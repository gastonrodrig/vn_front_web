import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { adminGuard } from './core/guards/admin.guard';
import { docenteGuard } from './core/guards/docente.guard';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'admin',
        canActivate: [adminGuard],
        loadChildren: () => import ('./admin/admin.routes').then(m =>m.ADMIN_ROUTES)
    },
    {
        path:'docente',
        canActivate:[docenteGuard],
        loadChildren:() => import ('./docente/docente.routes').then(m =>m.DOCENTE_ROUTES)
    }
];
