import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [SideBarComponent, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  @Input() sidebarShowed : any
  @Output() sidebar = new EventEmitter<Boolean>();

  dropdownVisible = false;

  mostrarSideBar() {
    this.sidebar.emit(true)
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

}
