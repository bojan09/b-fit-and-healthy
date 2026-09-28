# Motion and 3D operations

All motion and 3D in B Fit & Healthy is **CSS only**. No GSAP, Three.js, WebGL, or
animation library ships to the browser, and no JavaScript drives an animation.
The whole system lives in `src/styles/motion.css`.

## Principles

- **Opt-in motion.** Every animation sits inside
  `@media (prefers-reduced-motion: no-preference)`. With reduced motion, every
  surface renders in its final static state. The global reduced-motion guard in
  `globals.css` stays as a second safety net.
- **Progressive enhancement.** Scroll-driven reveals use
  `animation-timeline: view()` inside `@supports`. Browsers without support show
  content immediately.
- **Compositor only.** Animations touch `transform`, the individual
  `translate` / `rotate` / `scale` properties, and `opacity`. The one exception is
  a small SVG `filter` pulse on the selected muscle.
- **No hover traps on touch.** 3D hover depth only applies under
  `(hover: hover) and (pointer: fine)`.
- **Entrances never fight hover.** Entrance keyframes animate the individual
  `translate` / `rotate` properties, while hover states use `transform`. The two
  compose instead of overriding each other.

## 3D surfaces

| Surface | Technique |
|---|---|
| Anatomy atlas | `AnatomyRenderer` renders the front and back SVGs as the two faces of one `preserve-3d` card. `data-view="back"` rotates it 180° on Y. The hidden face is `inert` and `aria-hidden`. The card sways on an idle `rotate: y` loop and pauses on hover and focus. |
| Guided health path (landing hero) | The cards are a 3D deck: an angled stack with `translateZ` layers that deals in, floats, and flattens and fans out on hover. It is flattened below 64rem. |
| Card grids (modules, recipes, exercises, workout ideas, templates, records, priorities) | The grids set `perspective`. On hover, cards tilt (`rotateX`/`rotateY`/`translateZ`) and their icons and titles float above the surface. |
| Landing feature mockups | They rest at an angle and straighten on hover, with their layers lifting in Z. |
| Brand mark, priority icons, status icons | Coin-flip `rotateY` on hover, on selection, or as a loop. |
| Mobile menu, disclosure panels | Hinged drop-down (`rotateX`) through `@starting-style` and entrance keyframes. |

## Other motion

- A drifting ambient halo field (`.ambient-field`, transform-only).
- A staggered hero entrance with a 3D headline unfold.
- Scroll reveals (`MotionReveal`, `rise` or `tilt` variants) and card surfacing.
- Meter and progress bars that fill in (`scale` from 0).
- Feedback: a success pop, an error shake, a set-complete hinge, and a checkbox pop.
- A cross-document view transition for full navigations.

## Adding motion

1. Add the rule to `motion.css` inside the reduced-motion media query. Put it in
   the fine-pointer query as well if it is a hover effect.
2. Prefer individual transform properties for entrances.
3. Keep content readable without the animation. Never start from a hidden state
   outside the motion query.
