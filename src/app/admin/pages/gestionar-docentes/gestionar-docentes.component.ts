import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DocenteService } from '../../../core/services/docente.service';
import { ModalDocenteComponent } from '../../../shared/components/modal/modal-docente/modal-docente.component';
import { FormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TableComponent } from '../../../shared/components/table/table.component';
import { InputComponent } from '../../../shared/components/UI/input/input.component';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gestionar-docentes',
  standalone: true,
  imports: [TableComponent, MatProgressBarModule, FormsModule, InputComponent, MatButtonModule],
  templateUrl: './gestionar-docentes.component.html',
  styleUrl: './gestionar-docentes.component.css'
})
export class GestionarDocentesComponent {
  docentes = []
  docente = []
  trackByField = '_id'
  loading = false
  loadedComplete: any
  searchTerm: string = '';

  columns = [
    { header: 'Nombre(s)', field: 'nombre' },
    { header: 'Apellido(s)', field: 'apellido' },
    { header: 'Documento', field: 'numero_documento' },
    { header: 'Telefono', field: 'telefono' }
  ];

  constructor(
    private docenteService: DocenteService,
    public dialog: MatDialog,
    private router: Router
  ){}

  ngOnInit() {
    this.loading = true
    this.docenteService.listarDocentes().subscribe(
      (data: any) => {
        this.docentes = data.sort((a: any, b: any) => {
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

  displayedDocentes() {
    return this.docentes.filter((estudiante: any) =>
      estudiante.numero_documento.includes(this.searchTerm)
    );
  }

  agregarDocente() {
    const dialogRef = this.dialog.open(ModalDocenteComponent, {
      data: {
        isCreate: true
      },
      width: '70%'
    })

    dialogRef.afterClosed().subscribe(
      (data) => {
        this.docenteService.listarDocentes().subscribe(
          (data: any) => {
            this.docentes = data.sort((a: any, b: any) => {
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
  
  editarDocente(isEdit: any, id: any) {
    this.loading = true
    if (isEdit) {
      this.docenteService.obtenerDocente(id).subscribe(
        (data: any) => {
          this.docente = data
          this.loading = false
          const dialogRef =  this.dialog.open(ModalDocenteComponent, {
            data: {
              docente: this.docente,
              isEdit: true
            },
            width: '70%'
          });

          dialogRef.afterClosed().subscribe(
            (data) => {
              this.docenteService.listarDocentes().subscribe(
                (data: any) => {
                  this.docentes = data.sort((a: any, b: any) => {
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

  eliminarDocente(isDeleted: any, id: any) {
    if(isDeleted){
      Swal.fire({
        title: 'Eliminar docente',
        text: '¿Estás seguro de eliminar al docente?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.loading = true
          this.docenteService.eliminarDocente(id).subscribe(
            (data) => {
              this.loading = false
              Swal.fire('Docente eliminado', 'El docente ha sido eliminado de la base de datos', 'success').then(
                (e)=> {
                  this.docenteService.listarDocentes().subscribe(
                    (data: any) => {
                      this.docentes = data.sort((a: any, b: any) => {
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
              console.log(error)
              this.loading = false
              Swal.fire('Error', 'Error al eliminar el docente de la base de datos', 'error');
            }
          );
        }
      });
    }
  }

  editarPFP(isPfp: any, id: any) {
    this.loading = true
    if(isPfp) {
      this.router.navigate([`/admin/gestionar-perfil-docente/${id}`])
    }
  }

}