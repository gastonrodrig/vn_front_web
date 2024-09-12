import { Component, Inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { ModalSolicitudComponent } from '../shared/components/modal/modal-solicitud/modal-solicitud.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SolicitudService } from '../core/services/solicitud.service';
import { GradoService } from '../core/services/grado.service';
import Swal from 'sweetalert2';

interface Solicitud {
  nombre_hijo: string;
  apellido_hijo: string;
  dni_hijo: string;
  telefono_padre: string;
  correo_padre: string;
  grado: {
    _id: string;
  };
  estado: string;
  fecha_solicitud: Date;
}


@Component({
  selector: 'app-solicitud',
  standalone: true,
  imports: [MatInputModule, FormsModule, MatCheckbox],
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.css']
})
export class SolicitudComponent {
  SolicitudList: any[] = [];
  solicitud: any;
  solicitudId: any;
  loading = false;
  aceptarTerminos = false; // Términos de aceptación
  grado: any[] = []; // Lista de grados

  constructor(
    private snack: MatSnackBar,
    private solicitudService: SolicitudService,
    private gradoService: GradoService
  ) {}

  ngOnInit() {
    // Inicializa la solicitud
    this.solicitud = {
      nombre_hijo: '',
      apellido_hijo: '',
      dni_hijo: '',
      telefono_padre: '',
      correo_padre: '',
      grado: { _id: '' },
      estado: 'pendiente', // El estado inicial de la solicitud es "pendiente"
      fecha_solicitud: new Date()
    };
  }

  // Método para manejar el envío del formulario
  
  guardarSolicitud() {
    this.loading = true;
    const dataSolicitud = {
      nombre_hijo: this.solicitud.nombre_hijo,
      apellido_hijo: this.solicitud.apellido_hijo,
      dni_hijo: this.solicitud.dni_hijo,
      telefono_padre: this.solicitud.telefono_padre,
      correo_padre: this.solicitud.correo_padre,
      estado: this.solicitud.estado,
      fecha_solicitud: this.solicitud.fecha_solicitud,
      grado_id: this.solicitud.grado._id,
    };

    this.solicitudService.agregarSolicitud(dataSolicitud).subscribe(
      (data) => {
        Swal.fire('Solicitud guardada', 'La solicitud ha sido enviada con éxito', 'success');
        this.loading = false;
        this.limpiarFormulario();
      },
      (error) => {
        this.loading = false;
        Swal.fire('Error', 'Hubo un error al enviar la solicitud', 'error');
        console.log(error);
      }
    );
  }
  limpiarFormulario() {
    this.solicitud = {
      nombre_hijo: '',
      apellido_hijo: '',
      dni_hijo: '',
      telefono_padre: '',
      correo_padre: '',
      estado: 'pendiente',
      fecha_solicitud: new Date()
    };
    this.aceptarTerminos = false;
  }
  todayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  
  onSubmit(form: any) {
    if (form.valid && this.aceptarTerminos) {
      this.guardarSolicitud();
    }

  }
  saveToLocalStorage() {
    localStorage.setItem('docentes', JSON.stringify(this.SolicitudList))
  }
}