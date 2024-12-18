import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DocumentoService } from '../../../../core/services/documento.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { SoloNumerosDirective } from '../../../directives/solo-numeros.directive';
import { ApoderadoService } from '../../../../core/services/apoderado.service';
import Swal from 'sweetalert2';
import e from 'express';

@Component({
  selector: 'app-modal-apoderado',
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
  templateUrl: './modal-apoderado.component.html',
  styleUrl: './modal-apoderado.component.css'
})
export class ModalApoderadoComponent {
  apoderadoList: any[] = this.loadFromLocalStorage() || []
  tipoDocumento: any[] = []
  loading = false
  estudiante: any
  apoderadoId: any
  estudianteId: any

  apoderado = {
    nombre: '',
    apellido: '',
    numero: '',
    direccion: '',
    numero_documento: '',
    documento: {
      _id: ''
    },
    estudiante_id: '',
    correo: ''
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<ModalApoderadoComponent>,
    private snack: MatSnackBar,
    private tipoDocumentService: DocumentoService,
    private apoderadoService: ApoderadoService
  ) {
    dialogRef.disableClose = true
  }

  ngOnInit() {
    this.tipoDocumentService.listarTiposDocumento().subscribe(
      (data: any) => {
        this.tipoDocumento = data
      },
      (error) => {
        console.log(error)
      }
    )

    if(this.data.isEdit) {
      this.estudianteId = this.data.estudiante_id
      this.apoderadoId = this.data.apoderado_id
      this.apoderadoService.obtenerApoderado(this.apoderadoId).subscribe(
        (data: any) => {
          this.apoderado = data
        },
        (error) => {
          console.log(error)
        }
      )
    } else {
      this.estudiante = this.data.estudiante
      this.apoderado.estudiante_id = this.estudiante._id
    }
  }

  agregarApoderado() {
      // Si todas las validaciones pasan, se crea el nuevo apoderado
    const nuevoApoderado = { 
      ...this.apoderado, 
      _id: this.generarIdUnico()
    };
    this.apoderadoList.push(nuevoApoderado)
    this.saveToLocalStorage()
    this.apoderado = {
      nombre: '',
      apellido: '',
      numero: '',
      direccion: '',
      numero_documento: '',
      documento: {
        _id: ''
      },
      estudiante_id: this.estudiante._id,
      correo: ''
    };
  }

  generarIdUnico(): string {
    return Math.random().toString(36).substr(2, 9)
  }

