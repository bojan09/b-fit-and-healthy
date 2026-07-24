import type { Page } from "@playwright/test";

export type ViewportOffender = {
  selector: string;
  left: number;
  right: number;
  width: number;
};

export async function findViewportOffenders(
  page: Page,
): Promise<ViewportOffender[]> {
  return page.evaluate(() => {
    const tolerance = 1;
    const viewport = document.documentElement.clientWidth;
    const visible = [...document.querySelectorAll<HTMLElement>("body *")].filter(
      (element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return (
          !element.closest("details:not([open])") &&
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          style.contentVisibility !== "hidden" &&
          rect.width > 0 &&
          rect.height > 0
        );
      },
    );

    return visible
      .flatMap((element) => {
        const rect = element.getBoundingClientRect();
        if (
          rect.left >= -tolerance &&
          rect.right <= viewport + tolerance
        ) {
          return [];
        }
        const selector = element.id
          ? `#${element.id}`
          : `${element.tagName.toLowerCase()}.${[...element.classList].join(".")}`;
        return [
          {
            selector,
            left: rect.left,
            right: rect.right,
            width: rect.width,
          },
        ];
      })
      .slice(0, 20);
  });
}
