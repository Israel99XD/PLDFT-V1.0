// Se importan las dependencias necesarias para la configuración de la aplicación
import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';  // Se importan las rutas definidas en otro archivo
import { AuthConfig, OAuthService, provideOAuthClient } from 'angular-oauth2-oidc'; 
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// Se define la configuración para el flujo de autorización OAuth
export const authCodeFlowConfig: AuthConfig = {
  issuer: 'http://122.8.186.221:7580/realms/lks-core',  // Emisor del servidor de autorización
  tokenEndpoint: 'http://122.8.186.221:7580/realms/lks-core/protocol/openid-connect/token',  // Endpoint para obtener el token
  redirectUri: window.location.origin,  // URI de redirección después de la autenticación
  clientId: 'lks-core-demo',  // ID del cliente para la autenticación
  responseType: 'code',  // Tipo de respuesta esperado
  scope: 'openid profile',  // Alcance solicitado
  showDebugInformation: true,  // Muestra información de depuración
  requireHttps: false  // No requiere HTTPS en esta configuración
};

// Función que se ejecuta al inicio para inicializar la autenticación OAuth
function initializeOAuth(oauthService: OAuthService): Promise<void> {
  return new Promise((resolve, reject) => {
    oauthService.configure(authCodeFlowConfig);  // Configura el servicio OAuth con la configuración definida
    oauthService.setupAutomaticSilentRefresh();  // Configura la actualización silenciosa automática del token
    
    // Intenta cargar el documento de descubrimiento y hacer login automáticamente si es posible
    oauthService.loadDiscoveryDocumentAndTryLogin()
      .then(() => {
        // Si no se tiene un token válido, se inicia el flujo de autenticación
        if (!oauthService.hasValidAccessToken()) {
          oauthService.initCodeFlow();  // Inicia el flujo de código para obtener el token
        } else {
          console.log('Usuario autenticado:', oauthService.getIdentityClaims());  // Si ya está autenticado, muestra las reclamaciones del usuario
          localStorage.setItem('token', oauthService.getAccessToken());  // Almacena el token en localStorage
        }
        resolve();  // Finaliza la promesa con éxito
      })
      .catch((error) => {
        console.error('Error al intentar el login:', error);  // Muestra error si ocurre
        reject(error);  // Finaliza la promesa con error
      });
  });
}

// Configuración de la aplicación, que incluye los proveedores de servicios para la inicialización
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),  // Proporciona la detección de cambios en la zona
    provideRouter(routes),  // Proporciona el enrutador con las rutas definidas
    provideAnimationsAsync(),  // Proporciona animaciones asincrónicas
    provideHttpClient(),  // Proporciona el cliente HTTP para hacer solicitudes
    provideOAuthClient(),  // Proporciona el cliente OAuth para autenticación

    // Proveedor de APP_INITIALIZER que ejecuta la función de inicialización antes de que la aplicación se cargue
    {
      provide: APP_INITIALIZER,
      useFactory: (oauthService: OAuthService) => {
        return () => initializeOAuth(oauthService);  // Llama a la función de inicialización OAuth
      },
      multi: true,  // Permite múltiples inicializadores
      deps: [OAuthService]  // Dependencia del servicio OAuth
    }
  ]
};
