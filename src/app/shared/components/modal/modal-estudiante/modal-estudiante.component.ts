import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { DocumentoService } from '../../../../core/services/admin/documento.service';
import { SoloNumerosDirective } from '../../../directives/solo-numeros.directive';
import { ApoderadoService } from '../../../../core/services/admin/apoderado.service';
import { SeccionService } from '../../../../core/services/admin/seccion.service';
import { CommonModule } from '@angular/common';
import { EstudianteService } from '../../../../core/services/admin/estudiante.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-estudiante',
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
    MatProgressBarModule
  ],
  templateUrl: './modal-estudiante.component.html',
  styleUrl: './modal-estudiante.component.css'
})
export class ModalEstudianteComponent {
  tipoDocumento: any[] = []
  apoderado: any[] = []
  seccion: any[] = []
  estudiante: any
  estudianteId: any
  loading = false

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModalEstudianteComponent>,
    private tipoDocumentService: DocumentoService,
    private apoderadoService: ApoderadoService,
    private seccionService: SeccionService,
    private estudianteService: EstudianteService
  ) {}

  ngOnInit() {
    if (this.data.isEdit) {
      this.estudiante = this.data.estudiante;
      this.estudianteId = this.data.estudiante.estudiante_id
    } else {
      this.estudiante = {
        nombre: '',
        apellido: '',
        direccion: '',
        numero_documento: '',
        documento: {
          documento_id: ''
        },
        seccion: {
          seccion_id: ''
        },
        apoderado: {
          apoderado_id: ''
        }
      }
    }
    this.tipoDocumentService.listarTiposDocumento().subscribe(
      (data: any) => {
        this.tipoDocumento = data
      },
      (error) => {
        console.log(error)
      },
    )
    this.apoderadoService.listarApoderados().subscribe(
      (data: any) => {
        this.apoderado = data
      },
      (error) => {
        console.log(error)
      }
    )
    this.seccionService.listarSecciones().subscribe(
      (data: any) => {
        this.seccion = data
      },
      (error) => {
        console.log(error)
      }
    )
  }

  guardarInformacion() {
    this.loading = true
    const dataEstudiante = {
      nombre : this.estudiante.nombre,
      apellido : this.estudiante.apellido,
      direccion : this.estudiante.direccion,
      numero_documento : this.estudiante.numero_documento,
      documento_id : this.estudiante.documento.documento_id,
      seccion_id : this.estudiante.seccion.seccion_id,
      apoderado_id : this.estudiante.apoderado.apoderado_id
    }

    if(this.data.isCreate) {
      this.estudianteService.agregarEstudiante(dataEstudiante).subscribe(
        (data) => {
          this.loading = false
          Swal.fire('Estudiante guardado', 'El estudiante ha sido guardado con éxito', 'success').then(
            (e)=> {
              this.closeModel()
            }
          );
        },
        (error) => {
          console.log(error)
        }
      )
    }

    if(this.data.isEdit) {
      this.estudianteService.modificarEstudiante(this.estudianteId, dataEstudiante).subscribe(
        (data) => {
          this.loading = false
          Swal.fire('Estudiante modificado', 'El estudiante ha sido modificado con éxito', 'success').then(
            (e)=> {
              this.closeModel()
            }
          );
        },
        (error) => {
          console.log(error)
        }
      )
    }
  }

  closeModel() {
    this.dialogRef.close()
  }
  
}