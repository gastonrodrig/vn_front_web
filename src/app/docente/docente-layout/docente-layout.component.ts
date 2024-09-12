import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';
import { SideBarComponent } from '../../shared/components/side-bar/side-bar.component';
import { listaModulosDocente } from '../../shared/constants/itemsSidebarDocente';
import { DocenteMainContentComponent } from '../docente-main-content/docente-main-content.component';

@Component({
  selector: 'app-docente-layout',
  standalone: true,
  imports: [SideBarComponent, DocenteMainContentComponent, CommonModule, NavBarComponent],
  templateUrl: './docente-layout.component.html',
  styleUrl: './docente-layout.component.css'
})
export class DocenteLayoutComponent {
  listaModulos: any
  modulo = []
  sidebarMostrado: boolean = false

  ngOnInit() {
    this.listaModulos = listaModulosDocente
  }

  obtenerModulo(modulo: any) {
    this.modulo = modulo
  }

  mostrarSidebar(sidebar: any) {
    this.sidebarMostrado = sidebar
  }

  cerrarSidebar() {
    this.sidebarMostrado = !this.sidebarMostrado
  }
}
