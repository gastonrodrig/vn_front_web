import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { EstudianteService } from '../../../core/services/admin/estudiante.service';
import { TableComponent } from '../../../shared/components/table/table.component';
import { ModalEstudianteComponent } from '../../../shared/components/modal/modal-estudiante/modal-estudiante.component';

@Component({
  selector: 'app-gestionar-estudiantes',
  standalone: true,
  imports: [TableComponent, MatProgressBarModule],
  templateUrl: './gestionar-estudiantes.component.html',
  styleUrl: './gestionar-estudiantes.component.css'
})
export class GestionarEstudiantesComponent {
  @Input() sidebarShowed: any

  estudiantes: any
  estudiante = []
  trackByField = 'estudiante_id'
  loading = false
  loadedComplete: any

  columns = [
    { header: 'Nombre', field: 'nombre' },
    { header: 'Apellido', field: 'apellido' },
    { header: 'Documento', field: 'numero_documento' },
    { header: 'Grado', field: 'seccion.grado.nombre' },
    { header: 'Seccion', field: 'seccion.nombre' },
    { header: 'Periodo', field: 'seccion.periodo.anio' }
  ];

  constructor(
    private estudianteService: EstudianteService,
    public dialog: MatDialog
  ){}

  ngOnInit() {
    this.loading = true
    this.estudianteService.listarEstudiantes().subscribe(
      (data: any) => {
        this.estudiantes = data
        this.loading = false
        this.loadedComplete = true
      },
      (error) => {
        console.log(error)
      }
    )
  }

  displayed() {

  }

  agregarEstudiante() {
    this.dialog.open(ModalEstudianteComponent, {
      data: {
        estudiante: this.estudiante,
        isCreate: true
      },
      width: '50%',
      height: '82%'
    })
  }
  
  editarEstudiante(isEdit: any, id: any) {
    this.loading = true
    if (isEdit) {
      this.estudianteService.obtenerEstudiante(id).subscribe(
        (data: any) => {
          this.estudiante = data
          this.loading = false
          this.dialog.open(ModalEstudianteComponent, {
            data: {
              estudiante: this.estudiante,
              isEdit: isEdit
            },
            width: '70%',
            height: '80%'
          });
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  eliminarEstudiante(isDeleted: any) {
    if(isDeleted){
    }
  }


}
