import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from '../helpers/baseUrl';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private stripePromise: Promise<Stripe | null>;

  constructor(private http: HttpClient) {
    this.stripePromise = loadStripe(environment.stripePublicKey.toString());
  }

  getStripe() {
    return this.stripePromise;
  }
  
  procesarPago(data: any) {
    return this.http.post(`${baseUrl}/stripe/angular`, data)
  }
}
