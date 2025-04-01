// Importaciones necesarias desde Angular y Angular Material
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button'; // Botón de Angular Material
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog'; // Módulo y referencia para manejar diálogos
import { MAT_DIALOG_DATA } from '@angular/material/dialog'; // Token para inyectar datos en el diálogo
import { Inject } from '@angular/core'; // Decorador para la inyección de dependencias
import { Router } from '@angular/router'; // Servicio para la navegación entre rutas
import { CommonModule } from '@angular/common'; // Módulo con funciones comunes de Angular

// Decorador que define el componente
@Component({
  selector: 'app-info-cliente', // Selector del componente
  standalone: true, // Define que este componente puede usarse sin un módulo externo
  imports: [CommonModule, MatDialogModule, MatButtonModule], // Importación de módulos necesarios
  templateUrl: './info-cliente.component.html', // Archivo de la plantilla HTML
  styleUrls: ['./info-cliente.component.scss'] // Archivo de estilos CSS
})
export class InfoClienteComponent {
  // Constructor con inyección de dependencias
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, // Recibe los datos inyectados en el diálogo
    private router: Router, // Servicio de navegación
    private dialogRef: MatDialogRef<InfoClienteComponent> // Referencia al diálogo para controlarlo
  ) {}

  // Método para cerrar el diálogo con un resultado booleano
  close(result: boolean) {
    this.dialogRef.close(result);
  }

  // Método para navegar a la página de perfil transaccional
  verPerfilTransaccional(): void {
    this.dialogRef.close(); // Cierra el diálogo actual
    sessionStorage.setItem('clienteData', JSON.stringify(this.data)); // Guarda los datos del cliente en sessionStorage
    this.router.navigate(['/perfil-transaccional']); // Redirige a la página de perfil transaccional
  }
}
