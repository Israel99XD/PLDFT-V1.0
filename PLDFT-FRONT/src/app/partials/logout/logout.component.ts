import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  //templateUrl: './logoutconfirm.component.html',
  template: ` <h2 mat-dialog-title>Cerrar sesión</h2>
  <mat-dialog-content
    >¿Estás seguro que deseas cerrar sesión?</mat-dialog-content
  >
  <mat-dialog-actions align="end">
    <button mat-button (click)="close(false)">Cancelar</button>
    <button mat-button color="warn" (click)="close(true)">
      Aceptar
    </button>
  </mat-dialog-actions>
`,
})
export class LogoutComponent {
  constructor(private dialogRef: MatDialogRef<LogoutComponent>) { }

  close(result: boolean) {
    this.dialogRef.close(result);
  }
}
