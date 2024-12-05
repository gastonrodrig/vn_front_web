import { Component, OnInit } from '@angular/core';
import { StripeService } from '../../../core/services/stripe.service';
import { StripeCardElement, StripeElementChangeEvent, StripeElements } from '@stripe/stripe-js';
import { MatProgressBar } from '@angular/material/progress-bar';
import { EstudianteService } from '../../../core/services/estudiante.service';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { DocumentoService } from '../../../core/services/documento.service';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { GmailService } from '../../../core/services/gmail.service';
import { SolicitudService } from '../../../core/services/solicitud.service';
import { VacanteService } from '../../../core/services/vacante.service';
import { MatriculaService } from '../../../core/services/matricula.service';
import { UserService } from '../../../core/services/user.service';
import { PensionService } from '../../../core/services/pension.service';
import { listaMeses } from '../../../shared/constants/itemsMonths';
import { SoloNumerosDirective } from '../../../shared/directives/solo-numeros.directive';
import { MatRadioModule } from '@angular/material/radio';
import { PeriodoService } from '../../../core/services/periodo.service';
import { PagoService } from '../../../core/services/pagos.service';

@Component({
  selector: 'app-pagar-matricula',
  standalone: true,
  imports: [
    MatProgressBar,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    CommonModule,
    MatSelectModule,
    MatIconModule,
    SoloNumerosDirective,
    MatRadioModule
  ],
  templateUrl: './pagar-matricula.component.html',
  styleUrls: ['./pagar-matricula.component.css']
})
export class PagarMatriculaComponent implements OnInit {
  private elements: StripeElements | undefined;
  private card: StripeCardElement | undefined;
  stripeError: string | undefined;
  loading = false;
  estudiantes: any;
  estudiante: any;
  estudianteId: any;
  tiposDocumento: any;
  tipoPago: string = 'boleta';
  documento: any

  dni = '';
  nombreUsuario = '';

  name = '';
  number = '';
  email = '';
  line1 = '';
  n_doc = '';
  periodoid: any;

  isDisabled = true;
  listaMeses: any
  tipoPagoSeleccionado: boolean = false;

  constructor(
    private stripeService: StripeService,
    private estudianteService: EstudianteService,
    private authService: AuthService,
    private documentoService: DocumentoService,
    private gmailService: GmailService,
    private solicitudService: SolicitudService,
    private vacanteService: VacanteService,
    private matriculaService: MatriculaService,
    private usuarioService: UserService,
    private periodoService: PeriodoService,
    private pensionService: PensionService,
    private pagoService: PagoService,
    private snack: MatSnackBar
  ) {}

  onTipoPagoChange() {
    this.tipoPagoSeleccionado = !!this.tipoPago;
    this.cargarElementosStripe();
  }

  ngOnInit() {
    this.listaMeses = listaMeses;
    this.estudianteService.listarEstudiantes().subscribe(
      (data: any) => {
        this.estudiantes = data;
      }
    );
    this.documentoService.listarTiposDocumento().subscribe(
      (data: any) => {
        this.tiposDocumento = data;
      }
    );
    this.cargarElementosStripe();
  }

  desbloquear() {
    this.loading = true;
    const user = this.authService.getUser();
    this.estudiante = this.estudiantes.find((e: any) => e.numero_documento === this.dni);

    if (this.dni === '') {
      this.mostrarMensaje('El Dni es requerido.', 3000);
      return;
    }

    if (this.estudiante === undefined) {
      this.mostrarMensaje('El Dni ingresado no existe.', 3000);
      return;
    }

    if (this.nombreUsuario !== user.usuario) {
      this.mostrarMensaje('El nombre de usuario ingresado es incorrecto.', 3000)
      return
    }

    this.estudianteId = this.estudiante._id

    this.estudianteService.obtenerEstudiante(this.estudianteId).subscribe(
      (data: any) => {
        this.estudiante = data
        this.solicitudService.obtenerSolicitudPorDni(data.numero_documento).subscribe(
          (data: any) => {
            if (data.estado !== 'Aprobado') {
              this.mostrarMensaje('Los documentos del estudiante aún no han sido aprobados.', 3000)
            } else {
              this.isDisabled = false
              this.loading = false
            }
          }
        )
      }
    )
  }

  async cargarElementosStripe() {
    const stripe = await this.stripeService.getStripe();
    if (stripe) {
      this.elements = stripe.elements();
      this.card = this.elements.create('card', { hidePostalCode: false });
  
      // Verifica que el contenedor exista antes de montar
      setTimeout(() => {
        const cardElementContainer = document.getElementById('card-element');
        if (cardElementContainer) {
          this.card?.mount('#card-element');
  
          // Manejo de errores en validación
          this.card?.on('change', (event: StripeElementChangeEvent) => {
            if (event.error) {
              this.mostrarMensaje(event.error.message, 3000); // Mostrar mensaje de error
            }
          });
        } else {
          console.error('El contenedor #card-element no está disponible.');
        }
      }, 0); // Espera mínima para garantizar que el DOM esté listo
    }
  }

