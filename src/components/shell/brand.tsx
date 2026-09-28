import Link from "next/link";
import { resolveBrandDestination } from "@/components/shell/brand-destination";

/**
 * Pure presentational mark. Public surfaces link home; the product header passes
 * `authenticated` so the mark returns to Today. No auth lookup happens here, so
 * public pages never wait on a Supabase round trip just to render the logo.
 */
export function Brand({ authenticated = false }: { authenticated?: boolean }) {
  return (
    <Link className="brand" href={resolveBrandDestination(authenticated)} aria-label="B Fit & Healthy home">
      <svg width="38" height="38" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="var(--logo-body)" d="M24 13.6c2.6-3.3 6.2-4.6 9.6-3.6 4.4 1.3 6.9 5.9 6.2 11-.5 3.9-2.6 7.7-5.6 10.9-3 3.2-6.7 5.7-10.2 7.6-3.5-1.9-7.2-4.4-10.2-7.6-3-3.2-5.1-7-5.6-10.9-.7-5.1 1.8-9.7 6.2-11 3.4-1 7 .3 9.6 3.6z" />
        <path fill="var(--logo-leaf)" d="M24.6 12.4c-.5-3 .8-5.6 3.2-7 1.5-.9 3.2-1.2 4.6-1.2.3 2.6-.5 5-2.3 6.5-1.5 1.3-3.5 1.9-5.5 1.7z" />
        <text x="24" y="31.5" textAnchor="middle" fill="var(--logo-mark)" fontSize="17" fontWeight="800">B</text>
      </svg>
      <span>B Fit &amp; Healthy</span>
    </Link>
  );
}
