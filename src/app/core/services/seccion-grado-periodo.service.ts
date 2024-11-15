import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../helpers/baseUrl';

@Injectable({
  providedIn: 'root'
})
export class SeccionGradoPeriodoService {
  constructor(private http:HttpClient) {}
 
  listarSeccionGradoPeriodo() {
    return this.http.get(`${baseUrl}/seccion-grado-periodo`);
  }
  agregarSeccionGradoPeriodo(SGP: any){
    return this.http.post(`${baseUrl}/seccion-grado-periodo/`, SGP);
  }
  modificarSeccionGradoPeriodo(id: string, SGP: any){
    return this.http.put(`${baseUrl}/seccion-grado-periodo/${id}`, SGP);
  }
  modificarSeccion(id: string, seccion: any) {
    return this.http.put(`${baseUrl}/seccion-grado-periodo/${id}/seccion`, seccion);
  }
  eliminarSeccionGradoPeriodo(id: string){
    return this.http.delete(`${baseUrl}/seccion-grado-periodo/${id}`);
  }
  obtenerSeccionGradoPeriodo(id: string) {
    return this.http.get(`${baseUrl}/seccion-grado-periodo/${id}`);
  }
  listarSeccionesPorGradoPeriodo(gradoId: string, periodoId: string) {
    return this.http.get(`${baseUrl}/seccion-grado-periodo/${gradoId}/${periodoId}`);
  }
}
