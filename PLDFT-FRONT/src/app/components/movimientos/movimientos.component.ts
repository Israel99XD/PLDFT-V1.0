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
import { InfoClienteComponent } from '../modales/info-cliente/info-cliente.component'; // Modal para mostrar información del cliente
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
  selector: 'app-movimientos',
  standalone: true,
  imports: [MATERIAL_MODULES, CommonModule],
  templateUrl: './movimientos.component.html',
  styleUrl: './movimientos.component.scss'
})
export class MovimientosComponent implements OnInit, AfterViewInit {
  movimientos: any[] = [];
  jsonCompleto: any; // Guarda el JSON completo recibido
  cargando: boolean = false;

  displayedColumnsMovimientos: string[] = [
    'movimientoID',
    'cveMovimiento',
    'descMovimiento',
    'saldo'
  ];

  dataSourceMovimientos = new MatTableDataSource<any>();

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
      this.getMovimientos();
     }

       // Método que se ejecuta después de que la vista se ha inicializado
  ngAfterViewInit() {
    this.dataSourceMovimientos.paginator = this.paginator;
    this.dataSourceMovimientos.sort = this.sort;
  }

  
  getMovimientos() {
    this.cargando = true; // Activar spinner
    this.clienteService.getMovimientos().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          // Verifica si `data` es un array
          this.movimientos = data; // Asigna directamente los movimientos
          console.log('Movimientos obtenidos:', this.movimientos);
          this.dataSourceMovimientos.data = this.movimientos; // Actualiza la tabla
        } else {
          console.error('La respuesta de la API no es un array válido:', data);
        }
        this.cargando = false; // Desactivar spinner
      },
      error: (error) => {
        console.error('Error al obtener movimientos:', error);
        this.cargando = false; // Desactivar spinner
      },
    });
  }

    // Filtra los resultados en la tabla según el tipo de cliente
    applyFilter(event: Event, tipo: string) {
      const filterValue = (event.target as HTMLInputElement).value;
      if (tipo === 'movimientos') {
        this.dataSourceMovimientos.filter = filterValue.trim().toLowerCase();
        if (this.dataSourceMovimientos.paginator) {
          this.dataSourceMovimientos.paginator.firstPage();
        }
      }
    }



}
