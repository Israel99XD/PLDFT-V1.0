import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-info-cliente',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './info-cliente.component.html',
  styleUrl: './info-cliente.component.scss'
})
export class InfoClienteComponent {
  constructor(private dialogRef: MatDialogRef<InfoClienteComponent>) { }

  close(result: boolean) {
    this.dialogRef.close(result);
  }
}
