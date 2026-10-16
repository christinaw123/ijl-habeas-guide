import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://vihovdjflwjhnaeteeql.supabase.co",
      "img-src 'self' data:",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // Old URLs → current ones, so links and bookmarks keep working.
  // Each source points straight at its final page (no redirect chains).
  async redirects() {
    return [
      // Original /detainee/* flow
      ["/detainee/step-1", "/arrest"],
      ["/detainee/step-2", "/detention"],
      ["/detainee/step-3", "/facility"],
      ["/detainee/loading", "/results"],
      ["/detainee/results/known", "/results"],
      ["/detainee/results/unknown", "/results"],
      ["/detainee/learn/:page", "/learn-more/:page"],
      // Short-lived names from the October 2026 restructure
      ["/knows-location", "/detention"],
      ["/loading", "/results"],
      ["/results/known", "/results"],
      ["/results/unknown", "/results"],
      ["/learn/:page", "/learn-more/:page"],
    ].map(([source, destination]) => ({ source, destination, permanent: true }));
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
