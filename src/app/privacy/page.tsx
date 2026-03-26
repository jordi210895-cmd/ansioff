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

                <h1 className="text-4xl font-bold text-white mb-8 font-serif">Política de Privacidad</h1>

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
                            <li><strong>Datos Personales:</strong> Información de identificación personal, como su dirección de correo electrónico, que nos proporciona voluntariamente al registrarse en la Aplicación a través de <strong>Supabase Auth</strong>.</li>
                            <li><strong>Identificadores de Dispositivo:</strong> Si permite las notificaciones, recopilamos un identificador de dispositivo único (push token) a través de <strong>OneSignal</strong> para enviarle recordatorios y consejos de bienestar.</li>
                            <li><strong>Datos Generados por el Usuario:</strong> Entradas de diario, registros de pensamientos (CBT) y configuraciones personales. Estos datos se almacenan de forma segura en <strong>Supabase</strong> (cuando inicia sesión) o localmente en su dispositivo (IndexedDB/LocalStorage).</li>
                            <li><strong>Datos Derivados:</strong> Información que nuestros servidores recopilan automáticamente cuando accede a la Aplicación, como su dirección IP y tiempos de acceso.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Uso de su información</h2>
                        <p>Tener información precisa sobre usted nos permite brindarle una experiencia fluida, eficiente y personalizada. Específicamente, utilizamos la información para:</p>
                        <ul className="list-disc pl-5 mt-4 space-y-2">
                            <li>Crear y administrar su cuenta y sincronizar sus datos entre dispositivos.</li>
                            <li>Enviarle notificaciones push con ejercicios de respiración y recordatorios de calma (solo si se activan).</li>
                            <li>Personalizar su experiencia basada en su progreso y uso de herramientas.</li>
                            <li>Supervisar el rendimiento técnico de la Aplicación.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Proveedores de Servicios Terceros</h2>
                        <p>Para el funcionamiento de la aplicación, utilizamos los siguientes proveedores de confianza:</p>
                        <ul className="list-disc pl-5 mt-4 space-y-2">
                            <li><strong>Supabase:</strong> Para la gestión de usuarios y base de datos segura.</li>
                            <li><strong>OneSignal:</strong> Para el envío de notificaciones push.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Seguridad y Retención</h2>
                        <p>Utilizamos medidas de seguridad técnicas para proteger su información. Sus datos se conservan mientras su cuenta esté activa o sea necesario para proporcionarle los servicios de la Aplicación. Puede solicitar la eliminación de todos sus datos en cualquier momento desde la sección de Ajustes de la Aplicación.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Derechos del usuario</h2>
                        <p>Usted tiene derecho a acceder, rectificar o eliminar sus datos personales. Puede eliminar su cuenta y todos los datos asociados directamente desde el botón "Borrar todos mis datos" en el menú de Ajustes. Para cualquier otra consulta, puede contactarnos.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">7. Contacto</h2>
                        <p>Si tiene preguntas sobre esta Política de Privacidad o desea ejercer sus derechos, por favor contáctenos en: <span className="text-blue-500 underline">soporte@ansioff.com</span></p>
                    </section>
                </div>
            </div>
        </div>
    );
}
