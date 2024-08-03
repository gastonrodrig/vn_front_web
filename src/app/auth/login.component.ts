import { Component } from '@angular/core';
import { InputComponent } from '../shared/components/UI/input/input.component';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputComponent, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email_usuario: string = '';
  contrasena_usuario: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  login() {
    this.loading = true;
    this.authService.login(this.email_usuario, this.contrasena_usuario).subscribe(
      response => {
        console.log('Login successful, response:', response);
        this.loading = false;
        this.navigateToRole();
      },
      error => {
        console.error('Login error:', error);
        this.loading = false;
        Swal.fire('Error', 'Credenciales incorrectas', 'error');
      }
    );
  }

  navigateToRole() {
    const user = this.authService.getUser();
    if (user) {
      const roleRoutes: { [key: string]: string } = {
        'admin': '/admin',
        'docente': '/docente'
      };
      const route = roleRoutes[user.rol] || '';
      this.router.navigate([route]);
    } else {
      this.router.navigate(['']);
    }
  }
}
