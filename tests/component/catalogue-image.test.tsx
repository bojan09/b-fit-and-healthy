import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CatalogueImage } from "@/components/media/catalogue-image";
import type { DisplayMedia } from "@/features/media/catalogue-media";

const media: DisplayMedia = {
  src: "/media/recipe.webp",
  alt: "Roasted vegetables in a bowl",
  focalPoint: "45% 35%",
  sourceName: "B Fit & Healthy",
  sourceUrl: "https://example.com/source",
  creator: "Catalogue team",
  licenseName: "CC BY 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
};

describe("CatalogueImage", () => {
  afterEach(cleanup);

  it("renders the supplied localized image alt text", () => {
    render(<CatalogueImage media={media} fallback="recipe-dinner" />);

    expect(screen.getByAltText("Roasted vegetables in a bowl")).toBeInTheDocument();
  });

  it("passes responsive settings and focal position to the image", () => {
    render(<CatalogueImage media={media} fallback="recipe-dinner" sizes="(min-width: 64rem) 24rem, 100vw" priority />);

    const image = screen.getByAltText("Roasted vegetables in a bowl");
    expect(image).toHaveAttribute("sizes", "(min-width: 64rem) 24rem, 100vw");
    expect(image).not.toHaveAttribute("loading", "lazy");
    expect(image).toHaveStyle({ objectPosition: "45% 35%" });
    expect(image.closest("[style*='aspect-ratio']")).toBeInTheDocument();
  });

  it("renders accessible optional attribution and links URL-backed provenance", () => {
    render(<CatalogueImage media={media} fallback="recipe-dinner" showAttribution />);

    expect(screen.getByLabelText("Image attribution")).toHaveTextContent("B Fit & Healthy");
    expect(screen.getByLabelText("Image attribution")).toHaveTextContent("Catalogue team");
    expect(screen.getByRole("link", { name: "B Fit & Healthy" })).toHaveAttribute("href", "https://example.com/source");
    expect(screen.getByRole("link", { name: "CC BY 4.0" })).toHaveAttribute("href", "https://creativecommons.org/licenses/by/4.0/");
  });

  it("replaces a failed image with its decorative fallback", () => {
    render(<CatalogueImage media={media} fallback="recipe-dinner" />);

    fireEvent.error(screen.getByAltText("Roasted vegetables in a bowl"));
    expect(screen.queryByAltText("Roasted vegetables in a bowl")).not.toBeInTheDocument();
    expect(screen.getByTestId("catalogue-image-fallback")).toHaveAttribute("aria-hidden", "true");
  });

  it("uses replacement media after an error limited to the failed source", () => {
    const { rerender } = render(
      <CatalogueImage media={media} fallback="recipe-dinner" />,
    );

    fireEvent.error(screen.getByAltText("Roasted vegetables in a bowl"));
    rerender(
      <CatalogueImage
        media={{ ...media, src: "/media/replacement.webp", alt: "Fresh vegetables in a bowl" }}
        fallback="recipe-dinner"
      />,
    );

    expect(screen.getByAltText("Fresh vegetables in a bowl")).toBeInTheDocument();
    expect(screen.queryByTestId("catalogue-image-fallback")).not.toBeInTheDocument();
  });

  it("renders the decorative fallback when media is missing", () => {
    render(<CatalogueImage media={null} fallback="exercise-core" />);

    expect(screen.getByTestId("catalogue-image-fallback")).toHaveAttribute("data-fallback-kind", "exercise-core");
    expect(screen.getByTestId("catalogue-image-fallback")).toHaveAttribute("aria-hidden", "true");
  });
});
