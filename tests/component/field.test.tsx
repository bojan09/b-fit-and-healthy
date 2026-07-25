import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Field } from "@/components/ui/field";

describe("Field", () => {
  it("associates its label, description, and error with the control", () => {
    render(
      <Field
        label="Weight"
        description="Use your preferred unit."
        error="Enter a valid value."
      >
        <input name="weight" />
      </Field>,
    );

    const input = screen.getByLabelText("Weight");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.getAttribute("aria-describedby")).toContain("description");
    expect(input.getAttribute("aria-describedby")).toContain("error");
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Enter a valid value.",
    );
  });
});
