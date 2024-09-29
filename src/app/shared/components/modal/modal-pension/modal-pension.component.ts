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
  listaMeses: any
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
    this.listaMetodosPago = listaMetodosPago
    this.listaMeses = listaMeses
    this.pension = {
     estudiante_id: '',
     monto: '',
     metodo_pago: '',
     n_operacion: '',
     fecha_inicio:'',
     fecha_limite:'',
     estado:'',
     mes:''
    }
  }
  guardarInformacion(){
    this.loading=true
    const pensionData = {
      estudiante_id: this.estudianteId,
      monto: Number(this.pension.monto),
      metodo_pago: this.pension.metodo_pago,
      n_operacion: this.pension.n_operacion,
      fecha_inicio: this.formatDateTime(this.fecha_inicio, this.tiempo),
      fecha_limite: this.formatDateTime(this.fecha_limite, this.tiempo),
      estado: this.pension.estado,
      mes: this.pension.mes,
    }
   if(this.pension.monto ===''){
    this.snack.open('El monto es requerico', '',{
      duration: 3000
    })
    this.loading = false
    return
    }
    this.pensionService.agregarPension(pensionData).subscribe(
      (data) => {
        console.log(data)
        this.loading = false
        Swal.fire('Pension agregada', 'La pewnsion ha sido guardada con éxito', 'success').then(
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
  formatDateTime(date: Date, time: string) {
    const [hours, minutes, seconds] = time.split(':').map(Number)
    date.setHours(hours, minutes, seconds);
    return formatDate(date, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", 'en-US', '+0000');
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
