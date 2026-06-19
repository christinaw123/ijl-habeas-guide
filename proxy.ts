import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Per-IP sliding window backed by a `rate_limits` table in Supabase, so the
// limit is shared across all Vercel instances/regions (an in-memory store
// would be per-instance and not actually enforce a global limit).
const WINDOW_SECONDS = 60;
const MAX_REQUESTS = 30;

// Edge middleware only has access to NEXT_PUBLIC_* env vars, so this uses
// the anon key. rate_limit_hit() is SECURITY DEFINER and bypasses RLS on
// rate_limits, so the anon key can call it without direct table access.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function proxy(request: NextRequest) {
  const ip = getClientIp(request);

  const { data, error } = await supabase
    .rpc("rate_limit_hit", { p_key: ip, p_window_seconds: WINDOW_SECONDS })
    .single();

  if (error) {
    // Fail open: don't block traffic if the rate-limit store is unreachable.
    console.error("[rate-limit]", error.message);
    return NextResponse.next();
  }

  const { count, reset_at } = data as { count: number; reset_at: string };
  if (count > MAX_REQUESTS) {
    const retryAfter = Math.max(0, Math.ceil((new Date(reset_at).getTime() - Date.now()) / 1000));
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": retryAfter.toString() } }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
