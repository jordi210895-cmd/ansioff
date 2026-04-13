# Instrucciones para el Desarrollador (iOS Deployment)

Este paquete contiene las credenciales necesarias para firmar y subir la aplicación **ANSIOFF** a la App Store.

## 📁 Archivos Incluidos

1.  **Certificado de Distribución**: `Certificado.p12`
    *   **Contraseña**: `1234`
    *   Este certificado debe ser importado en el Acceso a Llaveros (Keychain Access) de macOS.
2.  **Perfil de Provisión**: `ANSIOFF_APPSTORE.mobileprovision`
    *   Este perfil debe ser instalado en Xcode para permitir la firma de la app con el ID `com.ansioff.app`.
3.  **App Store Connect API Key**: `AuthKey_2WKHGPHFX2.p8`
    *   **Key ID**: `2WKHGPHFX2`
    *   **Issuer ID**: (Consultar en el portal de App Store Connect si es necesario para automatización).
    *   Este archivo es necesario para usar herramientas como `altool` o `fastlane` para la subida automática.

## 🚀 Pasos Recomendados

1.  Importar el archivo `.p12` con la contraseña proporcionada.
2.  Hacer doble clic en el archivo `.mobileprovision` para que Xcode lo reconozca.
3.  En Xcode, seleccionar el target "App", ir a "Signing & Capabilities" y asegurar que el "Bundle Identifier" sea `com.ansioff.app`.
4.  Desactivar "Automatically manage signing" y seleccionar manualmente el perfil `ANSIOFF_APPSTORE`.
5.  Realizar un **Product > Archive** y subir a TestFlight/App Store.

Si necesitas cualquier otra clave (.env con Supabase, Stripe, etc.), por favor solicítala por canal privado.
