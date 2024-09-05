import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../helpers/baseUrl';

@Injectable({
  providedIn: 'root'
})
export class CursoService {
  constructor(private http:HttpClient) {}
  
  listarCursos() {
    return this.http.get(`${baseUrl}/curso/`);
  }
  agregarCurso(curso: any){
    return this.http.post(`${baseUrl}/curso/`, curso);
  }
  modificarCurso(id: string, curso: any){
    return this.http.put(`${baseUrl}/curso/${id}`, curso);
  }
  eliminarCurso(id: string){
    return this.http.delete(`${baseUrl}/curso/${id}`);
  }
  obtenerCurso(id: string) {
    return this.http.get(`${baseUrl}/curso/${id}`);
  }
}
