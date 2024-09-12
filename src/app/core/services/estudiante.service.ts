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
  asignarSeccion(id: string, seccion: any) {
    return this.http.patch(`${baseUrl}/estudiante/assign-seccion/${id}`, seccion);
  }
  eliminarSeccion(id: string) {
    return this.http.put(`${baseUrl}/estudiante/remove-seccion/${id}`, null);
  }
  listarEstudiantePorGradoYPeriodo(gradoId: string, periodoId: string) {
    return this.http.get(`${baseUrl}/estudiante/grado/${gradoId}/periodo/${periodoId}`);
  }
  listarEstudiantePorSeccionGradoYPeriodo(seccionId: string, gradoId: string, periodoId: string) {
    return this.http.get(`${baseUrl}/estudiante/seccion/${seccionId}/grado/${gradoId}/periodo/${periodoId}`);
  }
  asignarUsuario(id: string, usuario: any) {
    return this.http.patch(`${baseUrl}/estudiante/assign-user/${id}`, usuario);
  }
  eliminarUsuario(id: string) {
    return this.http.put(`${baseUrl}/estudiante/remove-user/${id}`, null);
  }
  modificarPerfilEstudiante(id: string, data: FormData) {
    return this.http.patch(`${baseUrl}/estudiante/${id}/profile-picture/`, data);
  }
  cambiarEstadoEstudiante(id: string, data: any) {
    return this.http.patch(`${baseUrl}/estudiante/change-state/${id}`, data);
  }
  modificarArchivosEstudiante(id: string, data: FormData) {
    return this.http.put(`${baseUrl}/estudiante/assign-files/${id}`, data)
  }
  obtenerEstudiantePorNroDoc(numero_documento: string) {
    return this.http.get(`${baseUrl}/estudiante/documento/${numero_documento}`)
  }
}
