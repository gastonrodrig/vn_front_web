import { Component } from '@angular/core';
import { TableComponent } from '../../../shared/components/table/table.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../../shared/components/UI/input/input.component';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../../core/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalUsuarioComponent } from '../../../shared/components/modal/modal-usuario/modal-usuario.component';
import { EstudianteService } from '../../../core/services/estudiante.service';
import { TutorService } from '../../../core/services/tutor.service';
import Swal from 'sweetalert2';
import { DocenteService } from '../../../core/services/docente.service';

@Component({
  selector: 'app-gestionar-usuarios',
  standalone: true,
  imports: [TableComponent, MatProgressBarModule, FormsModule, InputComponent, MatButtonModule],
  templateUrl: './gestionar-usuarios.component.html',
  styleUrl: './gestionar-usuarios.component.css'
})
export class GestionarUsuariosComponent {
  usuarios: any[] = []
  usuario = []
  trackByField = '_id'
  loading = false
  loadedComplete: any
  searchTerm: string = ''

  columns = [
    { header: 'Usuario', field: 'usuario' },
    { header: 'Correo', field: 'email' },
    { header: 'Rol', field: 'rol' },
    { header: 'Nro. Documento', field: 'perfil' },
    { header: 'Estado', field: 'estado'}
  ]

  actionsByState = {
    'Deshabilitado': [
      { icon: 'fa-unlock', action: 'deshabilitado', style: 'hover:text-stone-500' }
    ],
    'Habilitado': [
      { icon: 'fa-lock', action: 'habilitado', style: 'hover:text-stone-500' }
    ]
  }

  constructor(
    private userService: UserService,
    private estudianteService: EstudianteService,
    private tutorService: TutorService,
    private docenteService: DocenteService,
    public dialog: MatDialog
  ){}

  ngOnInit() {
    this.listarUsuarios(true)
  }

  listarUsuarios(load: any) {
    this.loading = load;
    this.userService.listarUsuarios().subscribe(
      (data: any) => {
        const usuariosFiltrados = data
          .filter((user: any) => user.rol !== 'Temporal')
          .sort((a: any, b: any) => {
            if (a.usuario.toLowerCase() < b.usuario.toLowerCase()) return -1;
            if (a.usuario.toLowerCase() > b.usuario.toLowerCase()) return 1;
            return 0;
          });
  
        // Inicializamos la lista de usuarios vacía antes de formatear
        this.usuarios = [];
        
        console.log(usuariosFiltrados)
        usuariosFiltrados.forEach((usuario: any) => {
          this.formatearUsuarios(usuario).then((usuarioFormateado: any) => {
            this.usuarios.push(usuarioFormateado);
            // Si todos los usuarios han sido formateados, finalizamos el loading
            if (this.usuarios.length === usuariosFiltrados.length) {
              this.loading = false;
              this.loadedComplete = true;
            }
          });
        });
      },
      (error) => {
        this.loading = false;
        Swal.fire('Error', 'Error al cargar los datos', 'error');
        console.log(error);
      }
    );
  }
  

  displayedUsuarios() {
    return this.usuarios.filter((usuario: any) =>
      usuario.usuario.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
      usuario.perfil.toString().includes(this.searchTerm)
    )
  }

  agregarUsuario() {
    const dialogRef = this.dialog.open(ModalUsuarioComponent, {
      data: {
        isCreate: true
      },
      width: '70%'
    })

    dialogRef.afterClosed().subscribe(
      (data) => {
        this.listarUsuarios(false)
      }
    )
  }
  
  editarUsuario(isEdit: any, id: any) {
    this.loading = true
    if (isEdit) {
      this.userService.obtenerUsuario(id).subscribe(
        (data: any) => {
          this.usuario = data
          this.loading = false
          const dialogRef =  this.dialog.open(ModalUsuarioComponent, {
            data: {
              usuario: this.usuario,
              isEdit: true
            },
            width: '70%'
          })

          dialogRef.afterClosed().subscribe(
            (data) => {
              this.listarUsuarios(false)
            }
          )
        },
        (error) => {
          this.loading = false
          console.log(error)
        }
      )
    }
  }

  eliminarUsuario(id: any) {
    this.userService.eliminarUsuario(id).subscribe(
      (data) => {
        this.loading = false
        Swal.fire('Usuario eliminado', 'El usuario ha sido eliminado de la base de datos', 'success').then(
          (e)=> {
            this.listarUsuarios(true)
          }
        )
      },
      (error) => {
        this.loading = false
        Swal.fire('Error', 'Error al eliminar al usuario de la base de datos', 'error')
      }
    )
  }

  eliminarUsuarioAvanzado(isDeleted: any, id: any) {
    if(isDeleted){
      Swal.fire({
        title: 'Eliminar usuario',
        text: '¿Estás seguro de eliminar al usuario?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.loading = true
          this.userService.obtenerUsuario(id).subscribe(
            (data: any) => {
              if(data.rol === 'Admin' || data.rol === 'Temporal') {
                this.eliminarUsuario(data._id)
              }
              if(data.rol === 'Estudiante') {
                this.estudianteService.eliminarUsuario(data.perfil).subscribe(
                  (data: any) => {
                    this.eliminarUsuario(id)
                  }
                )
              }
              if(data.rol === 'Tutor') {
                this.tutorService.eliminarUsuario(data.perfil).subscribe(
                  (data: any) => {
                    this.eliminarUsuario(id)
                  }
                )
              }
              if(data.rol === 'Docente') {
                this.docenteService.eliminarUsuario(data.perfil).subscribe(
                  (data: any) => {
                    this.eliminarUsuario(id)
                  }
                )
              }
            }
          )
        }
      })
    }
  }

  handleTableAction(event: { id: any, action: string }) {
    const { id, action } = event
    switch (action) {
      case 'deshabilitado':
        Swal.fire({
          title: 'Habilitar usuario',
          text: '¿Estás seguro de habilitar el usuario?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Habilitar',
          cancelButtonText: 'Cerrar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.loading = false
            this.userService.habilitarUsuario(id).subscribe(
              (data: any) => {
                this.listarUsuarios(true)
              }
            )
          }
        });
        break;
      case 'habilitado':
        Swal.fire({
          title: 'Deshabilitar usuario',
          text: '¿Estás seguro de deshabilitar el usuario?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Deshabilitar',
          cancelButtonText: 'Cerrar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.loading = false
            this.userService.deshabilitarUsuario(id).subscribe(
              (data: any) => {
                this.listarUsuarios(true)
              }
            )
          }
        });
        break;
    }
  }

  formatearUsuarios(usuario: any): Promise<any> {
    return new Promise((resolve) => {
      if (usuario.rol === 'Admin' || usuario.rol === 'Temporal') {
        usuario.perfil = '-';
        resolve(usuario);
      }
      
      if (usuario.rol === 'Estudiante') {
        this.estudianteService.obtenerEstudiante(usuario.perfil).subscribe(
          (data: any) => {
            usuario.perfil = data.numero_documento;
            resolve(usuario);
          }
        );
      }
      
      if (usuario.rol === 'Tutor') {
        this.tutorService.obtenerTutor(usuario.perfil).subscribe(
          (data: any) => {
            usuario.perfil = data.numero_documento;
            resolve(usuario);
          }
        );
      }

      if (usuario.rol === 'Docente') {
        this.docenteService.obtenerDocente(usuario.perfil).subscribe(
          (data: any) => {
            usuario.perfil = data.numero_documento;
            resolve(usuario);
          }
        );
      }
    });
  }
}
