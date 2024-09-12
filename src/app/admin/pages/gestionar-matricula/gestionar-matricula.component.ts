import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TableComponent } from '../../../shared/components/table/table.component';
import { InputComponent } from '../../../shared/components/UI/input/input.component';
import { MatriculaService } from '../../../core/services/matricula.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ModalMatriculaComponent } from '../../../shared/components/modal/modal-matricula/modal-matricula.component';

@Component({
  selector: 'app-gestionar-matricula',
  standalone: true,
  imports: [TableComponent, MatProgressBarModule, FormsModule, InputComponent, MatButtonModule],
  templateUrl: './gestionar-matricula.component.html',
  styleUrl: './gestionar-matricula.component.css'
})
export class GestionarMatriculaComponent {
  matriculas = []
  matricula = []
  trackByField = '_id'
  loading = false
  loadedComplete: any
  searchTerm: string = ''

  columns = [
    { header: 'Nro. Documento', field: 'estudiante.numero_documento' },
    { header: 'Nombre', field: 'estudiante' },
    { header: 'Monto', field: 'monto',
      valueGetter: (row: any) => this.formatMonto(row.monto)
    },
    { header: 'Método de Pago', field: 'metodo_pago' },
    { header: 'Nro. Operacion', field: 'n_operacion' },
    { header: 'Periodo del estudiante', field: 'periodo.anio' },
    { header: 'Tipo', field: 'tipo' },
    { header: 'Fecha', field: 'fecha',
      valueGetter: (row: any) => this.formatFecha(row.fecha)
    },
  ]

  constructor(
    private matriculaService: MatriculaService,
    public dialog: MatDialog
  ){}

  ngOnInit() {
    this.loading = true
    this.listarMatriculas()
  }

  listarMatriculas() {
    this.matriculaService.listarMatriculas().subscribe(
      (data: any) => {
        console.log(data)
        this.matriculas = data.map((matricula: any) => {
          matricula.monto = this.formatMonto(matricula.monto)
          matricula.fecha = this.formatFecha(matricula.fecha);
          return matricula;
        });
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

  agregarMatricula() {
    const dialogRef = this.dialog.open(ModalMatriculaComponent, {
      width: '70%'
    })

    dialogRef.afterClosed().subscribe(
      (data) => {
        this.listarMatriculas()
      }
    )
  }

  displayedMatriculas() {
    return this.matriculas.filter((matricula: any) => 
      matricula.estudiante.numero_documento.includes(this.searchTerm)
    )
  }

  getFullName(estudiante: any) {
    return `${estudiante.nombre} ${estudiante.apellido}`
  }

  formatMonto(monto: any) {
    return `S/. ${monto.toFixed(2)}`
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
}
