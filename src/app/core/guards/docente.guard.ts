import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class docenteGuard implements CanActivate {
  
  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  canActivate() {
    if (this.authService.isTokenExpired()) {
      this.authService.logout()
      this.router.navigate(['/login'])
      return false
    }

    const user = this.authService.getUser()
    if (user && user.rol === 'Docente') {
      return true
    } else {
      this.router.navigate([''])
      return false
    }
  }
}