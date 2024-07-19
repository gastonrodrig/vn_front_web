import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DocumentoService } from '../../../../core/services/documento.service';
import { SoloNumerosDirective } from '../../../directives/solo-numeros.directive';
import { ApoderadoService } from '../../../../core/services/apoderado.service';
import { SeccionService } from '../../../../core/services/seccion.service';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { EstudianteService } from '../../../../core/services/estudiante.service';
import { ModalApoderadoComponent } from '../modal-apoderado/modal-apoderado.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-estudiante',
  standalone: true,
  imports: [
    MatDialogModule, 
    SoloNumerosDirective, 
    MatFormFieldModule, 
    MatInputModule, 
    FormsModule, 
    MatSelectModule, 
    MatButtonModule, 
    CommonModule, 
    MatProgressBarModule,
    MatIconModule
  ],
  templateUrl: './modal-estudiante.component.html',
  styleUrl: './modal-estudiante.component.css'
})
export class ModalEstudianteComponent {
  tipoDocumento: any[] = []
  seccion: any[] = []
  estudiante: any
  estudianteId: any
  apoderadoList: any[] = []
  loading = false

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<ModalEstudianteComponent>,
    private snack: MatSnackBar,
    private tipoDocumentService: DocumentoService,
    private apoderadoService: ApoderadoService,
    private seccionService: SeccionService,
    private estudianteService: EstudianteService
  ) {
    dialogRef.disableClose = true
  }

  ngOnInit() {
    if (this.data.isEdit) {
      this.estudiante = this.data.estudiante
      this.estudianteId = this.data.estudiante.estudiante_id
      this.loading = true
      this.apoderadoService.listarApoderadosPorEstudiante(this.estudianteId).subscribe(
        (data: any) => {
          this.loading = false
          this.apoderadoList = data
        },
        (error) => {
          console.log(error)
        }
      )
    } else {
      this.estudiante = {
        nombre: '',
        apellido: '',
        direccion: '',
        numero_documento: '',
        documento: {
          documento_id: ''
        },
        seccion: {
          seccion_id: ''
        }
      }
    }
    this.tipoDocumentService.listarTiposDocumento().subscribe(
      (data: any) => {
        this.tipoDocumento = data
      },
      (error) => {
        console.log(error)
      },
    )
    this.seccionService.listarSecciones().subscribe(
      (data: any) => {
        this.seccion = data
      },
      (error) => {
        console.log(error)
      }
    )
  }

  guardarInformacion() {
    this.loading = true
    const dataEstudiante = {
      nombre : this.estudiante.nombre,
      apellido : this.estudiante.apellido,
      direccion : this.estudiante.direccion,
      numero_documento : this.estudiante.numero_documento,
      documento_id : this.estudiante.documento.documento_id,
      seccion_id : this.estudiante.seccion.seccion_id
    }

    if(dataEstudiante.nombre === '') {
      this.snack.open('El nombre del estudiante es requerido', 'Cerrar', {
        duration: 3000
      })
      this.loading = false
      return
    }

    if(this.data.isCreate) {
      this.estudianteService.agregarEstudiante(dataEstudiante).subscribe(
        (data) => {
          Swal.fire('Estudiante guardado', 'El estudiante ha sido guardado con éxito', 'success').then(
            (e)=> {
              this.closeModel()
              this.dialog.open(ModalApoderadoComponent, {
                data: {
                  estudiante: data,
                  isCreate: true
                },
                width: '70%'
              });
            }
          );
        },
        (error) => {
          console.log(error)
        }
      )
    }

    if(this.data.isEdit) {
      if (this.apoderadoList.length < 1) {
        this.snack.open('Debe incluir como mínimo 1 apoderado', 'Cerrar', {
          duration: 3000
        })
        this.loading = false
        return
      }
      this.estudianteService.modificarEstudiante(this.estudianteId, dataEstudiante).subscribe(
        (data) => {
          this.loading = false
          Swal.fire('Estudiante modificado', 'El estudiante ha sido modificado con éxito', 'success').then(
            (e)=> {
              this.closeModel()
            }
          );
        },
        (error) => {
          console.log(error)
        }
      )
    }
  }

  agregarApoderado() {
    const dialogRef = this.dialog.open(ModalApoderadoComponent, {
      data: {
        estudiante: this.estudiante,
        isCreateOnEdit: true
      },
      width: '70%'
    })

    dialogRef.afterClosed().subscribe(
      (data) => {
        this.apoderadoService.listarApoderadosPorEstudiante(this.estudianteId).subscribe(
          (data: any) => { this.apoderadoList = data }
        )
      }
    )
  }

  editarApoderado(id: any) {
    const dialogRef = this.dialog.open(ModalApoderadoComponent, {
      data: {
        apoderado_id: id,
        estudiante_id: this.data.estudiante.estudiante_id,
        isEdit: true
      },
      width: '70%'
    })

    dialogRef.afterClosed().subscribe(
      (data) => {
        this.apoderadoService.listarApoderadosPorEstudiante(this.estudianteId).subscribe(
          (data: any) => { this.apoderadoList = data }
        )
      }
    )
  }

  eliminarApoderado(id: any) {
    Swal.fire({
      title: 'Eliminar apoderado',
      text: '¿Estás seguro de eliminar al apoderado?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true
        this.apoderadoService.eliminarApoderado(id).subscribe(
          (data: any) => {
            this.apoderadoService.listarApoderadosPorEstudiante(this.estudianteId).subscribe(
              (data: any) => { this.apoderadoList = data }
            )
            this.snack.open('El apoderado ha sido eliminado con éxito', 'Cerrar', {
              duration: 3000
            })
            this.loading = false
          },
          (error) => {
            console.log(error)
          }
        )
      }
    });
  }

  closeModel() {
    this.dialogRef.close()
  }
  
}