import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info-cliente',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './info-cliente.component.html',
  styleUrls: ['./info-cliente.component.scss']
})
export class InfoClienteComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private router: Router,
    private dialogRef: MatDialogRef<InfoClienteComponent> // Inyecta MatDialogRef aquí
  ) {}

  close(result: boolean) {
    this.dialogRef.close(result);
  }

  verPerfilTransaccional(): void {
    this.dialogRef.close();
    sessionStorage.setItem('clienteData', JSON.stringify(this.data));
    this.router.navigate(['/perfil-transaccional']);
  }
  
}
