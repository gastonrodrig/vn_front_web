import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../helpers/baseUrl';

@Injectable({
  providedIn: 'root'
})
export class CuposService {
  constructor(private http:HttpClient) {}
  
  listarCupos() {
    return this.http.get(`${baseUrl}/cupos/`);
  }
  agregarCupos(cupos: any){
    return this.http.post(`${baseUrl}/cupos/`, cupos);
  }
  modificarCupos(id: string, cupos: any){
    return this.http.put(`${baseUrl}/cupos/${id}`, cupos);
  }
  obtenerCupo(id: string) {
    return this.http.get(`${baseUrl}/cupos/${id}`);
  }
}
