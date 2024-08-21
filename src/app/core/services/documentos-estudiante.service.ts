import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../helpers/baseUrl';

@Injectable({
  providedIn: 'root'
})
export class DocumentosEstudianteService {
  constructor(private http:HttpClient) {}
 
  agregarDocumentos(data: FormData) {
    return this.http.post(`${baseUrl}/documentos-estudiante`, data);
  }
  obtenerDocumentosPorEstudiante(id: string) {
    return this.http.get(`${baseUrl}/documentos-estudiante/estudiante/${id}`);
  }
  actualizarDocumentos(id: string, data: FormData) {
    return this.http.put(`${baseUrl}/documentos-estudiante/${id}`, data);
  }
}