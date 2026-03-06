import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 p-6 md:p-12 font-sans selection:bg-blue-500/30">
            <div className="max-w-3xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-8 transition-colors">
                    <ArrowLeft size={20} />
                    <span>Volver a la aplicación</span>
                </Link>

                <h1 className="text-4xl font-bold text-white mb-8" style={{ fontFamily: 'Georgia, serif' }}>Política de Privacidad</h1>

                <p className="mb-6 text-sm text-slate-400">Última actualización: 7 de Marzo de 2026</p>

                <div className="space-y-8 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Introducción</h2>
                        <p>Bienvenido a ANSIOFF ("la Aplicación"). Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y salvaguardamos su información cuando visita nuestra aplicación móvil o sitio web. Lea atentamente esta política de privacidad. Si no está de acuerdo con los términos de esta política de privacidad, no acceda a la aplicación.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Recopilación de su información</h2>
                        <p>Podemos recopilar información sobre usted de varias maneras. La información que podemos recopilar en la Aplicación incluye:</p>
                        <ul className="list-disc pl-5 mt-4 space-y-2">
                            <li><strong>Datos Personales:</strong> Información de identificación personal, como su dirección de correo electrónico, que nos proporciona voluntariamente al registrarse en la Aplicación.</li>
                            <li><strong>Datos Generados por el Usuario:</strong> Entradas de diario, registros de pensamientos (CBT) y configuraciones personales que decide guardar dentro de la Aplicación. Estos datos se asocian a su cuenta para proporcionar una experiencia personalizada.</li>
                            <li><strong>Datos Derivados:</strong> Información que nuestros servidores recopilan automáticamente cuando accede a la Aplicación, como su dirección IP, tipo de navegador, sistema operativo y los tiempos de acceso.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Uso de su información</h2>
                        <p>Tener información precisa sobre usted nos permite brindarle una experiencia fluida, eficiente y personalizada. Específicamente, podemos utilizar la información recopilada a través de la Aplicación para:</p>
                        <ul className="list-disc pl-5 mt-4 space-y-2">
                            <li>Crear y administrar su cuenta.</li>
                            <li>Sincronizar sus datos (como entradas de diario) entre dispositivos.</li>
                            <li>Mejorar la eficiencia y el funcionamiento de la Aplicación.</li>
                            <li>Supervisar y analizar el uso y las tendencias para mejorar su experiencia.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Seguridad de los datos</h2>
                        <p>Utilizamos medidas de seguridad administrativas, técnicas y físicas, incluida la infraestructura de Supabase, para ayudar a proteger su información personal. Si bien hemos tomado medidas razonables para asegurar la información personal que nos proporciona, tenga en cuenta que, a pesar de nuestros esfuerzos, ninguna medida de seguridad es perfecta o impenetrable, y ningún método de transmisión de datos puede garantizarse contra cualquier intercepción u otro tipo de uso indebido.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Compartir su información</h2>
                        <p>No vendemos, comercializamos ni alquilamos información de identificación personal de los Usuarios a terceros. Podemos compartir información demográfica agregada genérica no vinculada a ninguna información de identificación personal sobre visitantes y usuarios con nuestros socios comerciales y anunciantes de confianza.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Derechos del usuario</h2>
                        <p>Dependiendo de su jurisdicción, puede tener ciertos derechos con respecto a su información personal, incluido el derecho a acceder, corregir o eliminar los datos que hemos recopilado de usted. Para ejercer estos derechos, puede ponerse en contacto con nosotros.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">7. Contacto</h2>
                        <p>Si tiene preguntas o comentarios sobre esta Política de Privacidad, por favor contáctenos a través de los canales de soporte de la Aplicación.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
