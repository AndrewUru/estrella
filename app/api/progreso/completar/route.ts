import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { dia } = await req.json();
  const parsedDia = Number(dia);

  if (!Number.isInteger(parsedDia) || parsedDia < 1) {
    return NextResponse.json({ error: "Dia invalido" }, { status: 400 });
  }

  const supabaseAdmin = createAdminClient();

  const { data: perfil, error: perfilError } = await supabaseAdmin
    .from("profiles")
    .select("start_date, plan")
    .eq("id", user.id)
    .single();

  if (perfilError || !perfil?.start_date || !perfil.plan) {
    return NextResponse.json(
      { error: "No pudimos validar tu acceso a este dia" },
      { status: 403 }
    );
  }

  const diasDesdeInicio = Math.floor(
    (Date.now() - new Date(perfil.start_date).getTime()) / (1000 * 60 * 60 * 24)
  );
  const accesoPermitido =
    (perfil.plan === "gratis" && parsedDia === 1) ||
    (perfil.plan !== "gratis" && parsedDia <= diasDesdeInicio + 1);

  if (!accesoPermitido) {
    return NextResponse.json(
      { error: "Este dia aun no esta disponible para tu cuenta" },
      { status: 403 }
    );
  }

  const { data: entrega, error: entregaError } = await supabaseAdmin
    .from("entregas")
    .select("dia")
    .eq("dia", parsedDia)
    .maybeSingle();

  if (entregaError) {
    return NextResponse.json({ error: entregaError.message }, { status: 500 });
  }

  if (!entrega) {
    return NextResponse.json(
      { error: "No existe contenido publicado para este dia" },
      { status: 404 }
    );
  }

  const { data: existente, error: fetchError } = await supabaseAdmin
    .from("progresos")
    .select("id, completado")
    .eq("user_id", user.id)
    .eq("dia", parsedDia)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  const completedAt = new Date().toISOString();
  const progressPayload = existente?.completado
    ? { completado: true, desbloqueado: true }
    : { completado: true, completado_at: completedAt, desbloqueado: true };

  const { error } = existente
    ? await supabaseAdmin
        .from("progresos")
        .update(progressPayload)
        .eq("id", existente.id)
    : await supabaseAdmin.from("progresos").insert({
        user_id: user.id,
        dia: parsedDia,
        completado: true,
        completado_at: completedAt,
        desbloqueado: true,
      });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabaseAdmin
    .from("progresos")
    .update({ desbloqueado: true })
    .match({ user_id: user.id, dia: parsedDia + 1 });

  return NextResponse.json({ ok: true });
}
