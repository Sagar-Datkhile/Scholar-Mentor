import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body
    if (!email) {
      return new NextResponse("Missing email", { status: 400 })
    }

    const { data, error } = await supabaseAdmin.from("profiles").select("*").eq("email", email).single()
    if (error && error.code !== "PGRST116") {
      return new NextResponse(error.message, { status: 400 })
    }
    // This route is illustrative; actual password auth happens client-side via supabase-js.
    return NextResponse.json({ exists: !!data })
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}


