import { Component } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


export interface entitySanction {
  name: string;
  address: string;
  tipe: string;
  program: string;
  list: string;
}



@Component({
  selector: 'app-sanction-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatProgressSpinnerModule,

  ],
  templateUrl: './sanction-list.component.html',
  styleUrls: ['./sanction-list.component.scss']
})
export class SanctionListComponent {
  displayedColumns = ['Nombre', 'Direccion', 'Tipo', 'Programa', 'Lista'];
  entityId: string = '';
  listName: string = '';
  programName: string = '';
  result: any = null;
  errorMessage: string = '';
  dataSource: any[] = [];
  entities: any[] = [];
  cargando: boolean = false;
  programs: any[] = [];
  selectedProgram: any;
  entityName: string = '';
  selectedType: string = '';
  address: string = '';


  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    // this.getEntitiesData();
    this.getPrograms();
  }

  getPrograms(): void {
    this.apiService.getPrograms().subscribe({
      next: (response) => {
        // console.log('Respuesta de la API:', response);
        // Asegurar que estamos accediendo al array correcto
        if (response && Array.isArray(response)) {
          this.programs = response.sort((a, b) => a.localeCompare(b));
        } else {
          this.programs = [];
        }
        // console.log('Programas obtenidos:', this.programs);
      },
      error: (err) => {
        console.error('Error al obtener los programas de sanción', err);
      }
    });
  }


  /*
    getEntitiesData(): void {
    this.apiService.getEntities().subscribe(response => {
      // Verificamos si 'entities' es un objeto con una propiedad 'entity'
      const entities = response.sanctionsData?.entities?.entity;

      // Si 'entities.entity' es un solo objeto, lo convertimos en un arreglo
      const entitiesArray = Array.isArray(entities) ? entities : [entities];

      // Asignamos el arreglo de entidades a la variable 'entities'
      this.entities = entitiesArray;

      // Ahora podemos usar 'map' sobre el arreglo de entidades
      this.entities.map(entity => {
        // Lógica para mapear las entidades, por ejemplo:
        console.log(entity);  // Aquí puedes manipular cada entidad según sea necesario
      });
    }, error => {
      console.error('Error al obtener los datos de las entidades', error);
    });
  }
 

  getEntityById(entityId: string): void {
    this.apiService.getEntityById(entityId).subscribe(response => {
      const entity = response.sanctionsData?.entities?.entity;
      this.entities = Array.isArray(entity) ? entity : [entity];
      console.log(this.entities);
    }, error => {
      console.error('Error al obtener la entidad por ID', error);
    });
  }
 */

  onSubmit() {
    this.cargando = true;
    this.errorMessage = '';
    this.result = null;

    if (this.entityId && this.programName) {
      this.apiService.getEntityByIdAndProgram(this.entityId, this.programName).subscribe({
        next: (data) => this.handleResponse(data),
        error: () => this.handleError('Error al obtener la entidad con el programa')
      });
    }

    if (!this.programName && this.entityId) {
      this.apiService.getEntityById(this.entityId).subscribe({
        next: (data) => this.handleResponse(data),
        error: () => this.handleError('Error al obtener la entidad')
      });
    }

    if (!this.entityId && this.programName) {
      this.apiService.getEntitiesByProgram(this.programName).subscribe({
        next: (data) => this.handleResponse(data),
        error: () => this.handleError('Error al obtener entidades por programa')
      });
    }
    if (!this.entityId && !this.programName) {
      this.errorMessage = 'Por favor, ingrese al menos un criterio de búsqueda';
      this.cargando = false;
    }
  }

  private handleResponse(data: any) {
    console.log('Datos recibidos:', data);
    this.result = data;

    const entities = Array.isArray(this.result?.sanctionsData?.entities?.entity)
      ? this.result.sanctionsData.entities.entity
      : [this.result?.sanctionsData?.entities?.entity].filter(Boolean);

    this.dataSource = this.transformData(entities)
      .sort((a, b) => a.name.localeCompare(b.name));

    console.log("Datos en dataSource:", this.dataSource);
    this.cargando = false;
  }

  private handleError(message: string) {
    console.error(message);
    this.errorMessage = message;
    this.cargando = false;
  }

  transformData(entities: any[]): entitySanction[] {
    if (!entities || !Array.isArray(entities)) return [];

    return entities.map(entity => {
      // Función para extraer la primera dirección completa
      const extractFirstAddress = (addressData: any): string => {
        if (!addressData) return '';
        const firstAddress = Array.isArray(addressData) ? addressData[0] : addressData;
        if (!firstAddress) return '';
        const parts = firstAddress.translations?.translation?.addressParts?.addressPart;
        if (!parts) return '';
        const partsValues = Array.isArray(parts) ? parts.map(part => part.value).filter(v => v.trim() !== '') : [parts.value];
        return partsValues.join(", ");
      };

      const fullName = Array.isArray(entity?.names?.name)
        ? entity.names.name[0]?.translations?.translation?.formattedFullName
        : entity?.names?.name?.translations?.translation?.formattedFullName;

      return {
        name: fullName || '',
        address: entity.addresses ? extractFirstAddress(entity.addresses.address) : '',
        tipe: entity.generalInfo?.entityType?._ || '',
        program: entity.sanctionsPrograms?.sanctionsProgram?._ || '',
        list: entity.sanctionsLists?.sanctionsList?._ || '',
      };
    }).filter(e => e.name && e.name.trim() !== ''); // Solo muestra los que tienen nombre
  }

  
}
