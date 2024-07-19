import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MainContentComponent } from '../../../admin/main-content/main-content.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, MainContentComponent, FormsModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
  open = true
  selectedModule: any
  searchTerm = ''
  @Input() listaModulos : any
  @Input() sidebarMostrado: any

  toggleOpen() {
    this.open = !this.open
  }

  inputText() {
    if(this.searchTerm !== '')
    return true
    else return false
  }

  clearSelection() {
    this.selectedModule = null
  }

  toggleClick(modulo: any) {
    this.selectedModule = modulo.id
    this.searchTerm = ''
  }

  displayedModules() {
    return this.listaModulos.filter((modulo: any) =>
      modulo.titulo.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
