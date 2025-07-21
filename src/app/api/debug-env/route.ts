import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const nextAuthUrl = process.env.NEXTAUTH_URL;

  return NextResponse.json({
    note: "Value of NEXTAUTH_URL as seen by the Vercel server.",
    NEXTAUTH_URL: nextAuthUrl || "Not Set / Undefined",
  });
}
