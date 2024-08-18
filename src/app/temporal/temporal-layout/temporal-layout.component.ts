import { Component } from '@angular/core';
import { SideBarComponent } from '../../shared/components/side-bar/side-bar.component';
import { TemporalMainContentComponent } from '../temporal-main-content/temporal-main-content.component';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';
import { listaModulosTemporal } from '../../shared/constants/itemsSidebarTemporal';

@Component({
  selector: 'app-temporal-layout',
  standalone: true,
  imports: [SideBarComponent, TemporalMainContentComponent, CommonModule, NavBarComponent],
  templateUrl: './temporal-layout.component.html',
  styleUrl: './temporal-layout.component.css'
})
export class TemporalLayoutComponent {
  listaModulos: any
  modulo = []
  sidebarMostrado: boolean = false

  ngOnInit() {
    this.listaModulos = listaModulosTemporal
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
