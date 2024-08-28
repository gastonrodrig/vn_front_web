import { Component, Inject } from '@angular/core';
import { GradoService } from '../../../../core/services/grado.service';
import { PeriodoService } from '../../../../core/services/periodo.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeccionService } from '../../../../core/services/seccion.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { SeccionGradoPeriodoService } from '../../../../core/services/seccion-grado-periodo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-seccion',
  standalone: true,
  imports: [
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    FormsModule, 
    MatSelectModule, 
    MatButtonModule, 
    CommonModule, 
    MatProgressBarModule,
    MatIconModule
  ],
  templateUrl: './modal-seccion.component.html',
  styleUrl: './modal-seccion.component.css'
})
export class ModalSeccionComponent {
  grados: any[] = []
  periodos: any[] = []
  seccion: any
  seccionGradoPeriodo: any
  seccionId: any
  seccionCreated = false
  loading = false

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModalSeccionComponent>,
    private snack: MatSnackBar,
    private gradoService: GradoService,
    private periodoService: PeriodoService,
    private seccionService: SeccionService,
    private sgpService: SeccionGradoPeriodoService
  ) {
    dialogRef.disableClose = true
  }

  ngOnInit() {
    if (this.data.isEdit) {
      console.log(this.data)
      this.seccionGradoPeriodo = this.data
      this.seccion = this.data.seccion
      this.seccionId = this.data.seccion._id
    } else {
      this.seccion = {
        aula: '',
        nombre: ''
      }
      this.seccionGradoPeriodo = {
        seccion: {
          _id: '',
        },
        grado: {
          _id: ''
        },
        periodo: {
          _id: ''
        }
      }
    }
    this.gradoService.listarGrados().subscribe(
      (data: any) => {
        this.grados = data
      },
      (error) => {
        console.log(error)
      }
    )
    this.periodoService.listarPeriodos().subscribe(
      (data: any) => {
        this.periodos = data
      },
      (error) => {
        console.log(error)
      }
    )
  }

  crearSeccion() {
    this.loading = true
    const dataSeccion = {
      nombre: this.seccion.nombre,
      aula: this.seccion.aula
    }

    if(dataSeccion.nombre === '') {
      this.snack.open('El nombre de la seccion es requerida', '',{
        duration: 3000
      })
      this.loading = false
      return
    }

    this.seccionService.agregarSeccion(dataSeccion).subscribe(
      (data: any) => {
        this.loading = false
        this.seccionCreated = true
        this.seccionGradoPeriodo.seccion._id = data._id
      },
      (error) => {
        console.log(error)
      }
    )
  }

  guardarInformacion() {
    this.loading = true

    if(this.data.isCreate) {
      const dataSGP = {
        seccion_id: this.seccionGradoPeriodo.seccion._id,
        grado_id : this.seccionGradoPeriodo.grado._id,
        periodo_id : this.seccionGradoPeriodo.periodo._id
      }
  
      // VALIDACIONES

      this.sgpService.agregarSeccionGradoPeriodo(dataSGP).subscribe(
        (data) => {
          Swal.fire('Seccion guardada', 'La sección ha sido guardado con éxito', 'success').then(
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
      const data = {
        nombre: this.seccionGradoPeriodo.seccion.nombre,
        aula: this.seccionGradoPeriodo.seccion.aula
      }
  
      // VALIDACIONES

      this.seccionService.modificarSeccion(this.seccionId, data).subscribe(
        (data: any) => {
          this.loading = false
          Swal.fire('Seccion modificada', 'La seccion ha sido modificado con éxito', 'success').then(
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
