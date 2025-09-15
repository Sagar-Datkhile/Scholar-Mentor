import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, full_name, email, role, branch, year, avatar_url } = body

    if (!id || !email || !full_name) {
      return new NextResponse("Missing id, email, or full_name", { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from("profiles")
      .upsert({ id, full_name, email, role, branch, year, avatar_url }, { onConflict: "id" })

    if (error) {
      return new NextResponse(error.message, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const email = searchParams.get("email")

    if (!id && !email) {
      return new NextResponse("Provide id or email to fetch profile", { status: 400 })
    }

    const query = supabaseAdmin.from("profiles").select("*").limit(1)
    const { data, error } = id
      ? await query.eq("id", id)
      : await query.eq("email", email as string)

    if (error) {
      return new NextResponse(error.message, { status: 400 })
    }

    return NextResponse.json(data?.[0] ?? null)
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}


