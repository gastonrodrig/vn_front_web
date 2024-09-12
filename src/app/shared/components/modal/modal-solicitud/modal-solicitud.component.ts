import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SoloNumerosDirective } from '../../../directives/solo-numeros.directive';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SolicitudService } from '../../../../core/services/solicitud.service';
import Swal from 'sweetalert2';
import { GradoService } from '../../../../core/services/grado.service';



@Component({
  selector: 'app-modal-solicitud',
  standalone: true,
  imports: [
    MatDialogModule, 
    SoloNumerosDirective, 
    MatFormFieldModule, 
    MatInputModule, 
    FormsModule, 
    MatSelectModule, 
    MatButtonModule, 
    CommonModule, 
    MatProgressBarModule,
    MatIconModule
  ],
  templateUrl: './modal-solicitud.component.html',
  styleUrl: './modal-solicitud.component.css'
})
export class ModalSolicitudComponent {
  solicitud: any;
  solicitudId: any;
  loading = false;
  grado: any[] = []; 

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModalSolicitudComponent>,
    private snack: MatSnackBar,
    private solicitudService: SolicitudService,
    private gradoService: GradoService
  ) 
  {
    dialogRef.disableClose = true

  }

  ngOnInit() {
    if (this.data.isEdit) {
      this.solicitud = this.data.solicitud;
      this.solicitudId = this.data.solicitud.id;
    } else {
      this.solicitud = {
        nombre_hijo: '',
        apellido_hijo: '',
        dni_hijo: '',
        telefono_padre: '',
        correo_padre: '',
        grado: {
          _id: ''
        },
        estado: '',
        fecha_solicitud: new Date()
      };
    }
    
  }
  closeModal() {
    this.dialogRef.close();
  }
}

