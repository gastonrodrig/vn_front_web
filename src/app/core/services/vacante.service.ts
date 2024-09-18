import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../helpers/baseUrl';

@Injectable({
  providedIn: 'root'
})
export class VacanteService {

  constructor(private http:HttpClient) {}
  
  listarVacantes() {
    return this.http.get(`${baseUrl}/vacante/`);
  }
  agregarVacantes(vacante: any){
    return this.http.post(`${baseUrl}/vacante/`, vacante);
  }
  obtenerVacante(id: string) {
    return this.http.get(`${baseUrl}/vacante/${id}`);
  }
  cambiarEstado(id: string, data: any) {
    return this.http.patch(`${baseUrl}/vacante/change-state/${id}`, data);
  }
  obtenerVacantePorEstudiante(id: string) {
    return this.http.get(`${baseUrl}/vacante/estudiante/${id}`);
  }
}
