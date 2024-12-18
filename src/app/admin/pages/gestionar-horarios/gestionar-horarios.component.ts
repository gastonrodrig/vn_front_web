import { Component } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { PeriodoService } from '../../../core/services/periodo.service';
import { GradoService } from '../../../core/services/grado.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SeccionGradoPeriodoService } from '../../../core/services/seccion-grado-periodo.service';
import { HorarioService } from '../../../core/services/horario.service';
import { listaHoras } from '../../../shared/constants/itemsHoursPerDayClass';
import { listaDias } from '../../../shared/constants/itemsDays';
import { GradoCursosHorasService } from '../../../core/services/grado-cursos-horas.service';
import { CursoDocenteService } from '../../../core/services/curso-docente.service';
import { SeccionCursoDocenteService } from '../../../core/services/seccion-curso-docente.service';

@Component({
  selector: 'app-gestionar-horarios',
  standalone: true,
  imports: [
    MatProgressBarModule, 
    FormsModule, 
    MatButtonModule,
    MatFormFieldModule, 
    MatInputModule, 
    FormsModule,
    MatSelectModule,
    CommonModule
  ],
  templateUrl: './gestionar-horarios.component.html',
  styleUrl: './gestionar-horarios.component.css'
})
export class GestionarHorariosComponent {
  periodoId: any
  grados: any
  secciones: any
  horarios: any
  cursos: any
  docentes: any
  loading = false
  gradosLoaded = false
  seccionLoaded = false
  cursosLoaded = false
  docentesLoaded = false
  horarioLoaded = false
  horas: any

  horario = {
    dia_semana: '',
    hora_inicio: '',
    hora_fin: '',
    seccion_id: '',
    grado_id: '',
    curso_id: '',
    docente_id: ''
  }

  periodoEscolar = new Date().getFullYear().toString();

  days = listaDias
  times = listaHoras
  selectedCells: { [key: string]: boolean } = {};
  cellInfo: { [key: string]: any } = {};

  constructor(
    private periodoService: PeriodoService,
    private gradoService: GradoService,
    private cdService: CursoDocenteService,
    private sgpService: SeccionGradoPeriodoService,
    private gchService: GradoCursosHorasService,
    private horarioService: HorarioService,
    private scdService: SeccionCursoDocenteService,
    private snack: MatSnackBar
  ){}

  ngOnInit() {
    this.loading = true
    this.periodoService.obtenerPeriodoporanio(this.periodoEscolar).subscribe(
      (data: any) => {
        this.periodoId = data._id
        this.loading = false
      }
    )
    this.gradoService.listarGrados().subscribe(
      (data: any) => {
        this.grados = data
        this.loading = false
        this.gradosLoaded = true
      }
    )
  }

  listarSeccionesPorPeriodoGrado() {
    this.loading = true
    this.sgpService.listarSeccionesPorGradoPeriodo(
      this.horario.grado_id, 
      this.periodoId
    ).subscribe(
      (data: any) => {
        this.secciones = data
        this.loading = false
        this.seccionLoaded = true

        if (this.secciones.length === 0) {
          this.snack.open('No se encontraron secciones', 'Cerrar', {
            duration: 3000,
          })
          this.seccionLoaded = false
        }
      }
    )
  }

  listarCursosPorGrado() {
    this.loading = true
    this.gchService.listarGradoCursosHorasPorGrado(this.horario.grado_id).subscribe(
      (data: any) => {
        this.cursos = data
        this.loading = false
        this.cursosLoaded = true
      },
      (error) => {
        this.snack.open('No se encontraron cursos', 'Cerrar', {
          duration: 3000,
        })
      }
    )
  }

  listarDocentesPorCurso() {
    this.loading = true
    this.cdService.listarDocentesPorCurso(this.horario.curso_id).subscribe(
      (data: any) => {
        this.docentes = data
        this.loading = false
      },
      (error) => {
        this.loading = false
        this.docentes = []
        this.docentesLoaded = false
        this.snack.open('No se encontraron docentes', 'Cerrar', {
          duration: 3000,
        })
      }
    )
  }

  obtenerHoras() {
    this.gchService.obtenerHorasPorGradoYCurso(this.horario.curso_id, this.horario.grado_id).subscribe(
      (data: any) => {
        this.horas = data
        this.docentesLoaded = true
      },
      (error) => {
        console.log(error)
        this.docentesLoaded = false
        this.snack.open(`No se han fijado horas para el curso`, 'Cerrar', {
          duration: 3000 
        })
      }
    )  
  }

  listarHorariosPorGradoSeccion() {
    this.loading = true;

    if (this.horario.grado_id === '') {
      this.snack.open('Debe seleccionar un grado.', 'Cerrar', {
        duration: 3000,
      });
      this.loading = false;
      return;
    }
  
    if (this.horario.seccion_id === '') {
      this.snack.open('Debe seleccionar una seccion.', 'Cerrar', {
        duration: 3000,
      });
      this.loading = false;
      return;
    }

    this.gradosLoaded = false
    this.seccionLoaded = false
  
    this.horarioService.listarHorariosPorSeccionGrado(
      this.horario.seccion_id,
      this.horario.grado_id
    ).subscribe(
      (data: any) => {
        this.horarios = data;
        this.loading = false;
        this.horarioLoaded = true;
        this.actualizarCeldas(this.horarios);
      }
    );
  }

