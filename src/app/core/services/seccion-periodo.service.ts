import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../helpers/baseUrl';

@Injectable({
  providedIn: 'root'
})
export class SeccionPeriodoService {
  constructor(private http:HttpClient) {}
 
  listarSeccionPorPeriodo(id: string) {
    return this.http.get(`${baseUrl}/seccion-periodo/periodo/${id}`);
  }
}