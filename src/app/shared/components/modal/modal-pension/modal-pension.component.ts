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
  styleUrl: './modal-pension.component.css'
})
export class ModalPensionComponent {
  listaMetodosPago: any
  listaMeses: any = listaMeses;
  listaEstado: any = listaEstado;
  pension: any
  loading = false
  nOperacionDisabled = false
  
  dni: any
  mes: any
  fecha_inicio: any
  fecha_limite: any
  tiempo: any

  nombreEstudiante: any
  estudianteId: any

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModalMatriculaComponent>,
    private snack: MatSnackBar,
    private estudianteService: EstudianteService,
    private pensionService: PensionService,
  ){}

  ngOnInit() {
    this.nOperacionDisabled = true;
    this.listaMetodosPago = listaMetodosPago;
    this.listaMeses = listaMeses;
    this.pension = {
      estudiante_id: '',
      monto: '150',
      metodo_pago: '',
      n_operacion: '',
      fecha_inicio: '',
      fecha_limite: '',
      estado: 'Pendiente', // Valor por defecto
      mes: ''
    };
  }
  
  guardarInformacion() {
    this.loading = true;
  
    // Obtener fechas originales restando un día
    const fechaInicioOriginal = moment(this.pension.fecha_inicio).subtract(1, 'days').format('YYYY-MM-DD');
    const fechaLimiteOriginal = moment(this.pension.fecha_limite).subtract(1, 'days').format('YYYY-MM-DD');
  
    const pensionData = {
      estudiante_id: this.estudianteId,
      monto: Number(this.pension.monto),
      metodo_pago: this.pension.metodo_pago,
      n_operacion: this.pension.n_operacion || '-', // Enviar '-' si no hay operación
      fecha_inicio: fechaInicioOriginal, // Usar la fecha original
      fecha_limite: fechaLimiteOriginal, // Usar la fecha original
      estado: this.pension.estado,
      mes: this.pension.mes,
    };
  
    console.log('Datos enviados:', pensionData); // Verifica que los datos son correctos
  
    this.pensionService.agregarPension(pensionData).subscribe(
      (data) => {
        console.log('Respuesta del servidor:', data);
        this.loading = false;
        Swal.fire('Pensión agregada', 'La pensión ha sido guardada con éxito', 'success').then(
          (e) => {
            this.closeModel();
          }
        );
      },
      (error) => {
        console.error('Error al agregar pensión:', error.error || error.message);
        this.snack.open('Error al agregar la pensión: ' + (error.error?.message || 'Solicitud inválida'), 'Cerrar', {
          duration: 3000,
        });
        this.loading = false;
      }
    );
  }  

  onMesChange(mes: string) {
    const mesSeleccionado = this.listaMeses.find((m: any) => m.nombre === mes);
    if (mesSeleccionado) {
      const indexMes = this.listaMeses.indexOf(mesSeleccionado);
      const year = new Date().getFullYear();
      
      // Obtiene la hora actual
      const currentHour = new Date().getHours();
  
      // Calcula la fecha de inicio (primer día del mes seleccionado)
      let fechaInicio = moment([year, indexMes + 2, 1]).startOf('month');
      
      // Asigna a la vista (agregando 1 día para mostrar)
      this.pension.fecha_inicio = fechaInicio.add(1, 'days').format('YYYY-MM-DD'); // Agregar un día para mostrar
      console.log("Fecha inicio para mostrar:", this.pension.fecha_inicio);
  
      // Calcula la fecha límite (último día del mes seleccionado)
      let fechaLimite = moment([year, indexMes + 2, 1]).endOf('month');
  
      // Asigna a la vista (agregando 1 día para mostrar)
      this.pension.fecha_limite = fechaLimite.add(1, 'days').format('YYYY-MM-DD'); // Agregar un día para mostrar
      console.log("Fecha límite para mostrar:", this.pension.fecha_limite);
    }
  }
  

  validarDNI(dni: string) {
    if (dni.length === 8) {
      this.loading = true;
  
      this.estudianteService.obtenerEstudiantePorNroDoc(dni).subscribe(
        (data: any) => {
          this.loading = false;
          this.nombreEstudiante = `${data.apellido}, ${data.nombre}`;
          this.estudianteId = data._id;
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