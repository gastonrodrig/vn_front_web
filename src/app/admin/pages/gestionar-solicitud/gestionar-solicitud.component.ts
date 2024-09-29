import { Component } from '@angular/core';
import { SolicitudService } from '../../../core/services/solicitud.service';
import { TableComponent } from '../../../shared/components/table/table.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../../shared/components/UI/input/input.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { EstudianteService } from '../../../core/services/estudiante.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { VacanteService } from '../../../core/services/vacante.service';

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
  trackByField = '_id'
  loading = false
  searchTerm: string = ''
  loadedComplete: boolean = false

  solicitudDni: any

  columns = [
    { header: 'Nombre del hijo', field: 'nombre_hijo' },
    { header: 'Apellido del hijo', field: 'apellido_hijo' },
    { header: 'DNI del hijo', field: 'dni_hijo' },
    { header: 'Teléfono del padre', field: 'telefono_padre' },
    { header: 'Correo del padre', field: 'correo_padre' },
    { header: 'Estado', field: 'estado' },
    { header: 'Fecha', field: 'fecha_solicitud' }
  ]

  actionsByState = {
    'Pendiente': [
      { icon: 'fa-check', action: 'enProceso', style: 'hover:text-green-500' },
      { icon: 'fa-x', action: 'cancelado', style: 'hover:text-red-500' }
    ],
    'En Proceso': [
      { icon: 'fa-check-double', action: 'aprobado', style: 'hover:text-green-500' },
      { icon: 'fa-x', action: 'cancelado', style: 'hover:text-red-500' }
    ],
    'Aprobado': [],
    'Cancelado': []
  }

  constructor(
    private solicitudService: SolicitudService,
    private estudianteService: EstudianteService,
    private vacanteService: VacanteService,
    private snack: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loading = true
    this.listarSolicitudes()
  }

  listarSolicitudes() {
    this.solicitudService.listarSolicitudes().subscribe(
      (data: any) => { 
        this.solicitudes = this.ordenarFechas(data)
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

  ordenarFechas(data: any) {
    return data.map((solicitud: any) => {
      solicitud.fecha_solicitud = this.formatFecha(solicitud.fecha_solicitud)
      return solicitud
    }).sort((a: any, b: any) => {
      return new Date(b.fecha_solicitud).getTime() - new Date(a.fecha_solicitud).getTime()
    })
  }

  displayedSolicitudes() {
    return this.solicitudes.filter((solicitud: any) =>
      solicitud.nombre_hijo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      solicitud.dni_hijo.includes(this.searchTerm)
    )
  }

  handleTableAction(event: { id: any, action: string }) {
    const { id, action } = event
    switch (action) {
      case 'enProceso':
        Swal.fire({
          title: 'Procesar solicitud',
          text: '¿Estás seguro de procesar la solicitud?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Procesar',
          cancelButtonText: 'Cerrar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.cambiarEstadoEnProceso(id)
          }
        });
        break;
      case 'aprobado':
        Swal.fire({
          title: 'Aprobar solicitud',
          text: '¿Estás seguro de aprobar la solicitud?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Aprobar',
          cancelButtonText: 'Cerrar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.cambiarEstadoAprobado(id)
          }
        });
        break;
      case 'cancelado':
        Swal.fire({
          title: 'Cancelar solicitud',
          text: '¿Está seguro de cancelar la solicitud?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Cancelar',
          cancelButtonText: 'Cerrar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.solicitudService.cambiarEstadoCancelado(id).subscribe(
              (data: any) => {
                this.mostrarMensaje('La Solcitud ha sido cancelada')
                this.listarSolicitudes()
              }
            )
          }
        });
        break;
    }
  }

  cambiarEstadoEnProceso(id: any) {
    this.loading = true

    this.solicitudService.obtenerSolicitud(id).subscribe(
      (data: any) => {
        this.solicitudDni = data.dni_hijo;

        this.estudianteService.obtenerEstudiantePorNroDoc(this.solicitudDni).subscribe(
          (data: any) => {
            this.solicitudService.cambiarEstadoEnProceso(id).subscribe(
              (data: any) => {
                this.mostrarMensaje('La Solcitud ha sido cambiada a En Proceso')
                this.listarSolicitudes();
              }
            )
          },
          (error) => {
            this.loading = false
            this.mostrarMensaje('No existe un estudiante con el DNI proporcionado')
          }
        )
      }
    )
  }

  cambiarEstadoAprobado(id: any) {
    this.loading = true

    this.solicitudService.obtenerSolicitud(id).subscribe(
      (data: any) => {
        this.solicitudDni = data.dni_hijo;

        this.estudianteService.obtenerEstudiantePorNroDoc(this.solicitudDni).subscribe(
          (data: any) => {
            this.solicitudService.cambiarEstadoAprobado(id).subscribe(
              (data: any) => {
                this.mostrarMensaje('La Solcitud ha sido aprobada')
                this.listarSolicitudes()
              }
            )

            const dataEstado = {
              estado: 'No pagó'
            }
            this.estudianteService.cambiarEstadoEstudiante(data._id, dataEstado).subscribe(
              (data: any) => {
                console.log(data)
              }
            )

            const dataVacante = {
              estudiante_id: data._id,
              grado_id: data.grado._id,
              periodo_id: data.periodo._id,
            }
            this.vacanteService.agregarVacantes(dataVacante).subscribe(
              (data: any) => {
                console.log(data)
              }
            )
          },
          (error) => {
            this.loading = false
            this.mostrarMensaje('No existe un estudiante con el DNI proporcionado')
          }
        )
      }
    )  
  }

  mostrarMensaje(mensaje: any) {
    this.snack.open(mensaje, '', {
      duration: 3000
    })
    this.loading = false
    return
  }

}

