import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { SoloNumerosDirective } from '../../../directives/solo-numeros.directive';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DocenteService } from '../../../../core/services/docente.service';
import { DocumentoService } from '../../../../core/services/documento.service';
import Swal from 'sweetalert2';
import { UserService } from '../../../../core/services/user.service';

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
    MatProgressBarModule,
    MatIconModule
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
    private docenteService: DocenteService,
    private userService: UserService
  ) {}

  ngOnInit() {
    if (this.data.isEdit) {
      console.log(this.data)
      this.docente = this.data.docente;
      this.docenteId = this.data.docente._id

    } else {
      console.log(this.data)
      this.docente = {
        nombre: '',
        apellido: '',
        direccion: '',
        numero_documento: '',
        documento: {
          _id: ''
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
      documento_id : this.docente.documento._id,
      
    }
    //VALIDACIONES 
    if(!isNaN(dataDocente.nombre)) {
      this.snack.open('El nombre tiene que ser en letras', '', {
        duration: 3000
      })
      this.loading = false
      return
    }
    if(!isNaN(dataDocente.apellido)) {
      this.snack.open('El apellido tiene que ser en letras', '', {
        duration: 3000
      })
      this.loading = false
      return
    }
     //validacion documento 
     if (!this.docente.documento._id) {
      this.snack.open('Tiene que elegir un tipo de Documento', '', {
        duration: 3000
      });
      this.loading = false;
      return;
    }
      
    if(dataDocente.numero_documento.length !== 8) {
      this.snack.open('El Numero de Documento tiene que de 8 digitos', '', {
        duration: 3000
      })
      this.loading = false
      return
    }

    if(dataDocente.telefono.length !== 9) {
      this.snack.open('El telefono tiene que ser de 9 digitos', '', {
        duration: 3000
      })
      this.loading = false
      return
    }
    //VALIDACIONES TERMINADA

    if(dataDocente.nombre === '') {
      this.snack.open('El nombre del docente es requerido', '', {
        duration: 3000
      })
      this.loading = false
      return
    }

    if(this.data.isCreate) {
      this.docenteService.agregarDocente(dataDocente).subscribe(
        (data:any) => {
          this.loading = false
          Swal.fire('Docente guardado', 'El docente ha sido guardado con éxito', 'success').then(
            (e)=> {
              this.closeModel()
            }
          );
  // Asignar el ID del tutor desde la respuesta del servidor
  const docenteId = data._id; // Suponiendo que el backend te devuelve el ID del tutor
  
  const newdataUser = {
    usuario: this.docente.numero_documento,
    email: this.docente.numero_documento + '@vn.com',
    contrasena: '1111111',
    rol: 'Docente',
    perfil_id: docenteId, // Aquí utilizamos el tutorId de la respuesta
  };
  this.userService.agregarUsuario(newdataUser).subscribe(
    (data) => {
      console.log('Usuario creado con éxito', data);
    },
    (error) => {
      console.log('Error al crear el usuario', error);
    }
       );  
        },
        (error) => {
          this.snack.open(error.error.message, 'cerrar', {
            duration: 3000
          });
          this.loading = false;
          console.log('Error al crear el Docente:', error);
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
