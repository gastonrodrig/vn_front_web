import { Component } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TableComponent } from '../../../shared/components/table/table.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { InputComponent } from '../../../shared/components/UI/input/input.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SeccionService } from '../../../core/services/seccion.service';
import { DocenteService } from '../../../core/services/docente.service';
import { CursoService } from '../../../core/services/curso.service';
import { CommonModule } from '@angular/common';
import { PeriodoService } from '../../../core/services/periodo.service';
import { GradoService } from '../../../core/services/grado.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeccionGradoPeriodoService } from '../../../core/services/seccion-grado-periodo.service';
import { HorarioService } from '../../../core/services/horario.service';
import { listaHoras } from '../../../shared/constants/itemsHoursPerDayClass';

@Component({
  selector: 'app-gestionar-horarios',
  standalone: true,
  imports: [
    TableComponent, 
    MatProgressBarModule, 
    FormsModule, 
    InputComponent, 
    MatButtonModule,
    MatFormFieldModule, 
    MatInputModule, 
    FormsModule,
    MatSelectModule,
    CommonModule
  ],
  templateUrl: './gestionar-horarios.component.html',
  styleUrl: './gestionar-horarios.component.css'
})
export class GestionarHorariosComponent {
  periodos: any
  grados: any
  secciones: any
  horarios: any
  loading = false
  gradosLoaded = false
  seccionLoaded = false

  periodo = {
    periodo_id: ''
  }
  grado = {
    grado_id: ''
  }
  seccion = {
    seccion_id: ''
  }

  horario = {
    seccion_id: '',
    curso_id: '',
    docente_id: '',
    dia_semana: '',
    hora_inicio: '',
    hora_fin: ''
  }

  constructor(
    private periodoService: PeriodoService,
    private seccionService: SeccionService,
    private gradoService: GradoService,
    private cursoService: CursoService,
    private docenteService: DocenteService,
    private sgpService: SeccionGradoPeriodoService,
    private horarioService: HorarioService,
    private snack: MatSnackBar
  ){}

  ngOnInit() {
    this.periodoService.listarPeriodos().subscribe(
      (data: any) => {
        this.periodos = data
      }
    )
  }

  listarGrados() {
    this.loading = true
    this.gradoService.listarGrados().subscribe(
      (data: any) => {
        this.grados = data
        this.loading = false
        this.gradosLoaded = true
      }
    )
  }

  listarSeccionesPorPeriodoGrado() {
    this.loading = true
    this.sgpService.listarSeccionesPorGradoPeriodo(
      this.grado.grado_id, 
      this.periodo.periodo_id
    ).subscribe(
      (data: any) => {
        this.secciones = data
        this.loading = false
        this.seccionLoaded = true

        if (this.secciones.length === 0) {
          this.snack.open('No se encontraron secciones', 'Cerrar', {
            duration: 3000,
          })
        }
      }
    )
  }

  listarHorariosPorGradoSeccion() {
    this.horarioService.listarHorariosPorSeccionGrado(
      this.seccion.seccion_id,
      this.grado.grado_id
    ).subscribe(
      (data: any) => {
        this.horarios = data
        console.log(data)
      }
    )
  }

  days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  times = listaHoras
  selectedCells: { [key: string]: boolean } = {};

  selectCell(day: string, time: string) {
    const key = `${day}-${time}`;
    this.selectedCells[key] = !this.selectedCells[key];

    if (this.selectedCells[key]) {
      this.assignValue(day, time);
    }
  }

  isSelected(day: string, time: string): boolean {
    const key = `${day}-${time}`;
    return !!this.selectedCells[key];
  }

  assignValue(day: string, time: string) {
    const snackBarRef = this.snack.open(`Asignar valor a ${day} ${time}`, 'Asignar', {
      duration: 3000,
    });

    snackBarRef.onAction().subscribe(() => {
      // Aquí puedes asignar el valor que desees.
      // Por ejemplo, mostrar un modal para seleccionar curso y docente
      console.log(`Asignando valor a ${day} ${time}`);
    });
  }
}
