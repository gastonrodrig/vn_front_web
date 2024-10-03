import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../helpers/baseUrl';

@Injectable({
  providedIn: 'root'
})
export class TutorService {
  constructor(private http:HttpClient) {}

  listarTutores() {
    return this.http.get(`${baseUrl}/tutor/`);
  }
  agregarTutor(tutor: any){
    return this.http.post(`${baseUrl}/tutor/`, tutor);
  }
  modificarTutor(id: string, tutor: any){
    return this.http.put(`${baseUrl}/tutor/${id}`, tutor);
  }
  eliminarTutor(id: string){
    return this.http.delete(`${baseUrl}/tutor/${id}`);
  }
  obtenerTutor(id: string) {
    return this.http.get(`${baseUrl}/tutor/${id}`);
  }
  asignarUsuario(id: string, usuario: any) {
    return this.http.patch(`${baseUrl}/tutor/assign-user/${id}`, usuario);
  }
  eliminarUsuario(id: string) {
    return this.http.put(`${baseUrl}/tutor/remove-user/${id}`, null);
  }
  modificarPerfilTutor(id: string, data: FormData) {
    return this.http.patch(`${baseUrl}/tutor/${id}/profile-picture/`, data);
  }
  obtenerTutorPorNroDoc(numero_documento: string, validarUsuario: any) {
    return this.http.get(`${baseUrl}/tutor/documento/${numero_documento}?validarUsuarioAsignado=${validarUsuario}`);
  }
}
