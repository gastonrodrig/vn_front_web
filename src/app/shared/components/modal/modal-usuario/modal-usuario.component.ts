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
import { DocenteService } from '../../../../core/services/docente.service';
import { ApoderadoService } from '../../../../core/services/apoderado.service';
import { listaRoles } from '../../../constants/itemsRols';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { ModalCambiarContraComponent } from '../modal-cambiar-contra/modal-cambiar-contra.component';

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
  docentes = []
  apoderados = []

  rol = ''
  searchTerm = ''
  listLoaded = false
  showResults = false
  personSelected = false
  changeOnEdit = false
  hide = true

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModalUsuarioComponent>,
    public dialog: MatDialog,
    private snack: MatSnackBar,
    private userService: UserService,
    private estudianteService: EstudianteService,
    private docenteService: DocenteService,
    private apoderadoService: ApoderadoService
  ) {
    dialogRef.disableClose = true
  }

  ngOnInit() {
    if (this.data.isEdit) {
      this.usuario = this.data.usuario
      this.usuarioId = this.data.usuario.usuario_id

      const rol = this.data.usuario.rol
      if (rol === 'Estudiante' || rol === 'Docente' || rol === 'Apoderado') {
        const entity = this.data.usuario[rol.toLowerCase()]
        console.log(entity)
        if (entity) {
          this.searchTerm = `${entity.nombre} ${entity.apellido} (Nro.Documento: ${entity.numero_documento})`
        }
      }

      this.changeOnEdit = true

    } else {
      this.usuario = {
        nombres_usuario: '',
        email_usuario: '',
        contrasena_usuario: '',
        rol: '',
        estudiante: {
          estudiante_id: ''
        },
        docente: {
          docente_id: ''
        },
        apoderado: {
          apoderado_id: ''
        }
      }
    }
  }

  listarEstudiantes() {
    this.estudianteService.listarEstudiantes().subscribe(
      (data: any) => {
        this.estudiantes = this.ordenarPorApellido(data)
      },
      (error) => {
        console.log(error)
      }
    )
  }

  listarDocentes() {
    this.docenteService.listarDocentes().subscribe(
      (data: any) => {
        this.docentes =  this.ordenarPorApellido(data)
      },
      (error) => {
        console.log(error)
      }
    )
  }

  listarApoderados() {
    this.apoderadoService.listarApoderados().subscribe(
      (data: any) => {
        this.apoderados = this.ordenarPorApellido(data)
      },
      (error) => {
        console.log(error)
      }
    )
  }

  ordenarPorApellido(data: any) {
    return data.sort((a: any, b: any) => {
      if (a.apellido.toLowerCase() < b.apellido.toLowerCase()) {
        return -1;
      }
      if (a.apellido.toLowerCase() > b.apellido.toLowerCase()) {
        return 1;
      }
      return 0;
    });
  }

  listar() {
    if(this.usuario.rol === 'Estudiante') {
      this.listarEstudiantes()
    }
    if(this.usuario.rol === 'Docente') {
      this.listarDocentes()
    }
    if(this.usuario.rol === 'Apoderado') {
      this.listarApoderados()
    }
    this.listLoaded = true
  }

  inputText() {
    return this.searchTerm !== '';
  }


  usuarioSinReferencia() {
    return (this.usuario.estudiante?.estudiante_id ?? '') !== '' || 
           (this.usuario.docente?.docente_id ?? '') !== '' || 
           (this.usuario.apoderado?.apoderado_id ?? '') !== ''
  }

  displayedByRol(rol: any) {
    return rol.filter((e: any) =>
      e.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      e.apellido.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      e.numero_documento.includes(this.searchTerm)
    );
  }

  placeholderText(): string {
    const placeholders: { [key: string]: string } = {
      Estudiante: 'Buscar estudiante por nombre, apellido o número de documento',
      Docente: 'Buscar docente por nombre, apellido o número de documento',
      Apoderado: 'Buscar apoderado por nombre, apellido o número de documento'
    }
    return placeholders[this.usuario.rol]
  }

  asignarUsuarioPorRol(rol: string, id: any) {
    this.loading = true
    const data = {
      usuario_id: Number(this.usuarioId)
    }
  
    let servicio$: Observable<any>
  
    switch (rol) {
      case 'Estudiante':
        servicio$ = this.estudianteService.asignarUsuario(id, data)
        break
      case 'Docente':
        servicio$ = this.docenteService.asignarUsuario(id, data)
        break
      case 'Apoderado':
        servicio$ = this.apoderadoService.asignarUsuario(id, data)
        break
      default:
        console.error('Rol no válido')
        return
    }
  
    servicio$.subscribe(
      (data: any) => {
        this.loading = false
        if(this.data.isCreate) {
          Swal.fire('Usuario agregado', 'El usuario ha sido agregado con éxito.', 'success').then(
            () => {
              this.closeModel()
            }
          )
        }
        if(this.data.isEdit) {
          Swal.fire('Usuario modificado', 'El usuario ha sido modificado con éxito.', 'success').then(
            () => {
              this.closeModel()
            }
          )
        }
      }
    )
  }

  asignarUsuarioData(id: any) {
    this.loading = true
    this.usuario = {
      nombres_usuario: this.usuario.nombres_usuario,
      email_usuario: this.usuario.email_usuario,
      rol: this.usuario.rol,
      contrasena_usuario: this.usuario.contrasena_usuario,
      estudiante: {
        estudiante_id: ''
      },
      docente: {
        docente_id: ''
      },
      apoderado: {
        apoderado_id: ''
      }
    }
    if(this.usuario.rol === 'Estudiante') {
      this.estudianteService.obtenerEstudiante(id).subscribe(
        (data: any) => {
          this.loading = false
          this.usuario.estudiante.estudiante_id = id
          this.searchTerm = `${data.nombre} ${data.apellido} (Nro.Documento: ${data.numero_documento})`
          this.showResults = false
          this.personSelected = true
          this.changeOnEdit = false
        }
      )
    }
    if(this.usuario.rol === 'Docente') {
      this.docenteService.obtenerDocente(id).subscribe(
        (data: any) => {
          this.loading = false
          this.usuario.docente.docente_id = id
          this.searchTerm = `${data.nombre} ${data.apellido} (Nro.Documento: ${data.numero_documento})`
          this.showResults = false
          this.personSelected = true
        }
      )
    }
    if(this.usuario.rol === 'Apoderado') {
      this.apoderadoService.obtenerApoderado(id).subscribe(
        (data: any) => {
          this.loading = false
          this.usuario.apoderado.apoderado_id = id
          this.searchTerm = `${data.nombre} ${data.apellido} (Nro.Documento: ${data.numero_documento})`
          this.showResults = false
          this.personSelected = true
        }
      )
    }
  }

  quitarPersona() {
    if(this.data.isCreate) {
      this.searchTerm = ''
      this.usuario.estudiante.estudiante_id = ''
      this.usuario.docente.docente_id = ''
      this.usuario.apoderado.apoderado_id = ''
      this.personSelected = false
    }
    if(this.data.isEdit) {
      if(this.usuario.rol === 'Estudiante') {
        const estudianteId = this.usuario.estudiante.estudiante_id
        this.loading = true
        this.userService.eliminarEstudianteDeUsuario(this.usuarioId).subscribe(
          (data: any) => {
            this.estudianteService.eliminarUsuario(estudianteId).subscribe(
              (data: any) => {
                this.loading = false
                !this.usuarioSinReferencia() 
                this.usuario.estudiante.estudiante_id = ''
                this.personSelected = false
                this.usuario.rol = 'Admin'
                this.searchTerm = ''
                this.changeOnEdit = false
                this.snack.open('Usuario removido del estudiante.', 'Cerrar', {
                  duration: 3000
                })
              }
            )
          }
        )
      }
      if(this.usuario.rol === 'Docente') {
        const docenteId = this.usuario.docente.docente_id
        this.loading = true
        this.userService.eliminarDocenteDeUsuario(this.usuarioId).subscribe(
          (data: any) => {
            this.docenteService.eliminarUsuario(docenteId).subscribe(
              (data: any) => {
                this.loading = false
                !this.usuarioSinReferencia() 
                this.usuario.docente.docente_id = ''
                this.personSelected = false
                this.usuario.rol = 'Admin'
                this.searchTerm = ''
                this.changeOnEdit = false
                this.snack.open('Usuario removido del docente.', 'Cerrar', {
                  duration: 3000
                })
              }
            )
          }
        )
      }
      if(this.usuario.rol === 'Apoderado') {
        const apoderadoId = this.usuario.apoderado.apoderado_id
        this.loading = true
        this.userService.eliminarApoderadoDeUsuario(this.usuarioId).subscribe(
          (data: any) => {
            this.apoderadoService.eliminarUsuario(apoderadoId).subscribe(
              (data: any) => {
                this.loading = false
                !this.usuarioSinReferencia() 
                this.usuario.apoderado.apoderado_id = ''
                this.personSelected = false
                this.usuario.rol = 'Admin'
                this.searchTerm = ''
                this.changeOnEdit = false
                this.snack.open('Usuario removido del apoderado.', 'Cerrar', {
                  duration: 3000
                })
              }
            )
          }
        )
      }
    }
  }
  rolSeleccionado: boolean = false;

  onRolChange(rol: string) {
    this.rolSeleccionado = !!rol;
  }
  guardarInformacion() {
    this.loading = true
    if(this.data.isCreate) {
      const userData = {
        nombres_usuario: this.usuario.nombres_usuario,
        email_usuario: this.usuario.email_usuario,
        contrasena_usuario: this.usuario.contrasena_usuario,
        rol: this.usuario.rol,
        estudiante_id: Number(this.usuario?.estudiante?.estudiante_id),
        docente_id: Number(this.usuario?.docente?.docente_id),
        apoderado_id: Number(this.usuario?.apoderado?.apoderado_id)
      }

      switch (this.usuario.rol) {
        case 'Estudiante':
          userData.estudiante_id = this.usuario.estudiante._id
          break
        case 'Docente':
          userData.docente_id = this.usuario.docente._id
          break
        case 'Apoderado':
          userData.apoderado_id = this.usuario.apoderado._id
          break
        case 'Admin':
          // No se necesita hacer cambios adicionales para Admin
          break
        default:
          console.error('Rol desconocido:', this.usuario.rol)
          this.loading = false
          return
      }
  
          // Validaciones
      if (!userData.nombres_usuario && !userData.rol && !userData.email_usuario && !userData.contrasena_usuario) {
        Swal.fire('Error', 'Todos los campos deben ser completados.', 'error');
        this.loading = false;
        return;
      }

      // Validación de nombre (no puede contener números)
      if (/\d/.test(this.usuario.nombres_usuario)) {
        Swal.fire('Error', 'El nombre no puede contener números.', 'error');
        this.loading = false;
        return;
      }

      // Validación de correo (debe ser una dirección de correo electrónico válida)
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(this.usuario.email_usuario)) {
        Swal.fire('Error', 'El correo electrónico no es válido.', 'error');
        this.loading = false;
        return;
      }

      // Validación de contraseña (no puede estar vacía)
      if (!this.usuario.contrasena_usuario) {
        Swal.fire('Error', 'La contraseña no puede estar vacía.', 'error');
        this.loading = false;
        return;
      }

      

      this.userService.agregarUsuario(userData).subscribe(
        (data: any) => {
          this.usuarioId = data.usuario_id
          if(data.rol === 'Admin') {
            this.loading = false
            Swal.fire('Usuario agregado', 'El usuario ha sido agregado con éxito.', 'success').then(
              () => {
                this.closeModel()
              }
            )
          }
          else {
            this.asignarUsuarioPorRol(data.rol, data[`${data.rol.toLowerCase()}`][`${data.rol.toLowerCase()}_id`]);
          }
        }
      )
    }

    if(this.data.isEdit) {
      if(this.usuario.rol === 'Estudiante') {
        const userData = {
          nombres_usuario: this.usuario.nombres_usuario,
          email_usuario: this.usuario.email_usuario,
          rol: this.usuario.rol,
          estudiante_id: Number(this.usuario.estudiante.estudiante_id),
          docente_id: 0,
          apoderado_id: 0
        }
  
        this.userService.modificarUsuario(this.usuarioId, userData).subscribe(
          (data: any) => {
            if(data.rol === 'Admin') {
              this.loading = false
              Swal.fire('Usuario modificado', 'El usuario ha sido modificado con éxito.', 'success').then(
                () => {
                  this.closeModel()
                }
              )
            }
            else {
              this.asignarUsuarioPorRol(data.rol, data[`${data.rol.toLowerCase()}`][`${data.rol.toLowerCase()}_id`]);
            }
          }
        )
      }
      if(this.usuario.rol === 'Docente') {
        const userData = {
          nombres_usuario: this.usuario.nombres_usuario,
          email_usuario: this.usuario.email_usuario,
          rol: this.usuario.rol,
          estudiante_id: 0,
          docente_id: Number(this.usuario.docente.docente_id),
          apoderado_id: 0
        }
  
        this.userService.modificarUsuario(this.usuarioId, userData).subscribe(
          (data: any) => {
            if(data.rol === 'Admin') {
              this.loading = false
              Swal.fire('Usuario modificado', 'El usuario ha sido modificado con éxito.', 'success').then(
                () => {
                  this.closeModel()
                }
              )
            }
            else {
              this.asignarUsuarioPorRol(data.rol, data[`${data.rol.toLowerCase()}`][`${data.rol.toLowerCase()}_id`]);
            }
          }
        )
      }
      if(this.usuario.rol === 'Apoderado') {
        const userData = {
          nombres_usuario: this.usuario.nombres_usuario,
          email_usuario: this.usuario.email_usuario,
          rol: this.usuario.rol,
          estudiante_id: 0,
          docente_id: 0,
          apoderado_id: Number(this.usuario.apoderado.apoderado_id)
        }
  
        this.userService.modificarUsuario(this.usuarioId, userData).subscribe(
          (data: any) => {
            if(data.rol === 'Admin') {
              this.loading = false
              Swal.fire('Usuario modificado', 'El usuario ha sido modificado con éxito.', 'success').then(
                () => {
                  this.closeModel()
                }
              )
            }
            else {
              this.asignarUsuarioPorRol(data.rol, data[`${data.rol.toLowerCase()}`][`${data.rol.toLowerCase()}_id`]);
            }
          }
        )
      }
      if(this.usuario.rol === 'Admin') {
        const userData = {
          nombres_usuario: this.usuario.nombres_usuario,
          email_usuario: this.usuario.email_usuario,
          rol: this.usuario.rol,
          estudiante_id: 0,
          docente_id: 0,
          apoderado_id: 0
        }

        this.userService.modificarUsuario(this.usuarioId, userData).subscribe(
          (data: any) => {
            this.loading = false
            Swal.fire('Usuario modificado', 'El usuario ha sido modificado con éxito.', 'success').then(
              () => {
                this.closeModel()
              }
            )
          }
        )
      }
    }
  }

  cambiarContrasenia() {
    this.dialog.open(ModalCambiarContraComponent, {
      data: {
        user: this.data
      },
      width: '35%'
    })
  }

  closeModel() {
    this.dialogRef.close()
  }
}