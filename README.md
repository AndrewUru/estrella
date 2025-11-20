# Estrella

Plataforma web para la comunidad Estrella del Alba: landing publica, onboarding y area protegida con practicas guiadas, progreso diario, feed social y panel de administracion. Construida sobre Next.js (App Router) y Supabase.

## Estado actual
- **Landing y paginas informativas**: `app/page.tsx` con secciones Hero/Proceso/Stats/Social, mas contenido en `app/bienvenida`, `app/informacion`, `app/preguntas`, `app/terminos`, `app/privacidad`, `app/contacto` y `app/upgrade`.
- **Autenticacion y perfiles**: flujo Supabase Auth en `app/auth/*`, middleware en `middleware.ts` para proteger rutas y helper `lib/supabase/ensure-user-profile.ts` para crear perfiles por defecto. Subida de avatar a bucket `avatars` via `app/api/upload-avatar/route.ts` y vista de perfil en `app/protected/profile`.
- **Area protegida y progreso**: dashboard en `app/protected/page.tsx` que lee plan y progreso (`progresos`, `entregas`) para desbloquear dias, con API `app/api/progreso/init` y `app/api/progreso/completar` para iniciar y marcar completados.
- **Practicas guiadas**: galeria en `components/PracticesGallery.tsx` filtrada por tipo con control de plan (free/premium) y audio/PDF. Creacion desde panel admin `app/protected/admin/practicas#nueva` con `components/admin/NewPracticeForm.tsx` subiendo a buckets `media-audio`, `media-covers` y `media-pdfs` y guardando en la tabla `practices`.
- **Comunidad**: pagina `app/protected/social/page.tsx` con composer, feed y comentarios en tiempo real usando TanStack Query + Supabase Realtime sobre `progress_updates` y `progress_update_comments`, mas stats y sidebars (`components/social/*`). Moderacion de comentarios en `app/protected/admin/page.tsx` via RPC `admin_delete_comment`.
- **Membresia y pagos**: pantalla `app/upgrade/page.tsx` con PayPal Subscriptions (hook `hooks/usePayPalButtons.ts`) que actualiza `profiles.plan`/`plan_type`/`subscription_id` en Supabase al aprobar el pago.
- **Scripts**: importador masivo `scripts/import-users.ts` que lee `scripts/usuarios_limpios.csv`, crea usuarios (Auth + tabla `profiles`) y genera `usuarios_generados.csv` con accesos.
- **PWA y tema**: configurado con `next-pwa` en `next.config.ts` (service worker en `public/`) y modo claro/oscuro via `next-themes` y `components/theme-switcher.tsx`.

## Stack y estructura
- Next.js (App Router) + React 19 + TypeScript.
- Tailwind CSS + shadcn/ui, lucide-react y heroicons para UI.
- Supabase JS/SSR para Auth, Storage y RLS; TanStack Query para datos en vivo; Framer Motion para animaciones; next-themes y next-pwa.
- Carpetas clave: `app/` (rutas y paginas), `components/` (UI y bloques como Hero, Stats, Social), `lib/` (supabase client/server/admin, hooks), `hooks/` (PayPal), `scripts/` (tareas CLI), `public/` (assets).

## Configuracion local
1. Requisitos: Node 20+ y npm.
2. Instala dependencias: `npm install`.
3. Copia `.env.example` a `.env.local` y completa:
   - `NEXT_PUBLIC_SUPABASE_URL` (URL del proyecto).
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (anon key).
   - `SUPABASE_URL` (igual que la publica, para clientes admin/SSR).
   - `SUPABASE_SERVICE_ROLE_KEY` (service role, necesario para scripts y endpoints admin).
4. Ejecuta:
   - `npm run dev` para desarrollo (App Router, sin Turbopack).
   - `npm run build` / `npm start` para produccion.
   - `npm run lint` para eslint.
5. PayPal: los plan IDs estan hardcodeados en `app/upgrade/page.tsx` (`PLANS`). Sustituyelos por los de tu cuenta si cambian.

## Esquema Supabase (resumen)
- **profiles**: `id` (uuid), `email`, `full_name`, `avatar_url`, `role` (alumna/admin), `is_active`, `start_date`, `plan` (gratis/premium), `plan_type` (gratis/premium-mensual/premium-anual/7D), `subscription_id`, `created_at`.
- **progresos**: `user_id`, `dia`, `completado`, `completado_at`, `desbloqueado`. La API `progreso/init` crea el dia 1; `progreso/completar` marca completado y desbloquea el siguiente.
- **entregas**: catalogo diario (usado para pintar tarjetas del dashboard). Campos usados: `dia`, `imagen_url` (+ el resto del contenido que muestre cada dia).
- **practices**: `id`, `title`, `kind` (meditation/channeling), `description`, `language`, `facilitator`, `duration_minutes`, `tags[]`, `audio_url`, `cover_url`, `pdf_url`, `visibility` (public/private/unlisted), `plan` (free/premium), `recorded_at`, `created_by`, `created_at`. Archivos en buckets `media-audio`, `media-covers`, `media-pdfs`.
- **progress_updates** y **progress_update_comments**: posts y comentarios del feed social. Relacionan con `profiles` para nombre/avatar; `comments_count` se actualiza via triggers.
- **Storage**: bucket `avatars` para fotos de perfil y buckets `media-*` para practicas. Ajusta las politicas RLS/Storage para permitir solo al propietario subir/leer lo que corresponda.
- **RPC**: `admin_delete_comment` usado en el panel admin para moderacion segura respetando RLS.

## Flujo de creacion
1. Se partio del Next.js + Supabase Starter Kit (App Router) y se tradujo la UI al castellano.
2. Se configuro Supabase con Auth basada en cookies, manejo de perfiles (`ensure-user-profile`) y middleware para proteger rutas privadas.
3. Se diseno la landing y paginas publicas con Tailwind/shadcn y assets de marca, mas copy e imagenes propias.
4. Se construyo el dashboard protegido con control de plan (gratis/premium), desbloqueo diario (`entregas`/`progresos`) y galeria de practicas con gating por plan.
5. Se integro subida de avatar y edicion de perfil, asi como flujo de upgrade anual con PayPal que actualiza el plan en `profiles`.
6. Se creo el espacio social con posts/comentarios en tiempo real usando TanStack Query + Supabase Realtime y se anadio panel de moderacion y herramientas admin.
7. Se anadio PWA, modo oscuro/claro, y scripts CLI para carga masiva de usuarias.

## Despliegue
- Orientado a Vercel + Supabase. `next.config.ts` incluye configuracion de PWA y dominios permitidos de imagen (`lh3.googleusercontent.com`, tu dominio Supabase). Define las variables de entorno en Vercel y en Supabase (Auth/Storage) para que coincidan con las claves anteriores.

