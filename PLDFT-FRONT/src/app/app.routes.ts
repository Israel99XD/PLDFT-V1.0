import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { PersonaFisicaComponent } from './components/persona-fisica/persona-fisica.component';
import { PersonaMoralComponent } from './components/persona-moral/persona-moral.component';
import { MovimientosComponent } from './components/movimientos/movimientos.component';
import { TransaccionesComponent } from './components/transacciones/transacciones.component';
import { PerfilTComponent } from './components/perfil-t/perfil-t.component';
import { PerfilTMComponent } from './components/perfil-t-m/perfil-t-m.component';
import { SanctionListComponent } from './components/sanction-list/sanction-list.component';


export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' }, // Ruta por defecto
    { path: 'persona-fisica', component: PersonaFisicaComponent, title: 'PerF', canActivate: [AuthGuard] },
    { path: 'persona-moral', component: PersonaMoralComponent, title: 'PerM', canActivate: [AuthGuard] },
    { path: 'movimientos', component: MovimientosComponent, title: 'Movimientos', canActivate: [AuthGuard] },
    { path: 'transacciones', component: TransaccionesComponent, title: 'Transacciones', canActivate: [AuthGuard] },
    { path: 'perfil-transaccional', component: PerfilTComponent, title: 'Perfil-transaccional', canActivate: [AuthGuard] },
    { path: 'perfil-transaccional-m', component: PerfilTMComponent, title: 'Perfil-transaccional-m', canActivate: [AuthGuard] },
    { path: 'sanction-list', component: SanctionListComponent, title: 'sanction-list', canActivate: [AuthGuard] },

];
