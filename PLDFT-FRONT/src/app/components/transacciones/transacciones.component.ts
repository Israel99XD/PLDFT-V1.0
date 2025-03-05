import { CommonModule } from '@angular/common'; // Módulo común de Angular
import { HttpClient } from '@angular/common/http'; // Cliente HTTP para peticiones API
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; // Servicio para manejar diálogos de Material
import { MatFormFieldModule } from '@angular/material/form-field'; // Módulo de formulario de Material
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'; // Componente para paginación de Material
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort'; // Componente para ordenar tablas de Material
import { MatTableDataSource, MatTableModule } from '@angular/material/table'; // Fuente de datos para las tablas de Material
import { OAuthService } from 'angular-oauth2-oidc'; // Servicio de autenticación OAuth
import { ParseJsonPipe } from '../../parse-json.pipe'; // Pipe personalizado para parsear JSON
import { ApiService } from '../../service/api.service';
import { InfoClienteComponent } from '../modales/info-cliente/info-cliente.component'; // Modal para mostrar información del cliente

// Agrupación de módulos de Material para facilitar la importación
const MATERIAL_MODULES = [
  MatInputModule,
  MatPaginatorModule,
  MatSortModule,
  MatTableModule,
  MatFormFieldModule,
  MatDialogModule,
  MatButtonModule,
  MatProgressSpinnerModule,
];

interface Transaccion {
  cveMovimiento: string;
  monto: number;
  descTipoMov: string;
  fecha: string;
  esAnomalo?: boolean; // Propiedad para detectar anomalías
}

@Component({
  selector: 'app-transacciones',
  standalone: true,
  imports: [MATERIAL_MODULES, CommonModule],
  templateUrl: './transacciones.component.html',
  styleUrl: './transacciones.component.scss',
})
export class TransaccionesComponent implements OnInit, AfterViewInit {
  transacciones: any[] = []; // Almacena las transacciones
  montosAnomalos: number[] = []; // Array para almacenar montos anómalos
  jsonCompleto: any; // Guarda el JSON completo recibido
  cargando: boolean = false;

  displayedColumnsTransacciones: string[] = [
    'cveMovimiento',
    'monto',
    'descTipoMov',
    'fecha',
  ];

  dataSourceTransacciones = new MatTableDataSource<Transaccion>([]);

  // Referencias a los componentes de paginación y ordenación
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Inyección de dependencias en el constructor
  constructor(
    private clienteService: ApiService,
    private dialog: MatDialog,
    private oauthService: OAuthService,
    private httpClient: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  // Método del ciclo de vida de Angular, se ejecuta al iniciar el componente
  ngOnInit() {
    this.getTransacciones();
  }

  // Método que se ejecuta después de que la vista se ha inicializado
  ngAfterViewInit() {
    this.dataSourceTransacciones.paginator = this.paginator;
    this.dataSourceTransacciones.sort = this.sort;
  }

  // Almacena transacciones con monto mayor a 300,000
  transaccionesAltas: Transaccion[] = [];

  // Método para obtener las transacciones
  getTransacciones() {
    this.cargando = true;
    this.clienteService.getTransacciones().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.transacciones = data;
          console.log('Transacciones obtenidas:', this.transacciones);

          this.transaccionesAltas = this.transacciones.filter(
            (t) => t.monto > 300000
          );
          console.log(
            'Transacciones mayores a 300,000:',
            this.transaccionesAltas
          );

          this.dataSourceTransacciones.data = this.transacciones;

          // Mostrar el snackbar si hay transacciones altas
          this.mostrarNotificacion();
        } else {
          console.error('La respuesta de la API no es un array válido:', data);
        }
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al obtener transacciones:', error);
        this.cargando = false;
      },
    });
  }

  // Verificar que el monto no sobrepase el limite establecido
  esMontoAlto(monto: number): boolean {
    return monto > 300000;
  }

  mostrarNotificacion() {
    if (this.transaccionesAltas.length > 0) {
      this.snackBar.open(
        `Se han detectado ${this.transaccionesAltas.length} transacciones inusuales`,
        'Cerrar',
        {
          duration: 5000, // Duración en milisegundos
          horizontalPosition: 'center', // Posición horizontal
          verticalPosition: 'top', // Posición vertical
          panelClass: ['snackbar-alerta'], // Clase CSS personalizada
        }
      );
    }
  }

  // Filtra los resultados en la tabla según el tipo de cliente
  applyFilter(event: Event, tipo: string) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (tipo === 'transacciones') {
      this.dataSourceTransacciones.filter = filterValue.trim().toLowerCase();
      if (this.dataSourceTransacciones.paginator) {
        this.dataSourceTransacciones.paginator.firstPage();
      }
    }
  }
}
