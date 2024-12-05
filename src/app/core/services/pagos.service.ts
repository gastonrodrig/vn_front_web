import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../helpers/baseUrl';

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  constructor(private http:HttpClient) { }
  
  listarPagos() {
    return this.http.get(`${baseUrl}/pago/`);
  }

  obtenerGananciasPorMes(){
    return this.http.get<{ _id: string, totalGanancias: number }[]>(`${baseUrl}/pago/ganancias-mensuales`);
  }
}
