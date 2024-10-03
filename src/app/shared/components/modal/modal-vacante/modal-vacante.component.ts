import { CommonModule } from '@angular/common';
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
import { GradoService } from '../../../../core/services/grado.service';
import { VacanteService } from '../../../../core/services/vacante.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EstudianteService } from '../../../../core/services/estudiante.service';
import { PeriodoService } from '../../../../core/services/periodo.service';
import { combineLatest } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-vacante',
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
  ],
  templateUrl: './modal-vacante.component.html',
  styleUrl: './modal-vacante.component.css'
})
export class ModalVacanteComponent {
  periodos: any
  grados: any
  vacante: any
  loading = false

  dni: any

  nombreEstudiante: any
  estudianteId: any

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModalVacanteComponent>,
    private snack: MatSnackBar,
    private estudianteService: EstudianteService,
    private periodoService: PeriodoService,
    private gradoService: GradoService,
    private vacanteService: VacanteService
  ) {}
  
  ngOnInit() {
    this.loading = true;

    combineLatest([
      this.gradoService.listarGrados(),
      this.periodoService.listarPeriodos()
    ]).subscribe(
      ([grados, periodos]) => {
        this.grados = grados;
        this.periodos = periodos;
        this.loading = false;
      },
      (error) => {
        console.log(error);
        this.loading = false;
      }
    );

    this.vacante = {
      estudiante_id: '',
      grado_id: '',
      periodo_id: ''
    };
  }
  guardarInformacion() {
    this.loading = true
    const vacanteData = {
      estudiante_id: this.estudianteId,
      grado_id: this.vacante.grado_id,
      periodo_id: this.vacante.periodo_id,
    }

    if(this.estudianteId === null || this.estudianteId === undefined) {
      this.snack.open('El dni del estudiante es requerido', '', {
        duration: 3000
      })
      this.loading = false
      return
    }

    if(vacanteData.grado_id === '') {
      this.snack.open('El grado es requerido', '', {
        duration: 3000
      })
      this.loading = false
      return
    }

    if(vacanteData.periodo_id === '') {
      this.snack.open('El periodo es requerido', '', {
        duration: 3000
      })
      this.loading = false
      return
    }

    this.vacanteService.agregarVacantes(vacanteData).subscribe(
      (data) => {
        console.log(data)
        this.loading = false
        Swal.fire('Vacante agregada', 'La vacante ha sido guardada con éxito', 'success').then(
          (e)=> {
            this.closeModel()
          }
        );
      },
      (error) => {
        this.loading = false
        this.snack.open(error.error.message, '', {
          duration: 3000
        })
      }
    )
  }

  validarDNI(dni: string) {
    if (dni.length === 8) {
      this.loading = true
      this.estudianteService.obtenerEstudiantePorNroDoc(dni, false).subscribe(
        (data: any) => {
          this.loading = false
          this.nombreEstudiante = `${data.apellido}, ${data.nombre}`
          this.estudianteId = data._id
        },
        (error) => {
          this.loading = false
          this.snack.open('No se encontró al estudiante', '', {
            duration: 3000
          })
        }
      )
    } else {
      this.nombreEstudiante = ''
    }
  }
  closeModel() {
    this.dialogRef.close()
  }
}
