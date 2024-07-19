import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../helpers/baseUrl';

@Injectable({
  providedIn: 'root'
})
export class SeccionService {
  constructor(private http:HttpClient) {}
 
  listarSecciones() {
    return this.http.get(`${baseUrl}/seccion/`);
  }
  agregarSeccion(seccion: any){
    return this.http.post(`${baseUrl}/seccion/`, seccion);
  }
  modificarSeccion(id: string, seccion: any){
    return this.http.put(`${baseUrl}/seccion/${id}`, seccion);
  }
  eliminarSeccion(id: string){
    return this.http.delete(`${baseUrl}/seccion/${id}`);
  }
  obtenerSeccion(id: string) {
    return this.http.get(`${baseUrl}/seccion/${id}`);
  }
}
