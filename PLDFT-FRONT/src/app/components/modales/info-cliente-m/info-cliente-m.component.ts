import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { ParseJsonPipe } from '../../../parse-json.pipe';

@Component({
  selector: 'app-info-cliente-m',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, ParseJsonPipe],
  templateUrl: './info-cliente-m.component.html',
  styleUrl: './info-cliente-m.component.scss'
})
export class InfoClienteMComponent {
  dialogRef: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  close(result: boolean) {
    this.dialogRef.close(result);
  }
}
