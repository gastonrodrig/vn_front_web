import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../helpers/baseUrl';

@Injectable({
  providedIn: 'root'
})
export class GradoService {
  constructor(private http:HttpClient) {}
 
  listarGrados() {
    return this.http.get(`${baseUrl}/grado/`);
  }
  agregarGrado(grado: any){
    return this.http.post(`${baseUrl}/grado/`, grado);
  }
  modificarGrado(id: string, grado: any){
    return this.http.put(`${baseUrl}/grado/${id}`, grado);
  }
  eliminarGrado(id: string){
    return this.http.delete(`${baseUrl}/grado/${id}`);
  }
  obtenerGrado(id: string) {
    return this.http.get(`${baseUrl}/grado/${id}`);
  }
}
