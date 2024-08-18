import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../helpers/baseUrl';

@Injectable({
  providedIn: 'root'
})
export class ApoderadoService {
  constructor(private http:HttpClient) {}
 
  listarApoderados() {
    return this.http.get(`${baseUrl}/apoderado/`);
  }
  agregarApoderado(apoderado: any){
    return this.http.post(`${baseUrl}/apoderado/`, apoderado);
  }
  modificarApoderado(id: string, apoderado: any){
    return this.http.put(`${baseUrl}/apoderado/${id}`, apoderado);
  }
  eliminarApoderado(id: string){
    return this.http.delete(`${baseUrl}/apoderado/${id}`);
  }
  obtenerApoderado(id: string) {
    return this.http.get(`${baseUrl}/apoderado/${id}`);
  }
  listarApoderadosPorEstudiante(id: string) {
    return this.http.get(`${baseUrl}/apoderado/estudiante/${id}`)
  }
  asignarUsuario(id: string, usuario: any) {
    return this.http.patch(`${baseUrl}/apoderado/assign-user/${id}`, usuario);
  }
  eliminarUsuario(id: string) {
    return this.http.put(`${baseUrl}/apoderado/remove-user/${id}`, null);
  }
}