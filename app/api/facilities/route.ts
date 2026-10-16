import { NextResponse } from "next/server";
import { getFacilitiesByState } from "@/server/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get("state");
  if (!state || state.length > 100) return NextResponse.json([]);
  const facilities = await getFacilitiesByState(state);
  return NextResponse.json(facilities);
}
