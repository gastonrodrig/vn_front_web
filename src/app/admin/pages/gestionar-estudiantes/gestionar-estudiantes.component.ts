import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { EstudianteService } from '../../../core/services/admin/estudiante.service';
import { TableComponent } from '../../../shared/components/table/table.component';
import { ModalEstudianteComponent } from '../../../shared/components/modal/modal-estudiante/modal-estudiante.component';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestionar-estudiantes',
  standalone: true,
  imports: [TableComponent, MatProgressBarModule, FormsModule],
  templateUrl: './gestionar-estudiantes.component.html',
  styleUrl: './gestionar-estudiantes.component.css'
})
export class GestionarEstudiantesComponent {
  @Input() sidebarShowed: any

  estudiantes = []
  estudiante = []
  trackByField = 'estudiante_id'
  loading = false
  loadedComplete: any
  searchTerm: string = '';

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
        this.estudiantes = data.sort((a: any, b: any) => {
          if (a.apellido.toLowerCase() < b.apellido.toLowerCase()) {
            return -1;
          }
          if (a.apellido.toLowerCase() > b.apellido.toLowerCase()) {
            return 1;
          }
          return 0;
        });
        this.loading = false
        this.loadedComplete = true
      },
      (error) => {
        console.log(error)
      }
    )
  }

  displayedEstudiantes() {
    return this.estudiantes.filter((estudiante: any) =>
      estudiante.numero_documento.includes(this.searchTerm)
    );
  }

  agregarEstudiante() {
    const dialogRef = this.dialog.open(ModalEstudianteComponent, {
      data: {
        isCreate: true
      },
      width: '70%'
    })

    dialogRef.afterClosed().subscribe(
      (data) => {
        this.estudianteService.listarEstudiantes().subscribe(
          (data: any) => {
            this.estudiantes = data.sort((a: any, b: any) => {
              if (a.apellido.toLowerCase() < b.apellido.toLowerCase()) {
                return -1;
              }
              if (a.apellido.toLowerCase() > b.apellido.toLowerCase()) {
                return 1;
              }
              return 0;
            });
          },
          (error) => {
            console.log(error)
          }
        )
      }
    )
  }
  
  editarEstudiante(isEdit: any, id: any) {
    this.loading = true
    if (isEdit) {
      this.estudianteService.obtenerEstudiante(id).subscribe(
        (data: any) => {
          this.estudiante = data
          this.loading = false
          const dialogRef = this.dialog.open(ModalEstudianteComponent, {
            data: {
              estudiante: this.estudiante,
              isEdit: isEdit
            },
            width: '70%'
          });

          dialogRef.afterClosed().subscribe(
            (data) => {
              this.estudianteService.listarEstudiantes().subscribe(
                (data: any) => {
                  this.estudiantes = data.sort((a: any, b: any) => {
                    if (a.apellido.toLowerCase() < b.apellido.toLowerCase()) {
                      return -1;
                    }
                    if (a.apellido.toLowerCase() > b.apellido.toLowerCase()) {
                      return 1;
                    }
                    return 0;
                  });
                },
                (error) => {
                  console.log(error)
                }
              )
            }
          )
        },
        (error) => {
          this.loading = false
          console.log(error);
        }
      );
    }
  }

  eliminarEstudiante(isDeleted: any, id: any) {
    if(isDeleted){
      Swal.fire({
        title: 'Eliminar estudiante',
        text: '¿Estás seguro de eliminar al estudiante?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.loading = true
          this.estudianteService.eliminarEstudiante(id).subscribe(
            (data) => {
              this.loading = false
              Swal.fire('Estudiante eliminado', 'El estudiante ha sido eliminado de la base de datos', 'success').then(
                (e)=> {
                  this.estudianteService.listarEstudiantes().subscribe(
                    (data: any) => {
                      this.estudiantes = data.sort((a: any, b: any) => {
                        if (a.apellido.toLowerCase() < b.apellido.toLowerCase()) {
                          return -1;
                        }
                        if (a.apellido.toLowerCase() > b.apellido.toLowerCase()) {
                          return 1;
                        }
                        return 0;
                      });
                    },
                    (error) => {
                      console.log(error)
                    }
                  )
                }
              );
            },
            (error) => {
              this.loading = false
              Swal.fire('Error', 'Error al eliminar el estudiante de la base de datos', 'error');
            }
          );
        }
      });
    }
  }

  


}
