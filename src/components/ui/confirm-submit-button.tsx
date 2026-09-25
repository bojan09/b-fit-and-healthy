"use client";

import type { ButtonHTMLAttributes } from "react";

/** Submit button that asks for confirmation before a destructive form action. */
export function ConfirmSubmitButton({
  message,
  onClick,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { message: string }) {
  return (
    <button
      type="submit"
      {...props}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
        onClick?.(event);
      }}
    />
  );
}
