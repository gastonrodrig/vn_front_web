import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBar } from '@angular/material/progress-bar';
import { SoloNumerosDirective } from '../../../shared/directives/solo-numeros.directive';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { EstudianteService } from '../../../core/services/estudiante.service';

@Component({
  selector: 'app-gestionar-documentos-temporal',
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
  templateUrl: './gestionar-documentos-temporal.component.html',
  styleUrl: './gestionar-documentos-temporal.component.css'
})
export class GestionarDocumentosTemporalComponent {
  loading = false;
  dni = '';
  files: File[] = [];
  isDragging = false;
  dragCounter = 0;
  isDisabled = true;
  estudiante: any
  estudiantes: any;
  estudianteId: any;
  nombreUsuario: any;

  isCreate = false
  isEdit = false

  constructor(
    private estudianteService: EstudianteService,
    private authService: AuthService,
    private snack: MatSnackBar,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.estudianteService.listarEstudiantes().subscribe(
      (data: any) => {
        this.estudiantes = data
      }
    )
  }

  desbloquear() {
    this.loading = true;
    const user = this.authService.getUser();
    this.estudiante = this.estudiantes.find((e: any) => e.numero_documento === this.dni)
  
    if (this.dni === '') {
      this.mostrarMensaje('El Dni es requerido.', 3000)
      return
    }
  
    if (this.nombreUsuario !== user.usuario) {
      this.mostrarMensaje('El nombre de usuario ingresado es incorrecto.', 3000)
      return
    }
  
    if (this.estudiante === undefined) {
      this.mostrarMensaje('El Dni ingresado no existe.', 3000)
      return
    }

    this.estudianteId = this.estudiante._id
    this.obtenerArchivos()
    this.isDisabled = false
  }

  obtenerArchivos() {
    this.estudianteService.obtenerEstudiante(this.estudianteId).subscribe(
      async (data: any) => {
        this.estudiante = data
        this.loading = false
        const filesPromises = this.estudiante.archivo.map(async (file: any) => {
          const response = await fetch(file.url);
          const blob = await response.blob();
          return new File([blob], file.nombre, { type: blob.type });
        });
  
        this.files = await Promise.all(filesPromises);
      }
    )
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files) {
      if (this.files.length + input.files.length > 4) {
        this.mostrarMensaje('Máximo de 4 archivos permitido.', 3000)
        return
      }

      for (const file of Array.from(input.files)) {
        if (file.type !== 'application/pdf') {
          this.mostrarMensaje('Solo se permiten archivos PDF.', 3000)
          continue
        }

        if (this.files.some(f => f.name === file.name)) {
          this.mostrarMensaje('El archivo ya ha sido añadido.', 3000)
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
      if (this.files.length + event.dataTransfer.files.length > 4) {
        this.mostrarMensaje('Máximo de 4 archivos permitido.', 3000)
        return
      }

      const droppedFiles = Array.from(event.dataTransfer.files)
      droppedFiles.forEach((file) => {
        if (file.type !== 'application/pdf') {
          this.mostrarMensaje('Solo se permiten archivos PDF.', 3000)
          return
        }

        if (this.files.some((f) => f.name === file.name)) {
          this.mostrarMensaje('El archivo ya ha sido añadido.', 3000)
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

  mostrarMensaje(message: string, duration: number) {
    this.snack.open(message, 'Cerrar', {
      duration: duration
    })
    this.loading = false
  }

  borrarArchivo(file: any) {
    this.files = this.files.filter(f => f !== file)
    console.log(this.files)
  }

  guardarArchivos() {
    this.loading = true
    if (this.files.length === 0) {
      this.mostrarMensaje('No se han añadido documentos.', 3000)
      return
    }

    const formData = new FormData()
    this.files.forEach(file => formData.append('files', file))
    formData.append('estudiante_id', this.estudianteId.toString())
    console.log(this.files)
    this.estudianteService.modificarArchivosEstudiante(this.estudianteId, formData).subscribe(
      (data: any) => {
        this.mostrarMensaje('Los documentos han sido agregados con éxito.', 3000)
        this.loading = false
        this.isDisabled = true
        this.files = []
      },
      (error) => {
        console.log(error)
        this.mostrarMensaje('Error al subir los documentos.', 3000)
      }
    )
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
}