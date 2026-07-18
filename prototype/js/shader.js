/* ==========================================================================
   Hero backdrop shader.

   A deliberately cheap WebGL fragment shader: three drifting fields of value
   noise, tinted with the live theme colours, rendered to a canvas at ~1/3
   resolution and stretched. Costs a fraction of a millisecond per frame.

   It bails out — leaving the CSS gradient wash in place — when:
     - WebGL is unavailable,
     - motion is reduced,
     - the hero has scrolled out of view, or
     - the tab is hidden.
   ========================================================================== */

const Shader = {
  canvas: null,
  gl: null,
  raf: null,
  start: 0,
  visible: true,

  VERT: `
    attribute vec2 p;
    void main() { gl_Position = vec4(p, 0.0, 1.0); }
  `,

  FRAG: `
    precision mediump float;
    uniform vec2  u_res;
    uniform float u_time;
    uniform vec3  u_a;      // accent (lime)
    uniform vec3  u_b;      // secondary (blue)
    uniform vec3  u_bg;     // page background
    uniform float u_dark;

    // Cheap value noise — hash + bilinear smoothstep interpolation.
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }
    float noise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
    }
    float fbm(vec2 p) {
      return 0.55 * noise(p) + 0.30 * noise(p * 2.03) + 0.15 * noise(p * 4.01);
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_res;
      vec2 q  = uv * 2.4;
      float t = u_time * 0.035;

      // Two slow, counter-drifting warp fields keep it from looking like a loop.
      float f1 = fbm(q + vec2(t, t * 0.6));
      float f2 = fbm(q * 1.3 - vec2(t * 0.8, t * 0.4) + f1 * 0.6);

      // Soft blobs, weighted toward the top-left where the headline sits.
      float blobA = smoothstep(0.30, 0.92, f1 * 1.25 - length(uv - vec2(0.24, 0.72)) * 0.85);
      float blobB = smoothstep(0.34, 0.95, f2 * 1.20 - length(uv - vec2(0.80, 0.30)) * 0.95);

      vec3 col = u_bg;
      col = mix(col, u_a, clamp(blobA, 0.0, 1.0) * (u_dark > 0.5 ? 0.55 : 0.72));
      col = mix(col, u_b, clamp(blobB, 0.0, 1.0) * (u_dark > 0.5 ? 0.42 : 0.55));

      // Fade out toward the bottom so the content below sits on clean ground.
      float fade = smoothstep(1.0, 0.25, uv.y);
      gl_FragColor = vec4(col, fade);
    }
  `,

  /** Reads a CSS custom property and returns it as normalised RGB. */
  cssRGB(name) {
    const probe = document.createElement("div");
    probe.style.color = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    document.body.appendChild(probe);
    const parsed = getComputedStyle(probe).color.match(/[\d.]+/g) || [0, 0, 0];
    probe.remove();
    return [parsed[0] / 255, parsed[1] / 255, parsed[2] / 255];
  },

  mount(host) {
    this.destroy();
    if (!host || Theme.reducedMotion()) return;

    const canvas = document.createElement("canvas");
    canvas.className = "hero-canvas";
    canvas.setAttribute("aria-hidden", "true");

    const gl = canvas.getContext("webgl", { alpha: true, antialias: false, depth: false });
    if (!gl) return;                       // CSS wash already covers this case

    host.appendChild(canvas);
    this.canvas = canvas;
    this.gl = gl;

    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn("[shader]", gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, this.VERT);
    const fs = compile(gl.FRAGMENT_SHADER, this.FRAG);
    if (!vs || !fs) { this.destroy(); return; }

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { this.destroy(); return; }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const u = {
      res: gl.getUniformLocation(prog, "u_res"),
      time: gl.getUniformLocation(prog, "u_time"),
      a: gl.getUniformLocation(prog, "u_a"),
      b: gl.getUniformLocation(prog, "u_b"),
      bg: gl.getUniformLocation(prog, "u_bg"),
      dark: gl.getUniformLocation(prog, "u_dark")
    };

    const applyPalette = () => {
      const dark = document.documentElement.getAttribute("data-theme") === "dark";
      gl.uniform3fv(u.a, this.cssRGB("--accent"));
      gl.uniform3fv(u.b, this.cssRGB("--data-2"));
      gl.uniform3fv(u.bg, this.cssRGB("--bg"));
      gl.uniform1f(u.dark, dark ? 1 : 0);
    };

    const resize = () => {
      // A third of device resolution: the output is all soft gradients, so
      // nobody can tell, and it keeps the fill rate trivial on phones.
      const r = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.round(r.width / 3));
      const h = Math.max(1, Math.round(r.height / 3));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
        gl.uniform2f(u.res, w, h);
      }
    };

    applyPalette();
    resize();
    this._resize = resize;
    this._applyPalette = applyPalette;
    window.addEventListener("resize", resize, { passive: true });

    // Pause when the hero leaves the viewport.
    this._io = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      this.visible ? this.play() : this.pause();
    }, { threshold: 0 });
    this._io.observe(host);

    this._onVis = () => (document.hidden ? this.pause() : this.visible && this.play());
    document.addEventListener("visibilitychange", this._onVis);

    this.start = performance.now();
    this._draw = () => {
      resize();
      gl.uniform1f(u.time, (performance.now() - this.start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      this.raf = requestAnimationFrame(this._draw);
    };
    this.play();
  },

  play() {
    if (this.raf || !this.gl || !this._draw) return;
    this.raf = requestAnimationFrame(this._draw);
  },

  pause() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = null;
  },

  /** Theme switched — re-read the palette without rebuilding the context. */
  repaint() {
    if (this.gl && this._applyPalette) this._applyPalette();
  },

  destroy() {
    this.pause();
    if (this._io) { this._io.disconnect(); this._io = null; }
    if (this._resize) { window.removeEventListener("resize", this._resize); this._resize = null; }
    if (this._onVis) { document.removeEventListener("visibilitychange", this._onVis); this._onVis = null; }
    if (this.canvas) { this.canvas.remove(); this.canvas = null; }
    this.gl = null;
    this._draw = null;
  }
};
