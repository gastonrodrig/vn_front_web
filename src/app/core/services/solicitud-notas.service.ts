import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../helpers/baseUrl';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudNotasService {
  
  constructor(private http: HttpClient) {}

  listarSolicitudesNotas(): Observable<any> {
    return this.http.get(`${baseUrl}/solicitud-notas/`);
  }

  agregarSolicitudNotas(solicitudNotas: any): Observable<any> {
    return this.http.post(`${baseUrl}/solicitud-notas/`, solicitudNotas);
  }

  obtenerSolicitudNotas(id: string): Observable<any> {
    return this.http.get(`${baseUrl}/solicitud-notas/${id}`);
  }

  actualizarSolicitudNotas(id: string, solicitudNotas: any): Observable<any> {
    return this.http.put(`${baseUrl}/solicitud-notas/${id}`, solicitudNotas);
  }

  aprobarSolicitudNotas(id: string): Observable<any> {
    return this.http.patch(`${baseUrl}/solicitud-notas/approve/${id}`, null);
  }

  rechazarSolicitudNotas(id: string): Observable<any> {
    return this.http.patch(`${baseUrl}/solicitud-notas/reject/${id}`, null);
  }
}
