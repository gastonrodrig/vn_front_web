import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../../helpers/baseUrl';

@Injectable({
  providedIn: 'root'
})
export class ApoderadoService {
  constructor(private http:HttpClient) {}
 
  listarApoderados() {
    return this.http.get(`${baseUrl}/apoderado/`);
  }
  ObtenerApoderado(id: string) {
    return this.http.get(`${baseUrl}/apoderado/${id}`);
  }
}
