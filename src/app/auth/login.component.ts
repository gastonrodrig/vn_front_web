import { Component } from '@angular/core';
import { InputComponent } from '../shared/components/UI/input/input.component';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputComponent, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  identificador: string = '';
  contrasena: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private snack: MatSnackBar
  ) {}

  login() {
    this.loading = true;
    this.authService.login(this.identificador, this.contrasena).subscribe(
      (response) => {
        this.loading = false;
        this.navigateToRole();
      },
      (error) => {
        this.loading = false;
        this.snack.open('Credenciales Incorrectas', 'Cerrar', {
          duration: 3000 
        })
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
