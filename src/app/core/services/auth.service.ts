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
  private usuarioActual: any = null;

  constructor(private http: HttpClient) {}
  
  login(identificador: string, contrasena: string) {
    const rolesPermitidos = ['Docente', 'Admin', 'Temporal']
    
    return this.http.post<any>(`${baseUrl}/auth/login`, { identificador, contrasena })
      .pipe(
        tap(data => {
          if (data.token) {
            if (this.isLocalStorageAvailable()) {
              if (rolesPermitidos.includes(data.rol)) {
                const expirationTime = new Date().getTime() + 60 * 60 * 1000; // tiempo de expiración del token (1 hora)
                localStorage.setItem(this.tokenKey, data.token)
                localStorage.setItem('auth-expiration', expirationTime.toString())
              }

              const user: any = {
                email: data.email,
                rol: data.rol,
                usuario: data.usuario
              }

              if (data.rol === 'Docente') {
                user.docente = data.docente
              }

              this.usuarioActual = user
              if (rolesPermitidos.includes(data.rol)) {
                localStorage.setItem(this.userKey, JSON.stringify(user))
              }
            }
          } 
        })
      )
  }

  getUser() {
    if (this.usuarioActual) {
      return this.usuarioActual
    }
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
    return null
  }

  isTokenExpired() {
    if (this.isLocalStorageAvailable()) {
      const expiration = localStorage.getItem('auth-expiration')
      if (!expiration) return true
      
      const expirationTime = parseInt(expiration, 10)
      if (isNaN(expirationTime)) return true
      
      const currentTime = new Date().getTime()
      return currentTime > expirationTime
    }
    return true
  }
  
  logout() {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(this.tokenKey)
      localStorage.removeItem(this.userKey)
      localStorage.removeItem('auth-expiration')
    }
  }

  isLocalStorageAvailable() {
    return typeof localStorage !== 'undefined'
  }
}
