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
  secciones: any[] = []
  loading = false

  horario = {
    seccion_id: '',
    curso_id: '',
    docente_id: '',
    dia_semana: '',
    hora_inicio: '',
    hora_fin: ''
  }

  constructor(
    private seccionService: SeccionService,
    private periodoService: PeriodoService,
    private cursoService: CursoService,
    private docenteService: DocenteService
  ){}

  ngOnInit() {
    this.seccionService.listarSecciones().subscribe(
      (data: any) => {
        this.secciones = data
      }
    )
    this.periodoService.listarPeriodos().subscribe(
      (data: any) => {
        this.periodos = data
      }
    )
  }
}
