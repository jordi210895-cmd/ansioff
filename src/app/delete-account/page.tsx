import Link from 'next/link';

export default function DeleteAccountPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 px-6 py-10 md:py-16">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-medium text-blue-400 hover:text-blue-300">
          Volver a ANSIOFF
        </Link>

        <header className="mt-8 mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-300">
            Eliminación de cuenta
          </p>
          <h1 className="mt-3 text-4xl font-bold text-white">
            Solicitar la eliminación de tu cuenta de ANSIOFF
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            Puedes solicitar que eliminemos tu cuenta y los datos asociados a ella en cualquier
            momento. Esta página está disponible públicamente para usuarios de iOS, Android y web.
          </p>
        </header>

        <section className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-semibold text-white">Cómo solicitarlo</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-slate-300">
            <li>
              Envía un email desde la dirección asociada a tu cuenta a{' '}
              <a className="font-medium text-blue-300 underline" href="mailto:soporte@ansioff.com">
                soporte@ansioff.com
              </a>
              .
            </li>
            <li>
              Usa el asunto <strong className="text-white">Eliminar cuenta ANSIOFF</strong>.
            </li>
            <li>
              Indica el correo de tu cuenta y confirma que quieres eliminarla de forma permanente.
            </li>
          </ol>
        </section>

        <section className="mt-6 rounded-lg border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-semibold text-white">Qué se elimina</h2>
          <p className="mt-3 text-slate-300">
            Eliminaremos los datos de cuenta guardados en nuestros sistemas, incluyendo el correo,
            identificador de usuario y la información vinculada a la cuenta cuando exista. Algunos
            registros mínimos pueden conservarse durante el plazo legal necesario para seguridad,
            prevención de fraude, obligaciones contables o cumplimiento normativo.
          </p>
          <p className="mt-3 text-slate-300">
            Los datos guardados únicamente en tu dispositivo también pueden borrarse desde los ajustes
            de la app o desinstalando la aplicación.
          </p>
        </section>

        <section className="mt-6 rounded-lg border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-semibold text-white">Plazo de respuesta</h2>
          <p className="mt-3 text-slate-300">
            Revisaremos tu solicitud y responderemos normalmente en un plazo máximo de 30 días.
          </p>
        </section>

        <p className="mt-8 text-sm text-slate-500">Última actualización: 14 de julio de 2026.</p>
      </div>
    </main>
  );
}
