/* eslint-disable @typescript-eslint/no-var-requires */
require("dotenv").config({ path: ".env.local" });
const fs = require("fs");
const csv = require("csv-parser");
const { createClient } = require("@supabase/supabase-js");
const { randomBytes } = require("crypto");
const path = require("path");

interface Usuario {
  full_name: string;
  email: string;
  role: string;
  password: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const FILE = "scripts/usuarios_limpios.csv";
const usuarios: Usuario[] = [];

function generatePassword(length = 12) {
  return randomBytes(length).toString("base64").slice(0, length);
}

fs.createReadStream(FILE)
  .pipe(csv(["full_name", "email", "role"]))
  .on("data", (data: Record<string, string>) => {
    const email = data.email?.trim();
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      usuarios.push({
        full_name: data.full_name.trim(),
        email,
        role: data.role?.trim() || "alumna",
        password: generatePassword(),
      });
    } else {
      console.warn(`⚠️ Email inválido o vacío: ${data.email}`);
    }
  })
  .on("end", async () => {
    console.log(`🔄 Procesando ${usuarios.length} usuarios...\n`);

    const usuariosExport: string[] = ["full_name,email,password"];

    for (const user of usuarios) {
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", user.email)
        .maybeSingle();

      if (existingUser) {
        console.log(`ℹ️ Usuario ya existe, se omite: ${user.email}`);
        continue;
      }

      const { data: authData, error: authError } =
        await supabase.auth.admin.createUser({
          email: user.email,
          password: "estrella2025",
          email_confirm: false,
          user_metadata: {
            full_name: user.full_name,
            role: user.role,
          },
        });

      if (authError) {
        console.error(`❌ Auth error [${user.email}]: ${authError.message}`);
        continue;
      }

      const userId = authData?.user?.id;
      if (!userId) continue;

      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: userId,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          is_active: false,
          start_date: new Date().toISOString().split("T")[0],
          plan_type: "gratis", // 🔐 nuevo campo para la suscripción
          subscription_id: null,
        },
      ]);

      if (profileError) {
        console.error(
          `⚠️ Error perfil [${user.email}]: ${profileError.message}`
        );
      } else {
        console.log(`✅ Usuario creado y perfil insertado: ${user.email}`);
        usuariosExport.push(`${user.full_name},${user.email},${user.password}`);
      }
    }

    // Guardar el CSV con los accesos
    const exportPath = path.resolve("usuarios_generados.csv");
    fs.writeFileSync(exportPath, usuariosExport.join("\n"), "utf-8");
    console.log(`\n📁 Archivo generado: ${exportPath}`);
    console.log("🎉 Importación finalizada.");
  });
