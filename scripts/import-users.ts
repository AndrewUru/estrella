/* eslint-disable @typescript-eslint/no-var-requires */

require("dotenv").config({ path: ".env.local" });
const fs = require("fs");
const csv = require("csv-parser");
const { createClient } = require("@supabase/supabase-js");

interface Usuario {
  full_name: string;
  email: string;
  role: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const FILE = "scripts/usuarios_limpios.csv";
const usuarios: Usuario[] = [];

fs.createReadStream(FILE)
  .pipe(csv(["full_name", "email", "role"]))
  .on("data", (data: Record<string, string>) => {
    const email = data.email?.trim();
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      usuarios.push({
        full_name: data.full_name.trim(),
        email,
        role: data.role?.trim() || "alumna",
      });
    } else {
      console.warn(`⚠️ Email inválido o vacío: ${data.email}`);
    }
  })
  .on("end", async () => {
    console.log(`🔄 Procesando ${usuarios.length} usuarios...\n`);

    for (const user of usuarios) {
      // Saltar si ya existe en Supabase
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
        },
      ]);

      if (profileError) {
        console.error(
          `⚠️ Error perfil [${user.email}]: ${profileError.message}`
        );
      } else {
        console.log(`✅ Usuario creado y perfil insertado: ${user.email}`);
      }
    }

    console.log("\n🎉 Importación completada.");
  });
