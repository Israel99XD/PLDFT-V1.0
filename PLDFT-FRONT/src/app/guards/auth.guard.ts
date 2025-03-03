// Se importa el decorador Injectable y las dependencias necesarias de Angular
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

// Se marca la clase como un servicio inyectable para que Angular la administre
@Injectable({
  providedIn: 'root'  // Esto indica que el servicio está disponible en toda la aplicación
})
export class AuthGuard implements CanActivate {
  // Se inyectan el servicio Router y OAuthService en el constructor
  constructor(private router: Router, private oauthService: OAuthService) {}

  // Método que se ejecuta para determinar si la ruta puede ser activada
  canActivate(): boolean {
    // Se obtiene el token de acceso actual
    const token = this.oauthService.getAccessToken();

    // Si no hay token o el token no es válido
    if (!token || !this.oauthService.hasValidAccessToken()) {
      // Se redirige al usuario a la página principal (o página de login)
      this.router.navigate(['/']);
      return false;  // No se puede activar la ruta
    }

    // Si el token es válido, se permite la activación de la ruta
    return true;
  }
}
