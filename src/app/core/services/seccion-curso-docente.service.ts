import { Injectable } from '@angular/core';
import { baseUrl } from '../helpers/baseUrl';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SeccionCursoDocenteService {
  constructor(private http:HttpClient) {}
 
  agregarSeccionCursoDocente(SCD: any){
    return this.http.post(`${baseUrl}/seccion-curso-docente/`, SCD);
  }
  eliminarSeccionCursoDocente(id: string) {
    return this.http.delete(`${baseUrl}/seccion-curso-docente/${id}`);
  }
  obtenerSeccionCursoDocentePorSeccionCursoYDocente(seccionId: string, cursoId: string, docenteId: string){
    return this.http.get(`${baseUrl}/seccion-curso-docente/${seccionId}/${cursoId}/${docenteId}`);
  }
}
