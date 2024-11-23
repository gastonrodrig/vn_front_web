import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../helpers/baseUrl';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})

export class SolicitudService {
  
  constructor(private http: HttpClient) {}

  listarSolicitudes() {
    return this.http.get(`${baseUrl}/solicitud/`);
  }
  agregarSolicitud(solicitud: any) {
    return this.http.post(`${baseUrl}/solicitud/`, solicitud);
  }
  obtenerSolicitud(id: string) {
    return this.http.get(`${baseUrl}/solicitud/${id}`);
  }
  cambiarEstadoEnProceso(id: string) {
    return this.http.patch(`${baseUrl}/solicitud/process/${id}`, null);
  }
  cambiarEstadoAprobado(id: string) {
    return this.http.patch(`${baseUrl}/solicitud/approve/${id}`, null);
  }
  cambiarEstadoCancelado(id: string) {
    return this.http.patch(`${baseUrl}/solicitud/cancel/${id}`, null);
  }
  obtenerSolicitudPorDni(dni: string) {
    return this.http.get(`${baseUrl}/solicitud/documento/${dni}`);
  }
  obtenerSolicitudPorMes(){
    return this.http.get<number>(`${baseUrl}/solicitud/solicitudes/por-mes`);
  }
}
