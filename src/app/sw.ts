import type { PrecacheEntry, RuntimeCaching, SerwistGlobalConfig } from "serwist";
import { CacheFirst, ExpirationPlugin, NetworkOnly, Serwist, StaleWhileRevalidate } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const privateNetworkOnly: RuntimeCaching = {
  matcher: ({ url }) =>
    /\/auth\//.test(url.pathname) ||
    /\/rest\/v1\//.test(url.pathname) ||
    url.pathname.startsWith("/api/") ||
    url.hostname.endsWith(".supabase.co"),
  handler: new NetworkOnly()
};

const runtimeCaching: RuntimeCaching[] = [
  privateNetworkOnly,
  {
    matcher: ({ request }) => request.mode === "navigate",
    handler: new NetworkOnly()
  },
  {
    matcher: /\/_next\/static\//,
    handler: new StaleWhileRevalidate({ cacheName: "bfit-static-v1" })
  },
  {
    matcher: ({ request, url }) => url.origin === self.location.origin && request.destination === "image",
    handler: new CacheFirst({
      cacheName: "bfit-public-images-v1",
      plugins: [new ExpirationPlugin({ maxEntries: 160, maxAgeSeconds: 30 * 24 * 60 * 60 })]
    })
  }
];

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: false,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching,
  fallbacks: {
    entries: [{
      url: "/~offline",
      matcher: ({ request }) => request.destination === "document"
    }]
  }
});

serwist.addEventListeners();
