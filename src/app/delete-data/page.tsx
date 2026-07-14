import Link from 'next/link';

export default function DeleteDataPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 px-6 py-10 md:py-16">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-medium text-blue-400 hover:text-blue-300">
          Volver a ANSIOFF
        </Link>

        <header className="mt-8 mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-300">
            Eliminación de datos
          </p>
          <h1 className="mt-3 text-4xl font-bold text-white">
            Solicitar la eliminación de tus datos en ANSIOFF
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            Puedes pedir que eliminemos datos vinculados a tu uso de ANSIOFF sin necesidad de
            eliminar completamente tu cuenta, cuando técnicamente sea posible.
          </p>
        </header>

        <section className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-semibold text-white">Cómo solicitarlo</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-slate-300">
            <li>
              Envía un email a{' '}
              <a className="font-medium text-blue-300 underline" href="mailto:soporte@ansioff.com">
                soporte@ansioff.com
              </a>
              .
            </li>
            <li>
              Usa el asunto <strong className="text-white">Eliminar datos ANSIOFF</strong>.
            </li>
            <li>
              Indica el correo asociado a tu cuenta y qué datos quieres eliminar o revisar.
            </li>
          </ol>
        </section>

        <section className="mt-6 rounded-lg border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-semibold text-white">Datos que puedes solicitar eliminar</h2>
          <ul className="mt-4 list-disc space-y-3 pl-5 text-slate-300">
            <li>Datos de cuenta, como correo e identificador de usuario.</li>
            <li>Datos de uso vinculados a funciones de diario, pausas, progreso o preferencias.</li>
            <li>Información técnica asociada a compras o acceso, dentro de los límites legales.</li>
          </ul>
          <p className="mt-4 text-slate-300">
            Los datos guardados solamente en tu dispositivo pueden borrarse desde los ajustes de la
            app o eliminando la aplicación del dispositivo.
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
