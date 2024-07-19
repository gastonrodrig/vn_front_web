import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { SoloNumerosDirective } from '../../../directives/solo-numeros.directive';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DocenteService } from '../../../../core/services/admin/docente.service';
import { DocumentoService } from '../../../../core/services/admin/documento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-docente',
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
    MatProgressBarModule
  ],
  templateUrl: './modal-docente.component.html',
  styleUrl: './modal-docente.component.css'
})
export class ModalDocenteComponent {
  tipoDocumento: any[] = []
  docente: any
  docenteId: any
  loading = false

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModalDocenteComponent>,
    private snack: MatSnackBar,
    private tipoDocumentService: DocumentoService,
    private docenteService: DocenteService
  ) {}

  ngOnInit() {
    if (this.data.isEdit) {
      console.log(this.data)
      this.docente = this.data.docente;
      this.docenteId = this.data.docente.docente_id

    } else {
      this.docente = {
        nombre: '',
        apellido: '',
        direccion: '',
        numero_documento: '',
        documento: {
          documento_id: ''
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
  }

  guardarInformacion() {
    this.loading = true
    const dataDocente = {
      nombre : this.docente.nombre,
      apellido : this.docente.apellido,
      direccion : this.docente.direccion,
      telefono : this.docente.telefono,
      numero_documento : this.docente.numero_documento,
      documento_id : this.docente.documento.documento_id,
      
    }

    if(dataDocente.nombre === '') {
      this.snack.open('El nombre del docente es requerido', '', {
        duration: 3000
      })
      this.loading = false
      return
    }

    if(this.data.isCreate) {
      this.docenteService.agregarDocente(dataDocente).subscribe(
        (data) => {
          Swal.fire('Docente guardado', 'El docente ha sido guardado con éxito', 'success').then(
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

    if(this.data.isEdit) {
      this.docenteService.modificarDocente(this.docenteId, dataDocente).subscribe(
        (data) => {
          this.loading = false
          Swal.fire('Docente modificado', 'El docente ha sido modificado con éxito', 'success').then(
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

  closeModel() {
    this.dialogRef.close()
  }

}
