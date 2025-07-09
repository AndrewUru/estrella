import fs from "fs";
import csv from "csv-parser";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const FILE = "scripts/usuarios_limpios.csv";

interface Usuario {
  full_name: string;
  email: string;
  role: string;
}

const usuarios: Usuario[] = [];

fs.createReadStream(FILE)
  .pipe(csv(["full_name", "email", "role"]))
  .on("data", (data) => {
    if (data.email) {
      usuarios.push({
        full_name: data.full_name.trim(),
        email: data.email.trim(),
        role: data.role?.trim() || "alumna",
      });
    }
  })
  .on("end", async () => {
    console.log(`🔄 Procesando ${usuarios.length} usuarios...\n`);

    for (const user of usuarios) {
      const { data: authData, error: authError } =
        await supabase.auth.admin.createUser({
          email: user.email,
          email_confirm: false, // para que Supabase envíe el correo de confirmación
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
