import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../helpers/baseUrl';

@Injectable({
  providedIn: 'root'
})
export class NotasService {
  constructor(private http:HttpClient) {}
 
  obtenerNota(estudianteId: any, cursoId: any, bimestreId: any, seccionId: any, tipoNota: any) {
    return this.http.get(`${baseUrl}/notas/${estudianteId}/${cursoId}/${bimestreId}/${seccionId}/${tipoNota}`);
  }
  cambiarEstadoAprobado(notaId: any){
    return this.http.patch(`${baseUrl}/notas/approve/${notaId}`, null);
  }
  cambiarEstadoCancelado(notaId: any){
    return this.http.patch(`${baseUrl}/notas/cancel/${notaId}`, null);
  }
}