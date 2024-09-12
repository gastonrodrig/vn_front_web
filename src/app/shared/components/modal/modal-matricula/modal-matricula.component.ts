import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { SoloNumerosDirective } from '../../../directives/solo-numeros.directive';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DocumentoService } from '../../../../core/services/documento.service';
import { MatriculaService } from '../../../../core/services/matricula.service';
import Swal from 'sweetalert2';
import { listaMetodosPago } from '../../../constants/itemsPayment';

@Component({
  selector: 'app-modal-matricula',
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
  templateUrl: './modal-matricula.component.html',
  styleUrl: './modal-matricula.component.css'
})
export class ModalMatriculaComponent {
  tipoDocumento: any[] = []
  listaMetodosPago: any
  docente: any
  docenteId: any
  loading = false

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModalMatriculaComponent>,
    private snack: MatSnackBar,
    private tipoDocumentService: DocumentoService,
    private matriculaService: MatriculaService
  ) {}

  ngOnInit() {
    this.listaMetodosPago = listaMetodosPago
    this.docente = {
      nombre: '',
      apellido: '',
      direccion: '',
      numero_documento: '',
      documento: {
        _id: ''
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
      documento_id : this.docente.documento._id,
    }

    if(dataDocente.nombre === '') {
      this.snack.open('El nombre del docente es requerido', '', {
        duration: 3000
      })
      this.loading = false
      return
    }

    this.matriculaService.agregarMatricula(dataDocente).subscribe(
      (data) => {
        this.loading = false
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

  closeModel() {
    this.dialogRef.close()
  }
}
