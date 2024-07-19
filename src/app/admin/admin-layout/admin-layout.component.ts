import { Component } from '@angular/core';
import { SideBarComponent } from '../../shared/components/side-bar/side-bar.component';
import { MainContentComponent } from '../main-content/main-content.component';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';
import { listaModulos } from '../../shared/constants/itemsSidebarAdmin';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [SideBarComponent, MainContentComponent, CommonModule, NavBarComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
  listaModulos: any
  modulo = []
  sidebarMostrado: boolean = false

  ngOnInit() {
    this.listaModulos = listaModulos
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
