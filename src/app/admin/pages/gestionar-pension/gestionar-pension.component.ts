import { Component } from '@angular/core';
import { PensionService } from '../../../core/services/pension.service';
import { MatDialog } from '@angular/material/dialog';
import { TableComponent } from '../../../shared/components/table/table.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { InputComponent } from '../../../shared/components/UI/input/input.component';
import { ModalPensionComponent } from '../../../shared/components/modal/modal-pension/modal-pension.component';
import Swal from 'sweetalert2';

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
    { header: 'Método de Pago', field: 'metodo_pago' },
    { header: 'Nro. Operacion', field: 'n_operacion' },
    { header: 'Periodo del estudiante', field: 'periodo.anio' },
    { header: 'Mes', field: 'mes' },
    { header: 'Tiempo de pago', field: 'tiempo_pago' },
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
        this.pensiones = data.sort((a: any, b: any) => {
          const mesesOrdenados = ['Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
          return mesesOrdenados.indexOf(a.mes) - mesesOrdenados.indexOf(b.mes);
        });
        console.log(data)

        this.pensiones = data.map((pension: any) => {
          pension.n_operacion = this.formatOperacion(pension.n_operacion) 
          pension.metodo_pago = this.formatMetodoPago(pension.metodo_pago)
          pension.tiempo_pago = this.formatFecha(pension.tiempo_pago) 
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
  formatOperacion(n_operacion: any){
    if( n_operacion === null ){
      return '-'
    }
    return n_operacion;
  }
  formatMetodoPago(metodoPago: any){
    if( metodoPago === null ){
      return '-'
    }
    return metodoPago;
  }
  formatmes(fecha: any) {
    const date = new Date(fecha)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    return `${month}`
  }
  formatFecha(fecha: any) {
    if (fecha === null) {
      return '-';
    }
    
    const date = new Date(fecha);
    date.setHours(date.getHours()); 
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  importarExcel() {
    this.pensionService.descargarExcel().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'reportePensiones_VirgenNatividad.xlsx';
      a.click();
    }, error => {
      console.error('Error al descargar el archivo Excel', error);
    });
  }
}
