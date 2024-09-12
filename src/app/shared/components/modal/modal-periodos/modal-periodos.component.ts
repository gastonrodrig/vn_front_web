import { Component, Inject } from '@angular/core';
import { PeriodoService } from '../../../../core/services/periodo.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SoloNumerosDirective } from '../../../directives/solo-numeros.directive';
import { MatDatepickerModule } from '@angular/material/datepicker';
import Swal from 'sweetalert2';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';

const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-modal-periodos',
  standalone: true,
  imports: [ 
    MatDialogModule, 
    SoloNumerosDirective, 
    MatFormFieldModule, 
    MatInputModule, 
    ReactiveFormsModule, 
    MatButtonModule, 
    MatProgressBarModule,
    MatIconModule, 
    MatDatepickerModule
  ],
  templateUrl: './modal-periodos.component.html',
  styleUrls: ['./modal-periodos.component.css']
})
export class ModalPeriodosComponent {
  periodoForm: FormGroup
  loading = false

  currentYear = new Date().getFullYear()
  minYear = this.currentYear + 1
  maxYear = this.currentYear + 2

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModalPeriodosComponent>,
    private snack: MatSnackBar,
    private docenteService: PeriodoService 
  ) {
    this.periodoForm = new FormGroup({
      anio: new FormControl({ value: '', disabled: data.isEdit }),
      fechaInicio: new FormControl(),
      fechaFin: new FormControl()
    })
  }

  ngOnInit() {
    const periodoAnio = this.data.periodo?.anio
    if (periodoAnio) {
      this.minYear = periodoAnio
      this.maxYear = periodoAnio
    } else {
      this.minYear = this.currentYear + 1
      this.maxYear = this.currentYear + 2
    }

    if (this.data.isEdit) {
      const { fechaInicio, fechaFin, anio } = this.data.periodo
      this.periodoForm.setValue({
        anio: anio,
        fechaInicio: this.convertToDate(fechaInicio),
        fechaFin: this.convertToDate(fechaFin),
      })
      this.periodoForm.controls['fechaInicio'].enable()
      this.periodoForm.controls['fechaFin'].enable()
    } else {
      this.updateDateControls()
    }
  }

  onYearChange(year: string) {
    const yearNum = parseInt(year, 10)
    if (isNaN(yearNum) || yearNum < this.minYear || yearNum > this.maxYear) {
      this.periodoForm.patchValue({
        fechaInicio: null,
        fechaFin: null
      })
      this.periodoForm.controls['fechaInicio'].disable()
      this.periodoForm.controls['fechaFin'].disable()
    } else {
      this.setDateControls(year)
      this.periodoForm.controls['fechaInicio'].enable()
      this.periodoForm.controls['fechaFin'].enable()
    }
  }

  setDateControls(year: string) {
    const startOfYear = moment([Number(year), 0, 1]).toDate()
    const endOfYear = moment([Number(year), 11, 31]).toDate()
    
    if (this.data.isCreate) {
      this.periodoForm.patchValue({
        fechaInicio: startOfYear,
        fechaFin: endOfYear
      })
    }
  }

  updateDateControls() {
    if (!this.isYearValid()) {
      this.periodoForm.controls['fechaInicio'].disable()
      this.periodoForm.controls['fechaFin'].disable()
    } else {
      this.periodoForm.controls['fechaInicio'].enable()
      this.periodoForm.controls['fechaFin'].enable()
    }
  }

  isYearValid(): boolean {
    const year = Number(this.periodoForm.get('anio')?.value)
    return year >= this.minYear && year <= this.maxYear
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date || !this.isYearValid()) return false
    const selectedYear = date.getFullYear()
    const dayOfWeek = date.getDay()
    return selectedYear === Number(this.periodoForm.get('anio')?.value) && dayOfWeek !== 0 && dayOfWeek !== 6
  }

  guardarInformacion() {
    this.loading = true

    const fechaInicio = this.convertToDateString(this.periodoForm.get('fechaInicio')?.value)
    const fechaFin = this.convertToDateString(this.periodoForm.get('fechaFin')?.value)

    const dataPeriodo = {
      anio: this.periodoForm.get('anio')?.value,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
    }

    if (dataPeriodo.anio === '') {
      this.snack.open('El año del periodo es requerido', '', {
        duration: 3000
      })
      this.loading = false
      return
    }

    if (this.data.isCreate) {
      this.docenteService.agregarPeriodo(dataPeriodo).subscribe(
        () => {
          this.loading = false
          Swal.fire('Periodo escolar guardado', 'El periodo escolar ha sido guardado con éxito', 'success').then(
            () => {
              this.closeModel()
            }
          )
        },
        (error) => {
          this.loading = false
          this.snack.open(error.error.message, '', {
            duration: 3000
          })
        }
      )
    } else if (this.data.isEdit) {
      this.docenteService.modificarPeriodo(this.data.periodo._id, dataPeriodo).subscribe(
        () => {
          this.loading = false
          Swal.fire('Periodo escolar modificado', 'El periodo escolar ha sido modificado con éxito', 'success').then(
            () => {
              this.closeModel()
            }
          )
        },
        (error) => {
          this.loading = false
          this.snack.open(error.error.message, '', {
            duration: 3000
          })
        }
      )
    }
  }

  convertToDate(date: string) {
    const [day, month, year] = date.split('-').map(Number)
    return new Date(year, month - 1, day)
  }
  
  convertToDateString(date: Date) {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  closeModel() {
    this.dialogRef.close()
  }
}