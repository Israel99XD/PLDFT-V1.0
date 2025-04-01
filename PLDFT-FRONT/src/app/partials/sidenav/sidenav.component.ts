import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatAccordion } from '@angular/material/expansion';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { ApiService } from '../../service/api.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';


const ANGULAR_MODULES = [
  MatAccordion,
  MatExpansionModule,
  MatIcon,
  MatButtonModule,
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatDividerModule,
  MatIconModule,
  MatListModule,
  MatMenuModule,
]

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [ANGULAR_MODULES],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {

  totalClientesFisicos: number = 0;
  totalClientesMorales: number = 0;

  constructor(private router: Router, private apiService: ApiService) { }

  navegar(tipo: string) {
    if (tipo === '1') {
      this.router.navigate(['/persona-fisica']);
    } if (tipo === '2') {
      this.router.navigate(['/persona-moral']);
    } if (tipo === '3') {
      this.router.navigate(['/movimientos']);
    } if (tipo === '4') {
      this.router.navigate(['/transacciones']);
    } if (tipo === '5') {
      this.router.navigate(['/perfil-transaccional']);
    } if (tipo === '6') {
      this.router.navigate(['/sanction-list']);
    }if (tipo === '7') {
      this.router.navigate(['/map']);
    }
  }

  ngOnInit(): void {
    this.contarClientesFisicos();
    this.contarClientesMorales();
  }

  contarClientesFisicos() {
    const codigo = '0';
    const perfil = '268';

    this.apiService.getClienteData(codigo, perfil).subscribe({
      next: (data) => {
        if (data[0] && typeof data[0].personaFisica === 'string') {
          const personaFisicaArray = JSON.parse(data[0].personaFisica);
          this.totalClientesFisicos = personaFisicaArray.length;
        } else {
          console.error(
            'El campo personaFisica no es un string válido o no existe.'
          );
        }
      },
      error: (error) => {
        console.error('Error al contar clientes físicos:', error);
      },
    });
  }

  contarClientesMorales() {
    const codigo = '0';
    const perfil = '269';

    this.apiService.getClientesM(codigo, perfil).subscribe({
      next: (data) => {
        if (data[0] && typeof data[0].personaMoral === 'string') {
          const personaMoralArray = JSON.parse(data[0].personaMoral);
          this.totalClientesMorales = personaMoralArray.length;
        } else {
          console.error(
            'El campo personaMoral no es un string válido o no existe.'
          );
        }
      },
      error: (error) => {
        console.error('Error al contar clientes morales:', error);
      },
    });
  }
}