import { NextResponse } from "next/server";
import { getUnknownResultsData } from "@/lib/supabase/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get("state");
  if (!state || state.length > 200) {
    return NextResponse.json({ facilities: [], fieldOffice: null, orgs: [] });
  }
  const codesParam = searchParams.get("countyCodes");
  const countyCodes = codesParam
    ? codesParam.split(",").slice(0, 50).filter((c) => c.length > 0 && c.length <= 100)
    : null;
  const data = await getUnknownResultsData(state, countyCodes);
  return NextResponse.json(data);
}
