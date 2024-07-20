import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../helpers/baseUrl';

@Injectable({
  providedIn: 'root'
})
export class PeriodoService {
  constructor(private http:HttpClient) {}
 
  listarPeriodos() {
    return this.http.get(`${baseUrl}/periodo-escolar/`);
  }
}