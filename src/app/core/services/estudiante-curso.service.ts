import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../helpers/baseUrl';

@Injectable({
  providedIn: 'root'
})  
export class EstudianteCursoService {
    constructor(private http:HttpClient) {}

    listarEstudiantesCurso() {
        return this.http.get(`${baseUrl}/estudiante-curso/`);
    }
    agregarEstudianteCurso(estudianteCurso: any){
        return this.http.post(`${baseUrl}/estudiante-curso/`, estudianteCurso);
    }
    modificarEstudianteCurso(id: string, estudianteCurso: any){
        return this.http.put(`${baseUrl}/estudiante-curso/${id}`, estudianteCurso);
    }
    eliminarEstudianteCurso(id: string){
        return this.http.delete(`${baseUrl}/estudiante-curso/${id}`);
    }
}