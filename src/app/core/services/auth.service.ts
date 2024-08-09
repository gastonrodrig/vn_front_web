import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { baseUrl } from '../helpers/baseUrl';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'auth-token'
  private userKey = 'auth-user'

  constructor(private http: HttpClient) {}

  login(identificador: string, contrasena: string) {
    return this.http.post<any>(`${baseUrl}/auth/login`, { identificador: identificador, contrasena: contrasena })
      .pipe(
        tap(data => {
          if (data.token) {
            if (this.isLocalStorageAvailable()) {
              const expirationTime = new Date().getTime() + 60 * 60 * 1000 // tiempo de expiracion del token (1 hora)
              localStorage.setItem(this.tokenKey, data.token)
              localStorage.setItem('auth-expiration', expirationTime.toString())

              const user: any = {
                email: data.email,
                rol: data.rol,
                usuario: data.usuario
              }

              if (data.rol === 'docente') {
                user.docente = data.docente
              } else if (data.rol === 'estudiante') {
                user.estudiante = data.estudiante
              } else if (data.rol === 'apoderado') {
                user.apoderado = data.apoderado
              }
    
              localStorage.setItem(this.userKey, JSON.stringify(user))
            } 
          }
        })
      )
  }

  getUser() {
    if (this.isLocalStorageAvailable()) {
      const user = localStorage.getItem(this.userKey)
      return user ? JSON.parse(user) : null
    }
    return null
  }
  
  getToken() {
    if (this.isLocalStorageAvailable()) {
      return localStorage.getItem(this.tokenKey)
    }
    return null;
  }

  isTokenExpired() {
    if (this.isLocalStorageAvailable()) {
      const expiration = localStorage.getItem('auth-expiration');
      if (!expiration) return true;
      
      const expirationTime = parseInt(expiration, 10);
      if (isNaN(expirationTime)) return true;
      
      const currentTime = new Date().getTime();
      return currentTime > expirationTime;
    }
    return true;
  }
  
  logout() {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
      localStorage.removeItem('auth-expiration');
    }
  }

  isLocalStorageAvailable() {
    return typeof localStorage !== 'undefined'
  }
}
