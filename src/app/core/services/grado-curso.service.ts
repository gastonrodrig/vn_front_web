import { Injectable } from '@angular/core';
import { baseUrl } from '../helpers/baseUrl';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GradoCursoService {
  constructor(private http:HttpClient) {}
 
  agregarGradoCurso(GC: any){
    return this.http.post(`${baseUrl}/grado-cursos/`, GC);
  }
  modificarGradoCurso(id: string, GC: any){
    return this.http.put(`${baseUrl}/grado-cursos/${id}`, GC);
  }
  eliminarGradoCurso(id: string){
    return this.http.delete(`${baseUrl}/grado-cursos/${id}`);
  }
  obtenerGradoCurso(id: string) {
    return this.http.get(`${baseUrl}/grado-cursos/${id}`);
  }
  listarCursosPorGrado(id: string) {
    return this.http.get(`${baseUrl}/grado-cursos/grado/${id}`);
  }
  listarGradosPorCurso(id: string) {
    return this.http.get(`${baseUrl}/grado-cursos/curso/${id}`);
  }
  eliminarGradoCursoPorGradoYCurso(gradoId: string, cursoId: string) {
    return this.http.delete(`${baseUrl}/grado-cursos/${gradoId}/${cursoId}`);
  }
}
