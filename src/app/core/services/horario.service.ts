import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../helpers/baseUrl';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {
  constructor(private http:HttpClient) {}
  
  listarHorarios() {
    return this.http.get(`${baseUrl}/horario/`);
  }
  agregarHorario(horario: any){
    return this.http.post(`${baseUrl}/horario/`, horario);
  }
  modificarHorario(id: string, horario: any){
    return this.http.put(`${baseUrl}/horario/${id}`, horario);
  }
  eliminarHorario(id: string){
    return this.http.delete(`${baseUrl}/horario/${id}`);
  }
  obtenerHorario(id: string) {
    return this.http.get(`${baseUrl}/horario/${id}`);
  }
  listarHorariosPorSeccionGrado(seccionId: string, gradoId: string) {
    return this.http.get(`${baseUrl}/horario/seccion/${seccionId}/grado/${gradoId}`);
  }
  listarHorariosPorDocente(docenteId: string) {
    return this.http.get(`${baseUrl}/horario/docente/${docenteId}`);
  }
  obtenerCantidadRegistros(seccionId: string, gradoId: string, cursoId: string) {
    return this.http.get(`${baseUrl}/horario/${seccionId}/${gradoId}/${cursoId}`);
  }
}
