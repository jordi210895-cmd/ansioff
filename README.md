# ANSIOFF

Aplicacion de autocuidado para iOS, Android y web construida con Next.js y Capacitor. La version iOS 1.1 incorpora el onboarding "Ecosistema de Calma", acceso inicial como invitado y suscripciones nativas mediante RevenueCat.

## Arquitectura

- Next.js 15 y React 19 para la interfaz.
- Capacitor 6 para iOS y Android.
- Supabase para cuenta y sincronizacion opcional.
- RevenueCat para validar compras de App Store y Google Play.
- Gemini, a traves del endpoint de ANSIOFF, para la reflexion opcional del diario.
- LocalStorage e IndexedDB para onboarding, notas, progreso y audios locales.

Las respuestas del onboarding no se envian a analitica ni a plataformas publicitarias. Las notas solo salen del dispositivo cuando el usuario acepta expresamente solicitar una reflexion IA.

## Acceso

Gratis:

- Inicio, SOS, soporte y ajustes.
- Respiracion 4-2-6.
- Audio "Calma Profunda".
- Check-in de bienestar.

Premium:

- Resto de respiraciones y audios.
- Diario, reflexion IA, CBT y ACT.
- Juegos, modo noche, exposicion, estadisticas, exportacion y audios propios.

El entitlement de RevenueCat es `premium`. El offering es `default` y usa:

- `com.ansioff.premium.annual`
- `com.ansioff.premium.monthly`

En Google Play, los identificadores completos incluyen su plan base:

- `com.ansioff.premium.annual:annual` (39,99 EUR/ano, prueba de 7 dias)
- `com.ansioff.premium.monthly:monthly` (6,99 EUR/mes)

## Configuracion

Copiar `.env.example` a `.env.local` y completar solo las variables necesarias. Nunca se deben subir claves privadas al repositorio.

Variables nativas principales:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_REVENUECAT_IOS_API_KEY`
- `NEXT_PUBLIC_REVENUECAT_ANDROID_API_KEY`

El endpoint de IA necesita `GEMINI_API_KEY` unicamente en el servidor. Stripe conserva el flujo web existente y usa sus variables de servidor.

## Desarrollo

```bash
npm ci
npm run dev
npm run lint
npm test
npx tsc --noEmit
```

Vista previa del onboarding nativo en desarrollo:

```text
http://localhost:3000/?nativePreview=1
```

## Build nativo

```bash
STATIC_EXPORT=true npm run build
npx cap sync ios
open ios/App/App.xcworkspace
```

El proyecto iOS usa el bundle `com.ansioff.app.jordi`, la capacidad In-App Purchase y la version `1.1.0`. La subida automatizada esta en `.github/workflows/deploy-ios.yml` y requiere los secretos de firma, App Store Connect y la clave publica iOS de RevenueCat.

Android usa una ficha nueva de Google Play con el paquete `com.ansioff.app`. La ficha antigua `app.vercel.app_ansiedad_flame.twa` no se reutiliza para evitar el bloqueo de la clave de firma anterior.

```bash
STATIC_EXPORT=true npm run build
npx cap sync android
cd android
./gradlew :app:bundleRelease
```

La publicacion automatizada esta en `.github/workflows/deploy-android.yml`. Requiere la cuenta de servicio de Google Play, la clave de subida y la clave publica Android de RevenueCat configuradas como secretos de GitHub.

Antes de publicar:

1. Confirmar que RevenueCat contiene entitlement `premium`, offering `default` y ambos productos.
2. Probar compra anual, mensual, restauracion, cancelacion, expiracion y falta de red en sandbox.
3. Verificar onboarding y paywall en iPhone pequeno, iPhone grande e iPad.
4. Ejecutar lint, tests, TypeScript, build estatico y archive Release.
5. Subir primero a TestFlight y documentar para App Review el modo invitado, las funciones gratuitas y la cuenta demo.
