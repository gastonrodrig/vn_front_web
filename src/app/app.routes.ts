import { Routes } from '@angular/router';
import { loggedGuard } from './core/guards/logged.guard';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
    {
        path: '',
        component: LoginComponent
    },
    {
        path: 'admin',
        loadChildren: () => import ('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
    },
    // {
    //     path: 'gestionar-alumnos',
    //     component: GestionarAlumnosComponent
    // },
    // {
    //     path: '',
    //     // loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES),
    //     canActivate: [loggedGuard]
    // },
    // {
    //     path: '',
    //     // loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES),
    //     canActivate: [loggedGuard]
    // }
];
