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
import { ApoderadoService } from '../../../core/services/apoderado.service';
import { DocenteService } from '../../../core/services/docente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestionar-usuarios',
  standalone: true,
  imports: [TableComponent, MatProgressBarModule, FormsModule, InputComponent, MatButtonModule],
  templateUrl: './gestionar-usuarios.component.html',
  styleUrl: './gestionar-usuarios.component.css'
})
export class GestionarUsuariosComponent {
  usuarios = []
  usuario = []
  trackByField = '_id'
  loading = false
  loadedComplete: any
  searchTerm: string = ''

  columns = [
    { header: 'Usuario', field: 'usuario' },
    { header: 'Correo', field: 'email' },
    { header: 'Rol', field: 'rol' },
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
    private docenteService: DocenteService,
    private apoderadoService: ApoderadoService,
    public dialog: MatDialog
  ){}

  ngOnInit() {
    this.listarUsuarios(true)
  }

  listarUsuarios(load: any) {
    this.loading = load
    this.userService.listarUsuarios().subscribe(
      (data: any) => {
        this.usuarios = data
        .filter((user: any) => user.rol !== 'Temporal')
        .sort((a: any, b: any) => {
          if (a.usuario.toLowerCase() < b.usuario.toLowerCase()) {
            return -1
          }
          if (a.usuario.toLowerCase() > b.usuario.toLowerCase()) {
            return 1
          }
          return 0
        })
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

  displayedUsuarios() {
    return this.usuarios.filter((usuario: any) =>
      usuario.usuario.toLowerCase().includes(this.searchTerm.toLowerCase())
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

  eliminarUsuarioDeUsuarioYEstudiante(isDeleted: any, id: any) {
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
              if(data.estudiante !== null) {
                this.estudianteService.eliminarUsuario(data.estudiante._id).subscribe(
                  (data: any) => {
                    this.eliminarUsuario(id)
                  }
                )
              }
              if(data.docente !== null) {
                this.docenteService.eliminarUsuario(data.docente._id).subscribe(
                  (data: any) => {
                    this.eliminarUsuario(id)
                  }
                )
              }
              if(data.apoderado !== null) {
                this.apoderadoService.eliminarUsuario(data.apoderado._id).subscribe(
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

  handleIconClick(id: any, action: string) {
    // Lógica para cambiar el estado o icono
    console.log('Icon clicked', id, action);
    // Aquí puedes actualizar el estado correspondiente en el arreglo de usuarios o cambiar el icono
  }
}