  async pagar() {
    this.loading = true
    if (!this.card) {
      return;
    }
    
    const stripe = await this.stripeService.getStripe();
    const { paymentMethod, error } = await stripe!.createPaymentMethod({
      type: 'card',
      card: this.card,
      billing_details: {
        address: {
          city: 'Lima',
          country: 'PE',
          state: 'Departamento de Lima',
          line1: this.line1
        },
        email: this.email,
        name: this.name,
        phone: this.number
      },
    });
    
    if (error) {
      console.error(error);
      this.mostrarMensaje(error.message, 3000);
      this.stripeError = error.message;
    } else {
      const paymentData = {
        nombre_completo: this.name,
        monto: 1000,
        divisa: 'pen',
        paymentMethodId: paymentMethod.id,
        metadata: {
          nroDocumento: this.documento,
        },
      };
     
      //VALIDACIONES
      if(this.name === ''){
        this.mostrarMensaje('el nombre es requerido',3000);
        return;
      }
      if(this.number === ''){
        this.mostrarMensaje('el numero es requerido',3000);
        return;
      }
      if(this.email ===''){
        this.mostrarMensaje('El correo se encuentra vacio',3000);
        return;
      }
      if(this.documento === ''){
        this.mostrarMensaje('Numero de Documento Vacio',3000);
        return;
      }
      if(this.line1 === ''){
        this.mostrarMensaje('La Direccion se encuentra vacia',3000);
        return;
      }

      this.stripeService.procesarPago(paymentData).subscribe(
        async (response: any) => {
          console.log('Payment successful:', response);
          const stripeOperationId  = response.stripeOperationId;

          this.estudianteService.cambiarEstadoEstudiante(this.estudianteId, { estado: 'Pagó' }).subscribe(
            (data: any) => {
              console.log(data);
            }
          )

          this.vacanteService.obtenerVacantePorEstudiante(this.estudianteId).subscribe(
            (data: any) => {
              const vacanteId = data[0]._id
              this.vacanteService.cambiarEstado(vacanteId, { estado: 'Confirmado' }).subscribe(
                (data: any) => {
                  console.log(data)
                }
              )
            }
          )

          const dataMatricula = {
            monto: 300,
            metodo_pago: 'Tarjeta',
            n_operacion: Math.floor(10000000 + Math.random() * 90000000).toString(),
            periodo_id: this.estudiante.periodo._id,
            estudiante_id: this.estudianteId,
            tipo: 'Virtual',
            tipoMa: 'Nuevo',
            fecha: new Date()
          }

          this.matriculaService.agregarMatricula(dataMatricula).subscribe(
            (data: any) => {
              const pagoData = {
                monto: data.monto,
                divisa: 'PEN',
                paymentMethodId: data.metodo_pago,
                nombre_completo: `${this.estudiante.nombre} ${this.estudiante.apellido}`,
                transactionDetails: `Pago de matrícula del estudiante con ID ${this.estudiante._id}`,
                status: 'Aprobado',
                stripeOperationId: data.n_operacion,
                metadata: {
                  nroDocumento: this.documento,
                },
                paymentDate: data.fecha,
              };

              this.pagoService.crearPago(pagoData).subscribe(
                (data: any) => {
                  console.log('Pago creado:', data);
                  this.loading = false
                }
              );

              const currentYear = new Date().getFullYear();

              this.listaMeses.forEach((mes: any) => {
                const monthIndex = mes.indice;
              
                const fechaInicio = new Date(currentYear, monthIndex, 1);
                const fechaFin = new Date(currentYear, monthIndex + 1, 0);
                
                this.periodoService.obtenerPeriodoporanio(currentYear.toString()).subscribe(
                  (data: any)=>{
                    this.periodoid = data._id
                    
                    const pensionData = {
                      estudiante_id: this.estudianteId,
                      monto: 150,
                      fecha_inicio: fechaInicio.toISOString(),
                      fecha_limite: fechaFin.toISOString(),
                      mes: mes.nombre,
                      periodo_id: this.periodoid,
                    };
                    this.pensionService.agregarPension(pensionData).subscribe(
                      (data: any) => {
                        console.log('Pensión agregada:', data);
                        this.loading = false
                      }
                    );
                  }
                )
              });
            },
            (error) => {
              this.mostrarMensaje(error.error.message, 3000)
            }
          )

          await this.enviarCorreoConBoleta(stripeOperationId);
          this.loading = false
        },
        (error) => {
          this.loading = false
          console.error('Payment failed:', error);
        }
      );
    }
  }

  async enviarCorreoConBoleta(operationId: string) {
    const correoData = {
      to: this.email,
      subject: 'Boleta de Pago - Virgen de la Natividad',
      dni: this.dni
    };

    try {
      await this.gmailService.sendEmailPdf(operationId, correoData).toPromise();
      this.mostrarMensaje('Se le ha enviado la boleta a su correo adjuntado en el pago.', 3000);

      
      // this.usuarioService.eliminarUsuario()
      this.loading = false
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      this.mostrarMensaje('Error al enviar el correo.', 3000);
      this.loading = false
    }
  }

  mostrarMensaje(message: any, duration: number) {
    this.snack.open(message, 'Cerrar', {
      duration: duration
    });
    this.loading = false;
  }
}