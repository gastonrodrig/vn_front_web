import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBar } from '@angular/material/progress-bar';
import { SoloNumerosDirective } from '../../../shared/directives/solo-numeros.directive';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { DocenteService } from '../../../core/services/docente.service';

@Component({
  selector: 'app-gestionar-perfil-docente',
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
  templateUrl: './gestionar-perfil-docente.component.html',
  styleUrl: './gestionar-perfil-docente.component.css'
})
export class GestionarPerfilDocenteComponent {
  loading = false
  docenteId: any
  files: File[] = [];
  isDragging = false;
  dragCounter = 0;

  docente = {
    nombre: '',
    apellido: '',
    numero_documento: '',
    telefono: '',
    direccion: '',
    multimedia: {
      url: ''
    }
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private snack: MatSnackBar,
    private docenteService: DocenteService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => this.docenteId = params.get('id'));
    this.loading = true
    this.obtenerDocente()
    this.docenteService.obtenerPerfilDocente(this.docenteId).subscribe(
      (data: any) => {
        if (data.multimedia && data.multimedia.url !== 'no existe') {
          fetch(data.multimedia.url)
            .then(response => response.blob())
            .then(blob => new File([blob], data.multimedia.nombre, { type: blob.type }))
            .then(file => {
              this.files = [file]
              this.loading = false
            });
        } else {
          this.files = []
          this.loading = false
        }
      },
      (error) => {
        this.mostrarMensaje('Error al obtener la imagen.', 3000)
      }
    )
  }

  obtenerDocente() {
    this.docenteService.obtenerDocente(this.docenteId).subscribe(
      (data: any) => {
        this.docente = data
      }
    )
  }

  guardarArchivos() {
    this.loading = true
    if (this.files.length === 0) {
      this.mostrarMensaje('No se ha añadido una imagen.', 3000)
      return
    }

    const formData = new FormData()
    formData.append('imageFile', this.files[0]);
    this.docenteService.modificarPerfilDocente(this.docenteId, formData).subscribe(
      (data: any) => {
        this.mostrarMensaje('La foto de perfil ha sido agregada con éxito.', 10000)
        this.obtenerDocente()
      },
      (error) => {
        console.log(error)
        this.mostrarMensaje('Error al subir los documentos.', 3000)
      }
    )
  }

  volverDocentes() {
    this.router.navigate([`/admin/gestionar-docentes`])
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files) {
      if (this.files.length + input.files.length > 1) {
        this.mostrarMensaje('Máximo de 1 archivo permitido.', 3000)
        return
      }

      for (const file of Array.from(input.files)) {
        if (file.type !== 'image/jpeg') {
          this.mostrarMensaje('Solo se permiten archivos JPG.', 3000)
          return
        }
        else {
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
        if (file.type !== 'image/jpeg') {
          this.mostrarMensaje('Solo se permiten archivos JPG.', 3000)
          return
        }
        else {
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
