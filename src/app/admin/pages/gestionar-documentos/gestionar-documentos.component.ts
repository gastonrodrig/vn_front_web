import { ChangeDetectorRef, Component } from '@angular/core';
import { DocumentosEstudianteService } from '../../../core/services/documentos-estudiante.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { EstudianteService } from '../../../core/services/estudiante.service';

@Component({
  selector: 'app-gestionar-documentos',
  standalone: true,
  imports: [CommonModule, MatProgressBar, MatButtonModule],
  templateUrl: './gestionar-documentos.component.html',
  styleUrl: './gestionar-documentos.component.css'
})
export class GestionarDocumentosComponent {
  loading = false
  estudianteId: any
  files: File[] = []
  isDragging = false
  isCreate = false
  isEdit = false
  dragCounter = 0

  estudiante = {
    nombre: '',
    apellido: '',
    numero_documento: '',
    grado: {
      nombre: ''
    },
    periodo: {
      anio: ''
    },
    multimedia: {
      url: ''
    }
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private snack: MatSnackBar,
    private docsEstudianteService: DocumentosEstudianteService,
    private estudianteService: EstudianteService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => this.estudianteId = params.get('id'));
    this.loading = true

    this.estudianteService.obtenerEstudiante(this.estudianteId).subscribe(
      (data: any) => {
        this.estudiante = data
        console.log(this.estudiante)
      }
    )

    this.docsEstudianteService.obtenerDocumentosPorEstudiante(this.estudianteId.toString()).subscribe(
      async (data: any) => {
        // Transformar urls de los objetos de multimedia a blob's y luego a File c/u
        const filesPromises = data.flatMap((item: any) => 
          item.multimedia.map(async (file: any) => {
            const response = await fetch(file.url)
            const blob = await response.blob()
            return new File([blob], file.nombre, { type: blob.type })
          })
        )
        
        this.files = await Promise.all(filesPromises)

        this.loading = false
        if(this.files.length === 0 ) {
          this.isCreate = true
          this.isEdit = false
        } else {
          this.isEdit = true
          this.isCreate = false
        }
      },
      (error) => {
        this.mostrarMensaje('Error al obtener los documentos.', 3000)
      }
    )
  }

  guardarArchivos() {
    if(this.isCreate) {
      this.loading = true
      if (this.files.length === 0) {
        this.mostrarMensaje('No se han añadido documentos.', 3000)
        return
      }

      const formData = new FormData()
      this.files.forEach(file => formData.append('files', file))
      formData.append('estudiante_id', this.estudianteId.toString())

      this.docsEstudianteService.agregarDocumentos(formData).subscribe(
        (data: any) => {
          this.mostrarMensaje('Los documentos han sido agregados con éxito.', 3000)
          this.files = []
        },
        (error) => {
          console.log(error)
          this.mostrarMensaje('Error al subir los documentos.', 3000)
        }
      )
    }

    if(this.isEdit) {
      this.loading = true
      if (this.files.length === 0) {
        this.mostrarMensaje('No se han añadido documentos.', 3000)
        return
      }

      const formData = new FormData()
      this.files.forEach(file => formData.append('files', file))
      formData.append('estudiante_id', this.estudianteId.toString())

      this.docsEstudianteService.actualizarDocumentos(this.estudianteId, formData).subscribe(
        (data: any) => {
          this.mostrarMensaje('Los documentos han sido agregados con éxito.', 3000)
          this.files = []
        },
        (error) => {
          console.log(error)
          this.mostrarMensaje('Error al subir los documentos.', 3000)
        }
      )
    }
  }
  
  volverEstudiantes() {
    this.router.navigate([`/admin/gestionar-estudiantes`])
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
