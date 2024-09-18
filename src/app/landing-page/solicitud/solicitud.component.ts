import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SolicitudService } from '../../core/services/solicitud.service';
import { GradoService } from '../../core/services/grado.service';
import Swal from 'sweetalert2';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { SoloNumerosDirective } from '../../shared/directives/solo-numeros.directive';
import { MatButton } from '@angular/material/button';


@Component({
  selector: 'app-solicitud',
  standalone: true,
  imports: [
    MatInputModule, 
    FormsModule, 
    MatCheckbox,
    MatSelectModule,
  CommonModule,
  SoloNumerosDirective,
  MatButton,
  ],
  templateUrl: './solicitud.component.html',
  styleUrls: ['./solicitud.component.css']
})
export class SolicitudComponent {
  SolicitudList: any[] = [];
  solicitud: any;
  solicitudId: any;
  loading = false;
  aceptarTerminos = false; // Términos de aceptación
  grados: any[] = []; // Lista de grados

  constructor(
    private snack: MatSnackBar,
    private solicitudService: SolicitudService,
    private gradoService: GradoService
  ) {}

  ngOnInit() {
    this.gradoService.listarGrados().subscribe(
      (data: any) => {
        this.grados = data       
      },
      (error) => {
        console.log(error)
      },
    )
  }
  
  guardarSolicitud() {
    this.loading = true;
    const dataSolicitud = {
      nombre_hijo: this.solicitud.nombre_hijo,
      apellido_hijo: this.solicitud.apellido_hijo,
      dni_hijo: this.solicitud.dni_hijo,
      telefono_padre: this.solicitud.telefono_padre,
      correo_padre: this.solicitud.correo_padre,
      grado_id: this.solicitud.grado._id,
    };

    this.solicitudService.agregarSolicitud(dataSolicitud).subscribe(
      (data) => {
        Swal.fire('Solicitud guardada', 'La solicitud ha sido enviada con éxito', 'success');
        this.loading = false;
        this.limpiarFormulario();
      },
      (error) => {
        this.loading = false;
        Swal.fire('Error', 'Hubo un error al enviar la solicitud', 'error');
        console.log(error);
      }
    );
  }

  limpiarFormulario() {
    this.solicitud = {
      nombre_hijo: '',
      apellido_hijo: '',
      dni_hijo: '',
      telefono_padre: '',
      correo_padre: '',
      grado: { _id: '' }
    };
    this.aceptarTerminos = false;
  }
  
  onSubmit(form: any) {
    if (form.valid && this.aceptarTerminos) {
      this.guardarSolicitud();
    }
  }
  
  validarDatos(): boolean {
    if (!this.solicitud.nombre_hijo || this.solicitud.nombre_hijo.length < 2) {
      this.mostrarMensaje('El nombre del hijo es requerido y debe tener al menos 2 caracteres.');
      return false;
    }

    if (!this.solicitud.apellido_hijo || this.solicitud.apellido_hijo.length < 2) {
      this.mostrarMensaje('El apellido del hijo es requerido y debe tener al menos 2 caracteres.');
      return false;
    }

    if (!this.solicitud.dni_hijo || !/^\d+$/.test(this.solicitud.dni_hijo) || this.solicitud.dni_hijo.length < 8) {
      this.mostrarMensaje('El DNI del hijo es requerido, debe contener solo números y tener al menos 8 dígitos.');
      return false;
    }

    if (!this.solicitud.telefono_padre || !/^\d+$/.test(this.solicitud.telefono_padre) || this.solicitud.telefono_padre.length < 9) {
      this.mostrarMensaje('El teléfono del padre es requerido y debe ser válido.');
      return false;
    }

    if (!this.solicitud.correo_padre || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.solicitud.correo_padre)) {
      this.mostrarMensaje('El correo del padre es requerido y debe tener un formato válido.');
      return false;
    }

    if (!this.solicitud.grado._id) {
      this.mostrarMensaje('Debe seleccionar un grado.');
      return false;
    }

    if (!this.aceptarTerminos) {
      this.mostrarMensaje('Debe aceptar los términos y condiciones.');
      return false;
    }

