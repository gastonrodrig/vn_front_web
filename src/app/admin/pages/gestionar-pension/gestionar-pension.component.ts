import { Component } from '@angular/core';
import { PensionService } from '../../../core/services/pension.service';
import { MatDialog } from '@angular/material/dialog';
import { TableComponent } from '../../../shared/components/table/table.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { InputComponent } from '../../../shared/components/UI/input/input.component';
import Swal from 'sweetalert2';
import { ModalPensionComponent } from '../../../shared/components/modal/modal-pension/modal-pension.component';

@Component({
  selector: 'app-gestionar-pension',
  standalone: true,
  imports: [TableComponent, MatProgressBarModule, FormsModule, InputComponent, MatButtonModule],
  templateUrl: './gestionar-pension.component.html',
  styleUrl: './gestionar-pension.component.css'
})
export class GestionarPensionComponent {
  pensiones = []
  pension = []
  trackByField = '_id'
  loading = false
  loadedComplete: any
  searchTerm: string = ''
  
  columns= [
    { header: 'Nro. Documento', field: 'estudiante.numero_documento' },
    { header: 'Nombre', field: 'estudiante' },
    { header: 'Monto', field: 'monto' },
    { header: 'Método de Pago', field: 'metodo_pago' },
    { header: 'Nro. Operacion', field: 'n_operacion' },
    { header: 'Estado', field: 'estado' },
    { header: 'Mes', field: 'mes' },
    { header: 'Fecha de Inicio', field: 'fecha_inicio' },
    { header: 'Fecha Limite', field: 'fecha_limite' },
  ]

  constructor(
    private pensionService: PensionService,
    public dialog: MatDialog
  ){}

  ngOnInit(){
    this.loading = true
    this.listarPension()
  }

  listarPension(){
    this.pensionService.listarPension().subscribe(
      (data: any) => {
        console.log(data)
        this.pensiones = data.map((pension: any) => {
          pension.monto = this.formatMonto(pension.monto)
          pension.n_operacion = this.formatOperacion(pension.n_operacion) 
          return pension;
        });
        this.loading = false
        this.loadedComplete = true
      },
      (error) => {
        this.loading = false
        Swal.fire('Error', 'Error al cargar los datos', 'error')
      }
    )
  }
  agregarPension() {
    const dialogRef = this.dialog.open(ModalPensionComponent, {
      width: '70%'
    })

    dialogRef.afterClosed().subscribe(
      (data) => {
        this.listarPension()
      }
    )
  }
  displayedPension() {
    return this.pensiones.filter((pension: any) => 
      pension.estudiante.numero_documento.includes(this.searchTerm)
    )
  }
  getFullName(estudiante: any) {
    return `${estudiante.nombre} ${estudiante.apellido}`
  }

  formatMonto(monto: any) {
    return `S/. ${monto.toFixed(2)}`
  }
  formatOperacion(n_operacion: any){
    if( n_operacion === null ){
      return '-'
    }
    return n_operacion;
  }
  formatmes(fecha: any) {
    const date = new Date(fecha)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    return `${month}`
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
