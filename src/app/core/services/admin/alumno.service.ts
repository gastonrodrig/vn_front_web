import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../../helpers/baseUrl';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {
  constructor(private http:HttpClient) {}
 

}
