import Link from 'next/link';

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 px-6 py-10 md:py-16">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-medium text-blue-400 hover:text-blue-300">
          Volver a ANSIOFF
        </Link>

        <header className="mt-8 mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-300">Soporte</p>
          <h1 className="mt-3 text-4xl font-bold text-white">Ayuda y contacto de ANSIOFF</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            Si tienes dudas sobre la app, problemas de acceso, eliminación de datos o necesitas ayuda
            para utilizar las herramientas de calma, puedes contactar con el equipo de soporte.
          </p>
        </header>

        <section className="rounded-lg border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-semibold text-white">Contacto</h2>
          <p className="mt-3 text-slate-300">
            Email de soporte:
            {' '}
            <a className="font-medium text-blue-300 underline" href="mailto:soporte@ansioff.com">
              soporte@ansioff.com
            </a>
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Respondemos consultas sobre funcionamiento de la app, privacidad, datos de usuario y problemas
            técnicos.
          </p>
        </section>

        <section className="mt-6 rounded-lg border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-semibold text-white">Privacidad y datos</h2>
          <p className="mt-3 text-slate-300">
            Puedes consultar la politica de privacidad de ANSIOFF en:
            {' '}
            <Link className="font-medium text-blue-300 underline" href="/privacy">
              Politica de privacidad
            </Link>
          </p>
        </section>

        <section className="mt-6 rounded-lg border border-rose-400/20 bg-rose-400/10 p-6">
          <h2 className="text-xl font-semibold text-white">Ayuda urgente</h2>
          <p className="mt-3 text-slate-200">
            ANSIOFF no sustituye atencion medica, psicologica ni servicios de emergencia. Si estas en
            peligro inmediato o necesitas ayuda urgente, llama a emergencias.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <a className="rounded-md bg-rose-300 px-4 py-3 text-center font-semibold text-slate-950" href="tel:112">
              Llamar al 112
            </a>
            <a className="rounded-md border border-white/15 px-4 py-3 text-center font-semibold text-white" href="tel:024">
              Linea 024
            </a>
          </div>
        </section>

        <p className="mt-8 text-sm text-slate-500">Ultima actualizacion: 2 de julio de 2026.</p>
      </div>
    </main>
  );
}
