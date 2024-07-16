import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../../helpers/baseUrl';

@Injectable({
  providedIn: 'root'
})
export class SeccionService {
  constructor(private http:HttpClient) {}
 
  listarSecciones() {
    return this.http.get(`${baseUrl}/seccion/`);
  }
}
