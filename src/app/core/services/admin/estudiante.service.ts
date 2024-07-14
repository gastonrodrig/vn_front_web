import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../../helpers/baseUrl';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  constructor(private http:HttpClient) {}
 
  listarEstudiantes() {
    return this.http.get(`${baseUrl}/estudiante/`);
  }
  obtenerEstudiante(id: string) {
    return this.http.get(`${baseUrl}/estudiante/${id}`);
  }
}
