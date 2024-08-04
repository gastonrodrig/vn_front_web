import { Injectable } from '@angular/core';
import { baseUrl } from '../helpers/baseUrl';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GradoCursosHorasService {
  constructor(private http:HttpClient) {}
 
  agregarGradoCursosHoras(GC: any){
    return this.http.post(`${baseUrl}/grado-cursos-horas/`, GC);
  }
  obtenerGradoCursosHoras(id: string) {
    return this.http.get(`${baseUrl}/grado-cursos-horas/${id}`);
  }
  modificarHorasPorGradoCurso(gradoId: string, cursoId: string, GC: any){
    return this.http.patch(`${baseUrl}/grado-cursos-horas/${gradoId}/${cursoId}`, GC);
  }
  listarGradoCursosHorasPorGrado(id: string) {
    return this.http.get(`${baseUrl}/grado-cursos-horas/grado/${id}`);
  }
  listarGradosCursosHorasPorCurso(id: string) {
    return this.http.get(`${baseUrl}/grado-cursos-horas/curso/${id}`);
  }
  eliminarGradoCursosHorasPorGradoYCurso(gradoId: string, cursoId: string) {
    return this.http.delete(`${baseUrl}/grado-cursos-horas/${gradoId}/${cursoId}`);
  }
  obtenerHorasPorGradoYCurso(cursoId: string, gradoId: string) {
    return this.http.get(`${baseUrl}/grado-cursos-horas/${cursoId}/${gradoId}`);
  }
}
