"use client";

import Link from "next/link";
import { LogOut, Settings, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/config";

export function AccountMenu({
  name,
  locale,
  signOut,
}: {
  name: string;
  locale: Locale;
  signOut: (formData: FormData) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const initial = name.trim().charAt(0).toUpperCase() || "B";
  const copy =
    locale === "en"
      ? {
          open: `Open account menu for ${name}`,
          signedIn: "Signed in as",
          profile: "Profile",
          settings: "Settings",
          signOut: "Sign out",
        }
      : {
          open: `Отвори мени за сметката на ${name}`,
          signedIn: "Најавени како",
          profile: "Профил",
          settings: "Поставки",
          signOut: "Одјави се",
        };

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="account-menu" ref={rootRef}>
      <button
        type="button"
        className="account-menu-trigger"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={copy.open}
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true">{initial}</span>
      </button>
      {open ? (
        <div className="account-menu-panel" role="menu">
          <div className="account-menu-context">
            <span>{copy.signedIn}</span>
            <strong>{name}</strong>
          </div>
          <Link role="menuitem" href="/settings#profile">
            <UserRound aria-hidden="true" />
            {copy.profile}
          </Link>
          <Link role="menuitem" href="/settings#preferences">
            <Settings aria-hidden="true" />
            {copy.settings}
          </Link>
          <form action={signOut}>
            <button role="menuitem" type="submit">
              <LogOut aria-hidden="true" />
              {copy.signOut}
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
