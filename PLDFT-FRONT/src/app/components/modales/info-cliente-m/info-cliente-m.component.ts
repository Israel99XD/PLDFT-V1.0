import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ParseJsonPipe } from '../../../parse-json.pipe';

@Component({
  selector: 'app-info-cliente-m',
  standalone: true,
  imports: [
    ParseJsonPipe,
    CommonModule,
    MatDialogModule,
    MatButtonModule],
  templateUrl: './info-cliente-m.component.html',
  styleUrl: './info-cliente-m.component.scss'
})
export class InfoClienteMComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private dialogRef: MatDialogRef<InfoClienteMComponent> // Inyecta MatDialogRef aquí
  ) { }

  close(result: boolean) {
    this.dialogRef.close(result);
  }

  verPerfilTransaccional(): void {
    this.dialogRef.close();
    sessionStorage.setItem('clienteData', JSON.stringify(this.data));
    this.router.navigate(['/perfil-transaccional-m']);
  }

}
