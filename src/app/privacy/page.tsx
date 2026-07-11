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

                <p className="mb-6 text-sm text-slate-400">Última actualización: 10 de julio de 2026</p>

                <div className="space-y-8 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Introducción</h2>
                        <p>Esta Política explica qué datos utiliza ANSIOFF, dónde se guardan y cuándo se comparten con un proveedor. ANSIOFF es una herramienta de bienestar y autocuidado; no es un servicio de diagnóstico, tratamiento ni atención de emergencias.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Recopilación de su información</h2>
                        <p>La aplicación puede tratar las siguientes categorías de información:</p>
                        <ul className="list-disc pl-5 mt-4 space-y-2">
                            <li><strong>Cuenta opcional:</strong> correo electrónico e identificador de usuario gestionados mediante Supabase cuando decide registrarse o iniciar sesión.</li>
                            <li><strong>Datos locales:</strong> respuestas del onboarding, notas, check-ins, progreso, configuración y audios personalizados. Se guardan en el dispositivo mediante LocalStorage o IndexedDB.</li>
                            <li><strong>Reflexión IA opcional:</strong> si pulsa expresamente la función y acepta el aviso, se envían como máximo las 15 notas más recientes al servicio de ANSIOFF y a Google Gemini para generar un resumen.</li>
                            <li><strong>Compras:</strong> RevenueCat y la tienda correspondiente procesan identificadores de compra, recibos, producto adquirido, estado de suscripción y fechas necesarias para validar el acceso Premium.</li>
                            <li><strong>Notificaciones:</strong> se solicita permiso solo si activa recordatorios. Los recordatorios locales se programan en el dispositivo; cuando se utilicen notificaciones remotas, OneSignal podrá procesar el token de notificación.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Uso de su información</h2>
                        <p>Tener información precisa sobre usted nos permite brindarle una experiencia fluida, eficiente y personalizada. Específicamente, utilizamos la información para:</p>
                        <ul className="list-disc pl-5 mt-4 space-y-2">
                            <li>Crear y administrar la cuenta opcional.</li>
                            <li>Personalizar el plan dentro del dispositivo según las respuestas del onboarding.</li>
                            <li>Validar compras, restaurar suscripciones y habilitar funciones Premium.</li>
                            <li>Generar una reflexión IA únicamente cuando la solicita y consiente.</li>
                            <li>Programar recordatorios cuando los activa.</li>
                        </ul>
                        <p className="mt-4">Las respuestas sobre síntomas, desencadenantes, notas y puntuaciones no se envían a Meta, Google Ads ni a plataformas publicitarias. Si en el futuro se habilita analítica, los eventos de embudo serán genéricos y requerirán consentimiento cuando corresponda.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Proveedores de Servicios Terceros</h2>
                        <p>Para el funcionamiento de la aplicación, utilizamos los siguientes proveedores de confianza:</p>
                        <ul className="list-disc pl-5 mt-4 space-y-2">
                            <li><strong>Supabase:</strong> autenticación y servicios de cuenta.</li>
                            <li><strong>Google Gemini:</strong> procesamiento puntual de las notas enviadas voluntariamente para generar la reflexión IA.</li>
                            <li><strong>RevenueCat:</strong> validación y gestión técnica del estado de las suscripciones.</li>
                            <li><strong>Apple App Store y Google Play:</strong> cobro, recibos, renovación y cancelación de las compras realizadas en sus tiendas.</li>
                            <li><strong>OneSignal:</strong> notificaciones remotas cuando esta función esté habilitada y autorizada.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Seguridad y Retención</h2>
                        <p>Utilizamos conexiones cifradas y limitamos el contenido enviado a cada proveedor. Los datos locales permanecen hasta que los borra desde Ajustes, elimina la aplicación o el sistema limpia su almacenamiento. Los datos de cuenta se conservan mientras la cuenta esté activa o durante el plazo legal necesario. Los registros de compra pueden conservarse por obligaciones contables y de la tienda.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Derechos del usuario</h2>
                        <p>Puede borrar los datos locales, eliminar su cuenta, retirar permisos de notificación y dejar de utilizar la reflexión IA desde Ajustes. También puede restaurar o gestionar su suscripción desde la tienda. Para ejercer los derechos de acceso, rectificación, oposición, limitación o supresión, puede contactarnos.</p>
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