  guardarInformacion() {
  if (this.apoderadoList.length === 0){
   if (!isNaN(Number(this.apoderado.nombre))) {
    this.snack.open('El nombre debe contener solo letras', '', {
      duration: 3000
    });
    this.loading = false;
    return;
  }

  // VALIDACIÓN APELLIDO (debe contener solo letras)
  if (!isNaN(Number(this.apoderado.apellido))) {
    this.snack.open('El apellido debe contener solo letras', '', {
      duration: 3000
    });
    this.loading = false;
    return;
  }

  // VALIDACIÓN TIPO DE DOCUMENTO (debe estar seleccionado)
  if (!this.apoderado.documento._id) {
    this.snack.open('Debe seleccionar un tipo de documento', '', {
      duration: 3000
    });
    this.loading = false;
    return;
  }

  // VALIDACIÓN NÚMERO DE DOCUMENTO (debe ser de 8 dígitos)
  if (this.apoderado.numero_documento.length !== 8) {
    this.snack.open('El número de documento debe tener 8 dígitos', '', {
      duration: 3000
    });
    this.loading = false;
    return;
  }

  // VALIDACIÓN TELÉFONO (debe ser de 9 dígitos)
  if (this.apoderado.numero.length !== 9) {
    this.snack.open('El número de teléfono debe tener 9 dígitos', '', {
      duration: 3000
    });
    this.loading = false;
    return;
  }
}

    if(this.data.isCreate) {
      if (this.apoderadoList.length < 1) {
        this.snack.open('Debe incluir como mínimo 1 apoderado', 'Cerrar', {
          duration: 3000
        })
        return
      } 
      this.loading = true
      this.apoderadoList.forEach((e) => {
        const apoderado = {
          nombre: e.nombre,
          apellido: e.apellido,
          numero: e.numero,
          direccion: e.direccion,
          numero_documento: e.numero_documento,
          documento_id: e.documento._id,
          estudiante_id: e.estudiante_id,
          correo: e.correo
        }
    
        this.apoderadoService.agregarApoderado(apoderado).subscribe(
          (data: any) => {
            this.loading = false
            Swal.fire('Apoderado(s) gregados', 'Los apoderados del estudiante han sido registrados con exito', 'success').then(
              (e)=> {
                this.vaciarApoderadoList()
                this.closeModel()
              }
            )
          },
          (error) => {
            this.loading = false
            Swal.fire('Error', 'Error al cargar los datos', 'error')
            console.log(error)
          }
        )
      })
    }

    if(this.data.isCreateOnEdit) {
      const apoderado = {
        nombre: this.apoderado.nombre,
        apellido: this.apoderado.apellido,
        numero: this.apoderado.numero,
        direccion: this.apoderado.direccion,
        numero_documento: this.apoderado.numero_documento,
        documento_id: this.apoderado.documento._id,
        estudiante_id: this.apoderado.estudiante_id,
        correo: this.apoderado.correo
      }
      
      this.loading = true
      this.apoderadoService.agregarApoderado(apoderado).subscribe(
        (data: any) => {
          this.loading = false
          Swal.fire('Apoderado agregado', 'El apoderado ha sido registrado con exito', 'success')
          this.closeModel()
        },
        (error) => {
          Swal.fire('Error', 'Error al cargar los datos', 'error')
          console.log(error)
        }
      )
    }

    if(this.data.isEdit) {
      const apoderado = {
        nombre: this.apoderado.nombre,
        apellido: this.apoderado.apellido,
        numero: this.apoderado.numero,
        direccion: this.apoderado.direccion,
        numero_documento: this.apoderado.numero_documento,
        documento_id: this.apoderado.documento._id,
        estudiante_id: this.data.estudiante_id,
        correo: this.apoderado.correo
      }
      if (!isNaN(Number(this.apoderado.nombre))) {
        this.snack.open('El nombre debe contener solo letras', '', {
          duration: 3000
        });
        this.loading = false;
        return;
      }
    
      // VALIDACIÓN APELLIDO (debe contener solo letras)
      if (!isNaN(Number(this.apoderado.apellido))) {
        this.snack.open('El apellido debe contener solo letras', '', {
          duration: 3000
        });
        this.loading = false;
        return;
      }
    
      // VALIDACIÓN TIPO DE DOCUMENTO (debe estar seleccionado)
      if (!this.apoderado.documento._id) {
        this.snack.open('Debe seleccionar un tipo de documento', '', {
          duration: 3000
        });
        this.loading = false;
        return;
      }
    
      // VALIDACIÓN NÚMERO DE DOCUMENTO (debe ser  de 8 dígitos)
      if (this.apoderado.numero_documento.length !== 8) {
        this.snack.open('El número de documento debe tener 8 dígitos', '', {
          duration: 3000
        });
        this.loading = false;
        return;
      }
    
      // VALIDACIÓN TELÉFONO (debe ser numérico y de 9 dígitos)
      if (this.apoderado.numero.length !== 9) {
        this.snack.open('El número de teléfono debe tener 9 dígitos', '', {
          duration: 3000
        });
        this.loading = false;
        return;
      }
      this.loading = true
      this.apoderadoService.modificarApoderado(this.apoderadoId, apoderado).subscribe(
        (data) => {
          this.loading = false
          Swal.fire('Apoderado modificado', 'El apoderado ha sido modificado con éxito', 'success').then(
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

  eliminarApoderado(apoderado_id: any) {
    this.apoderadoList = this.apoderadoList.filter(a => a._id !== apoderado_id)
    this.saveToLocalStorage()
    this.snack.open('Apoderado eliminado', 'Cerrar', {
       duration: 3000 
    })
  }

  vaciarApoderadoList() {
    this.apoderadoList = []
    this.saveToLocalStorage()
  }

  saveToLocalStorage() {
    localStorage.setItem('apoderadoList', JSON.stringify(this.apoderadoList))
  }

  loadFromLocalStorage() {
    const storedList = localStorage.getItem('apoderadoList')
    return storedList ? JSON.parse(storedList) : []
  }

  closeModel() {
    this.dialogRef.close()
  }
}
