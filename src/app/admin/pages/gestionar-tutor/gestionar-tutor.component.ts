import { Component } from '@angular/core';
import { TutorService } from '../../../core/services/tutor.service';
import { TableComponent } from '../../../shared/components/table/table.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../../shared/components/UI/input/input.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { EstudianteService } from '../../../core/services/estudiante.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { ModalTutorComponent } from '../../../shared/components/modal/modal-tutor/modal-tutor.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gestionar-tutor',
  standalone: true,
  imports: [TableComponent, MatProgressBarModule, FormsModule, InputComponent, MatButtonModule],
  templateUrl: './gestionar-tutor.component.html',
  styleUrl: './gestionar-tutor.component.css'
})
export class GestionarTutorComponent {
      tutores = []
      tutor = []
      seccionLoaded = false
      trackByField = '_id'
      loading = false
      searchTerm: string = ''
      loadedComplete: boolean = false

      columns = [
        { header: 'Apellido ', field: 'apellido' },
        { header: 'Nombre ', field: 'nombre' },
        { header: 'Direccion', field: 'direccion' },
        { header: 'Telefono', field: 'telefono' },
        { header: 'Nro. Documento', field: 'numero_documento' },
        { header: 'Grado', field: 'grado.nombre' },
        { header: 'Periodo', field: 'periodo.anio' },
        { header: 'Seccion', field: 'seccion.nombre' },
        
      ]
      constructor(
        private tutorService:TutorService,
        private estudianteService: EstudianteService,
        private snack: MatSnackBar,
        public dialog: MatDialog,
        private router: Router
      ) {}
      ngOnInit() {
        this.loading = true
        this.listarTutores()
      }

      listarTutores() {
        this.tutorService.listarTutores().subscribe(
          (data: any) => { 
            this.tutores=data
            this.loading = false
            this.loadedComplete = true
          },
          (error) => {
            this.loading = false
            Swal.fire('Error', 'Error al cargar los datos de los tutores', 'error')
          }
        );
      }
      displayedTutores() {
        return this.tutores.filter((tutor: any) =>
          tutor.numero_documento.includes(this.searchTerm)
        );
      }

      agregarTutor() {
        const dialogRef = this.dialog.open(ModalTutorComponent, {
          data: {
            isCreate: true
          },
          width: '70%'
        })
    
        dialogRef.afterClosed().subscribe(
          (data) => {
            this.tutorService.listarTutores().subscribe(
              (data: any) => {
                this.tutores = data.sort((a: any, b: any) => {
                  if (a.apellido.toLowerCase() < b.apellido.toLowerCase()) {
                    return -1;
                  }
                  if (a.apellido.toLowerCase() > b.apellido.toLowerCase()) {
                    return 1;
                  }
                  return 0;
                });
              },
              (error) => {
                console.log(error)
              }
            )
          }
        )
      }
      editarTutor(isEdit: any, id: any) {
         this.loading = true
         if (isEdit) {
           this.tutorService.obtenerTutor(id).subscribe(
             (data: any) => {
               this.tutor = data
               this.loading = false
               const dialogRef =  this.dialog.open(ModalTutorComponent, {
                 data: {
                   tutor: this.tutor,
                   isEdit: true
                 },
                 width: '70%'
               });
    
               dialogRef.afterClosed().subscribe(
                 (data) => {
                   this.tutorService.listarTutores().subscribe(
                     (data: any) => {
                       this.tutores = data.sort((a: any, b: any) => {
                         if (a.apellido.toLowerCase() < b.apellido.toLowerCase()) {
                           return -1;
                         }
                         if (a.apellido.toLowerCase() > b.apellido.toLowerCase()) {
                           return 1;
                         }
                         return 0;
                       });
                     },
                     (error) => {
                       console.log(error)
                     }
                   )
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
       

  eliminarTutor(isDeleted: any, id: any) {
     if(isDeleted){
       Swal.fire({
        title: 'Eliminar tutor',
        text: '¿Estás seguro de eliminar al tutor?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
         this.loading = true
         this.tutorService.eliminarTutor(id).subscribe(
             (data) => {
               this.loading = false
               Swal.fire('Tutor eliminado', 'El tutor ha sido eliminado de la base de datos', 'success').then(
                 (e)=> {
                   this.tutorService.listarTutores().subscribe(
                     (data: any) => {
                       this.tutores = data.sort((a: any, b: any) => {
                         if (a.apellido.toLowerCase() < b.apellido.toLowerCase()) {
                           return -1;
                         }
                         if (a.apellido.toLowerCase() > b.apellido.toLowerCase()) {
                           return 1;
                         }
                         return 0;
                       });
                     },
                     (error) => {
                       console.log(error)
                     }
                   )
                 }
               );
             },
             (error) => {
               console.log(error)
               this.loading = false
               Swal.fire('Error', 'Error al eliminar el tutor de la base de datos', 'error');
             }
           );
         }
       });
     }
  }
  editarPFP(isPfp: any, id: any) {
    this.loading = true
    if(isPfp) {
      this.router.navigate([`/admin/gestionar-perfil-tutor/${id}`])
    }
  } 
}
