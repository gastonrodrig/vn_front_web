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
  tiempo: any

  nombreEstudiante: any
  estudianteId: any

  isNombreDisabled = true;
  isMesDisabled = true;
  isMetodoPagoDisabled = true; 

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
      fecha_inicio: '',
      fecha_limite: '',
      mes: '',
    };
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
        estado: 'Pagado', 
        tiempo_pago: moment().format('YYYY-MM-DD HH:mm:ss'),
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
    }
  }
  mostrarMensaje(mensaje: string) {
    this.snack.open(mensaje, 'Cerrar', {
      duration: 3000,
    })
    this.loading = false
  }
  closeModel() {
    this.dialogRef.close();
  }
}
