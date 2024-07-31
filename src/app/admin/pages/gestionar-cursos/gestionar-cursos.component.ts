import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TableComponent } from '../../../shared/components/table/table.component';
import { InputComponent } from '../../../shared/components/UI/input/input.component';
import { CursoService } from '../../../core/services/curso.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ModalCursoComponent } from '../../../shared/components/modal/modal-curso/modal-curso.component';

@Component({
  selector: 'app-gestionar-cursos',
  standalone: true,
  imports: [TableComponent, MatProgressBarModule, FormsModule, InputComponent, MatButtonModule],
  templateUrl: './gestionar-cursos.component.html',
  styleUrl: './gestionar-cursos.component.css'
})
export class GestionarCursosComponent {
  cursos = []
  curso = []
  trackByField = 'curso_id'
  loading = false
  loadedComplete: any
  searchTerm: string = '';

  columns = [
    { header: 'Nombre del Curso', field: 'nombre' }
  ];

  constructor(
    private cursoService: CursoService,
    public dialog: MatDialog
  ){}

  ngOnInit() {
    this.loading = true
    this.listarCursos()
  }

  listarCursos() {
    this.cursoService.listarCursos().subscribe(
      (data: any) => {
        this.cursos = data.sort((a: any, b: any) => {
          const nombreA = a.nombre.toLowerCase();
          const nombreB = b.nombre.toLowerCase();
          if (nombreA < nombreB) {
            return -1;
          }
          if (nombreA > nombreB) {
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

  displayedCursos() {
    return this.cursos.filter((curso: any) =>
      curso.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  agregarCurso() {
    const dialogRef = this.dialog.open(ModalCursoComponent, {
      data: {
        isCreate: true
      },
      width: '70%'
    })

    dialogRef.afterClosed().subscribe(
      (data) => {
        this.listarCursos()
      }
    )
  }
  
  editarCurso(isEdit: any, id: any) {
    this.loading = true
    if (isEdit) {
      this.cursoService.obtenerCurso(id).subscribe(
        (data: any) => {
          this.curso = data
          this.loading = false
          const dialogRef =  this.dialog.open(ModalCursoComponent, {
            data: {
              curso: this.curso,
              isEdit: isEdit
            },
            width: '70%'
          });

          dialogRef.afterClosed().subscribe(
            (data) => {
              this.listarCursos()
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

  eliminarCurso(isDeleted: any, id: any) {
    if(isDeleted){
      Swal.fire({
        title: 'Eliminar curso',
        text: '¿Estás seguro de eliminar al curso?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.loading = true
          this.cursoService.eliminarCurso(id).subscribe(
            (data) => {
              this.loading = false
              Swal.fire('Curso eliminado', 'El curso ha sido eliminado de la base de datos', 'success').then(
                (e)=> {
                  this.listarCursos()
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
}
