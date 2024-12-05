import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../helpers/baseUrl';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http:HttpClient) {}

  listarUsuarios() {
    return this.http.get(`${baseUrl}/user/`);
  }
  agregarUsuario(usuario: any){
    return this.http.post(`${baseUrl}/user/`, usuario);
  }
  modificarUsuario(id: string, usuario: any){
    return this.http.put(`${baseUrl}/user/${id}`, usuario);
  }
  eliminarUsuario(id: string){
    return this.http.delete(`${baseUrl}/user/${id}`);
  }
  obtenerUsuario(id: string) {
    return this.http.get(`${baseUrl}/user/${id}`);
  }
  modificarContrasenia(id: string, password: any) {
    return this.http.patch(`${baseUrl}/user/${id}/change-password`, password)
  }
  habilitarUsuario(id: string) {
    return this.http.patch(`${baseUrl}/user/${id}/activate`, null)
  }
  deshabilitarUsuario(id: string) {
    return this.http.patch(`${baseUrl}/user/${id}/deactivate`, null)
  }
  eliminarPerfil(id: string){
    return this.http.patch(`${baseUrl}/user/${id}/remove-profile`, null);
  }

  contarUsuariosHabilitados() {
    return this.http.get<number>(`${baseUrl}/user/usuarios/count/habilitados`);
  }
}
