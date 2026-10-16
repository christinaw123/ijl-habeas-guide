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
  // The flow used to live under /detainee/*. Keep old links and bookmarks working.
  async redirects() {
    return [
      ["/detainee/step-1", "/arrest"],
      ["/detainee/step-2", "/knows-location"],
      ["/detainee/step-3", "/facility"],
      ["/detainee/loading", "/loading"],
      ["/detainee/results/known", "/results/known"],
      ["/detainee/results/unknown", "/results/unknown"],
      ["/detainee/learn/bonds", "/learn/bonds"],
      ["/detainee/learn/habeas", "/learn/habeas"],
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
