import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/error?reason=missing_code", request.url));
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Email Confirmation Error:", error);
    return NextResponse.redirect(new URL("/error?reason=invalid_code", request.url));
  }
  cookies().set("isAnonymous", "false");
  
  return NextResponse.redirect(new URL("/quizzes?confirmed=true", request.url));
}
