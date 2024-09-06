import { Routes } from "@angular/router";
import { DocenteLayoutComponent } from "./docente-layout/docente-layout.component";
import { DocenteInicioComponent } from "./pages/docente-inicio/docente-inicio.component";
import { GestionarCalificacionesComponent } from "./pages/gestionar-calificaciones/gestionar-calificaciones.component";
import { GestionarCalendarioComponent } from "./pages/gestionar-calendario/gestionar-calendario.component";
import { GestionarZonaAcademicaComponent } from "./pages/gestionar-zona-academica/gestionar-zona-academica.component";
import { DocenteGestionarPerfilComponent } from "./pages/docente-gestionar-perfil/docente-gestionar-perfil.component";

export const DOCENTE_ROUTES: Routes = [
  { 
    path: '', 
    component: DocenteLayoutComponent,
    children: [
      {
        path: '',
        component: DocenteInicioComponent
      },
      {
        path: 'gestionar-calificaciones',
        component: GestionarCalificacionesComponent
      },
      {
        path: 'gestionar-calendario',
        component: GestionarCalendarioComponent
      },
      {
        path: 'gestionar-zona-academica',
        component: GestionarZonaAcademicaComponent
      },
      {
        path: 'gestionar-perfil',
        component: DocenteGestionarPerfilComponent
      }
    ]
  },
]