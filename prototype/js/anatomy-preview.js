/* Compact Training gateway. Deliberately independent from the full explorer. */
const AnatomyPreview = {
  render() {
    return `<a class="coverage-figure" href="#/anatomy?view=front" aria-label="${esc(t("coverage.title"))}">
      <svg class="training-anatomy-svg" data-figure="athletic" viewBox="0 0 220 430" aria-hidden="true" focusable="false">
        <g class="preview-structure">
          <path data-region="head" d="M110 10c-16 0-27 12-27 29 0 14 5 26 14 33 4 3 8 5 13 5s9-2 13-5c9-7 14-19 14-33 0-17-11-29-27-29Z" />
          <path class="preview-athletic-outline" data-region="body-outline" d="M96 65v13c-12 4-26 7-35 16-9 11-12 25-15 45l-8 69c-1 11 2 22 8 27l4 25c1 8 6 14 12 11l6-7-2-27c6-15 9-36 10-56l4-35 3 67c1 16-3 26-7 36l-4 27c-2 16 0 30 5 42l5 23-4 50-11 21c-2 4 2 8 8 8h22c5 0 7-4 5-9l-5-17 9-68 4-23 4 23 9 68-5 17c-2 5 0 9 5 9h22c6 0 10-4 8-8l-11-21-4-50 5-23c5-12 7-26 5-42l-4-27c-4-10-8-20-7-36l3-67 4 35c1 20 4 41 10 56l-2 27 6 7c6 3 11-3 12-11l4-25c6-5 9-16 8-27l-8-69c-3-20-6-34-15-45-9-9-23-12-35-16V65c-8 8-20 8-28 0Z" />
          <path data-region="neck" d="M97 68v17l-12 7c6 11 14 16 25 16s19-5 25-16l-12-7V68c-7 7-19 7-26 0Z" />
          <path data-region="pelvis" d="M82 235c8 10 17 15 28 15s20-5 28-15l8 38c-8 13-20 20-36 20s-28-7-36-20l8-38Z" />
          <path data-region="hand-left" d="M48 231l2 29c1 8 5 15 11 13l7-8-2-29-18-5Z" />
          <path data-region="hand-right" d="M172 231l-2 29c-1 8-5 15-11 13l-7-8 2-29 18-5Z" />
          <path data-region="foot-left" d="M79 389l-12 23c-2 5 2 9 8 9h22c5 0 7-4 5-9l-7-23H79Z" />
          <path data-region="foot-right" d="M141 389l12 23c2 5-2 9-8 9h-22c-5 0-7-4-5-9l7-23h16Z" />
        </g>

        <g class="preview-muscles">
          <path data-region="deltoid-left" d="M85 89c-13 2-23 8-28 18 1 13 6 22 14 28l14-12 7-28-7-6Z" />
          <path data-region="deltoid-right" d="M135 89c13 2 23 8 28 18-1 13-6 22-14 28l-14-12-7-28 7-6Z" />
          <path data-region="pectorals" d="M91 101c5-6 11-9 19-9s14 3 19 9l4 36c-7 8-14 12-23 12s-16-4-23-12l4-36Z" />
          <path data-region="abdominals" d="M94 150h32l7 75c-6 10-14 15-23 15s-17-5-23-15l7-75Z" />
          <path data-region="quadriceps-left" d="M82 285c7 5 14 7 24 8l-6 77-10 18H79l-1-47 4-56Z" />
          <path data-region="quadriceps-right" d="M138 285c-7 5-14 7-24 8l6 77 10 18h11l1-47-4-56Z" />
          <path data-region="calf-left" d="M82 339h17l3 31-8 20H80l-2-49 4-2Z" />
          <path data-region="calf-right" d="M138 339h-17l-3 31 8 20h14l2-49-4-2Z" />
        </g>

        <g class="preview-landmarks">
          <path d="M110 93v147M91 121h38M92 160h36M90 181h40M89 202h42M110 293v31" />
          <path d="M99 159l11 7 11-7M98 180l12 7 12-7M97 201l13 7 13-7" />
          <path d="M84 315l20 10M136 315l-20 10M81 356l18 8M139 356l-18 8" />
        </g>
      </svg>
      <span>${esc(t("nav.anatomy"))} ${icon("arrowRight", "icon icon-sm")}</span>
    </a>`;
  }
};

