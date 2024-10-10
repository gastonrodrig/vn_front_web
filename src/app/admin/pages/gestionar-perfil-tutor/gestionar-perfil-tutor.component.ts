import { ChangeDetectorRef, Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TutorService } from '../../../core/services/tutor.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBar } from '@angular/material/progress-bar';
import { SoloNumerosDirective } from '../../../shared/directives/solo-numeros.directive';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestionar-perfil-tutor',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBar,
    SoloNumerosDirective,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule
  ],
  templateUrl: './gestionar-perfil-tutor.component.html',
  styleUrl: './gestionar-perfil-tutor.component.css'
})
export class GestionarPerfilTutorComponent {
  loading = false
  tutorId: any
  files: File[] = [];
  isDragging = false;
  dragCounter = 0;

  tutor = {
    nombre: '',
      apellido: '',
      direccion: '',
      telefono: '',
      numero_documento: '',
    documento: {
        _id: ''
    },  
    grado: {
      nombre: ''
    },
    periodo: {
      anio: ''
    },
    seccion: {
      _id: ''
    },
    multimedia: {
      url: '',
      nombre: ''
    }
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private snack: MatSnackBar,
    private tutorService: TutorService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => this.tutorId = params.get('id'))
    this.loading = true
    this.obtenerTutor()
  }

  obtenerTutor() {
    this.tutorService.obtenerTutor(this.tutorId).subscribe(
      (data: any) => {
        this.tutor = data
        console.log(this.tutor)
  
        if (this.tutor.multimedia && this.tutor.multimedia.url !== 'no existe') {
          fetch(this.tutor.multimedia.url)
            .then(response => response.blob())
            .then(blob => new File([blob], this.tutor.multimedia.nombre, { type: blob.type }))
            .then(file => {
              this.files = [file]
              this.loading = false
            })
        } else {
          this.files = []
          this.loading = false
        }
      },
      (error) => {
        this.mostrarMensaje('Error al obtener los datos del tutor.', 3000)
        this.loading = false
      }
    )
  }

  guardarArchivos() {
    this.loading = true
    if (this.files.length === 0) {
      this.mostrarMensaje('No se ha añadido una imagen.', 3000)
      return
    }

    console.log(this.files)
    const formData = new FormData()
    formData.append('imageFile', this.files[0])
    this.tutorService.modificarPerfilTutor(this.tutorId, formData).subscribe(
      (data: any) => {
        this.mostrarMensaje('La foto de perfil ha sido agregada con éxito.', 10000)
        this.obtenerTutor()
      },
      (error) => {
        console.log(error)
        this.mostrarMensaje('Error al subir los documentos.', 3000)
      }
    )
  }

  volverTutor() {
    this.router.navigate([`/admin/gestionar-tutor`])
  }

  eliminarFoto() {
    Swal.fire({
      title: 'Eliminar foto de perfil',
      text: '¿Estás seguro de eliminar la foto de perfil?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.tutor && this.tutor.multimedia && this.tutor.multimedia.url) {
          this.loading = true
          this.tutor.multimedia.url = '../../../../assets/images/default.jpg';
          this.files = [];
          
          const formData = new FormData();
          formData.append('imageFile', ''); 
          
          this.tutorService.modificarPerfilTutor(this.tutorId, formData).subscribe(
            (data: any) => {
              this.mostrarMensaje('La foto de perfil ha sido eliminada', 3000);
              this.obtenerTutor(); 
             
            },
            (error) => {
              console.log(error);
              this.obtenerTutor(); 
            }
          );
        }
      }
    });
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files) {
      if (this.files.length + input.files.length > 1) {
        this.mostrarMensaje('Máximo de 1 archivo permitido.', 3000)
        return
      }
  
      for (const file of Array.from(input.files)) {
        if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
          this.mostrarMensaje('Solo se permiten archivos JPG o PNG.', 3000)
          return
        } else {
          this.files.push(file)
        }
      }
    }
    this.resetEstadoArrastrado()
  }

  arrastrarAlEntrar(event: DragEvent) {
    event.preventDefault()
    this.dragCounter++
    this.isDragging = true
  }

  arrastrarAlSalir(event: DragEvent) {
    event.preventDefault()
    this.dragCounter--
    if (this.dragCounter === 0) {
      this.isDragging = false
    }
  }

  arrastrarEncima(event: DragEvent) {
    event.preventDefault()
  }

  alSoltarArchivos(event: DragEvent) {
    event.preventDefault()
    this.resetEstadoArrastrado()
  
    if (event.dataTransfer?.files) {
      if (this.files.length + event.dataTransfer.files.length > 1) {
        this.mostrarMensaje('Máximo de 1 archivo permitido.', 3000)
        return
      }
  
      const droppedFiles = Array.from(event.dataTransfer.files)
      droppedFiles.forEach((file) => {
        if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
          this.mostrarMensaje('Solo se permiten archivos JPG o PNG.', 3000)
          return
        } else {
          this.files.push(file)
        }
      })
      this.cdr.detectChanges()
    }
  }

  resetEstadoArrastrado() {
    this.dragCounter = 0
    this.isDragging = false
  }

  borrarArchivo(file: any) {
    this.files = this.files.filter(f => f !== file)
    console.log(this.files)
  }

  formatFileSize(size: number) {
    if (size < 1024) {
      return `${size} bytes`
    } else if (size < 1048576) {
      return `${Math.round(size / 1024)} kb`
    } else {
      return `${Math.round(size / 1048576)} mb`
    }
  }

  descargarArchivo(file: any) {
    const url = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = url
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  mostrarMensaje(message: string, duration: number) {
    this.snack.open(message, 'Cerrar', {
      duration: duration
    })
    this.loading = false
  }
}
