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
  @Output() sidebar = new EventEmitter<Boolean>()

  user: any

  dropdownVisible = false;
  constructor(private authService: AuthService, private router: Router) {}

  mostrarSideBar() {
    this.sidebar.emit(true)
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible
  }

  logout() {
    this.authService.logout()
    this.router.navigate(['/login'])
  }

  ngOnInit() {
    this.user = this.authService.getUser()
  }

  nombreUsuario() {
    switch (this.user.rol) {
      case 'Admin':
        return 'Gabriel Ventura'
      case 'Docente':
        return this.user.docente ? `${this.user.docente.nombre}, ${this.user.docente.apellido}` : 'Nombre desconocido'
      case 'Temporal':
        return 'Usuario Temporal'
      default:
        return ''
    }
  }

}
