import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseUrl } from '../helpers/baseUrl';

@Injectable({
  providedIn: 'root'
})

export class GmailService {
    constructor(private http:HttpClient) {}

    sendEmailPdf(id: string, gmail: any){
        return this.http.patch(`${baseUrl}/gmail/send-email/${id}`,gmail)
    }
}