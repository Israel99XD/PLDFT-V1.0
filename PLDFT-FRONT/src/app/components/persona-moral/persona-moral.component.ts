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
import { InfoClienteMComponent } from '../modales/info-cliente-m/info-cliente-m.component';

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
  selector: 'app-persona-moral',
  standalone: true,
  imports: [MATERIAL_MODULES, CommonModule, ParseJsonPipe],
  templateUrl: './persona-moral.component.html',
  styleUrl: './persona-moral.component.scss'
})
export class PersonaMoralComponent implements OnInit, AfterViewInit {

  jsonCompleto: any; // Guarda el JSON completo recibido
  cargando: boolean = false;
  otrosDatos: any[] = []; // Almacena clientes de tipo Persona Moral

  // Definición de las columnas para la tabla de Persona Moral
  displayedColumnsOtrosDatos: string[] = [
    'razon_social',
    'giro',
    'nacionalidad',
    'rfc',
    'e_firma',
    'domicilio',
    'telefono',
    'correo',
    'fecha_const',
    'representante',
    'completitud',
    'action'
  ];

  dataSourceClientesM = new MatTableDataSource<any>();

  // Referencias a los componentes de paginación y ordenación
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Inyección de dependencias en el constructor
  constructor(
    private clienteService: ApiService,
    private dialog: MatDialog,
    private oauthService: OAuthService,
    private httpClient: HttpClient
  ) { }

  // Método del ciclo de vida de Angular, se ejecuta al iniciar el componente
  ngOnInit() {
    this.getClientesPerM();
  }

  // Método que se ejecuta después de que la vista se ha inicializado
  ngAfterViewInit() {
    this.dataSourceClientesM.paginator = this.paginator;
    this.dataSourceClientesM.sort = this.sort;
  }

  // Obtiene la lista de clientes Persona Moral desde el servicio
  getClientesPerM() {

    this.cargando = true; // Activar spinner
    // Ejemplo: Obtener codigo y perfil con espacio incluido
    const codigo = '0';
    const perfil = '269';

    this.clienteService.getClientesM(codigo, perfil).subscribe({
      next: (data) => {
        if (data[0] && typeof data[0].personaMoral === 'string') {
          const personaMoralArray = JSON.parse(data[0].personaMoral);
          this.otrosDatos = personaMoralArray;
          console.log(personaMoralArray);
          this.dataSourceClientesM.data = this.otrosDatos;
          this.jsonCompleto = data;
        } else {
          console.error(
            'El campo personaMoral no es un string válido o no existe.');
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
    if (tipo === 'otrosDatos') {
      this.dataSourceClientesM.filter = filterValue.trim().toLowerCase();
      if (this.dataSourceClientesM.paginator) {
        this.dataSourceClientesM.paginator.firstPage();
      }
    }
  }

  // Verifica si los campos requeridos están completos para determinar la "completitud"
  verificarCompletitud(cliente: any, tipo: string): boolean {
    let camposRequeridos: string[] = [];

    if (tipo === 'otrosDatos') {
      camposRequeridos = [
        'razon_social',
        'giro',
        'nacionalidad',
        'rfc',
        'e_firma',
        'domicilio',
        'telefono',
        'correo',
        'fecha_const',
        'representante',
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

  
  abrirModal(cliente: any) {
    const dialogRef = this.dialog.open(InfoClienteMComponent, {
        data: cliente  // Pasa la información del cliente al modal
    });

    dialogRef.afterClosed().subscribe(result => {
        // Opcional: puedes manejar el resultado cuando se cierre el modal
        console.log('Modal cerrado', result);
    });
}

}
