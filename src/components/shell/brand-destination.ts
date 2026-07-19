export type BrandDestination = "/" | "/today";

export function resolveBrandDestination(authenticated: boolean): BrandDestination {
  return authenticated ? "/today" : "/";
}
