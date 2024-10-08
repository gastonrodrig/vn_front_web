import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { SoloNumerosDirective } from '../../../directives/solo-numeros.directive';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../../core/services/user.service';
import { EstudianteService } from '../../../../core/services/estudiante.service';
import { listaRoles } from '../../../constants/itemsRols';
import { of } from 'rxjs';
import { ModalCambiarContraComponent } from '../modal-cambiar-contra/modal-cambiar-contra.component';
import { TutorService } from '../../../../core/services/tutor.service';
import Swal from 'sweetalert2';
import { error } from 'console';

@Component({
  selector: 'app-modal-usuario',
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
  templateUrl: './modal-usuario.component.html',
  styleUrl: './modal-usuario.component.css'
})
export class ModalUsuarioComponent {
  usuario: any
  usuarioId: any
  loading = false
  roles = listaRoles

  estudiantes = []
  tutores = []

  nombreCompleto = ''
  estudianteId = ''
  tutorId = ''

  rol = ''
  searchTerm = ''
  hide = true
  perfilRemovido = false

  dni = ''

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModalUsuarioComponent>,
    public dialog: MatDialog,
    private snack: MatSnackBar,
    private userService: UserService,
    private estudianteService: EstudianteService,
    private tutorService: TutorService
  ) {
    dialogRef.disableClose = true
  }

  ngOnInit() {
    if (this.data.isEdit) {
      this.usuario = this.data.usuario
      this.usuarioId = this.data.usuario._id

      this.usuario.perfil_id = this.usuario.perfil
      delete this.usuario.perfil

      if(this.usuario.rol === 'Estudiante') {
        this.estudianteService.obtenerEstudiante(this.usuario.perfil_id).subscribe(
          (data: any) => {
            this.dni = data.numero_documento
            this.nombreCompleto = `${data.apellido}, ${data.nombre}`
          }
        )
      }

      if(this.usuario.rol === 'Tutor') {
        this.tutorService.obtenerTutor(this.usuario.perfil_id).subscribe(
          (data: any) => {
            this.dni = data.numero_documento
            this.nombreCompleto = `${data.apellido}, ${data.nombre}`
          }
        )
      }
      
    } else {
      this.usuario = {
        usuario: '',
        email: '',
        contrasena: '',
        rol: ''
      }
    }
  }

  inputText() {
    return this.searchTerm !== '';
  }

  displayedByRol(rol: any) {
    return rol.filter((e: any) =>
      e.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      e.apellido.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      e.numero_documento.includes(this.searchTerm)
    );
  }

  cambiarContrasenia() {
    this.dialog.open(ModalCambiarContraComponent, {
      data: {
        user: this.data
      },
      width: '35%'
    })
  }

  guardarInformacion() {
    this.loading = true
  
    this.usuario.perfil_id = this.obtenerPerfilId()
  
    if (this.usuario.usuario.length === 0) {
      this.mostrarMensaje('El nombre del usuario es requerido')
      return
    }
  
    if (this.usuario.email.length === 0) {
      this.mostrarMensaje('El email del usuario es requerido')
      return
    }
  
    if (this.data.isCreate && this.usuario.contrasena.length === 0) {
      this.mostrarMensaje('La contraseña del usuario es requerida')
      return
    }
  
    if (this.usuario.rol.length === 0) {
      this.mostrarMensaje('El rol del usuario es requerido')
      return
    }
  
    if (this.usuario.rol !== 'Admin' && (this.nombreCompleto.length === 0 || this.dni.length !== 8)) {
      this.mostrarMensaje('El perfil del usuario es requerido')
      return
    }
  
    if (this.data.isCreate) {
      this.userService.agregarUsuario(this.usuario).subscribe(
        (data: any) => {
          Swal.fire('Usuario agregado', 'El usuario ha sido agregado con éxito', 'success').then(() => {
            this.closeModel()
            this.asignarPerfil({ user_id: data._id })
          })
        },
        (error) => {
          this.mostrarMensaje(error.error.message)
          console.error(error)
          this.loading = false
        }
      )
    }
  
    if (this.data.isEdit) {
      delete this.usuario.contrasena;
      delete this.usuario._id;
      delete this.usuario.estado;
      delete this.usuario.__v;

      this.userService.modificarUsuario(this.usuarioId, this.usuario).subscribe(
        (data: any) => {
          Swal.fire('Usuario modificado', 'El usuario ha sido modificado con éxito', 'success').then(() => {
            this.closeModel()
            const dataUsuario = { user_id: this.usuarioId }
            this.asignarPerfil(dataUsuario)
          })
        },
        (error) => {
          this.mostrarMensaje(error.error.message)
          console.error(error)
          this.loading = false
        }
      )
    }
  }

  obtenerPerfilId() {
    switch (this.usuario.rol) {
      case 'Estudiante':
        return this.estudianteId || this.usuario.perfil_id;
      case 'Tutor':
        return this.tutorId || this.usuario.perfil_id;
      case 'Admin':
        return null;
      default:
        return this.usuario.perfil_id;
    }
  }
  
  asignarPerfil(dataUsuario: any) {
    switch (this.usuario.rol) {
      case 'Estudiante':
        return this.estudianteService.asignarUsuario(this.estudianteId, dataUsuario).subscribe(
          () => { this.loading = false }
        )
      case 'Tutor':
        return this.tutorService.asignarUsuario(this.tutorId, dataUsuario).subscribe(
          () => { this.loading = false }
        )
      case 'Admin':
        this.loading = false
        return of(null);
      default:
        this.loading = false
        return of(null);
    }
  }

  validarDNI(dni: string) {
    if (dni.length === 8) {
      this.loading = true
  
      if(this.usuario.rol === 'Estudiante') {
        this.estudianteService.obtenerEstudiantePorNroDoc(dni, true).subscribe(
          (data: any) => {
            this.loading = false
            this.nombreCompleto = `${data.apellido}, ${data.nombre}`
            this.estudianteId = data._id
          },
          (error) => {
            this.mostrarMensaje(error.error.message)
            console.error(error)
            this.loading = false
          }
        )
      }

      if(this.usuario.rol === 'Tutor') {
        this.tutorService.obtenerTutorPorNroDoc(dni, true).subscribe(
          (data: any) => {
            this.loading = false
            this.nombreCompleto = `${data.apellido}, ${data.nombre}`
            this.tutorId = data._id
          },
          (error) => {
            this.mostrarMensaje(error.error.message)
            console.error(error)
            this.loading = false
          }
        )
      }
    } else {
      this.nombreCompleto = ''
    }
  }
  
  cambioRol() {
    if(this.data.isCreate) {
      this.nombreCompleto = ''
      this.dni = ''
      this.estudianteId = ''
      this.tutorId = ''
    }
    if(this.data.isEdit) {
      this.cambiarAsignacion()
      this.nombreCompleto = ''
      this.dni = ''
      this.loading = false
    }
  }

  cambiarAsignacion() {
    this.loading = true
    this.perfilRemovido = true
    if(this.usuario.rol === 'Estudiante') {
      this.estudianteService.eliminarUsuario(this.usuario.perfil_id).subscribe(
        (data: any) => { 
          this.dni = ''
          this.nombreCompleto = ''
          this.userService.eliminarPerfil(this.usuarioId).subscribe(
            (data: any) => {
              this.loading = false
            }
          )
        }
      )
    }
    if(this.usuario.rol === 'Tutor') {
      this.tutorService.eliminarUsuario(this.usuario.perfil_id).subscribe(
        (data: any) => { 
          this.dni = ''
          this.nombreCompleto = ''
          this.userService.eliminarPerfil(this.usuarioId).subscribe(
            (data: any) => {
              this.loading = false
            }
          )
        }
      )
    }
  }

  mostrarMensaje(mensaje: string) {
    this.snack.open(mensaje, 'Cerrar', {
      duration: 3000,
    })
    this.loading = false
  }

  closeModel() {
    this.dialogRef.close()
  }
}