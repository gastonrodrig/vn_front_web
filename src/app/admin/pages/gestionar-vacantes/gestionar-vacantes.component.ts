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
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    { header: 'Estado', field: 'estado' },
    { header: 'Fecha', field: 'fecha'}
  ]

  actionsByState = {
    'Reservado': [
      { icon: 'fa-x', action: 'cancelado', style: 'hover:text-red-500' }
    ],
    'Confirmado': [],
    'Cancelado': []
  }

  constructor(
    private gradoService: GradoService,
    private periodoService: PeriodoService,
    private estudianteService: EstudianteService,
    private vacanteService: VacanteService,
    private snack: MatSnackBar,
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
        this.vacantes = this.ordenarFechas(vacantes);
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

  formatFecha(fecha: any) {
    const date = new Date(fecha)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  ordenarFechas(data: any) {
    return data.map((vacante: any) => {
      vacante.fecha = this.formatFecha(vacante.fecha)
      return vacante
    }).sort((a: any, b: any) => {
      return new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    })
  }
  
  displayedVacantes() {
    if (!this.vacantes) {
      return []
    }

    return this.vacantes.filter((e: any) => {
      const matchSearchTerm = e.estudiante.numero_documento.includes(this.searchTerm)
      const matchGrado = this.gradoSelected === 'all' || e.grado._id === this.gradoSelected
      const matchPeriodo = this.periodoSelected === 'all' || e.periodo._id === this.periodoSelected
      return matchSearchTerm && matchGrado && matchPeriodo
    })
  }

  handleTableAction(event: { id: any, action: string }) {
    const { id, action } = event
    switch (action) {
      case 'cancelado':
        Swal.fire({
          title: 'Cancelar vacante',
          text: '¿Está seguro de cancelar la vacante?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Cancelar',
          cancelButtonText: 'Cerrar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.vacanteService.cambiarEstadoCancelado(id).subscribe(
              (data: any) => {
                this.mostrarMensaje('La Vacante ha sido cancelada')
                this.vacanteService.listarVacantes().subscribe(
                  (data: any) => {
                    this.vacantes = this.ordenarFechas(data)
                  }
                )
              }
            )
          }
        });
        break;
    }
  }

  mostrarMensaje(mensaje: any) {
    this.snack.open(mensaje, '', {
      duration: 3000
    })
    this.loading = false
    return
  }

  agregarVacante() {
    const dialogRef = this.dialog.open(ModalVacanteComponent, {
      width: '70%'
    })

    dialogRef.afterClosed().subscribe(
      (data) => {
        this.vacanteService.listarVacantes().subscribe(
          (data) => {
            this.vacantes = this.ordenarFechas(data)
          }
        )
      }
    )
  }
}

