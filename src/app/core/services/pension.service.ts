import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../helpers/baseUrl';

@Injectable({
  providedIn: 'root'
})
export class PensionService {

  constructor(private http:HttpClient) {}

  listarPension(){
    return this.http.get(`${baseUrl}/pension/`)
  }
  agregarPension(pension:any){
    return this.http.post(`${baseUrl}/pension/`,pension);
  }
  obtenerPension(id: string){
    return this.http.get(`${baseUrl}/pension/${id}`);
  }
}
