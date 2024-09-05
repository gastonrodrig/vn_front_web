import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SoloNumerosDirective } from '../../../directives/solo-numeros.directive';
import { GradoCursosHorasService } from '../../../../core/services/grado-cursos-horas.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-modal-asignar-horas',
  standalone: true,
  imports: [
    MatDialogModule,  
    MatFormFieldModule, 
    MatInputModule,
    FormsModule, 
    MatButtonModule, 
    CommonModule, 
    MatProgressBarModule,
    MatIconModule,
    MatSelectModule,
    SoloNumerosDirective
  ],
  templateUrl: './modal-asignar-horas.component.html',
  styleUrl: './modal-asignar-horas.component.css'
})
export class ModalAsignarHorasComponent {
  gradosXCurso: any
  cursoId: any
  horas: any
  loading = false

  gchData = {
    grado_id: '',
    horas: ''
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snack: MatSnackBar,
    private gchService: GradoCursosHorasService,
  ) {}

  ngOnInit() {
    this.cursoId = this.data.curso._id
    this.gchService.listarGradosCursosHorasPorCurso(this.cursoId).subscribe(
      (data: any) => {
        this.gradosXCurso = this.ordenarDatosPorGrado(data)
      }
    )
  }

  extractNumber(str: string)  {
    const match = str.match(/\d+/)
    return match ? parseInt(match[0], 10) : 0
  }

  ordenarDatosPorGrado(data: any[]) {
    return data.sort((a, b) => {
      const numberA = this.extractNumber(a.grado.nombre);
      const numberB = this.extractNumber(b.grado.nombre);

      return numberA - numberB
    });
  }

  obtenerHorasAsignadas() {
    this.loading = true
    this.gchService.obtenerHorasPorGradoYCurso(this.cursoId, this.gchData.grado_id).subscribe(
      (data: any) => {
        this.loading = false
        this.gchData.horas = data
      }, 
      (error) => {
        this.loading = false
        this.snack.open('Debe asignar horas del curso a este grado.', 'Cerrar', {
          duration: 3000
        })
        this.gchData.horas = ''
      }
    )
  }

  guardarInformacion() {
    this.loading = true
    const dataGCH = {
      horas: Number(this.gchData.horas)
    }

    if(Number(dataGCH.horas) === 0) {
      this.snack.open('El campo de horas es requerido.', 'Cerrar', {
        duration: 3000
      })
      this.loading = false
      return
    }

    if(Number(dataGCH.horas) <= 0) {
      this.snack.open('La cantidad de horas deben ser mayor a 0.', 'Cerrar', {
        duration: 3000
      })
      this.loading = false
      return
    }

    if(Number(dataGCH.horas) >= 9) {
      this.snack.open('La cantidad de horas no puede exceder a 9.', 'Cerrar', {
        duration: 3000
      })
      this.loading = false
      return
    }

    if(this.gchData.grado_id === '') {
      this.snack.open('Debe seleccionar un grado.', 'Cerrar', {
        duration: 3000
      })
      this.loading = false
      return
    }

    this.gchService.modificarHorasPorGradoCurso(this.gchData.grado_id, this.cursoId, dataGCH).subscribe(
      (data: any) => {
        this.loading = false
        this.snack.open(`Horas asignadas al curso de ${this.data.curso.nombre}`, 'Cerrar', {
          duration: 3000
        })
        console.log(data)
      }
    )
  }
}
