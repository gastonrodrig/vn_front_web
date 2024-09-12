import { Component } from '@angular/core';
import { SolicitudService } from '../../../core/services/solicitud.service';
import { TableComponent } from '../../../shared/components/table/table.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../../shared/components/UI/input/input.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ModalSolicitudComponent } from '../../../shared/components/modal/modal-solicitud/modal-solicitud.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestionar-solicitud',
  standalone: true,
  imports: [TableComponent, MatProgressBarModule, FormsModule, InputComponent, MatButtonModule],
  templateUrl: './gestionar-solicitud.component.html',
  styleUrl: './gestionar-solicitud.component.css'
})
export class GestionarSolicitudComponent {
  solicitudes = []
  solicitud = []
  trackByField = 'solicitud_id'
  loading = false
  searchTerm: string = ''
  loadedComplete: boolean = false

  columns = [
    { header: 'Nombre del hijo', field: 'nombre_hijo' },
    { header: 'Apellido del hijo', field: 'apellido_hijo' },
    { header: 'DNI del hijo', field: 'dni_hijo' },
    { header: 'Teléfono del padre', field: 'telefono_padre' },
    { header: 'Correo del padre', field: 'correo_padre' },
    { header: 'Estado', field: 'estado' },
    { header: 'Fecha', field: 'fecha_solicitud' }
  ]

  constructor(
    private solicitudService: SolicitudService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loading = true;
    this.listarSolicitudes()
  }

  listarSolicitudes(){
    this.solicitudService.listarSolicitudes().subscribe(
      (data: any) => { 
        this.solicitudes = data.map((solicitud: any) => {
          solicitud.fecha_solicitud = this.formatFecha(solicitud.fecha_solicitud)
          return solicitud
        })
        this.loading = false
        this.loadedComplete = true
      },
      (error) => {
        this.loading = false
        Swal.fire('Error', 'Error al cargar los datos de solicitudes', 'error')
      }
    );
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

  displayedSolicitudes() {
    return this.solicitudes.filter((solicitud: any) =>
      solicitud.nombre_hijo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      solicitud.dni_hijo.includes(this.searchTerm)
    )
  }

}

