import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-solicitud',
  standalone: true,
  imports: [MatInputModule, FormsModule, MatCheckbox],
  templateUrl: './solicitud.component.html',
  styleUrl: './solicitud.component.css'
})
export class SolicitudComponent {
  solicitudData = {
    nombre_hijo: '',
    apellido_hijo: '',
    dni_hijo: '',
    telefono_padre: '',
    correo_padre: '',
    grado_ID: ''
  };

  aceptarTerminos: boolean = false; // Agrega esta línea

  todayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Devuelve la fecha en formato YYYY-MM-DD
  }

  onSubmit(form: any) {
    if (form.valid && this.aceptarTerminos) {
      console.log('Formulario enviado:', this.solicitudData);
      // Aquí puedes manejar la lógica para enviar el formulario
    } else {
      console.log('El formulario no es válido o no se han aceptado los términos.');
      this.showErrors(form);
    }
  }

  showErrors(form: any) {
    const controls = form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        console.error(`Error en el campo ${name}:`, controls[name].errors);
      }
    }
  }
}


