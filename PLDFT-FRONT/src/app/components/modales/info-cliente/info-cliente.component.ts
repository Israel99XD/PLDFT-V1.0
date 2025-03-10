import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-info-cliente',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './info-cliente.component.html',
  styleUrl: './info-cliente.component.scss'
})
export class InfoClienteComponent {
  dialogRef: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  close(result: boolean) {
    this.dialogRef.close(result);
  }
}
