import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Política de Privacidad – ANSIOFF',
    description: 'Política de privacidad de la app ANSIOFF.',
};

export default function PrivacyPolicyPage() {
    return (
        <main style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1.5rem', fontFamily: 'sans-serif', color: '#e2e8f0', background: '#020617', minHeight: '100vh' }}>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Política de Privacidad</h1>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '2rem' }}>Última actualización: marzo 2026</p>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>1. ¿Qué datos recopilamos?</h2>
                <p style={{ lineHeight: 1.7, color: '#cbd5e1' }}>
                    ANSIOFF recoge únicamente los datos que el propio usuario introduce voluntariamente, como los registros de pensamientos (módulo TCC) y las notas del diario. Estos datos se almacenan de forma segura en nuestra base de datos (Supabase).
                </p>
                <p style={{ lineHeight: 1.7, color: '#cbd5e1', marginTop: '0.75rem' }}>
                    No recopilamos datos personales identificativos (nombre, correo electrónico, teléfono) a menos que el usuario los proporcione explícitamente en el futuro a través de un formulario de registro.
                </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>2. ¿Para qué usamos los datos?</h2>
                <p style={{ lineHeight: 1.7, color: '#cbd5e1' }}>
                    Los datos introducidos se utilizan exclusivamente para proporcionar las funcionalidades de la aplicación (historial de registros TCC, diario personal, etc.). ANSIOFF no vende ni comparte datos con terceros con fines comerciales.
                </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>3. ¿Cómo protegemos tus datos?</h2>
                <p style={{ lineHeight: 1.7, color: '#cbd5e1' }}>
                    Todos los datos se transmiten mediante conexión cifrada (HTTPS). El almacenamiento en Supabase incluye Row Level Security para asegurar que cada usuario solo accede a sus propios datos.
                </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>4. Cookies y almacenamiento local</h2>
                <p style={{ lineHeight: 1.7, color: '#cbd5e1' }}>
                    La aplicación puede usar el almacenamiento local del navegador (<code>localStorage</code>) para guardar preferencias básicas. No utilizamos cookies de seguimiento ni servicios de analítica de terceros.
                </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>5. Menores de edad</h2>
                <p style={{ lineHeight: 1.7, color: '#cbd5e1' }}>
                    ANSIOFF no está dirigida a menores de 16 años. No recopilamos conscientemente datos de menores.
                </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>6. Derechos del usuario</h2>
                <p style={{ lineHeight: 1.7, color: '#cbd5e1' }}>
                    Tienes derecho a acceder, rectificar o eliminar los datos que has introducido en la app. Para ejercer este derecho, o para cualquier consulta relacionada con la privacidad, puedes contactarnos en: <strong>ansioff.app@gmail.com</strong>
                </p>
            </section>

            <section>
                <h2 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>7. Cambios en esta política</h2>
                <p style={{ lineHeight: 1.7, color: '#cbd5e1' }}>
                    Podemos actualizar esta política ocasionalmente. Notificaremos cualquier cambio significativo a través de la propia aplicación.
                </p>
            </section>

            <p style={{ marginTop: '3rem', color: '#475569', fontSize: '0.8rem' }}>
                © 2026 ANSIOFF. Todos los derechos reservados.
            </p>
        </main>
    );
}
