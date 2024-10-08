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
    const usuario = this.authService.getUser()
    const rolesNoPermitidos = ['Estudiante', 'Tutor']
    const rutasPorRol: { [clave: string]: string } = {
      'Admin': '/admin',
      'Temporal': '/temporal'
    }

    if (rolesNoPermitidos.includes(usuario.rol)) {
      this.snack.open(`No está permitido ingresar con el rol ${usuario.rol}`, 'Cerrar', {
        duration: 3000
      })
    } else {
      const ruta = rutasPorRol[usuario.rol]
      this.router.navigate([ruta])
    }
  }
}
