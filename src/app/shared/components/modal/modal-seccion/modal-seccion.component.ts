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
  seccionId: any
  loading = false

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModalSeccionComponent>,
    private snack: MatSnackBar,
    private gradoService: GradoService,
    private periodoService: PeriodoService,
    private seccionService: SeccionService
  ) {}

  ngOnInit() {
    if (this.data.isEdit) {
      this.seccion = this.data.seccion;
      this.seccionId = this.data.seccion.seccion_id
    } else {
      this.seccion = {
        nombre: '',
        aula: '',
        grado: {
          grado_id: ''
        },
        periodo: {
          periodo_id: ''
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

  guardarInformacion() {
    this.loading = true
    const dataSeccion = {
      nombre : this.seccion.nombre,
      aula : this.seccion.apellido,
      grado_id : this.seccion.grado.grado_id,
      periodo_id : this.seccion.periodo.periodo_id
    }

    if(dataSeccion.nombre === '') {
      this.snack.open('El nombre de la seccion es requerida', '', {
        duration: 3000
      })
      this.loading = false
      return
    }

    if(this.data.isCreate) {
      this.seccionService.agregarSeccion(dataSeccion).subscribe(
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
      this.seccionService.modificarSeccion(this.seccionId, dataSeccion).subscribe(
        (data) => {
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
