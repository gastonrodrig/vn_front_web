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

    // Solo combinar los servicios de grados y periodos
    combineLatest([
      this.gradoService.listarGrados(),
      this.periodoService.listarPeriodos()
    ]).subscribe(
      ([grados, periodos]) => {
        // Asigna los datos a las variables correspondientes
        this.grados = grados;
        this.periodos = periodos;

        // Detener el indicador de carga después de que ambos servicios hayan respondido
        this.loading = false;
      },
      (error) => {
        console.log(error);
        this.loading = false;
      }
    );

    // Aquí le das estructura a vacantes, por ejemplo, como un arreglo vacío
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

    // if(this.matricula.monto === '') {
    //   this.snack.open('El nombre del docente es requerido', '', {
    //     duration: 3000
    //   })
    //   this.loading = false
    //   return
    // }

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
  closeModel() {
    this.dialogRef.close()
  }
}
