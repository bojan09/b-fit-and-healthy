import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-control)] px-4 text-sm font-bold transition-[background-color,color,border-color,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-50 active:translate-y-px",
  {
    variants: {
      variant: {
        primary: "border border-transparent bg-[var(--button-primary)] text-[var(--button-primary-text)] shadow-[0_7px_18px_color-mix(in_srgb,var(--brand)_18%,transparent)] hover:-translate-y-0.5 hover:bg-[var(--button-primary-hover)] hover:shadow-[0_10px_24px_color-mix(in_srgb,var(--brand)_24%,transparent)] active:translate-y-px",
        secondary: "border border-[var(--control-border)] bg-[var(--button-secondary)] text-[var(--foreground)] shadow-[0_3px_10px_color-mix(in_srgb,var(--foreground)_7%,transparent)] hover:-translate-y-0.5 hover:bg-[var(--button-secondary-hover)] active:translate-y-px",
        quiet: "text-[var(--foreground-secondary)] hover:bg-[var(--surface-raised)] hover:text-[var(--foreground)]",
        danger: "bg-[var(--danger)] text-[var(--on-danger)] hover:brightness-95"
      },
      size: { default: "h-11", sm: "h-10 min-h-10 px-3", lg: "h-12 px-6 text-base", icon: "size-11 px-0" }
    },
    defaultVariants: { variant: "primary", size: "default" }
  }
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Component = asChild ? Slot : "button";
  return <Component className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
