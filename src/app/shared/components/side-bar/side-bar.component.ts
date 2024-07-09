import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { listaModulos } from '../../constants/itemsSidebarAdmin';
import { RouterModule } from '@angular/router';
import { MainContentComponent } from '../../../admin/main-content/main-content.component';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, MainContentComponent],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {

  open = true;
  listaModulos = listaModulos;
  selectedModule: any;

  @Output() modulo = new EventEmitter<Object>();

  toggleOpen() {
    this.open = !this.open;
  }

  clearSelection() {
    this.selectedModule = null
  }

  toggleClick(modulo: any) {
    this.selectedModule = modulo.id
    this.modulo.emit(modulo)
  }
}
