import { Routes } from "@angular/router";
import { DocenteLayoutComponent } from "./docente-layout/docente-layout.component";
import { InicioComponent } from "./pages/inicio/inicio.component";

export const DOCENTE_ROUTES: Routes = [
  { 
      path: '', 
      component: DocenteLayoutComponent,
      children: [
          {
              path: '',
              component: InicioComponent
          },
      ]
  },
]