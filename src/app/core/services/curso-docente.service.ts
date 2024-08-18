import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../helpers/baseUrl';

@Injectable({
  providedIn: 'root'
})
export class CursoDocenteService {
  constructor(private http:HttpClient) {}

  agregarCursoDocente(CD: any){
    return this.http.post(`${baseUrl}/cursos-docente/`, CD);
  }
  modificarCursoDocente(id: string, CD: any){
    return this.http.put(`${baseUrl}/cursos-docente/${id}`, CD);
  }
  eliminarCursoDocente(id: string){
    return this.http.delete(`${baseUrl}/cursos-docente/${id}`);
  }
  obtenerCursoDocente(id: string) {
    return this.http.get(`${baseUrl}/cursos-docente/${id}`);
  }
  listarDocentesPorCurso(id: string) {
    return this.http.get(`${baseUrl}/cursos-docente/curso/${id}`);
  }
  eliminarCursoDocentePorCursoYDocente(cursoId: string, docenteId: string) {
    return this.http.delete(`${baseUrl}/cursos-docente/${cursoId}/${docenteId}`);
  }
}
