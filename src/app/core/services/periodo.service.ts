import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../helpers/baseUrl';

@Injectable({
  providedIn: 'root'
})
export class PeriodoService {
  constructor(private http:HttpClient) {}
 
  listarPeriodos() {
    return this.http.get(`${baseUrl}/periodo-escolar/`);
  }
  agregarPeriodo(periodo: any){
    return this.http.post(`${baseUrl}/periodo-escolar/`, periodo);
  }
  modificarPeriodo(id: string, periodo: any){
    return this.http.put(`${baseUrl}/periodo-escolar/${id}`, periodo);
  }
  eliminarPeriodo(id: string){
    return this.http.delete(`${baseUrl}/periodo-escolar/${id}`);
  }
  obtenerPeriodo(id: string) {
    return this.http.get(`${baseUrl}/periodo-escolar/${id}`);
  }
  obtenerPeriodoporanio( anio: string){
    return this.http.get(`${baseUrl}/periodo-escolar/anio/${anio}`)
  }
}