    return true;
  }

  // Mostrar mensaje de error
  mostrarMensaje(mensaje: string) {
    this.snack.open(mensaje, 'Cerrar', {
      duration: 3000,
    });
  }

  verInformacion(tipoAlumno: string) {
    let titulo = '';
    let iconoSVG = '';

      switch (tipoAlumno) {
          case 'nuevo':
           titulo = '<span class="text-white text-4xl font-bold">Alumno Nuevo</span>';
                  iconoSVG = `

                    <div class="flex justify-center mb-4;">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-24 h-24 text-white mb-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
            </svg>

                              </div>
                              <div class="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg shadow dark:border-gray-600 xl:p-8 dark:bg-white dark:text-blue hover:text-blue-900 ">
                              <ul role="list" class="mb-8 space-y-4 text-left">
                              <li class="flex items-center space-x-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                                </svg>
                                
                                <span>Completar la ficha de admisión 2025.

                                </span>
                              </li>
                              <li class="flex items-center space-x-3">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
                                </svg>
                                <span>Documentos a solicitar:
                                  <ul class="list-disc pl-6">
                  <li>Foto nítida por ambos lados del DNI del alumno.</li>
                  <li>Foto nítida por ambos lados del DNI del P.F. y/o apoderado.</li>
                  <li>Libreta de notas.</li>
                  <li>Cartilla de vacunación.</li>
                </ul>
                                </span>
                                
                              </li>
                              <li class="flex items-center space-x-3">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
            </svg>

                                                    
                                <span>Pago de matrícula.</span>
                                
                              </li>
                          </ul>
            </div>

                  `;
        break;
      case 'regular':
        titulo = '<span class="text-white text-4xl font-bold">Alumno Regular</span>';

        iconoSVG = `<div class="flex justify-center mb-4;">
        <svg  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 100px; height: 100px;" class="w-24 h-24 text-white mb-6"">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
        </svg>
      </div>
      <div class="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg shadow dark:border-gray-600 xl:p-8 dark:bg-white dark:text-blue hover:text-blue-900 ">
       <ul role="list" class="mb-8 space-y-4 text-left">
      <li class="flex items-center space-x-3">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
        </svg>
         
        <span>Actualizar ficha de matrícula 2025.

        </span>
      </li>
      <li class="flex items-center space-x-3">
       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
</svg>

        <span>Firmar el Compromiso de matrícula 2025.
        
        </span>
        
      </li>
      <li class="flex items-center space-x-3">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
        </svg>
                             
        <span>Completar y firmar la ficha médica del estudiante.</span>
         
      </li>
  </ul>
</div>

      `;
        break;
      case 'traslado':
        titulo = '<span class="text-white text-4xl font-bold">Alumno Traslado</span>';

        iconoSVG = `<div class="flex justify-center mb-4;">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-24 h-24 text-white mb-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 9v.906a2.25 2.25 0 0 1-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 0 0 1.183 1.981l6.478 3.488m8.839 2.51-4.66-2.51m0 0-1.023-.55a2.25 2.25 0 0 0-2.134 0l-1.022.55m0 0-4.661 2.51m16.5 1.615a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V8.844a2.25 2.25 0 0 1 1.183-1.981l7.5-4.039a2.25 2.25 0 0 1 2.134 0l7.5 4.039a2.25 2.25 0 0 1 1.183 1.98V19.5Z" />
</svg>

                  </div>
                  <div class="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg shadow dark:border-gray-600 xl:p-8 dark:bg-white dark:text-blue hover:text-blue-900 ">
                   <ul role="list" class="mb-8 space-y-4 text-left">
                  <li class="flex items-center space-x-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                    </svg>
                     
                    <span>Completar la ficha de admisión 2025.

                    </span>
                  </li>
                  <li class="flex items-center space-x-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
                    </svg>
                    <span>Documentos a solicitar:
                     <ul class="list-disc pl-6">
      <li>Foto nítida por ambos lados del DNI del alumno.</li>
      <li>Foto nítida por ambos lados del DNI del P.F. y/o apoderado.</li>
      <li>Libreta de notas.</li>
      <li>Cartilla de vacunación.</li>
    </ul>
                    </span>
                    
                  </li>
                  <li class="flex items-center space-x-3">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
</svg>

                                         
                    <span> Pago de matrícula.</span>
                     
                  </li>
              </ul>
</div>

                  `;
        break;
      default:
        titulo = 'Tipo de Alumno Desconocido';

    }
  
    Swal.fire({
      title: titulo,
      html: `${iconoSVG} `, 
      showConfirmButton: true,
      confirmButtonText: 'Leído',
      background: 'url("../../assets/images/fondex.jpg") no-repeat center center', 
        });
  }

}