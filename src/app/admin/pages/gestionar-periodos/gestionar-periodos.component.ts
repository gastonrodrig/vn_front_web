import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TableComponent } from '../../../shared/components/table/table.component';
import { InputComponent } from '../../../shared/components/UI/input/input.component';
import { PeriodoService } from '../../../core/services/periodo.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalPeriodosComponent } from '../../../shared/components/modal/modal-periodos/modal-periodos.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestionar-periodos',
  standalone: true,
  imports: [
    TableComponent, 
    MatProgressBarModule, 
    FormsModule, 
    InputComponent, 
    MatButtonModule
  ],
  templateUrl: './gestionar-periodos.component.html',
  styleUrl: './gestionar-periodos.component.css'
})
export class GestionarPeriodosComponent {
  periodos: any[] = []
  periodo = []
  trackByField = '_id'
  loading = false 
  loadedComplete: any
  searchTerm = ''

  columns = [
    { header: 'Año', field: 'anio' },
    { header: 'Fecha de Inicio de Clases', field: 'fechaInicio' },
    { header: 'Fecha de Fin de Clases', field: 'fechaFin' },
  ]

  constructor(
    private periodoService: PeriodoService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loading = true
    this.listarPeriodos()
  }

  listarPeriodos(){
    this.periodoService.listarPeriodos().subscribe(
      (data: any) => {
        this.periodos = this.ordenarPorUltimoAnio(data)
        this.loading = false
        this.loadedComplete = true
      },
      (error) => {
        this.loading = false
        Swal.fire('Error', 'Error al cargar los datos', 'error')
        console.log(error)
      }
    )
  }

  displayedPeriodos(){
    return this.periodos.filter((periodo: any) =>
      periodo.anio.includes(this.searchTerm)
    )
  }

  agregarPeriodo() {
    const dialogRef = this.dialog.open(ModalPeriodosComponent, {
      data: {
        isCreate: true
      },
      width: '70%'
    })

    dialogRef.afterClosed().subscribe(
      (data) => {
        this.listarPeriodos()
      }
    )
  }


  editarPeriodo(isEdit: any, id: any) {
    this.loading = true
    if (isEdit) {
      this.periodoService.obtenerPeriodo(id).subscribe(
        (data: any) => {
          this.periodo = data
          this.loading = false
          const dialogRef =  this.dialog.open(ModalPeriodosComponent, {
            data: {
              periodo: this.periodo,
              isEdit: true
            },
            width: '70%'
          })

          dialogRef.afterClosed().subscribe(
            (data) => {
              this.listarPeriodos()
            }
          )
        },
        (error) => {
          this.loading = false
          console.log(error)
        }
      )
    }
  }

  ordenarPorUltimoAnio(data: any) {
    return data.sort((a: any, b: any) => {
      const yearA = a.ultimoAnio || 0
      const yearB = b.ultimoAnio || 0
      return yearB - yearA
    })
  }
}
