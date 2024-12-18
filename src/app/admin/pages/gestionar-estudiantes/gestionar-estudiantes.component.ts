import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { EstudianteService } from '../../../core/services/estudiante.service';
import { TableComponent } from '../../../shared/components/table/table.component';
import { ModalEstudianteComponent } from '../../../shared/components/modal/modal-estudiante/modal-estudiante.component';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../../shared/components/UI/input/input.component';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ApoderadoService } from '../../../core/services/apoderado.service';

@Component({
  selector: 'app-gestionar-estudiantes',
  standalone: true,
  imports: [TableComponent, MatProgressBarModule, FormsModule, InputComponent, MatButtonModule],
  templateUrl: './gestionar-estudiantes.component.html',
  styleUrl: './gestionar-estudiantes.component.css'
})
export class GestionarEstudiantesComponent {
  estudiantes = []
  estudiante = []
  trackByField = '_id'
  loading = false
  loadedComplete: any
  searchTerm: string = '';

  columns = [
    { header: 'Apellido(s)', field: 'apellido' },
    { header: 'Nombre(s)', field: 'nombre' },
    { header: 'Documento', field: 'numero_documento' },
    { header: 'Grado', field: 'grado.nombre' },
    { header: 'Periodo', field: 'periodo.anio' },
    { header: 'Estado', field: 'estado' }
  ];

  constructor(
    private estudianteService: EstudianteService,
    private apoderadoService: ApoderadoService,
    public dialog: MatDialog,
    private router: Router
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
        this.loading = false
        Swal.fire('Error', 'Error al cargar los datos', 'error')
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
            width: '70%',
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
          this.apoderadoService.eliminarApoderadosPorEstudiante(id).subscribe(
            (data) => {
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
          )
        }
      });
    }
  }

  editarPFP(isPfp: any, id: any) {
    this.loading = true
    if(isPfp) {
      this.router.navigate([`/admin/gestionar-perfil-estudiante/${id}`])
    }
  }

  editarArchivos(isFiles: any, id: any) {
    this.loading = true
    if(isFiles) {
      this.router.navigate([`/admin/gestionar-documentos/${id}`])
    }
  }
}
