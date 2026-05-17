import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const supabaseAdmin = createAdminClient();

  const { data: existente, error } = await supabaseAdmin
    .from("progresos")
    .select("id")
    .eq("user_id", user.id)
    .eq("dia", 1)
    .limit(1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (existente.length === 0) {
    const { error: insertError } = await supabaseAdmin.from("progresos").insert([
      {
        user_id: user.id,
        dia: 1,
        completado: false,
        desbloqueado: true,
      },
    ]);

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
