import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-info-emp',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  //templateUrl: './logoutconfirm.component.html',
  template: `<h1 mat-dialog-title>Información</h1>
  <mat-dialog-content>
    <h2 class="justificado">LKSBAAS S.A. DE C.V.</h2>
    <p class="justificado">En LKS, nos dedicamos a ofrecer soluciones tecnológicas innovadoras y de alta calidad para el sector financiero, proporcionando herramientas de software que optimizan la automatización de procesos y mejoran la eficiencia operativa. Nuestro objetivo es ayudar a las instituciones financieras a transformar digitalmente sus servicios, creando un impacto positivo en la experiencia de sus clientes y en la competitividad del mercado. </p>
    <hr>
    <p class="justificado">Versión del sistema: 1.0</p>
  </mat-dialog-content>
  <mat-dialog-actions align="end">
    <button mat-button (click)="close(false)">Cerrar</button>
  </mat-dialog-actions>`,
  styles: `
 .justificado {
    text-align: justify;
  }
`

})
export class InfoEmpComponent {
  constructor(private dialogRef: MatDialogRef<InfoEmpComponent>) { }

  close(result: boolean) {
    this.dialogRef.close(result);
  }
}