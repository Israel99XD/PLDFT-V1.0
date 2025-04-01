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
  // Declaración de las variables que se utilizarán en el componente
  displayedColumns = ['Nombre', 'Direccion', 'Tipo', 'Programa', 'Lista'];  // Columnas que se mostrarán en la tabla
  entityId: string = '';             // ID de la entidad para la búsqueda
  listName: string = '';             // Nombre de la lista para la búsqueda
  programName: string = '';          // Nombre del programa de sanción para la búsqueda
  result: any = null;                // Resultado de la búsqueda
  errorMessage: string = '';         // Mensaje de error en caso de fallo
  dataSource: any[] = [];            // Datos que se mostrarán en la tabla
  entities: any[] = [];              // Entidades que serán procesadas
  cargando: boolean = false;         // Indicador de carga mientras se esperan los resultados
  programs: any[] = [];              // Programas de sanción disponibles
  selectedProgram: any;              // Programa seleccionado
  entityName: string = '';           // Nombre de la entidad para la búsqueda
  selectedType: string = '';         // Tipo de entidad seleccionado
  address: string = '';              // Dirección de la entidad para la búsqueda

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    // Cuando el componente se inicializa, se obtiene la lista de programas
    this.getPrograms();
  }

  // Método para obtener los programas de sanción desde el API
  getPrograms(): void {
    this.apiService.getPrograms().subscribe({
      next: (response) => {
        // Si la respuesta es un array, ordena los programas alfabéticamente
        if (response && Array.isArray(response)) {
          this.programs = response.sort((a, b) => a.localeCompare(b));
        } else {
          this.programs = [];  // Si no es un array, inicializa vacío
        }
      },
      error: (err) => {
        // Manejo de errores al obtener los programas
        console.error('Error al obtener los programas de sanción', err);
      }
    });
  }

  // Método que maneja el envío del formulario de búsqueda
  onSubmit() {
    this.cargando = true;  // Activa el indicador de carga
    this.errorMessage = ''; // Resetea cualquier mensaje de error
    this.result = null;     // Resetea el resultado

    // Condicionales para realizar la búsqueda según el ID de la entidad y el nombre del programa
    if (this.entityId && this.programName) {
      this.apiService.getEntityByIdAndProgram(this.entityId, this.programName).subscribe({
        next: (data) => this.handleResponse(data),  // Maneja la respuesta de la API
        error: () => this.handleError('Error al obtener la entidad con el programa')  // Maneja el error
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
      // Si no se ingresa ningún criterio de búsqueda, muestra un mensaje de error
      this.errorMessage = 'Por favor, ingrese al menos un criterio de búsqueda';
      this.cargando = false;
    }
  }

  // Método para manejar la respuesta exitosa de la API
  private handleResponse(data: any) {
    this.result = data;  // Asigna los datos recibidos
    // Extrae y transforma las entidades desde los datos recibidos
    const entities = Array.isArray(this.result?.sanctionsData?.entities?.entity)
      ? this.result.sanctionsData.entities.entity
      : [this.result?.sanctionsData?.entities?.entity].filter(Boolean);

    // Transforma las entidades para mostrarlas en la tabla
    this.dataSource = this.transformData(entities)
      .sort((a, b) => a.name.localeCompare(b.name));  // Ordena las entidades por nombre

    this.cargando = false;  // Desactiva el indicador de carga
  }

  // Método para manejar los errores de la API
  private handleError(message: string) {
    this.errorMessage = message;  // Muestra el mensaje de error
    this.cargando = false;  // Desactiva el indicador de carga
  }

  // Método para transformar los datos de las entidades a un formato adecuado para la tabla
  transformData(entities: any[]): entitySanction[] {
    if (!entities || !Array.isArray(entities)) return [];  // Si no hay entidades, retorna un array vacío

    return entities.map(entity => {
      // Función para extraer la primera dirección completa de la entidad
      const extractFirstAddress = (addressData: any): string => {
        if (!addressData) return '';  // Si no hay datos de dirección, retorna vacío
        const firstAddress = Array.isArray(addressData) ? addressData[0] : addressData;
        if (!firstAddress) return '';
        const parts = firstAddress.translations?.translation?.addressParts?.addressPart;
        if (!parts) return '';
        const partsValues = Array.isArray(parts) ? parts.map(part => part.value).filter(v => v.trim() !== '') : [parts.value];
        return partsValues.join(", ");  // Une las partes de la dirección
      };

      // Extrae el nombre completo de la entidad
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
    }).filter(e => e.name && e.name.trim() !== '');  // Filtra las entidades que no tienen nombre
  }
}