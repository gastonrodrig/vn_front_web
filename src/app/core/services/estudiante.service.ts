import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../helpers/baseUrl';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  constructor(private http:HttpClient) {}
 
  listarEstudiantes() {
    return this.http.get(`${baseUrl}/estudiante/`);
  }
  agregarEstudiante(estudiante: any){
    return this.http.post(`${baseUrl}/estudiante/`, estudiante);
  }
  modificarEstudiante(id: string, estudiante: any){
    return this.http.put(`${baseUrl}/estudiante/${id}`, estudiante);
  }
  eliminarEstudiante(id: string){
    return this.http.delete(`${baseUrl}/estudiante/${id}`);
  }
  obtenerEstudiante(id: string) {
    return this.http.get(`${baseUrl}/estudiante/${id}`);
  }
}
