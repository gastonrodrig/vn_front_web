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
    MatIconModule
  ],
  templateUrl: './pagar-matricula.component.html',
  styleUrls: ['./pagar-matricula.component.css']
})
export class PagarMatriculaComponent implements OnInit {
  private elements: StripeElements | undefined;
  private card: StripeCardElement | undefined;
  stripeError: string | undefined;
  loading = false
  estudiantes: any
  estudiante: any
  estudianteId: any
  tiposDocumento: any

  dni = ''
  nombreUsuario = ''

  name = ''
  number = ''
  email = ''
  line1 = ''
  tipoDoc = ''
  n_doc = ''

  isDisabled = true

  constructor(
    private stripeService: StripeService,
    private estudianteService: EstudianteService,
    private authService: AuthService,
    private documentoService: DocumentoService,
    private snack: MatSnackBar
  ) {}

  ngOnInit() {
    this.estudianteService.listarEstudiantes().subscribe(
      (data: any) => {
        this.estudiantes = data
      }
    )
    this.documentoService.listarTiposDocumento().subscribe(
      (data: any) => {
        this.tiposDocumento = data
      }
    )
    this.cargarElementosStripe()
  }

  desbloquear() {
    this.loading = true
    const user = this.authService.getUser()
    this.estudiante = this.estudiantes.find((e: any) => e.numero_documento === this.dni)

    if (this.dni === '') {
      this.mostrarMensaje('El Dni es requerido.', 3000)
      return
    }

    if (this.estudiante === undefined) {
      this.mostrarMensaje('El Dni ingresado no existe.', 3000)
      return
    }
  
    if (this.nombreUsuario !== user.usuario) {
      this.mostrarMensaje('El nombre de usuario ingresado es incorrecto.', 3000)
      return
    }

    this.estudianteId = this.estudiante._id
    
    this.estudianteService.obtenerEstudiante(this.estudianteId).subscribe(
      (data: any) => {
        if(data.estado === 'Pendiente') {
          this.mostrarMensaje('Los documentos del estudiante aun no han sido aprobados.', 3000);
        }
        else {
          this.isDisabled = false
          this.loading = false
        }
      }
    )
  }

  async cargarElementosStripe() {
    const stripe = await this.stripeService.getStripe();
    if (stripe) {
      this.elements = stripe.elements();
      this.card = this.elements.create('card', { hidePostalCode: false });
      this.card.mount('#card-element');
      this.card.on('change', (event: StripeElementChangeEvent) => {
        if(event.error) {
          this.mostrarMensaje(event.error?.message, 3000)
        }
      });
    }
  }

  async pagar() {
    if (!this.card){
      return
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
      this.mostrarMensaje(error.message, 3000)   
      this.stripeError = error.message;
    } else {
      const paymentData = {
        amount: 1000,
        currency: 'pen',
        paymentMethodId: paymentMethod.id,
        metadata: {
          tipoDocumento: this.tipoDoc,
          nroDocumento: this.n_doc
        }
      };
      console.log(paymentMethod);
  
      this.stripeService.procesarPago(paymentData).subscribe(
        (response: any) => {
          console.log('Payment successful:', response);
        },
        (error) => {
          console.error('Payment failed:', error);
        }
      );
    }
  }

  mostrarMensaje(message: any, duration: number) {
    this.snack.open(message, 'Cerrar', {
      duration: duration
    })
    this.loading = false
  }
}