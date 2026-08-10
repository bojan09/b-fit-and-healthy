import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "ui-button inline-flex min-h-10 items-center justify-center gap-2 rounded-[var(--radius-control)] px-4 text-[0.9375rem] font-semibold transition-[background-color,color,border-color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-50 active:translate-y-px",
  {
    variants: {
      variant: {
        primary: "ui-button-primary border bg-[var(--button-primary)] text-[var(--button-primary-text)] hover:-translate-y-1 active:translate-y-px",
        secondary: "ui-button-secondary border bg-[var(--button-secondary)] text-[var(--button-secondary-text)] hover:-translate-y-1 active:translate-y-px",
        quiet: "text-[var(--foreground-secondary)] transition-colors hover:bg-[var(--surface-raised)] hover:text-[var(--brand)]",
        danger: "bg-[var(--danger)] text-[var(--on-danger)] hover:brightness-95"
      },
      size: { default: "h-10", sm: "h-9 min-h-9 px-3 text-sm", lg: "h-11 px-5", icon: "size-11 min-h-11 px-0" }
    },
    defaultVariants: { variant: "primary", size: "default" }
  }
);

const cutByVariant: Record<NonNullable<VariantProps<typeof buttonVariants>["variant"]>, boolean> = {
  primary: true,
  secondary: false,
  quiet: false,
  danger: false
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean; cut?: boolean };

export function Button({ className, variant = "primary", size, asChild, cut, ...props }: ButtonProps) {
  const Component = asChild ? Slot : "button";
  const applyCut = cut ?? cutByVariant[variant ?? "primary"];
  return (
    <Component
      className={cn(
        buttonVariants({ variant, size }),
        applyCut && "ui-button-cut rounded-none [clip-path:var(--cut-clip)]",
        className
      )}
      {...props}
    />
  );
}
