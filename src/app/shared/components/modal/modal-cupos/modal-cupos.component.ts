import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CuposService } from '../../../../core/services/cupos.service';
import { GradoService } from '../../../../core/services/grado.service';
import { PeriodoService } from '../../../../core/services/periodo.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { SoloNumerosDirective } from '../../../directives/solo-numeros.directive';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-cupos',
  standalone: true,
  imports: [
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    FormsModule, 
    MatSelectModule, 
    MatButtonModule, 
    CommonModule, 
    MatProgressBarModule,
    MatIconModule,
    SoloNumerosDirective
  ],
  templateUrl: './modal-cupos.component.html',
  styleUrl: './modal-cupos.component.css'
})
export class ModalCuposComponent {
  cupo: any
  cupoId: any
  grados: any[] = []
  periodos: any[] = []
  GradoSeccion: any
  loading = false
  CupoCreated: boolean = false; 

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModalCuposComponent>,
    private snack: MatSnackBar,
    private cuposService: CuposService,
    private gradoService: GradoService,
    private periodoService: PeriodoService,
  ) {}

  ngOnInit() {
    this.cupo = {
      capacidad: '',
      vacantes_disponibles: '',
      grado: { 
        _id: ''
      },
      periodo: { 
        _id: ''
      }
    }
    this.gradoService.listarGrados().subscribe(
      (data: any) => {
        this.grados = data       
      },
      (error) => {
        console.log(error)
      },
    )
    this.periodoService.listarPeriodos().subscribe(
      (data: any) => {
        this.periodos = data        
      },
      (error) => {
        console.log(error)
      },
    )
  }

  guardarInformacion() {
    this.loading = true
    const dataCupo = {
      capacidad : Number(this.cupo.capacidad),
      vacantes_disponibles : Number(this.cupo.vacantes_disponibles),
      grado_id : this.cupo.grado._id,
      periodo_id : this.cupo.periodo._id,
      
    }
    
    // VALIDACIONES
    if(dataCupo.capacidad < 40 || dataCupo.capacidad > 60) {
      this.snack.open('La capacidad no puede ser menor a 40 y mayor a 60', '', {
        duration: 3000
      })
      this.loading = false
      return
    }
    if(dataCupo.vacantes_disponibles < 40 || dataCupo.vacantes_disponibles > 60) {
      this.snack.open('Las Vacantes no puede ser menor a 40 y mayor a 60', '', {
        duration: 3000
      })
      this.loading = false
      return
    }

    if(dataCupo.grado_id === '') {
      this.snack.open('El grado es requerido', '', {
        duration: 3000
      })
      this.loading = false
      return
    }

    if(dataCupo.periodo_id === '') {
      this.snack.open('El periodo es requerido', '', {
        duration: 3000
      })
      this.loading = false
      return
    }

    this.cuposService.agregarCupos(dataCupo).subscribe(
      (data) => {
        Swal.fire('Cupo guardado', 'El Cupo ha sido guardado con éxito', 'success').then(
          (e)=> {
            this.closeModel()
          }
        );
      },
      (error) => {
        this.snack.open(error.error.message, '', {
          duration: 3000
        })
        this.loading = false
        return
      }
    )
  }

  closeModel() {
    this.dialogRef.close()
  }
}
