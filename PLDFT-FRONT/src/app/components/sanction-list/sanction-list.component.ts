import { Component } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sanction-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './sanction-list.component.html',
  styleUrl: './sanction-list.component.scss'
})
export class SanctionListComponent {
  entityId: string = '';
  listName: string = '';
  programName: string = '';
  result: any = null;
  errorMessage: string = '';

  constructor(private apiService: ApiService) { }

  onSubmit() {
    this.errorMessage = '';
    this.result = null;

    // Verifica si se ingresaron tanto el entityId como el programName
    if (this.entityId && this.programName) {
      this.apiService.getEntityByIdAndProgram(this.entityId, this.programName).subscribe({
        next: (data) => {
          this.result = data;  // Aquí se recibe el JSON con la respuesta
          console.log(this.result);  // Puedes ver el JSON en la consola
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Error al obtener la entidad con el programa';
        }
      });
    }
    // Verifica si solo el entityId es proporcionado
    else if (this.entityId) {
      this.apiService.getEntityById(this.entityId).subscribe({
        next: (data) => {
          this.result = data;
          console.log(this.result);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Error al obtener la entidad';
        }
      });
    }
    // Verifica si solo el programName es proporcionado
    else if (this.programName) {
      this.apiService.getEntitiesByProgram(this.programName).subscribe({
        next: (data) => {
          this.result = data;
          console.log(this.result);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Error al obtener el programa';
        }
      });
    }
    // Si no hay ningún campo proporcionado
    else {
      this.errorMessage = 'Por favor ingrese al menos un campo';
    }
  }

}