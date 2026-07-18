/* ==========================================================================
   Charts.

   The previous implementation authored every chart at viewBox="0 0 460 148"
   and let the browser stretch it to the container — roughly 2.8x on desktop.
   Everything scaled with it: 11px tick labels rendered at ~31px, 1px grid
   lines at 3px, 3px corner radii at 8px. That is why the charts read as
   oversized and crude.

   Charts now render at TRUE PIXEL SIZE: the host element is measured, the
   viewBox is set to those exact pixels, and a ResizeObserver re-renders on
   layout change. 11px means 11px at every breakpoint.
   ========================================================================== */

const Charts = {
  hosts: new WeakMap(),
  ro: null,

  /** Escape-safe payload for the host element. */
  host(type, payload) {
    const data = encodeURIComponent(JSON.stringify(payload));
    return `<div class="chart-host" data-chart-type="${type}" data-chart="${data}"></div>`;
  },

  /* ---- nice numbers ------------------------------------------------------
     Axis ticks land on 1/2/5 x 10^n so the reader sees 0 / 1,000 / 2,000
     instead of 0 / 1,328 / 2,657. -------------------------------------- */
  niceStep(range, targetTicks) {
    const raw = range / targetTicks;
    const mag = Math.pow(10, Math.floor(Math.log10(raw || 1)));
    const norm = raw / mag;
    const step = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
    return step * mag;
  },

  scale(maxValue, targetTicks = 3) {
    if (!isFinite(maxValue) || maxValue <= 0) return { max: 1, step: 1, ticks: [0, 1] };
    const step = this.niceStep(maxValue, targetTicks);
    const max = Math.ceil(maxValue / step) * step;
    const ticks = [];
    for (let v = 0; v <= max + 1e-9; v += step) ticks.push(Math.round(v * 1e6) / 1e6);
    return { max, step, ticks };
  },

  /* ---- render all hosts on the page -------------------------------------- */
  mountAll() {
    const hosts = document.querySelectorAll(".chart-host");
    if (!hosts.length) return;

    if (!this.ro) {
      let frame = null;
      this.ro = new ResizeObserver(() => {
        if (frame) return;
        frame = requestAnimationFrame(() => { frame = null; this.redraw(); });
      });
    } else {
      this.ro.disconnect();
    }

    hosts.forEach((h) => { this.draw(h); this.ro.observe(h); });
  },

  redraw() {
    document.querySelectorAll(".chart-host").forEach((h) => this.draw(h));
  },

  draw(host) {
    const w = Math.round(host.clientWidth);
    if (!w) return;                       // not laid out yet
    if (host.dataset.drawnAt === String(w)) return;   // width unchanged
    host.dataset.drawnAt = String(w);

    const type = host.dataset.chartType;
    const payload = JSON.parse(decodeURIComponent(host.dataset.chart));
    host.innerHTML = type === "line" ? this.line(payload, w) : this.bar(payload, w);
  },

  /* ======================================================================
     Bar chart
     ====================================================================== */
  bar({ points, goal, unit, goalLabel }, w) {
    const h = 190;
    const pad = { t: 18, r: 12, b: 34, l: 44 };
    const innerW = w - pad.l - pad.r;
    const innerH = h - pad.t - pad.b;

    const values = points.map((p) => p.value).filter((v) => v !== null);
    const { max, ticks } = this.scale(Math.max(goal || 0, ...values, 1));
    const y = (v) => pad.t + innerH - (v / max) * innerH;

    const slot = innerW / points.length;
    const bw = Math.min(28, slot * 0.56);      // real pixels, capped

    const grid = ticks.map((v) => `
      <line x1="${pad.l}" y1="${y(v).toFixed(1)}" x2="${w - pad.r}" y2="${y(v).toFixed(1)}"/>
      <text class="tick" x="${pad.l - 10}" y="${(y(v) + 4).toFixed(1)}" text-anchor="end">${esc(I18n.num(v))}</text>`
    ).join("");

    const bars = points.map((p, i) => {
      const cx = pad.l + slot * i + slot / 2;
      const x = cx - bw / 2;
      const label = `<text class="axis-label" x="${cx.toFixed(1)}" y="${h - 12}" text-anchor="middle">${esc(p.label)}</text>`;

      // A day with no data is drawn as a dashed outline at target height with
      // an em-dash, so absence reads as "nothing logged" — not as a bug.
      if (p.value === null) {
        const top = goal ? y(goal) : y(max * 0.5);
        return `
          <rect class="bar-missing" x="${x.toFixed(1)}" y="${top.toFixed(1)}"
            width="${bw.toFixed(1)}" height="${(pad.t + innerH - top).toFixed(1)}" rx="4"/>
          <text class="bar-missing-mark" x="${cx.toFixed(1)}" y="${(pad.t + innerH - 6).toFixed(1)}"
            text-anchor="middle">&#8212;</text>
          ${label}
          <title>${esc(p.label)}: ${esc(t("habits.missed"))}</title>`;
      }

      const top = y(p.value);
      const over = goal && p.value > goal;
      return `
        <rect class="chart-bar ${over ? "is-over" : ""}" x="${x.toFixed(1)}" y="${top.toFixed(1)}"
          width="${bw.toFixed(1)}" height="${Math.max(2, pad.t + innerH - top).toFixed(1)}" rx="4">
          <title>${esc(p.label)}: ${esc(I18n.num(p.value))}${esc(unit || "")}</title>
        </rect>
        ${label}`;
    }).join("");

    // Target line: neutral and dashed, labelled inline so it never has to be
    // decoded from the legend.
    const goalLine = goal ? `
      <line class="goal-line" x1="${pad.l}" y1="${y(goal).toFixed(1)}" x2="${w - pad.r}" y2="${y(goal).toFixed(1)}"/>
      <text class="goal-text" x="${w - pad.r}" y="${(y(goal) - 6).toFixed(1)}" text-anchor="end">
        ${esc(goalLabel || t("common.goal"))} ${esc(I18n.num(goal))}
      </text>` : "";

    return `<svg class="chart" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img"
      aria-label="${esc(unit || "")}">
      <g class="chart-grid">${grid}</g>
      ${goalLine}
      ${bars}
    </svg>`;
  },

  /* ======================================================================
     Line chart
     ====================================================================== */
  line({ points, unit, digits = 0 }, w) {
    const h = 200;
    const pad = { t: 18, r: 14, b: 32, l: 48 };
    const innerW = w - pad.l - pad.r;
    const innerH = h - pad.t - pad.b;

    const vals = points.map((p) => p.value);
    const dataMin = Math.min(...vals), dataMax = Math.max(...vals);
    // Pad the band so the line never sits on the frame, then snap to nice steps.
    const spanRaw = (dataMax - dataMin) || Math.max(1, dataMax * 0.1);
    const step = this.niceStep(spanRaw * 1.6, 3);
    const min = Math.floor((dataMin - spanRaw * 0.25) / step) * step;
    const max = Math.ceil((dataMax + spanRaw * 0.25) / step) * step;

    const ticks = [];
    for (let v = min; v <= max + 1e-9; v += step) ticks.push(Math.round(v * 1e6) / 1e6);

    const x = (i) => pad.l + (innerW / Math.max(1, points.length - 1)) * i;
    const y = (v) => pad.t + innerH - ((v - min) / (max - min)) * innerH;

    const grid = ticks.map((v) => `
      <line x1="${pad.l}" y1="${y(v).toFixed(1)}" x2="${w - pad.r}" y2="${y(v).toFixed(1)}"/>
      <text class="tick" x="${pad.l - 10}" y="${(y(v) + 4).toFixed(1)}" text-anchor="end">${esc(I18n.num(v, digits))}</text>`
    ).join("");

    const d = points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ");
    const area = `${d} L${x(points.length - 1).toFixed(1)},${(pad.t + innerH).toFixed(1)} L${x(0).toFixed(1)},${(pad.t + innerH).toFixed(1)} Z`;

    // Thin out x labels so they never collide at narrow widths.
    const every = Math.max(1, Math.ceil(points.length / Math.max(2, Math.floor(innerW / 60))));
    const labels = points.map((p, i) => (i % every === 0
      ? `<text class="axis-label" x="${x(i).toFixed(1)}" y="${h - 10}" text-anchor="middle">${esc(p.label)}</text>` : "")).join("");

    const dots = points.map((p, i) =>
      `<circle class="chart-dot" cx="${x(i).toFixed(1)}" cy="${y(p.value).toFixed(1)}" r="3.5">
        <title>${esc(p.label)}: ${esc(I18n.num(p.value, digits))}${esc(unit || "")}</title>
      </circle>`).join("");

    return `<svg class="chart" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img"
      aria-label="${esc(unit || "")}">
      <g class="chart-grid">${grid}</g>
      <path class="chart-area" d="${area}"/>
      <path class="chart-line" d="${d}"/>
      <g>${labels}</g>
      ${dots}
    </svg>`;
  },

  /** Compact inline legend — sits beside the chart title, not under the axis. */
  legend(items) {
    return `<ul class="chart-legend">${items.map((i) => `
      <li><span class="legend-swatch" style="background:${i.color}"></span>${esc(i.label)}</li>`).join("")}</ul>`;
  }
};

/* Screens keep calling these names; they now emit a measured host. */
function barChart(points, { goal = null, unit = "", goalLabel = "" } = {}) {
  return Charts.host("bar", { points, goal, unit, goalLabel });
}
function lineChart(points, { unit = "", digits = 0 } = {}) {
  return Charts.host("line", { points, unit, digits });
}