  actualizarCeldas(data: any) {
    this.selectedCells = {};
    this.cellInfo = {};
    data.forEach((horario: any) => {
      const day = horario.dia_semana;
      const startTime = horario.hora_inicio;
      const endTime = horario.hora_fin;
      const key = day + '-' + startTime + ' - ' + endTime;
      this.selectedCells[key] = true;
      this.cellInfo[key] = {
        curso: horario.curso.nombre,
        docente: horario.docente.apellido,
        _id: horario._id
      };
    });
  }
  
  getCellInfo(day: string, time: string) {
    const key = `${day}-${time}`;
    return this.cellInfo[key];
  }

  selectCell(day: string, time: string) {
    const key = `${day}-${time}`;
    if (this.selectedCells[key]) {
      this.selectedCells[key] = false;
      this.eliminar(key);
    } else {
      this.selectedCells[key] = true;

      if(this.horario.curso_id === '') {
        this.snack.open('Debe seleccionar un curso.', 'Cerrar', { 
          duration: 3000 
        })
        this.selectedCells[key] = false
        return
      }
  
      if(this.horario.docente_id === '') {
        this.snack.open('Debe seleccionar un docente.', 'Cerrar', { 
          duration: 3000 
        })
        this.selectedCells[key] = false
        return
      }

      this.asignarValor(day, time);
    }
  }

  isSelected(day: string, time: string): boolean {
    const key = `${day}-${time}`;
    return !!this.selectedCells[key];
  }

  asignarValor(day: string, time: string) {
    this.loading = true;
    this.horario.dia_semana = day;
    this.horario.hora_inicio = time.split(' - ')[0];
    this.horario.hora_fin = time.split(' - ')[1];
    const key = `${day}-${time}`;
  
    this.horarioService.obtenerCantidadRegistros(
      this.horario.seccion_id,
      this.horario.grado_id,
      this.horario.curso_id
    ).subscribe(
      (data: any) => {
        // Comparar y validar antes de agregar el horario
        if (this.horas <= data) {
          this.snack.open(`Ha llegado al límite de horas del curso por grado.`, 'Cerrar', {
            duration: 3000
          });
          this.loading = false;
          this.selectedCells[key] = false;
          return;
        }
  
        // Si pasa la validación, proceder a guardar la información
        this.horarioService.agregarHorario(this.horario).subscribe(
          (data: any) => {
            this.cellInfo[`${day}-${time}`] = {
              curso: data.curso.nombre,
              docente: data.docente.apellido,
              _id: data._id
            };
            this.snack.open('Horario guardado.', 'Cerrar', {
              duration: 3000
            });
            this.loading = false;
            
            const scdData = {
              seccion_id: data.seccion._id,
              curso_id: data.curso._id,
              docente_id: data.docente._id
            }

            this.scdService.agregarSeccionCursoDocente(scdData).subscribe(
              (data: any) => {
                console.log(data);
              },
              (error) => {
                console.log(error);
              }
            )
          },
          (error) => {
            const mensaje = error.error.message
            this.snack.open(mensaje, 'Cerrar', {
              duration: 3000
            });
            this.selectedCells[key] = false;
            this.loading = false;
          }
        );
      },
      (error) => {
        console.log(error);
        this.snack.open('Error al obtener cantidad de registros.', 'Cerrar', {
          duration: 3000
        });
        this.loading = false;
      }
    );
  }

  eliminar(key: string) {
    this.loading = true;
  
    this.horarioService.obtenerHorario(this.cellInfo[key]._id).subscribe(
      (data: any) => {
        this.scdService.obtenerSeccionCursoDocentePorSeccionCursoYDocente(
          data.seccion._id,
          data.curso._id,
          data.docente._id
        ).subscribe(
          (data: any) => {
            this.scdService.eliminarSeccionCursoDocente(data._id).subscribe(
              (data: any) => {
                this.eliminarHorarioYContinuar(key);
              },
              (error) => {
                console.log('Error al eliminar SeccionCursoDocente, probablemente ya fue eliminado.');
                this.eliminarHorarioYContinuar(key);
              }
            );
          },
          (error) => {
            console.log('No se encontró SeccionCursoDocente, probablemente ya fue eliminado.');
            this.eliminarHorarioYContinuar(key);
          }
        );
      },
      (error) => {
        this.snack.open('Error al obtener el horario.', 'Cerrar', {
          duration: 3000
        });
        this.loading = false;
      }
    );
  }
  
  eliminarHorarioYContinuar(key: string) {
    this.horarioService.eliminarHorario(this.cellInfo[key]._id).subscribe(
      (data: any) => {
        delete this.cellInfo[key];
        this.loading = false;
        this.snack.open('Horario eliminado.', 'Cerrar', {
          duration: 3000
        });
      },
      (error) => {
        this.snack.open('Error al eliminar el horario.', 'Cerrar', {
          duration: 3000
        });
        this.loading = false;
      }
    );
  }

  cambiarHorario() {
    this.horarioLoaded = false
    this.gradosLoaded = true
    this.seccionLoaded = false
    this.cursosLoaded = false
    this.docentesLoaded = false
    this.horario.grado_id = ''
    this.horario.seccion_id = ''
    this.horario.curso_id = ''
    this.horario.docente_id = ''
  }
}
