import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SolicitudService } from '../../core/services/solicitud.service';
import { GradoService } from '../../core/services/grado.service';
import Swal from 'sweetalert2';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-solicitud',
  standalone: true,
  imports: [
    MatInputModule, 
    FormsModule, 
    MatCheckbox,
    MatSelectModule,
  CommonModule,
  ],
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.css']
})
export class SolicitudComponent {
  SolicitudList: any[] = [];
  solicitud: any;
  solicitudId: any;
  loading = false;
  aceptarTerminos = false; // Términos de aceptación
  grados: any[] = []; // Lista de grados

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
    this.gradoService.listarGrados().subscribe(
      (data: any) => {
        this.grados = data       
      },
      (error) => {
        console.log(error)
      },
    )
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
      grado_ID: this.solicitud.grado._id,
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