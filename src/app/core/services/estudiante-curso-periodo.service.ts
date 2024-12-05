import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../helpers/baseUrl';

@Injectable({
  providedIn: 'root'
})  
export class EstudianteCursoPeriodoService {
  constructor(private http:HttpClient) {}
  
  agregarEstudianteCursoPeriodo(estudianteCursoPeriodo: any){
    return this.http.post(`${baseUrl}/estudiante-curso-periodo/`, estudianteCursoPeriodo);
  }
}