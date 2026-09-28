"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOptionalMessages } from "@/components/providers/locale-provider";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const m = useOptionalMessages();
  return <main className="centered-state" id="main-content" tabIndex={-1}><AlertCircle size={34} aria-hidden="true" /><h1>{m.errorTitle}</h1><p>{m.errorBody}</p><Button onClick={reset}>{m.retry}</Button></main>;
}
