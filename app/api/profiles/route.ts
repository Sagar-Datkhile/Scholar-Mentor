import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, name, email, role, branch, year, avatar_url, skills, github_link, linkedin_link, portfolio_link } = body

    if (!id || !email || !name) {
      return new NextResponse("Missing id, email, or name", { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from("profiles")
      .upsert(
        {
          id,
          name,
          email,
          role,
          branch,
          year,
          avatar_url,
          skills: skills ?? [],
          github_link,
          linkedin_link,
          portfolio_link,
        },
        { onConflict: "id" },
      )

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


