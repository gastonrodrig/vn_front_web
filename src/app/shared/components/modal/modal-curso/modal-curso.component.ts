import { CommonModule } from '@angular/common';
import { Component, inject, Inject, model } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CursoDocenteService } from '../../../../core/services/curso-docente.service';
import { GradoCursoService } from '../../../../core/services/grado-curso.service';
import { GradoService } from '../../../../core/services/grado.service';
import { DocenteService } from '../../../../core/services/docente.service';
import { CursoService } from '../../../../core/services/curso.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { InputComponent } from '../../UI/input/input.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-curso',
  standalone: true,
  imports: [
    MatDialogModule,  
    MatFormFieldModule, 
    MatInputModule, 
    FormsModule, 
    MatButtonModule, 
    CommonModule, 
    MatProgressBarModule,
    MatIconModule,
    MatCheckboxModule,
    InputComponent
  ],
  templateUrl: './modal-curso.component.html',
  styleUrl: './modal-curso.component.css'
})
export class ModalCursoComponent {

  docenteList: any[] = []

  grados: any[] = []
  gradosSeleccionados: any[] = []
  searchTerm = ''

  docentes: any
  docentesXCurso: any[] = []
  curso: any
  cursoId: any
  cursoCreated = false
  loading = false

  checkedItems: { [key: number]: boolean } = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModalCursoComponent>,
    private snack: MatSnackBar,
    private cursoService: CursoService,
    private gradoService: GradoService,
    private docenteService: DocenteService,
    private gcService: GradoCursoService,
    private cdService: CursoDocenteService
  ) {
    dialogRef.disableClose = true
  }

  ngOnInit() {
    if (this.data.isEdit) {
      this.loading = true
      this.curso = this.data.curso
      this.cursoId = this.data.curso.curso_id
      this.listarGrados()
      this.listarDocentesPorCurso()
    } else {
      this.curso = {
        nombre: ''
      }
    }
    this.listarDocentes()
  }

  crearCurso() {
    this.loading = true
    const dataCurso = {
      nombre : this.curso.nombre,
    }

    if(dataCurso.nombre === '') {
      this.snack.open('El nombre del curso es requerido', '', {
        duration: 3000
      })
      this.loading = false
      return
    }

    this.cursoService.agregarCurso(dataCurso).subscribe(
      (data: any) => {
        this.cursoCreated = true
        this.listarGrados()
        this.loading = false
        this.cursoId = data.curso_id
      },
      (error) => {
        console.log(error)
      }
    )
  }

  listarGrados() {
    this.gradoService.listarGrados().subscribe(
      (data: any) => {
        this.grados = data
        if(this.data.isEdit) {
          this.listarGradosPorCurso()
        }
        if(this.data.isCreate) {
          this.loading = false
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }

  listarGradosPorCurso() {
    this.gcService.listarGradosPorCurso(this.cursoId).subscribe(
      (data: any) => {
        this.loading = false

        this.gradosSeleccionados = data.map((grado: any) => grado.grado_id)
        this.grados.forEach((grado: any) => {
          this.checkedItems[grado.grado_id] = this.gradosSeleccionados.includes(grado.grado_id)
        })
      }
    ) 
  }

  obtenerGradosSeleccionados() {
    return this.grados.filter(e => this.checkedItems[e.grado_id])
  }

  onCheckboxChange(gradoId: number, isChecked: boolean) {
    this.gradosSeleccionados[gradoId] = isChecked;
    this.updateGrados(gradoId);
  }

  updateGrados(gradoId: any) {
    if(this.data.isCreate) {
      localStorage.setItem('grados', JSON.stringify(this.obtenerGradosSeleccionados()))
      this.gradosSeleccionados = this.obtenerGradosSeleccionados()
    }
    if(this.data.isEdit) {
      this.loading = true
      // AGREGAR GRADO
      if (this.gradosSeleccionados[gradoId]) {
        const dataGC = {
          grado_id: gradoId,
          curso_id: this.cursoId
        }
        this.gcService.agregarGradoCurso(dataGC).subscribe(
          (data: any) => {
            this.snack.open('Grado agregado al curso con éxito.', 'Cerrar', {
              duration: 3000
            })
            this.listarGradosPorCurso()
          }
        )
      } 
      // QUITAR GRADO
      else {
        this.gcService.eliminarGradoCursoPorGradoYCurso(gradoId, this.cursoId).subscribe(
          (data: any) => {
            this.loading = false
            if(this.obtenerGradosSeleccionados().length > 0) {
              this.snack.open('Grado eliminado del curso con éxito.', 'Cerrar', {
                duration: 3000
              })
              this.listarGradosPorCurso()
            } else {
              this.snack.open('Debe seleccionar por lo menos 1 grado.', 'Cerrar', {
                duration: 3000
              })
            }
          }
        )
      }
    }
  }

  listarDocentes() {
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

  listarDocentesPorCurso() {
    this.cdService.listarDocentesPorCurso(this.cursoId).subscribe(
      (data: any) => {
        this.docentesXCurso = data.sort((a: any, b: any) => {
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

  inputText() {
    if(this.searchTerm !== '')
    return true
    else return false
  }

  displayedDocentes() {
    return this.docentes.filter((e: any) =>
      e.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      e.apellido.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      e.numero_documento.includes(this.searchTerm)
    );
  }

  agregarDocente(docente: any) {
    if(this.data.isCreate) {
      const storedItems = JSON.parse(localStorage.getItem('docentes') || '[]')
      const exists = storedItems.some((e: any) => e.docente_id === docente.docente_id)
      
      if (exists) {
        this.snack.open('El docente ya está en la lista.', 'Cerrar', {
          duration: 3000
        })
        this.searchTerm = ''
        return
      }
      
      this.docenteList.push(docente)
      this.saveToLocalStorage()
    }
    if(this.data.isEdit) {
      this.loading = true
      const dataCD = {
        docente_id: docente.docente_id,
        curso_id: this.cursoId
      }

      const exists = this.docentesXCurso.some(
        (doc: any) => doc.docente_id === dataCD.docente_id && this.cursoId === dataCD.curso_id
      );

      if (exists) {
        this.snack.open('El docente ya está asignado a este curso.', 'Cerrar', {
          duration: 3000
        });
        this.loading = false
        this.searchTerm = ''
        return
      }

      this.cdService.agregarCursoDocente(dataCD).subscribe(
        (data: any) => {
          this.snack.open('Docente agregado al curso con éxito.', 'Cerrar', {
            duration: 3000
          })
          this.listarDocentesPorCurso()
          this.loading = false
        }
      )
    }
    this.searchTerm = ''
  }

  eliminarDocente(id: any) {
    if(this.data.isCreate) {
      this.docenteList = this.docenteList.filter((e: any) =>  e.docente_id !== id )
      this.saveToLocalStorage()
    }
    if(this.data.isEdit) {
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
          this.cdService.eliminarCursoDocentePorCursoYDocente(this.cursoId, id).subscribe(
            (data) => {
              this.loading = false
              Swal.fire('Docente eliminado', 'El docente ha sido eliminado de la base de datos', 'success').then(
                (e)=> {
                  if(this.docentesXCurso.length === 1) {
                    this.docentesXCurso = []
                  } else {
                    this.listarDocentesPorCurso()
                  }
                }
              );
            },
            (error) => {
              this.loading = false
              Swal.fire('Error', 'Error al eliminar el docente de la base de datos', 'error');
            }
          );
        }
      });  
    }
  }

  vaciarListas() {
    this.docenteList = []
    this.grados = []
    this.saveToLocalStorage()
  }

  saveToLocalStorage() {
    localStorage.setItem('docentes', JSON.stringify(this.docenteList))
  }

  guardarInformacion() {
    this.loading = true
    if(this.data.isCreate) {
      const gradoPromesas = this.gradosSeleccionados.map(e => {
        const dataGC = {
          grado_id: e.grado_id,
          curso_id: this.cursoId
        }
        return this.gcService.agregarGradoCurso(dataGC).toPromise()
      })
  
      const docentePromesas = this.docenteList.map(e => {
        const dataCD = {
          docente_id: e.docente_id,
          curso_id: this.cursoId
        }
        return this.cdService.agregarCursoDocente(dataCD).toPromise()
      })

      if(this.gradosSeleccionados.length === 0) {
        this.snack.open('Debe seleccionar por lo menos 1 grado.', 'Cerrar', {
          duration: 3000
        })
        this.loading = false
        return
      }
      if(this.docenteList.length === 0) {
        this.snack.open('Debe seleccionar por lo menos 1 docente.', 'Cerrar', {
          duration: 3000
        })
        this.loading = false
        return
      }
  
      Promise.all([...gradoPromesas, ...docentePromesas])
        .then(() => {
          this.loading = false
          Swal.fire('Curso agregado', 'El curso ha sido registrado con éxito', 'success').then(() => {
            this.closeModel()
            this.vaciarListas()
          })
        })
    }
    if(this.data.isEdit) {
      this.loading = true
      const data = {
        nombre: this.curso.nombre
      }

      if(this.obtenerGradosSeleccionados().length === 0) {
        this.snack.open('Debe seleccionar por lo menos 1 grado.', 'Cerrar', {
          duration: 3000
        })
        this.loading = false
        return
      }

      if(this.docentesXCurso.length === 0) {
        this.snack.open('Debe existir por lo menos 1 docente.', 'Cerrar', {
          duration: 3000
        })
        this.loading = false
        return
      }

      this.cursoService.modificarCurso(this.cursoId, data).subscribe(
        (data: any) => {
          this.loading = false
          Swal.fire('Curso modificado', 'El curso ha sido modificado con éxito', 'success').then(
            (e)=> {
              this.cursoService.listarCursos().subscribe(() => {})
              this.closeModel()
            }
          );
        }
      )
    }
  }

  closeModel() {
    this.dialogRef.close()
  }

}
