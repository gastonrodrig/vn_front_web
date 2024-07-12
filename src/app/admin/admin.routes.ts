import { Routes } from '@angular/router';
import { GestionarEstudiantesComponent } from './pages/gestionar-estudiantes/gestionar-estudiantes.component';
import { GestionarApoderadosComponent } from './pages/gestionar-apoderados/gestionar-apoderados.component';
import { GestionarDocentesComponent } from './pages/gestionar-docentes/gestionar-docentes.component';
import { GestionarSeccionesComponent } from './pages/gestionar-secciones/gestionar-secciones.component';
import { GestionarCursosComponent } from './pages/gestionar-cursos/gestionar-cursos.component';
import { GestionarHorariosComponent } from './pages/gestionar-horarios/gestionar-horarios.component';
import { GestionarMatriculaComponent } from './pages/gestionar-matricula/gestionar-matricula.component';
import { GestionarGradoComponent } from './pages/gestionar-grado/gestionar-grado.component';
import { GestionarSalonesComponent } from './pages/gestionar-salones/gestionar-salones.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';

export const ADMIN_ROUTES: Routes = [
    { 
        path: '', 
        component: AdminLayoutComponent,
        children: [
            {
                path: 'gestionar-apoderados',
                component: GestionarApoderadosComponent
            },
            {
                path: 'gestionar-estudiantes',
                component: GestionarEstudiantesComponent
            },
            {
                path: 'gestionar-docentes',
                component: GestionarDocentesComponent
            },
            {
                path: 'gestionar-secciones',
                component: GestionarSeccionesComponent
            },
            {
                path: 'gestionar-cursos',
                component: GestionarCursosComponent
            },
            {
                path: 'gestionar-horarios',
                component: GestionarHorariosComponent
            },
            {
                path: 'gestionar-matricula',
                component: GestionarMatriculaComponent
            },
            {
                path: 'gestionar-grado',
                component: GestionarGradoComponent
            },
            {
                path: 'gestionar-salones',
                component: GestionarSalonesComponent
            },
        ]
    },
]