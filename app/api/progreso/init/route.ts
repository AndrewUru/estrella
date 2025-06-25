import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { user_id } = await req.json();

  const { data: existente, error } = await supabaseAdmin
    .from("progresos")
    .select("id")
    .eq("user_id", user_id)
    .limit(1);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  if (existente.length === 0) {
    const { error: insertError } = await supabaseAdmin
      .from("progresos")
      .insert([
        {
          user_id,
          dia: 1,
          completado: false,
        },
      ]);

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
