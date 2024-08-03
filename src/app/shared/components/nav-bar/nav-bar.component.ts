import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

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
  constructor(private authService: AuthService, private router: Router) {}

  mostrarSideBar() {
    this.sidebar.emit(true)
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['']);
}
}
