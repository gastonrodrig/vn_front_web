import { Component } from '@angular/core';
import { TableComponent } from '../../../shared/components/table/table.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../../shared/components/UI/input/input.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SolicitudNotasService } from '../../../core/services/solicitud-notas.service';
import Swal from 'sweetalert2';
import { NotasService } from '../../../core/services/notas.service';

@Component({
  selector: 'app-gestionar-solicitud',
  standalone: true,
  imports: [TableComponent, MatProgressBarModule, FormsModule, InputComponent, MatButtonModule],
  templateUrl: './gestionar-solicitud-notas.component.html',
  styleUrl: './gestionar-solicitud-notas.component.css'
})

export class GestionarSolicitudNotas {
  solicitudes = []
  solicitud = []
  trackByField = '_id'
  loading = false
  searchTerm: string = ''
  loadedComplete: boolean = false

  columns = [
    { header: 'Docente', field: 'docente.nombre' },
    { header: 'Descripción', field: 'descripcion' },
    { header: 'Estudiante', field: 'estudiante.nombre' },
    { header: 'Curso', field: 'curso.nombre' },
    { header: 'Bimestre', field: 'bimestre.nombre' },
    { header: 'Tipo de Nota', field: 'tipoNota' },
    { header: 'Estado', field: 'estado' },
  ]

  actionsByState = {
    'Pendiente': [
      { icon: 'fa-check-double', action: 'aprobado', style: 'hover:text-green-500' },
      { icon: 'fa-x', action: 'rechazado', style: 'hover:text-red-500' }
    ],
    'Aprobado': [],
    'Rechazado': []
  }

  constructor(
    private solicitudNotasService: SolicitudNotasService,
    private notasService: NotasService,
    private snack: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loading = true
    this.listarSolicitudNotas();
  }

  listarSolicitudNotas(){
    this.solicitudNotasService.listarSolicitudesNotas().subscribe(
      (data: any) => {
        this.solicitudes = data;
        this.loading = false
        this.loadedComplete = true
      },
      (error) => {
        this.loading = false
        Swal.fire('Error', 'Error al cargar los datos de solicitudes de cambio de nota', 'error')
      }
    )
  }

  truncateDescription(description: string, maxLength: number): string {
    if (description.length > maxLength) {
      return description.slice(0, maxLength) + '...';  // Truncar y agregar "..."
    }
    return description;  // Si no es larga, devolverla completa
  }

  displayedSolicitudes(){
    return this.solicitudes.map((solicitud: any) => {
      solicitud.descripcion = this.truncateDescription(solicitud.descripcion, 40); // Truncamos la descripción
      return solicitud;
    }).filter((solicitud: any) =>
      solicitud.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  handleTableAction(event: { id: any, action: string }) {
    const { id, action } = event;

    switch (action) {
      case 'rechazado': // Accion para "Rechazar"
        Swal.fire({
          title: 'Rechazar solicitud de nota',
          text: '¿Estás seguro de rechazar esta solicitud?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Rechazar',
          cancelButtonText: 'Cerrar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.cambiarNotaCancelado(id);
            this.cambiarEstadoRechazado(id);
          }
        });
        break;
        
      case 'aprobado': // Accion para "Aprobar"
        Swal.fire({
          title: 'Aprobar solicitud de nota',
          text: '¿Estás seguro de aprobar esta solicitud?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Aprobar',
          cancelButtonText: 'Cerrar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.cambiarNotaAprobado(id);
            this.cambiarEstadoAprobado(id);
          }
        });
        break;
    }
  }

  cambiarEstadoAprobado(id: any) {
    this.loading = true;
    this.solicitudNotasService.obtenerSolicitudNotas(id).subscribe(
      (data: any) => {
        this.solicitudNotasService.aprobarSolicitudNotas(id).subscribe(
          (data: any) => {
            this.mostrarMensaje('La solicitud ha sido aprobada');
            this.listarSolicitudNotas();
          }
        );
      },
      (error) => {
        this.loading = false;
        this.mostrarMensaje('Error al cambiar el estado');
      }
    );
  }

  cambiarEstadoRechazado(id: any) {
    this.loading = true;
    this.solicitudNotasService.obtenerSolicitudNotas(id).subscribe(
      (data: any) => {
        this.solicitudNotasService.rechazarSolicitudNotas(id).subscribe(
          (data: any) => {
            this.mostrarMensaje('La solicitud ha sido rechazada');
            this.listarSolicitudNotas();  // Actualiza la lista después de cambiar el estado
          }
        );
      },
      (error) => {
        this.loading = false;
        this.mostrarMensaje('Error al cambiar el estado');
      }
    );
  }

  cambiarNotaAprobado(id: any) {
    this.loading = true
    this.solicitudNotasService.obtenerSolicitudNotas(id).subscribe(
      (dataSolicitud: any) => {
        this.notasService.obtenerNota(
          dataSolicitud.estudiante._id,
          dataSolicitud.curso._id,
          dataSolicitud.bimestre._id,
          dataSolicitud.seccion._id,
          dataSolicitud.tipoNota
        ).subscribe(
          (dataNota: any) => {
            console.log(dataNota)
            this.notasService.cambiarEstadoAprobado(dataNota[0]._id).subscribe(
              () => {}
            );
          }
        )
      }
    )
  }

  cambiarNotaCancelado(id: any) {
    this.loading = true
    this.solicitudNotasService.obtenerSolicitudNotas(id).subscribe(
      (dataSolicitud: any) => {
        this.notasService.obtenerNota(
          dataSolicitud.estudiante._id,
          dataSolicitud.curso._id,
          dataSolicitud.bimestre._id,
          dataSolicitud.seccion._id,
          dataSolicitud.tipoNota
        ).subscribe(
          (dataNota: any) => {
            this.notasService.cambiarEstadoCancelado(dataNota[0]._id).subscribe(
              () => {}
            );
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