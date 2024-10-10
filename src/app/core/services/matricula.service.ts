import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../helpers/baseUrl';

@Injectable({
  providedIn: 'root'
})
export class MatriculaService {
  constructor(private http:HttpClient) { }
  
  listarMatriculas() {
    return this.http.get(`${baseUrl}/matricula/`);
  }
  agregarMatricula(matricula: any){
    return this.http.post(`${baseUrl}/matricula/`, matricula);
  }
  obtenerMatricula(id: string) {
    return this.http.get(`${baseUrl}/matricula/${id}`);
  }
  listarMatriculasPorEstudiante(id: string) {
    return this.http.get(`${baseUrl}/matricula/estudiante/${id}`);
  }
}
