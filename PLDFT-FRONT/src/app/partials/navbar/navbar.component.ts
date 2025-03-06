import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu'; // Importación del MatMenuModule
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { LogoutComponent } from '../logout/logout.component';

const MATERIAL_MODULE = [
  MatIconModule,
  MatToolbarModule,
  MatButtonModule,
  MatMenuModule,
  RouterModule,
  MatBadgeModule,
  MatDialogModule,
];



@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MATERIAL_MODULE],
  template: `
    <mat-toolbar>
    <img src="LOGO2.png" alt="Logo PLD/FT" class="logonav mb-2" />
      <!-- Espaciador para separar los íconos -->
      <span class="spacer"></span>

      <!-- Íconos a la derecha -->
      <div class="nav-links-right">
        <a mat-button routerLink="/alerts"><mat-icon>notifications_none</mat-icon></a>
        <a mat-button (click)="logout()"> <mat-icon>exit_to_app</mat-icon></a>
      </div>

      <!-- Botón de menú hamburguesa para pantallas pequeñas -->
      <button mat-icon-button [matMenuTriggerFor]="menu" class="mobile-menu-button">
        <mat-icon><span class="material-symbols-outlined">account_circle</span></mat-icon>
      </button>
    </mat-toolbar>

    <!-- Menú desplegable -->
    <mat-menu #menu="matMenu">
      <button mat-menu-item routerLink="/alerts">
        <mat-icon>notifications_none</mat-icon> Alerts
      </button>
      <button mat-menu-item (click)="logout()">
        <mat-icon>exit_to_app</mat-icon> Logout
      </button>
    </mat-menu>
  `,
  styles: `
    mat-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
    }

    .logonav {
      width: 75px;
      margin-right: 10px;
    }

    a[mat-button] {
      display: flex;
      align-items: center;
      margin: 5px;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .nav-links-left, .nav-links-right {
      display: flex;
      align-items: center;
    }

    .mobile-menu-button {
      display: none;
    }

    @media (max-width: 768px) {
      .logonav {
        width: 60px;
      }

      .nav-links-left, .nav-links-right {
        display: none;
      }

      .mobile-menu-button {
        display: inline-flex;
        margin-left: auto;
      }
    }

    @media (min-width: 768px) {
      .logonav {
        display: none;
      }
    }

  `,
})
export class NavbarComponent {
  constructor(
    private oauthService: OAuthService,
    private httpClient: HttpClient,
    private dialog: MatDialog
  ) { }

  logout() {
    const dialogRef = this.dialog.open(LogoutComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.oauthService.logOut();
      }
    });
  }
}
