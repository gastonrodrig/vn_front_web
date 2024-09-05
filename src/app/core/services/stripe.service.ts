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
    this.stripePromise = loadStripe('pk_test_51Pr2OvGk8XuMQuxy4SKqcatnltCcjyHPnK0c38oZyOoIKMzRZ429cZHNS1CLPI93FbGRR1KHgFA5ZSzhYtDl4O6j0007JeaqHk');
  }

  getStripe(): Promise<Stripe | null> {
    return this.stripePromise;
  }

  procesarPago(data: any) {
    return this.http.post(`${baseUrl}/stripe/`, data)
  }
}
