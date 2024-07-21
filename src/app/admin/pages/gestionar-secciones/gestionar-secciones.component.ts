import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TableComponent } from '../../../shared/components/table/table.component';
import { SeccionService } from '../../../core/services/seccion.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalSeccionComponent } from '../../../shared/components/modal/modal-seccion/modal-seccion.component';
import { GradoService } from '../../../core/services/grado.service';
import { PeriodoService } from '../../../core/services/periodo.service';
import { InputComponent } from '../../../shared/components/UI/input/input.component';
import { SelectComponent } from '../../../shared/components/UI/select/select.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestionar-secciones',
  standalone: true,
  imports: [TableComponent, MatProgressBarModule, FormsModule, InputComponent, SelectComponent],
  templateUrl: './gestionar-secciones.component.html',
  styleUrl: './gestionar-secciones.component.css'
})
export class GestionarSeccionesComponent {
  secciones = []
  seccion: any[] = []
  grados: any[] = []
  periodos: any[] = []
  trackByField = 'seccion_id'
  loading = false
  loadedComplete: any
  searchTerm: string = ''
  gradoSelected = 'all'
  periodoSelected = 'all'

  columns = [
    { header: 'Nombre', field: 'nombre' },
    { header: 'Aula', field: 'aula' },
    { header: 'Grado', field: 'grado.nombre' },
    { header: 'Periodo', field: 'periodo.anio' }
  ];

  constructor(
    private seccionService: SeccionService,
    private gradoService: GradoService,
    private periodoService: PeriodoService,
    public dialog: MatDialog
  ){}

  ngOnInit() {
    this.loading = true
    this.seccionService.listarSecciones().subscribe(
      (data: any) => {
        this.secciones = data.sort((a: any, b: any) => a.grado.grado_id - b.grado.grado_id);
        this.loading = false
        this.loadedComplete = true
      },
      (error) => {
        this.loading = false
        Swal.fire('Error', 'Error al cargar los datos', 'error')
        console.log(error)
      }
    )
    this.gradoService.listarGrados().subscribe(
      (data: any) => {
        this.grados = data
      },
      (error) => {
        console.log(error)
      }
    )
    this.periodoService.listarPeriodos().subscribe(
      (data: any) => {
        this.periodos = data
      },
      (error) => {
        console.log(error)
      }
    )
  }

  displayedSecciones() {
    return this.secciones.filter((seccion: any) => {
      const matchSearchTerm = seccion.aula.toLowerCase().includes(this.searchTerm.toLowerCase())
      const matchGrado = this.gradoSelected === 'all' || seccion.grado.grado_id === Number(this.gradoSelected)
      const matchPeriodo = this.periodoSelected === 'all' || seccion.periodo.periodo_id === Number(this.periodoSelected)
      return matchSearchTerm && matchGrado && matchPeriodo
    })
  }

  agregarSeccion() {
    const dialogRef = this.dialog.open(ModalSeccionComponent, {
      data: {
        isCreate: true
      },
      width: '70%'
    })

    dialogRef.afterClosed().subscribe(
      (data) => {
        this.seccionService.listarSecciones().subscribe(
          (data: any) => {
            this.secciones = data.sort((a: any, b: any) => a.grado.grado_id - b.grado.grado_id);
          },
          (error) => {
            console.log(error)
          }
        )
      }
    )
  }

  editarSeccion(isEdit: any, id: any) {
    this.loading = true
    if (isEdit) {
      this.seccionService.obtenerSeccion(id).subscribe(
        (data: any) => {
          this.seccion = data
          this.loading = false
          const dialogRef = this.dialog.open(ModalSeccionComponent, {
            data: {
              seccion: this.seccion,
              isEdit: isEdit
            },
            width: '70%'
          });

          dialogRef.afterClosed().subscribe(
            (data) => {
              this.seccionService.listarSecciones().subscribe(
                (data: any) => {
                  this.secciones = data.sort((a: any, b: any) => a.grado.grado_id - b.grado.grado_id);
                  console.log(this.secciones)
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

  eliminarSeccion(isDeleted: any, id: any) {
    if(isDeleted){
      Swal.fire({
        title: 'Eliminar sección',
        text: '¿Estás seguro de eliminar la sección?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.loading = true
          this.seccionService.eliminarSeccion(id).subscribe(
            (data) => {
              this.loading = false
              Swal.fire('Sección eliminada', 'La sección ha sido eliminada de la base de datos', 'success').then(
                (e)=> {
                  this.seccionService.listarSecciones().subscribe(
                    (data: any) => {
                      this.secciones = data
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
              Swal.fire('Error', 'Error al eliminar la sección de la base de datos', 'error');
            }
          );
        }
      });
    }
  }

}
