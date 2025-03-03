// Importaciones necesarias de Angular y Material
import { CommonModule } from '@angular/common'; // Módulo común de Angular
import { HttpClient } from '@angular/common/http'; // Cliente HTTP para peticiones API
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // Servicio para manejar diálogos de Material
import { MatFormFieldModule } from '@angular/material/form-field'; // Módulo de formulario de Material
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'; // Componente para paginación de Material
import { MatSort, MatSortModule } from '@angular/material/sort'; // Componente para ordenar tablas de Material
import { MatTableDataSource, MatTableModule } from '@angular/material/table'; // Fuente de datos para las tablas de Material
import { OAuthService } from 'angular-oauth2-oidc'; // Servicio de autenticación OAuth
import { ParseJsonPipe } from '../../parse-json.pipe'; // Pipe personalizado para parsear JSON
import { ApiService } from '../../service/api.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InfoClienteComponent } from '../modales/info-cliente/info-cliente.component';

// Agrupación de módulos de Material para facilitar la importación
const MATERIAL_MODULES = [
  MatInputModule,
  MatPaginatorModule,
  MatSortModule,
  MatTableModule,
  MatFormFieldModule,
  MatDialogModule,
  MatButtonModule,
  MatProgressSpinnerModule
];

@Component({
  selector: 'app-persona-fisica',
  standalone: true,
  imports: [MATERIAL_MODULES, CommonModule, ParseJsonPipe],
  templateUrl: './persona-fisica.component.html',
  styleUrl: './persona-fisica.component.scss'
})
export class PersonaFisicaComponent implements OnInit, AfterViewInit {
  clientes: any[] = []; // Almacena clientes de tipo Persona Física
  jsonCompleto: any; // Guarda el JSON completo recibido
  cargando: boolean = false;

  // Definición de las columnas para la tabla de Persona Física
  displayedColumnsClientes: string[] = [
    'name',
    'n_cliente',
    'status',
    'curp',
    'nacionalidad',
    'genero_cl',
    'fecha_nacimiento',
    'ocupacion',
    'calle',
    'ciudad',
    'telefono',
    'correo',
    'completitud',
  ];

  // Fuente de datos para las tablas de Persona Física y Persona Moral
  dataSourceClientes = new MatTableDataSource<any>();

  // Referencias a los componentes de paginación y ordenación
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Inyección de dependencias en el constructor
  constructor(
    private clienteService: ApiService,
    private dialog: MatDialog,
    private oauthService: OAuthService,
  ) { }

  // Método del ciclo de vida de Angular, se ejecuta al iniciar el componente
  ngOnInit() {
    this.obtenerClientes();
  }
  

  // Método que se ejecuta después de que la vista se ha inicializado
  ngAfterViewInit() {
    this.dataSourceClientes.paginator = this.paginator;
    this.dataSourceClientes.sort = this.sort;
  }

  // Obtiene la lista de clientes Persona Física desde el servicio
  obtenerClientes() {
    this.cargando = true; // Activar spinner

    // Ejemplo: Obtener codigo y perfil con espacio incluido
    const codigo = '0';
    const perfil = '268';

    // Llamada a la API pasando los parámetros
    this.clienteService.getClienteData(codigo, perfil).subscribe({
      next: (data) => {
        if (data[0] && typeof data[0].personaFisica === 'string') {
          const personaFisicaArray = JSON.parse(data[0].personaFisica);
          this.clientes = personaFisicaArray;
          console.log(personaFisicaArray);
          this.dataSourceClientes.data = this.clientes;
          this.jsonCompleto = data;
        } else {
          console.error('El campo personaFisica no es un string válido o no existe.');
        }
        this.cargando = false; // Desactivar spinner
      },
      error: (error) => {
        console.error('Error al obtener clientes:', error);
        this.cargando = false; // Desactivar spinner en caso de error
      },
    });
  }

  // Filtra los resultados en la tabla según el tipo de cliente
  applyFilter(event: Event, tipo: string) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.clientes) {
      this.dataSourceClientes.filter = filterValue.trim().toLowerCase();
      if (this.dataSourceClientes.paginator) {
        this.dataSourceClientes.paginator.firstPage();
      }
    }
  }

  // Verifica si los campos requeridos están completos para determinar la "completitud"
  verificarCompletitud(cliente: any, tipo: string): boolean {
    let camposRequeridos: string[] = [];

    if (this.clientes) {
      camposRequeridos = [
        'name',
        'n_cliente',
        'status',
        'curp',
        'nacionalidad',
        'genero_cl',
        'fecha_nacimiento',
        'ocupacion',
        'calle',
        'ciudad',
        'telefono',
        'correo',
        'agendacl',
      ];

    }

    return camposRequeridos.every((campo) => {
      let valor = cliente[campo];

      if (campo === 'agendacl' && typeof valor === 'string') {
        try {
          const agendaArray = JSON.parse(valor);
          return agendaArray.every(
            (item: any) => item.telefono !== null && item.correo !== null
          );
        } catch (error) {
          console.error('Error al parsear agendacl:', error);
          return false;
        }
      }

      return valor !== null && valor !== '' && valor !== 'null';
    });
  }

    // Muestra un modal con información del cliente
    mostrarInfo() {
      const dialogRef = this.dialog.open(InfoClienteComponent);
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          this.oauthService.logOut();
        }
      });
    }


}
