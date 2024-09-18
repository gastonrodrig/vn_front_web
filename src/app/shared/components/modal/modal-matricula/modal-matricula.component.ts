import { CommonModule, formatDate } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { SoloNumerosDirective } from '../../../directives/solo-numeros.directive';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatriculaService } from '../../../../core/services/matricula.service';
import { listaMetodosPago } from '../../../constants/itemsPayment';
import { EstudianteService } from '../../../../core/services/estudiante.service';
import { PeriodoService } from '../../../../core/services/periodo.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-matricula',
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
    MatIconModule,
    MatDatepickerModule
  ],
  templateUrl: './modal-matricula.component.html',
  styleUrl: './modal-matricula.component.css'
})
export class ModalMatriculaComponent {
  periodos: any[] = []
  listaMetodosPago: any
  matricula: any
  loading = false

  dni: any
  fecha: any
  tiempo: any

  nombreEstudiante: any
  estudianteId: any

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModalMatriculaComponent>,
    private snack: MatSnackBar,
    private estudianteService: EstudianteService,
    private periodoService: PeriodoService,
    private matriculaService: MatriculaService
  ) {}

  ngOnInit() {
    this.listaMetodosPago = listaMetodosPago
    this.matricula = {
      monto: '',
      metodo_pago: '',
      n_operacion: '',
      periodo_id: '',
      estudiante_id: '',
      tipo: '',
      fecha: ''
    }
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
    const matriculaData = {
      monto: Number(this.matricula.monto),
      metodo_pago: this.matricula.metodo_pago,
      n_operacion: this.matricula.n_operacion,
      periodo_id: this.matricula.periodo_id,
      estudiante_id: this.estudianteId,
      tipo: 'Presencial',
      fecha: this.formatDateTime(this.fecha, this.tiempo)
    }

    if(this.matricula.monto === '') {
      this.snack.open('El nombre del docente es requerido', '', {
        duration: 3000
      })
      this.loading = false
      return
    }

    this.matriculaService.agregarMatricula(matriculaData).subscribe(
      (data) => {
        console.log(data)
        this.loading = false
        Swal.fire('Matricula agregada', 'La matricula ha sido guardada con éxito', 'success').then(
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

  validarDNI(dni: string) {
    if (dni.length === 8) {
      this.loading = true
      this.estudianteService.obtenerEstudiantePorNroDoc(dni).subscribe(
        (data: any) => {
          this.loading = false
          this.nombreEstudiante = `${data.apellido}, ${data.nombre}`
          this.estudianteId = data._id
        }
      )
    } else {
      this.nombreEstudiante = ''
    }
  }

  formatDateTime(date: Date, time: string) {
    const [hours, minutes, seconds] = time.split(':').map(Number)
    date.setHours(hours, minutes, seconds);
    return formatDate(date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", 'en-US', '+0000');
  }

  closeModel() {
    this.dialogRef.close()
  }
}
