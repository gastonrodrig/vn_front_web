import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TableComponent } from '../../../shared/components/table/table.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalSeccionComponent } from '../../../shared/components/modal/modal-seccion/modal-seccion.component';
import { GradoService } from '../../../core/services/grado.service';
import { PeriodoService } from '../../../core/services/periodo.service';
import { InputComponent } from '../../../shared/components/UI/input/input.component';
import { SelectComponent } from '../../../shared/components/UI/select/select.component';
import { MatButtonModule } from '@angular/material/button';
import { SeccionGradoPeriodoService } from '../../../core/services/seccion-grado-periodo.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SeccionCursoService } from '../../../core/services/seccion-curso.service';

@Component({
  selector: 'app-gestionar-secciones',
  standalone: true,
  imports: [TableComponent, MatProgressBarModule, FormsModule, InputComponent, SelectComponent, MatButtonModule],
  templateUrl: './gestionar-secciones.component.html',
  styleUrl: './gestionar-secciones.component.css'
})
export class GestionarSeccionesComponent {
  seccionGradoPeriodo: any[] = []
  seccion: any[] = []
  grados: any[] = []
  periodos: any[] = []
  trackByField = '_id'
  loading = false
  loadedComplete: any
  searchTerm: string = ''
  gradoSelected = 'all'
  periodoSelected = 'all'

  columns = [
    { header: 'Nombre', field: 'seccion.nombre' },
    { header: 'Aula', field: 'seccion.aula' },
    { header: 'Grado', field: 'grado.nombre' },
    { header: 'Periodo', field: 'periodo.anio' }
  ];

  constructor(
    private gradoService: GradoService,
    private periodoService: PeriodoService,
    private sgpService: SeccionGradoPeriodoService,
    private scService: SeccionCursoService,
    public dialog: MatDialog,
    private router: Router
  ){}

  ngOnInit() {
    this.loading = true
    this.sgpService.listarSeccionGradoPeriodo().subscribe(
      (data: any) => {
        this.seccionGradoPeriodo = this.ordenarDatosPorGrado(data)
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

  extractNumber(str: string)  {
    const match = str.match(/\d+/)
    return match ? parseInt(match[0], 10) : 0
  }

  ordenarDatosPorGrado(data: any[]) {
    return data.sort((a, b) => {
      const numberA = this.extractNumber(a.grado.nombre);
      const numberB = this.extractNumber(b.grado.nombre);

      return numberA - numberB
    });
  }

  displayedSecciones() {
    return this.seccionGradoPeriodo.filter((e: any) => {
      // Check if e and e.seccion are valid
      if (!e || !e.seccion) {
        return false; // Skip this entry if it's invalid
      }
      
      const matchSearchTerm = e.seccion.aula.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchGrado = this.gradoSelected === 'all' || e.grado._id === this.gradoSelected;
      const matchPeriodo = this.periodoSelected === 'all' || e.periodo._id === this.periodoSelected;
  
      return matchSearchTerm && matchGrado && matchPeriodo;
    });
  }

  agregarSeccionGradoPeriodo() {
    const dialogRef = this.dialog.open(ModalSeccionComponent, {
      data: {
        isCreate: true
      },
      width: '70%'
    })

    dialogRef.afterClosed().subscribe(
      (data) => {
        this.sgpService.listarSeccionGradoPeriodo().subscribe(
          (data: any) => {
            this.seccionGradoPeriodo = this.ordenarDatosPorGrado(data)
          },
          (error) => {
            console.log(error)
          }
        )
      }
    )
  }

  editarSeccionGradoPeriodo(isEdit: any, id: any) {
    this.loading = true
    if (isEdit) {
      this.sgpService.obtenerSeccionGradoPeriodo(id).subscribe(
        (data: any) => {
          this.loading = false
          const dialogRef = this.dialog.open(ModalSeccionComponent, {
            data: {
              sgp_id: data._id,
              seccion: data.seccion,
              grado: data.grado,
              periodo: data.periodo,
              isEdit: isEdit
            },
            width: '70%'
          });

          dialogRef.afterClosed().subscribe(
            (data) => {
              this.sgpService.listarSeccionGradoPeriodo().subscribe(
                (data: any) => {
                  this.seccionGradoPeriodo = this.ordenarDatosPorGrado(data)
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
          
          // this.scService.eliminarSeccionCursoPorSeccion(id).subscribe(
          //   (data: any) => {
              this.sgpService.eliminarSeccionGradoPeriodo(id).subscribe(
                (data) => {
                  this.loading = false
                  Swal.fire('Sección eliminada', 'La sección ha sido eliminada de la base de datos', 'success').then(
                    (e)=> {
                      this.sgpService.listarSeccionGradoPeriodo().subscribe(
                        (data: any) => {
                          this.seccionGradoPeriodo = this.ordenarDatosPorGrado(data)
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
                  console.log(error);
                  Swal.fire('Error', 'Error al eliminar la sección de la base de datos', 'error');
                }
              );
          //   }
          // )
        }
      });
    }
  }

  asignarSeccion(isAsigned: any, id: any) {
    this.loading = true
    if(isAsigned) {
      this.router.navigate([`/admin/gestionar-secciones/${id}`])
    }
  }

}
