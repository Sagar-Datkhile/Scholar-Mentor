import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, full_name, email, role, branch, year } = body

    if (!id || !email || !full_name) {
      return new NextResponse("Missing id, email, or full_name", { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from("profiles")
      .upsert({ id, full_name, email, role, branch, year }, { onConflict: "id" })

    if (error) {
      return new NextResponse(error.message, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
