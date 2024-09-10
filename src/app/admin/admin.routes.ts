import { Routes } from '@angular/router';
import { GestionarEstudiantesComponent } from './pages/gestionar-estudiantes/gestionar-estudiantes.component';
import { GestionarDocentesComponent } from './pages/gestionar-docentes/gestionar-docentes.component';
import { GestionarSeccionesComponent } from './pages/gestionar-secciones/gestionar-secciones.component';
import { GestionarCursosComponent } from './pages/gestionar-cursos/gestionar-cursos.component';
import { GestionarHorariosComponent } from './pages/gestionar-horarios/gestionar-horarios.component';
import { GestionarMatriculaComponent } from './pages/gestionar-matricula/gestionar-matricula.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminInicioComponent } from './pages/admin-inicio/admin-inicio.component';
import { AsignarSeccionComponent } from './pages/asignar-seccion/asignar-seccion.component';
import { GestionarUsuariosComponent } from './pages/gestionar-usuarios/gestionar-usuarios.component';
import { GestionarSolicitudComponent } from './pages/gestionar-solicitud/gestionar-solicitud.component';
import { GestionarPerfilEstudianteComponent } from './pages/gestionar-perfil-estudiante/gestionar-perfil-estudiante.component';
import { GestionarDocumentosComponent } from './pages/gestionar-documentos/gestionar-documentos.component';
import { GestionarPerfilDocenteComponent } from './pages/gestionar-perfil-docente/gestionar-perfil-docente.component';
import { GestionarCuposComponent } from './pages/gestionar-cupos/gestionar-cupos.component';
import { GestionarPeriodosComponent } from './pages/gestionar-periodos/gestionar-periodos.component';

export const ADMIN_ROUTES: Routes = [
  { 
    path: '', 
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        component: AdminInicioComponent
      },
      {
        path: 'gestionar-estudiantes',
        component: GestionarEstudiantesComponent
      },
      {
        path: 'gestionar-perfil-estudiante/:id',
        component: GestionarPerfilEstudianteComponent
      },
      {
        path: 'gestionar-documentos/:id',
        component: GestionarDocumentosComponent
      },
      {
        path: 'gestionar-docentes',
        component: GestionarDocentesComponent
      },
      {
        path: 'gestionar-perfil-docente/:id',
        component: GestionarPerfilDocenteComponent
      },
      {
        path: 'gestionar-secciones',
        component: GestionarSeccionesComponent
      },
      {
        path: 'gestionar-secciones/:id',
        component: AsignarSeccionComponent
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
        path: 'gestionar-usuarios',
        component: GestionarUsuariosComponent
      },
      {
        path: 'gestionar-solicitud',
        component: GestionarSolicitudComponent
      },
      {
        path: 'gestionar-cupos',
        component: GestionarCuposComponent
      },
      {
        path: 'gestionar-periodos',
        component: GestionarPeriodosComponent
      }
    ]
  },
]