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
import { listaMeses } from '../../../constants/itemsMonths';
import { PensionService } from '../../../../core/services/pension.service';

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
  listaMeses: any
  matricula: any
  loading = false

  dni: any
  fecha: any
  tiempo: any

  nombreEstudiante: any
  estudianteId: any
  alumnoNuevo = false
  anioActual: any

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModalMatriculaComponent>,
    private snack: MatSnackBar,
    private estudianteService: EstudianteService,
    private periodoService: PeriodoService,
    private pensionService: PensionService,
    private matriculaService: MatriculaService
  ) {}

  ngOnInit() {
    this.listaMeses = listaMeses
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

    if(matriculaData.metodo_pago === ''){
      this.mostrarMensaje('El metodo de pago es requerido')
      return
    }

    if(matriculaData.metodo_pago !== 'Efectivo' && matriculaData.n_operacion === ''){
      this.mostrarMensaje('El nro. de operacion es requerido')
      return
    }

    if(matriculaData.metodo_pago !== 'Efectivo' && matriculaData.n_operacion.length !== 8){
      this.mostrarMensaje('El nro. de operacion debe tener 8 digitos')
      return
    }

    if(matriculaData.periodo_id === ''){
      this.mostrarMensaje('El periodo escolar es requerido')
      return
    }

    if(matriculaData.estudiante_id === ''){
      this.mostrarMensaje('El estudiante es requerido')
      return
    }

    if(matriculaData.tipoMa === ''){
      this.mostrarMensaje('El tipo de matricula es requerido')
      return
    }

    if(this.fecha === ''){
      this.mostrarMensaje('La fecha del pago es requerida')
      return
    }

    if(this.tiempo === ''){
      this.mostrarMensaje('La hora del pago es requerida')
      return
    }

    const fechaIngresada = this.formatDateTime(this.fecha, this.tiempo);

    if (!fechaIngresada) {
      this.mostrarMensaje('La fecha y hora del pago es requerida');
      return;
    }
    
    const fechaActual = new Date();
    
    if (new Date(fechaIngresada).getTime() > fechaActual.getTime()) {
      this.mostrarMensaje('La fecha y hora del pago no puede ser mayor a la fecha y hora actual');
      return;
    }

    this.matriculaService.agregarMatricula(matriculaData).subscribe(
      (data) => {
        this.loading = false;
        Swal.fire('Matricula agregada', 'La matricula ha sido guardada con éxito', 'success').then(
          (e) => {
            this.closeModel();
            this.periodoService.obtenerPeriodo(this.matricula.periodo_id).subscribe(
              (data: any) => {
                const periodoId = this.matricula.periodo_id;
    
                if (!periodoId) {
                  console.error('El periodo_id está vacío');
                  return;
                }
    
                const pensionRequests = listaMeses.map((mes: any) => {
                  const monthIndex = mes.indice;
                  let fechaInicio = new Date(Number(data.anio), monthIndex, 1);
                  let fechaFin = new Date(Number(data.anio), monthIndex + 1, 0);
    
                  if (monthIndex === 2) {
                    fechaInicio = new Date(2024, 2, 18);
                  }
    
                  if (monthIndex === 11) {
                    fechaFin = new Date(2024, 11, 13);
                  }
    
                  const pensionData = {
                    estudiante_id: this.estudianteId,
                    monto: 150,
                    periodo_id: periodoId,
                    fecha_inicio: fechaInicio.toISOString().split('T')[0],
                    fecha_limite: fechaFin.toISOString().split('T')[0],
                    mes: mes.nombre
                  };
    
                  return this.pensionService.agregarPension(pensionData).toPromise();
                });
    
                Promise.all(pensionRequests)
                  .then((responses) => {
                    console.log('Todas las pensiones agregadas:', responses);
                    this.loading = false;
                  })
                  .catch((error) => {
                    console.error('Error al agregar pensiones:', error);
                    this.loading = false;
                    this.mostrarMensaje(error.error.message);
                  });
              }
            );
          }
        );
      },
      (error) => {
        this.loading = false;
        console.log(error);
        this.mostrarMensaje(error.error.message);
        return;
      }
    );
  }

  validarDNI(dni: string) {
    if (dni.length > 8) {
      this.snack.open('El DNI no puede tener más de 8 dígitos', '', {
        duration: 3000
      });
      this.nombreEstudiante = ''
      return;
    }

    if (dni.length === 8) {
      this.loading = true;
  
      this.estudianteService.obtenerEstudiantePorNroDoc(dni, false).subscribe(
        (data: any) => {
          this.loading = false
          this.nombreEstudiante = `${data.apellido}, ${data.nombre}`
          this.estudianteId = data._id

          this.matriculaService.listarMatriculasPorEstudiante(data._id).subscribe(
            (data: any) => {
              if(data.length >= 1) {
                this.matricula.tipoMa = 'Regular'
                this.alumnoNuevo = true
                this.matricula.monto = 300
              }
              else {
                this.matricula.tipoMa = ''
              }
            }
          )
        },
        (error) => {
          this.mostrarMensaje(error.error.message)
          return
        }
      )
    } else {
      this.nombreEstudiante = ''
      this.matricula.monto = ''
      this.alumnoNuevo = false
      this.matricula.tipoMa = ''
    }
  }
  
  formatDateTime(date: Date, time: string): string | null {
    if (!this.fecha) {
      this.mostrarMensaje('La fecha del pago es requerida');
      return null;
    }
    
    if (!this.tiempo) {
      this.mostrarMensaje('La hora del pago es requerida');
      return null;
    }
  
    const [hours, minutes, seconds = 0] = time.split(':').map(Number);
  
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
      this.mostrarMensaje('La hora no tiene un formato válido');
      return null;
    }
  
    date.setHours(hours, minutes, seconds);
    return formatDate(date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", 'en-US', '+0000');
  }

  actualizarMonto(tipoMatricula: string) {
    if (tipoMatricula === 'Nuevo' || tipoMatricula === 'Regular') {
      this.matricula.monto = 300
    } else if (tipoMatricula === 'Traslado Externo') {
      this.matricula.monto = 350
    } else {
      this.matricula.monto = ''
    }
  }

  mostrarMensaje(mensaje: string) {
    this.snack.open(mensaje, 'Cerrar', {
      duration: 3000,
    })
    this.loading = false
  }

  closeModel() {
    this.dialogRef.close()
  }
}
