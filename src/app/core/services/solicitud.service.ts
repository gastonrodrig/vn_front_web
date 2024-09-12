import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../helpers/baseUrl';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})

export class SolicitudService {
  
  constructor(private http: HttpClient) {}

  // Listar todas las solicitudes
  listarSolicitudes() {
    return this.http.get(`${baseUrl}/solicitud/`);
  }

  // Agregar una nueva solicitud
  agregarSolicitud(solicitud: any) {
    return this.http.post(`${baseUrl}/solicitud/`, solicitud);
  }

  // Modificar una solicitud existente por ID
  modificarSolicitud(id: string, solicitud: any) {
    return this.http.put(`${baseUrl}/solicitud/${id}`, solicitud);
  }

  // Eliminar una solicitud por ID
  eliminarSolicitud(id: string) {
    return this.http.delete(`${baseUrl}/solicitud/${id}`);
  }

  // Obtener una solicitud por ID
  obtenerSolicitud(id: string) {
    return this.http.get(`${baseUrl}/solicitud/${id}`);
  }
}
