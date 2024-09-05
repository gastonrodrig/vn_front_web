import { Component, OnInit } from '@angular/core';
import { StripeService } from '../../../core/services/stripe.service';
import { StripeCardElement, StripeElementChangeEvent, StripeElements, loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-pagar-matricula',
  standalone: true,
  templateUrl: './pagar-matricula.component.html',
  styleUrls: ['./pagar-matricula.component.css']
})
export class PagarMatriculaComponent implements OnInit {
  private elements: StripeElements | undefined;
  private card: StripeCardElement | undefined;
  stripeError: string | undefined;

  constructor(private stripeService: StripeService) {}

  async ngOnInit() {
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
}