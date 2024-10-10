import { CommonModule, formatDate } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { SoloNumerosDirective } from '../../../directives/solo-numeros.directive';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EstudianteService } from '../../../../core/services/estudiante.service';
import { ModalMatriculaComponent } from '../modal-matricula/modal-matricula.component';
import { PensionService } from '../../../../core/services/pension.service';
import { listaMetodosPago } from '../../../constants/itemsPayment';
import Swal from 'sweetalert2';
import { listaMeses } from '../../../constants/itemsMonths';
import moment from 'moment';
import { listaEstado } from '../../../constants/iteamsStatus';
import { PeriodoService } from '../../../../core/services/periodo.service';
import { error } from 'console';

@Component({
  selector: 'app-modal-pension',
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
  templateUrl: './modal-pension.component.html',
  styleUrls: ['./modal-pension.component.css']
})
export class ModalPensionComponent {
  periodos: any[] = []
  listaMetodosPago: any
  listaMeses: any = listaMeses;
  listaEstado: any = listaEstado;
  pension: any
  pensionId: any
  loading = false
  nOperacionDisabled = true;

  dni: any
  mes: any
  
  fecha_inicio: any
  fecha_limite: any
  fecha: any
  tiempo: any

  nombreEstudiante: any
  estudianteId: any

  isNombreDisabled = true;
  isMesDisabled = true;
  isMetodoPagoDisabled = true; 
  isPeriodoDisabled = true;
  isfechaDisabled = true; 
  istiempoDisabled = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModalMatriculaComponent>,
    private snack: MatSnackBar,
    private estudianteService: EstudianteService,
    private pensionService: PensionService,
    private periodoService: PeriodoService,
  ){}

  ngOnInit() {
    this.listaMetodosPago = listaMetodosPago;
    this.listaMeses = listaMeses; 
    this.pension = {
      estudiante_id: '',
      periodo_id: '',
      fecha_inicio: '',
      fecha_limite: '',
      mes: '',
    };
    this.periodoService.listarPeriodos().subscribe(
      (data: any) => {
        this.periodos = data
      },
      (error) => {
        console.log(error)
      }
    )
  }
  
  PagarPension() {
    this.loading = true;
    
    if(!this.dni || this.dni.length !== 8){
      this.mostrarMensaje('Debe ser de 8 dígitos');
      return;
    }
    if(this.nombreEstudiante === ''){
      this.mostrarMensaje('El perfil del estudiante no ha sido proporcionado')
      return;
    }
    if(this.pension.mes === ''){
      this.mostrarMensaje('Mes a pagar no seleccionado')
      return;
    }
    
    const pagoData = {
        metodo_pago: this.pension.metodo_pago,
        n_operacion: this.pension.n_operacion || '-',
        periodo_id: this.pension.periodo_id, 
        estado: 'Pagado', 
        tiempo_pago: this.formatDateTime(this.fecha, this.tiempo),
    }
    if (!pagoData.metodo_pago || pagoData.metodo_pago.trim() === '') {
      this.mostrarMensaje('Método de pago no seleccionado');
      return;
    }
    if(pagoData.n_operacion ===''){
      this.mostrarMensaje('Numero de operacion no colocado')
      return;
    }
    if(pagoData.n_operacion.length !== 8){
      this.mostrarMensaje('El numero de Operacion debe ser de 8 digitos')
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
    };
    this.pensionService.pagarPension(this.pensionId, pagoData).subscribe(
        (data) => {
          console.log('Respuesta del servidor:', data);
          this.loading = false;
          Swal.fire('Pago realizado', 'El pago de la pensión ha sido registrado con éxito', 'success').then(
            (e) => {
              this.closeModel();
            }
          );
        },
        (error) => {
          console.error('Error al pagar pensión:', error.error || error.message);
          this.snack.open('Error al realizar el pago de la pensión: ' + (error.error?.message || 'Solicitud inválida'), 'Cerrar', {
            duration: 3000,
          });
          this.loading = false;
        }

    );
  }

  setPension(pension: { mes: string; id: string }) {
    this.pensionId = pension.id;
  }

  listaMesesPendientes: any
  
  validarDNI(dni: string) {
    if (dni.length === 8) {
      this.loading = true;
  
      this.estudianteService.obtenerEstudiantePorNroDoc(dni, false).subscribe(
        (data: any) => {
          this.loading = false;
          this.nombreEstudiante = `${data.apellido}, ${data.nombre}`;
          this.estudianteId = data._id;
  
          this.pensionService.getMesesPendientes(this.estudianteId).subscribe(
            (meses: any) => {
              console.log(meses)
              this.listaMesesPendientes = meses.map((mes: any, index: number) => ({
                id: mes._id,
                mes: mes.mes
              }));
          
              this.listaMesesPendientes.sort((a: any, b: any) => {
                const mesesOrdenados = ['Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                return mesesOrdenados.indexOf(a.mes) - mesesOrdenados.indexOf(b.mes);
              });
              this.isMesDisabled = false;
              this.isMetodoPagoDisabled = false;
              this.nOperacionDisabled = false;
              this.isPeriodoDisabled = false;
              this.isfechaDisabled = false;
              this.istiempoDisabled = false;
            },
            (error) => {
              console.error('Error al obtener los meses pendientes', error);
              this.isMesDisabled = true; 
            }
          );   
        },
        (error) => {
          this.mostrarMensaje(error.error.message)
          console.error('Error al obtener estudiante', error);
          this.loading = false;
        }
      );
    } else {
      this.nombreEstudiante = '';
      this.isNombreDisabled = true;
      this.isMesDisabled = true; 
      this.isMetodoPagoDisabled = true; 
      this.nOperacionDisabled = true;
      this.isPeriodoDisabled = true;
      this.isfechaDisabled = true;
      this.istiempoDisabled = true; 
    }
  }
  mostrarMensaje(mensaje: string) {
    this.snack.open(mensaje, 'Cerrar', {
      duration: 3000,
    })
    this.loading = false
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
  closeModel() {
    this.dialogRef.close();
  }
}
