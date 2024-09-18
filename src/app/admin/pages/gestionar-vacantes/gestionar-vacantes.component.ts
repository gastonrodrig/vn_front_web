import { Component } from '@angular/core';
import { TableComponent } from '../../../shared/components/table/table.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SelectComponent } from '../../../shared/components/UI/select/select.component';
import { GradoService } from '../../../core/services/grado.service';
import { PeriodoService } from '../../../core/services/periodo.service';
import { EstudianteService } from '../../../core/services/estudiante.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { VacanteService } from '../../../core/services/vacante.service';
import { InputComponent } from '../../../shared/components/UI/input/input.component';
import { combineLatest } from 'rxjs';
import { ModalVacanteComponent } from '../../../shared/components/modal/modal-vacante/modal-vacante.component';

@Component({
  selector: 'app-gestionar-vacantes',
  standalone: true,
  imports: [TableComponent, MatProgressBarModule, FormsModule, SelectComponent, MatButtonModule, InputComponent],
  templateUrl: './gestionar-vacantes.component.html',
  styleUrl: './gestionar-vacantes.component.css'
})
export class GestionarVacantesComponent {
  estudiantes: any
  grados: any
  periodos: any
  trackByField = '_id'
  loading = false
  loadedComplete: any
  searchTerm: string = ''
  gradoSelected = 'all'
  periodoSelected = 'all'
  vacantes: any
  
  columns = [
    { header: 'Estudiante', field: 'estudiante' },
    { header: 'Nro. Documento', field: 'estudiante.numero_documento' },
    { header: 'Grado', field: 'grado.nombre' },
    { header: 'Periodo', field: 'periodo.anio' },
    { header: 'Estado', field: 'estado' }
  ]

  constructor(
    private gradoService: GradoService,
    private periodoService: PeriodoService,
    private estudianteService: EstudianteService,
    private vacanteService: VacanteService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loading = true
    combineLatest([
      this.vacanteService.listarVacantes(),
      this.estudianteService.listarEstudiantes(),
      this.gradoService.listarGrados(),
      this.periodoService.listarPeriodos()
    ]).subscribe(
      ([vacantes, estudiantes, grados, periodos]) => {
        this.vacantes = vacantes;
        this.estudiantes = estudiantes;
        this.grados = grados;
        this.periodos = periodos;

        this.loading = false;
      },
      (error) => {
        console.log(error);
        this.loading = false;
      }
    )
  }
  
  displayedVacantes() {
    return this.vacantes.filter((e: any) => {
      const matchSearchTerm = e.estudiante.numero_documento.includes(this.searchTerm)
      const matchGrado = this.gradoSelected === 'all' || e.grado._id === this.gradoSelected
      const matchPeriodo = this.periodoSelected === 'all' || e.periodo._id === this.periodoSelected
      return matchSearchTerm && matchGrado && matchPeriodo
    })
  }

  agregarVacante() {
    const dialogRef = this.dialog.open(ModalVacanteComponent, {
      width: '70%'
    })

    dialogRef.afterClosed().subscribe(
      (data) => {
        this.vacanteService.listarVacantes().subscribe(
          (data) => {
            this.vacantes = data
          }
        )
      }
    )
  }
}

