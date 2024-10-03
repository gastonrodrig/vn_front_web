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
import { listaTiposMatricula } from '../../../constants/itemsRegistration';

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
  listaTiposMatricula: any
  matricula: any
  loading = false
  nOperacionDisabled = false

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
    this.nOperacionDisabled = true;  
    this.listaMetodosPago = listaMetodosPago
    this.listaTiposMatricula = listaTiposMatricula
    this.matricula = {
      monto: '',
      metodo_pago: '',
      n_operacion: '',
      periodo_id: '',
      estudiante_id: '',
      tipo: '',
      tipoMa:'',
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
    if(!this.matricula.tipoMa){
      this.snack.open('Debe seleccionar un tipo de matricula','', {
        duration: 3000
      })
      return;
    }
    if(!this.matricula.metodo_pago){
      this.snack.open('Debe seleccionar un metodo de pago','', {
        duration: 3000
      })
      return;
    }
    if(!this.matricula.periodo_id){
      this.snack.open('Debe seleccionar periodo','', {
        duration: 3000
      })
      return;
    }
    if (this.matricula.metodo_pago !== 'Efectivo' && (!this.matricula.n_operacion || this.matricula.n_operacion.trim() === '')) {
      this.snack.open('El número de operación no puede estar vacío','', {
        duration: 3000
      });
      return;
    }
    
    this.loading = true
    const matriculaData = {
      monto: Number(this.matricula.monto),
      metodo_pago: this.matricula.metodo_pago,
      n_operacion: this.matricula.n_operacion,
      periodo_id: this.matricula.periodo_id,
      estudiante_id: this.estudianteId,
      tipo: 'Presencial',
      tipoMa: this.matricula.tipoMa,
      fecha: this.formatDateTime(this.fecha, this.tiempo)
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

    if (dni.length > 8) {
      this.snack.open('El DNI no puede tener más de 8 dígitos', '', {
        duration: 3000
      });
      this.nombreEstudiante = '';
      return;
    }

    if (dni.length === 8) {
      this.loading = true;
  
      this.estudianteService.obtenerEstudiantePorNroDoc(dni).subscribe(
        (data: any) => {
          this.loading = false;
          this.nombreEstudiante = `${data.apellido}, ${data.nombre}`;
          this.estudianteId = data._id;
  
          // Verificar si el estudiante ya tiene una matrícula
          this.matriculaService.obtenerMatricula(data._id).subscribe(
            (matricula: any) => {
              if (matricula) {
                // Si ya tiene una matrícula, es un estudiante regular
                this.matricula.tipoMa = 'Regular';
                // Deshabilitar el selector de tipo de matrícula
                this.matricula.monto = 300; // Monto para alumnos regulares
              } else {
                // Si no tiene matrícula, permitir elegir entre "Nuevo" o "Externo"
                this.matricula.tipoMa = ''; // Dejar vacío para que el usuario elija
                // El monto se establecerá al seleccionar el tipo
              }
            },
            (error) => {
              console.error('Error al verificar matrícula', error);
            }
          );
        },
        (error) => {
          console.error('Error al obtener estudiante', error);
          this.loading = false;
        }
      );
    } else {
      this.nombreEstudiante = '';
    }
  }
  

  formatDateTime(date: Date, time: string) {
    const [hours, minutes, seconds] = time.split(':').map(Number)
    date.setHours(hours, minutes, seconds);
    return formatDate(date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", 'en-US', '+0000');
  }

  actualizarMonto(tipoMatricula: string) {
    if (tipoMatricula === 'Nuevo' || tipoMatricula === 'Regular') {
      this.matricula.monto = 300;
    } else if (tipoMatricula === 'Traslado Externo') {
      this.matricula.monto = 350;
    } else {
      this.matricula.monto = '';
    }
  }

  closeModel() {
    this.dialogRef.close()
  }

  verificarTipoPago(tipoPago: string) {
    if (tipoPago === 'Transferencia' || tipoPago === 'Tarjeta') {
      this.nOperacionDisabled = false;  
    } else if (tipoPago === 'Efectivo') {
      this.nOperacionDisabled = true;  
    }
  }
}
