import { Routes } from "@angular/router";
import { TemporalLayoutComponent } from "./temporal-layout/temporal-layout.component";
import { GestionarDocumentosTemporalComponent } from "./pages/gestionar-documentos-temporal/gestionar-documentos-temporal.component";
import { PagarMatriculaComponent } from "./pages/pagar-matricula/pagar-matricula.component";

export const TEMPORAL_ROUTES: Routes = [
  { 
    path: '', 
    component: TemporalLayoutComponent,
    children: [
      {
        path: '',
        component: GestionarDocumentosTemporalComponent
      },
      {
        path: 'pago-matricula',
        component: PagarMatriculaComponent
      },
    ]
  },
]