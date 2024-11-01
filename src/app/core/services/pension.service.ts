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
  pagarPension(id: string, data: any){  
    return this.http.patch(`${baseUrl}/pension/${id}`,data);
  }
  
  getMesesPendientes(estudiante_id: string) {
    return this.http.get(`${baseUrl}/pension/pendiente/${estudiante_id}`);
  }
  descargarExcel() {
    return this.http.get(`${baseUrl}/pension/reporte/excel`, { responseType: 'blob' });
  }
}
