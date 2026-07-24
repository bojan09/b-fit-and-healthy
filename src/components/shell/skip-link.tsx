"use client";

export function SkipLink({ label }: { label: string }) {
  function moveFocusToMain(event: React.MouseEvent<HTMLAnchorElement>) {
    const main = document.getElementById("main-content");
    if (!main) return;
    event.preventDefault();
    main.focus();
    main.scrollIntoView({ block: "start" });
    window.history.replaceState(null, "", "#main-content");
  }

  return (
    <a className="skip-link" href="#main-content" onClick={moveFocusToMain}>
      {label}
    </a>
  );
}
