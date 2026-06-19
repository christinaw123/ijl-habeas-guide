import { NextResponse } from "next/server";
import { getResultsData } from "@/lib/supabase/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const facilityCode = searchParams.get("facilityCode");
  if (!facilityCode || facilityCode.length > 500) return NextResponse.json(null);
  const data = await getResultsData(facilityCode);
  return NextResponse.json(data);
}
