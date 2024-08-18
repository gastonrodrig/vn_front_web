import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
  open = true
  selectedModule: any
  searchTerm = ''
  @Input() listaModulos : any
  @Input() sidebarMostrado: any
  @Input() bgColor: string = ''
  @Input() paddingXOpen: string = ''
  @Input() paddingXClosed: string = ''
  @Input() searchBgColorInput: string = ''
  @Input() searchBgColorIcon: string = ''
  @Input() moduleBgColorHover: string = ''
  @Input() moduleTextColor: string = ''
  @Input() baseRoute: string = '';

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

  changeSideBarState() {
    return { [this.paddingXOpen]: this.open, [this.paddingXClosed]: !this.open }
  }

  changeColorTexts(modulo: any) {
    return { [this.moduleTextColor]: modulo.id === this.selectedModule }
  }

  getFullRoute(route: string): string {
    return `/${this.baseRoute}/${route}`;
  }
}
