"use client";

import Link, { type LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  type AnchorHTMLAttributes,
  type PointerEvent,
  type FocusEvent,
  type TouchEvent,
  type MouseEvent,
} from "react";
import { markNavigationIntent } from "@/lib/performance/navigation-marks";

type NavigationIntentProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

function internalHref(href: LinkProps["href"]) {
  return typeof href === "string" && href.startsWith("/") ? href : null;
}

export function NavigationIntent({
  href,
  onPointerEnter,
  onFocus,
  onTouchStart,
  onClick,
  ...props
}: NavigationIntentProps) {
  const router = useRouter();
  const route = internalHref(href);
  const warm = useCallback(() => {
    if (route) router.prefetch(route);
  }, [route, router]);

  return (
    <Link
      href={href}
      onPointerEnter={(event: PointerEvent<HTMLAnchorElement>) => {
        warm();
        onPointerEnter?.(event);
      }}
      onFocus={(event: FocusEvent<HTMLAnchorElement>) => {
        warm();
        onFocus?.(event);
      }}
      onTouchStart={(event: TouchEvent<HTMLAnchorElement>) => {
        warm();
        onTouchStart?.(event);
      }}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        if (route && !event.defaultPrevented) {
          markNavigationIntent(route);
        }
        onClick?.(event);
      }}
      {...props}
    />
  );
}
