import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export type PlaceResult = {
  place_display: string;
  county_codes: string[];
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get("state");
  const q = searchParams.get("q") ?? "";

  if (!state) return NextResponse.json([]);

  console.log(`[DEBUG] /api/places input: state=${state}, q=${q}`);

  const { data, error } = await supabase
    .from("place_county")
    .select("place_display, county_code")
    .eq("state", state)
    .ilike("place_display", `${q}%`)
    .order("place_display")
    .limit(50);

  if (error) {
    console.error("[api/places]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log(`[DEBUG] /api/places raw rows:`, data);

  // Group by place_display so duplicate city names collapse into one entry
  // with all associated county codes.
  const grouped = new Map<string, string[]>();
  for (const row of data ?? []) {
    const codes = grouped.get(row.place_display) ?? [];
    codes.push(row.county_code);
    grouped.set(row.place_display, codes);
  }
  const result: PlaceResult[] = Array.from(grouped, ([place_display, county_codes]) => ({
    place_display,
    county_codes,
  }));

  console.log(`[DEBUG] /api/places grouped result:`, result);

  return NextResponse.json(result);
}
