import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function POST(req: Request) {
  const { user_id, dia } = await req.json();

  const { error } = await supabase
    .from("progresos")
    .update({
      completado: true,
      completado_at: new Date().toISOString(),
    })
    .match({ user_id, dia });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Desbloquear el siguiente día
  await supabase
    .from("progresos")
    .update({ desbloqueado: true })
    .match({ user_id, dia: dia + 1 });

  return NextResponse.json({ ok: true });
}
