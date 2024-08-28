import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../helpers/baseUrl';

@Injectable({
  providedIn: 'root'
})
export class CursoDocenteService {
  constructor(private http:HttpClient) {}

  agregarCursoDocente(CD: any){
    return this.http.post(`${baseUrl}/curso-docente/`, CD);
  }
  modificarCursoDocente(id: string, CD: any){
    return this.http.put(`${baseUrl}/curso-docente/${id}`, CD);
  }
  eliminarCursoDocente(id: string){
    return this.http.delete(`${baseUrl}/curso-docente/${id}`);
  }
  obtenerCursoDocente(id: string) {
    return this.http.get(`${baseUrl}/curso-docente/${id}`);
  }
  listarDocentesPorCurso(id: string) {
    return this.http.get(`${baseUrl}/curso-docente/curso/${id}`);
  }
  eliminarCursoDocentePorCursoYDocente(cursoId: string, docenteId: string) {
    return this.http.delete(`${baseUrl}/curso-docente/${cursoId}/${docenteId}`);
  }
}
