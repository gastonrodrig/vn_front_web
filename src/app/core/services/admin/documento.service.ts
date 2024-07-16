import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../../helpers/baseUrl';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {
  constructor(private http:HttpClient) {}
 
  listarTiposDocumento() {
    return this.http.get(`${baseUrl}/documento/`);
  }
}
