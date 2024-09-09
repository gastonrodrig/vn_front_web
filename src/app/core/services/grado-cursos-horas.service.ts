import { Injectable } from '@angular/core';
import { baseUrl } from '../helpers/baseUrl';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GradoCursosHorasService {
  constructor(private http:HttpClient) {}
 
  agregarGradoCursosHoras(GC: any){
    return this.http.post(`${baseUrl}/grado-curso-horas/`, GC);
  }
  obtenerGradoCursosHoras(id: string) {
    return this.http.get(`${baseUrl}/grado-curso-horas/${id}`);
  }
  modificarHorasPorGradoCurso(gradoId: string, cursoId: string, GC: any){
    return this.http.patch(`${baseUrl}/grado-curso-horas/${gradoId}/${cursoId}`, GC);
  }
  listarGradoCursosHorasPorGrado(id: string) {
    return this.http.get(`${baseUrl}/grado-curso-horas/grado/${id}`);
  }
  listarGradosCursosHorasPorCurso(id: string) {
    return this.http.get(`${baseUrl}/grado-curso-horas/curso/${id}`);
  }
  eliminarGradoCursosHorasPorGradoYCurso(gradoId: string, cursoId: string) {
    return this.http.delete(`${baseUrl}/grado-curso-horas/${gradoId}/${cursoId}`);
  }
  obtenerHorasPorGradoYCurso(cursoId: string, gradoId: string) {
    return this.http.get(`${baseUrl}/grado-curso-horas/${cursoId}/${gradoId}`);
  }
}
