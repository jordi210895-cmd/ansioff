import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfUse() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 p-6 md:p-12 font-sans selection:bg-blue-500/30">
            <div className="max-w-3xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-8 transition-colors">
                    <ArrowLeft size={20} />
                    <span>Volver a la aplicación</span>
                </Link>

                <h1 className="text-4xl font-bold text-white mb-8 font-serif">Términos de uso</h1>
                <p className="mb-6 text-sm text-slate-400">Última actualización: 15 de julio de 2026</p>

                <div className="space-y-8 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Aceptación de los términos</h2>
                        <p>Al usar ANSIOFF acepta estos términos de uso y la política de privacidad. Si no está de acuerdo, no utilice la aplicación.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Finalidad de ANSIOFF</h2>
                        <p>ANSIOFF ofrece herramientas de diario personal, pausas guiadas, sonidos, rutinas y seguimiento de hábitos cotidianos. La aplicación es una herramienta de bienestar y organización personal. No proporciona diagnóstico médico, tratamiento, consejo psicológico profesional ni servicios de emergencia.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Suscripciones y prueba gratuita</h2>
                        <p>ANSIOFF puede ofrecer suscripciones autorrenovables gestionadas por Apple App Store o Google Play. El plan mensual y el plan anual pueden incluir una prueba gratuita de 7 días cuando esté disponible para su cuenta y territorio.</p>
                        <ul className="list-disc pl-5 mt-4 space-y-2">
                            <li>El plan mensual se renueva cada mes al precio mostrado en la tienda antes de confirmar la compra.</li>
                            <li>El plan anual se renueva cada año al precio mostrado en la tienda antes de confirmar la compra.</li>
                            <li>Puede cancelar la renovación automática desde la configuración de suscripciones de su cuenta de Apple o Google antes de que termine el periodo de prueba o el periodo de facturación vigente.</li>
                            <li>La gestión de cobros, renovaciones, cancelaciones y reembolsos se realiza según las condiciones de la tienda correspondiente.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Uso responsable</h2>
                        <p>Debe utilizar ANSIOFF de forma lícita y responsable. No debe introducir contenido que vulnere derechos de terceros, que sea ilegal o que intente interferir con el funcionamiento de la aplicación.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Propiedad intelectual</h2>
                        <p>El diseño, textos, marca, gráficos, sonidos y contenidos de ANSIOFF pertenecen a sus titulares o se usan con autorización. No puede copiar, redistribuir o explotar comercialmente la aplicación sin permiso previo.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Privacidad</h2>
                        <p>El tratamiento de datos se describe en la <Link className="text-blue-500 underline" href="/privacy">Política de Privacidad</Link>. Las compras se validan mediante la tienda correspondiente y RevenueCat para habilitar el acceso Premium.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">7. Limitación de responsabilidad</h2>
                        <p>ANSIOFF se ofrece “tal cual” y puede cambiar, interrumpirse o actualizarse. En la medida permitida por la ley, no somos responsables de daños indirectos derivados del uso o imposibilidad de uso de la aplicación.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">8. Cambios en los términos</h2>
                        <p>Podemos actualizar estos términos para reflejar cambios legales, técnicos o de producto. La versión vigente estará disponible en esta página.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">9. Contacto</h2>
                        <p>Para consultas sobre estos términos, puede escribir a: <span className="text-blue-500 underline">soporte@ansioff.com</span></p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">10. EULA estándar de Apple</h2>
                        <p>Para usuarios de iOS, salvo que se indique lo contrario, también se aplica el <a className="text-blue-500 underline" href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/" target="_blank" rel="noreferrer">Contrato de licencia estándar de Apple</a>.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
