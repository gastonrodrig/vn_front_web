import { Component, OnInit } from '@angular/core';
import { StripeService } from '../../../core/services/stripe.service';
import { StripeCardElement, StripeElementChangeEvent, StripeElements, loadStripe } from '@stripe/stripe-js';
import { MatProgressBar } from '@angular/material/progress-bar';
import { EstudianteService } from '../../../core/services/estudiante.service';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-pagar-matricula',
  standalone: true,
  imports: [
    MatProgressBar,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    MatButtonModule
  ],
  templateUrl: './pagar-matricula.component.html',
  styleUrls: ['./pagar-matricula.component.css']
})
export class PagarMatriculaComponent implements OnInit {
  private elements: StripeElements | undefined;
  private card: StripeCardElement | undefined;
  stripeError: string | undefined;
  loading = false
  dni = ''
  nombreUsuario = ''
  estudiantes: any
  estudiante: any

  constructor(
    private stripeService: StripeService,
    private estudianteService: EstudianteService,
    private authService: AuthService,
    private snack: MatSnackBar
  ) {}

  async ngOnInit() {
    this.estudianteService.listarEstudiantes().subscribe(
      (data: any) => {
        this.estudiantes = data
      }
    )
    const stripe = await this.stripeService.getStripe();
    if (stripe) {
      this.elements = stripe.elements();
      this.card = this.elements.create('card', { hidePostalCode: false });
      this.card.mount('#card-element');
      this.card.on('change', (event: StripeElementChangeEvent) => {
        this.stripeError = event.error?.message;
      });
    }
  }

  desbloquear() {
    const user = this.authService.getUser()
    this.estudiante = this.estudiantes.find((e: any) => e.numero_documento === this.dni)

    if (this.estudiante === undefined) {
      this.mostrarMensaje('El Dni ingresado no existe.', 3000)
      return
    }
  }

  async handleSubmit(event: Event) {
    event.preventDefault();
  
    if (!this.card) return;
  
    const stripe = await this.stripeService.getStripe();
    const { paymentMethod, error } = await stripe!.createPaymentMethod({
      type: 'card',
      card: this.card,
    });
  
    if (error) {
      console.error(error);
      this.stripeError = error.message;
    } else {
      const paymentData = {
        amount: 1000, // Cantidad en centavos
        currency: 'pen', // Moneda
        paymentMethodId: paymentMethod.id,
        // No incluyas stripeOperationId aquí ya que se genera en el backend
      };
      console.log(paymentMethod);
  
      this.stripeService.procesarPago(paymentData).subscribe(
        (response: any) => {
          console.log('Payment successful:', response);
          // Maneja la respuesta del backend
        },
        (error) => {
          console.error('Payment failed:', error);
          // Maneja el error
        }
      );
    }
  }

  mostrarMensaje(message: string, duration: number) {
    this.snack.open(message, 'Cerrar', {
      duration: duration
    })
    this.loading = false
  }
}