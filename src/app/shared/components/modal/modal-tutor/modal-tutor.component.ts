import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { SoloNumerosDirective } from '../../../directives/solo-numeros.directive';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { DocumentoService } from '../../../../core/services/documento.service';
import { TutorService } from '../../../../core/services/tutor.service';
import { PeriodoService } from '../../../../core/services/periodo.service';
import { GradoService } from '../../../../core/services/grado.service';
import { SeccionService } from '../../../../core/services/seccion.service';
import { SeccionGradoPeriodoService } from '../../../../core/services/seccion-grado-periodo.service';

@Component({
  selector: 'app-modal-tutor',
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
  templateUrl: './modal-tutor.component.html',
  styleUrl: './modal-tutor.component.css'
})
export class ModalTutorComponent {
  tipoDocumento: any[] = []
  seccionGradoPeriodo: any[] = []
  loadedComplete: any
  seccion: any[] = []
  periodo: any[] = []
  seccionId: any
  grado: any[] = []
  tutor: any
  tutorId: any
  loading = false
  seccionLoaded = false
  gradosLoaded = false
  sgp:any
  
  periodoBlocked = false
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ModalTutorComponent>,
    private snack: MatSnackBar,
    private tipoDocumentService: DocumentoService,
    private tutorService: TutorService,
    private periodoService: PeriodoService,
    public dialog: MatDialog,
    private gradoService: GradoService,
    private sgpService: SeccionGradoPeriodoService,
    private seccionService: SeccionService
  ) {dialogRef.disableClose = true}

  ngOnInit() {
    if (this.data.isEdit) {
      console.log(this.data)
      this.tutor = this.data.tutor;
      this.tutorId = this.data.tutor._id
      
    }
else{
  
    this.tutor = {
      nombre: '',
      apellido: '',
      direccion: '',
      telefono: '',
      numero_documento: '',
      documento: {
        _id: ''
      },
      periodo: {
        _id: ''
      },
      grado: {
        _id: ''
      },
      seccion: {  // Inicializa seccion para evitar errores
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
  this.periodoService.listarPeriodos().subscribe(
    (data: any) => {
      this.periodo = data
    },
    (error) => {
      console.log(error)
    }
    
  )
  this.gradoService.listarGrados().subscribe(
    (data: any) => {
      this.grado = data
    },
    (error) => {
      console.log(error)
    }
  )
  }
  listarGrados() {
    this.loading = true;
    this.gradoService.listarGrados().subscribe(
      (data: any) => {
        if (data && data.length > 0) {
          console.log('Datos de grados recibidos:', data);
          this.grado = data;
          this.gradosLoaded = true;
        } else {
          console.error('No se encontraron grados disponibles.');
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error al cargar grados:', error);
        this.loading = false;
      }
    );
  }
  listarSeccionesPorPeriodoGrado() {
    if (!this.tutor.grado || !this.tutor.grado._id) {
      console.error('El grado está vacío');
      return;
    }
    if (!this.tutor.periodo || !this.tutor.periodo._id) {
      console.error('El periodo está vacío');
      return;
    }
  
    this.loading = true;
    console.log('ID del Grado:', this.tutor.grado._id);
    console.log('ID del Periodo:', this.tutor.periodo._id);
    
    this.sgpService.listarSeccionesPorGradoPeriodo(
      this.tutor.grado._id, 
      this.tutor.periodo._id
  ).subscribe(
      (data: any) => {
        this.seccion = data// Si `sgp.seccion` es donde está el ID correcto
          console.log('Secciones cargadas:', this.seccion); // Asegúrate de que aquí haya datos
          this.loading = false;
          this.seccionLoaded = true;
  
          if (this.seccion.length === 0) {
              this.snack.open('No se encontraron secciones', 'Cerrar', { duration: 3000 });
              this.seccionLoaded = false;
          }
      },
      (error) => {
          console.error('Error al cargar secciones:', error);
          this.loading = false;
          this.snack.open('Error al cargar secciones', 'Cerrar', { duration: 3000 });
      }
  );
  }
  
  closeModel() {
    this.dialogRef.close()
  }

  guardarInformacion() {
    if (!this.tutor.nombre || !this.tutor.periodo._id || !this.tutor.grado._id || !this.tutor.seccion._id) {
      this.snack.open('Faltan datos en el formulario', 'Cerrar', {
        duration: 3000,
      });
      return;
    }
    console.log('Sección ID:', this.tutor.seccion._id);
    this.loading = true
    const dataTutor = {
      nombre : this.tutor.nombre,
      apellido : this.tutor.apellido,
      direccion : this.tutor.direccion,
      telefono : this.tutor.telefono,
      numero_documento : this.tutor.numero_documento,
      documento_id : this.tutor.documento._id, // Cambiado a tutor.documento._id
      periodo_id : this.tutor.periodo._id, // Cambiado a tutor.periodo._id
      grado_id : this.tutor.grado._id, // Cambiado a tutor.grado._id
      seccion_id : this.tutor.seccion._id, // Cambiado a tutor.seccion._id
      
    }
    //VALIDACIONES 
    if(!isNaN(dataTutor.nombre)) {
      this.snack.open('El nombre tiene que ser en letras', '', {
        duration: 3000
      })
      this.loading = false
      return
    }
    if(!isNaN(dataTutor.apellido)) {
      this.snack.open('El apellido tiene que ser en letras', '', {
        duration: 3000
      })
      this.loading = false
      return
    }
       //validacion documento 
      if (!this.tutor.documento._id) {
        this.snack.open('Tiene que elegir un tipo de Documento', '', {
          duration: 3000
        });
        this.loading = false;
        return;
      }
     //validacion eleccion de documento
     if(isNaN(dataTutor.numero_documento) || dataTutor.numero_documento.length !== 8) {
       this.snack.open('El Numero de Documento tiene que ser numerico y de 8 digitos', '', {
         duration: 3000
       })
       this.loading = false
       return
     }
     //validacion periodo
     if (!this.tutor.periodo._id) {
       this.snack.open('Tiene que elegir un tipo de Periodo', '', {
         duration: 3000
       });
       this.loading = false;
       return;
     }
     //validacion grado
     if (!this.tutor.grado._id) {
       this.snack.open('Tiene que elegir un tipo de grado', '', {
         duration: 3000
       });
       this.loading = false;
       return;
     }
    
    //VALIDACIONES TERMINADA
    if (dataTutor.direccion ==='') {
      this.snack.open('La Direccion es requerida', '', {
        duration: 3000
      });
      this.loading = false;
      return;
    }

    if(dataTutor.nombre === '') {
      this.snack.open('El nombre del tutor es requerido', '', {
        duration: 3000
      })
      this.loading = false
      return
    }

    if(this.data.isCreate) {
      console.log('Sección ID:', this.tutor.seccion._id);
      this.tutorService.agregarTutor(dataTutor).subscribe(
        (data) => {
          Swal.fire('Tutor guardado', 'El Tutor ha sido guardado con éxito', 'success').then(
            (e)=> {
              this.closeModel()
              
            }
          );
        },
        (error) => {
          this.loading = false
          console.log(error)
        }
      )
    }

    if(this.data.isEdit) {
      this.tutorService.modificarTutor(this.tutorId, dataTutor).subscribe(
        (data) => {
          this.loading = false
          Swal.fire('Tutor modificado', 'El tutor ha sido modificado con éxito', 'success').then(
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
  
}
