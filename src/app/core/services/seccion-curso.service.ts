import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../helpers/baseUrl';

@Injectable({
  providedIn: 'root'
})
export class SeccionCursoService {
  constructor(private http:HttpClient) {}

  listarSeccionCurso(){
    return this.http.get(`${baseUrl}/seccion-curso/`)
  }
  agregarSeccionCurso(SC:any){
    return this.http.post(`${baseUrl}/seccion-curso/`,SC);
  }
  obtenerSeccionCurso(id: string){
    return this.http.get(`${baseUrl}/seccion-curso/${id}`);
  }
  listarSeccionesPorCurso(id: string) {
    return this.http.get(`${baseUrl}/seccion-curso/${id}`);
  }
}
