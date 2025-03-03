import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { PersonaFisicaComponent } from './components/persona-fisica/persona-fisica.component';
import { PersonaMoralComponent } from './components/persona-moral/persona-moral.component';
import { MovimientosComponent } from './components/movimientos/movimientos.component';
import { TransaccionesComponent } from './components/transacciones/transacciones.component';

export const routes: Routes = [
    { path: '', redirectTo: '/', pathMatch: 'full' }, // Ruta por defecto
    { path: 'persona-fisica', component: PersonaFisicaComponent, title: 'PerF', canActivate: [AuthGuard] },
    { path: 'persona-moral', component: PersonaMoralComponent, title: 'PerM', canActivate: [AuthGuard] },
    { path: 'movimientos', component: MovimientosComponent, title: 'Movimientos', canActivate: [AuthGuard] },
    { path: 'transacciones', component: TransaccionesComponent, title: 'Transacciones', canActivate: [AuthGuard] },
];
