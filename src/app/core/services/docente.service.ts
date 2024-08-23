import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { baseUrl } from "../helpers/baseUrl";

@Injectable({
  providedIn: 'root'
})
export class DocenteService {
  constructor(private http:HttpClient) {}
  
  listarDocentes() {
    return this.http.get(`${baseUrl}/docente/`);
  }
  agregarDocente(docente: any){
    return this.http.post(`${baseUrl}/docente/`, docente);
  }
  modificarDocente(id: string, docente: any){
    return this.http.put(`${baseUrl}/docente/${id}`, docente);
  }
  eliminarDocente(id: string){
    return this.http.delete(`${baseUrl}/docente/${id}`);
  }
  obtenerDocente(id: string) {
    return this.http.get(`${baseUrl}/docente/${id}`);
  }
  asignarUsuario(id: string, usuario: any) {
    return this.http.patch(`${baseUrl}/docente/assign-user/${id}`, usuario);
  }
  eliminarUsuario(id: string) {
    return this.http.put(`${baseUrl}/docente/remove-user/${id}`, null);
  }
  modificarPerfilDocente(id: string, data: FormData) {
    return this.http.patch(`${baseUrl}/docente/${id}/profile-picture/`, data);
  }
  obtenerPerfilDocente(id: string) {
    return this.http.get(`${baseUrl}/docente/${id}/profile-picture/`);
  }
}