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

            const expirationTime = new Date().getTime() + 60 * 60 * 1000 // tiempo de expiracion del token (1 hora)
            localStorage.setItem(this.tokenKey, data.token)
            localStorage.setItem('auth_expiration', expirationTime.toString())

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
        })
      )
  }

  getUser() {
    if (typeof localStorage !== 'undefined') {
      const user = localStorage.getItem(this.userKey)
      return user ? JSON.parse(user) : null
    }
    return null
  }
  
  getToken() {
    return localStorage.getItem(this.tokenKey)
  }

  isTokenExpired() {
    const expiration = localStorage.getItem('auth_expiration')
    if (!expiration) return true
  
    const currentTime = new Date().getTime()
    return currentTime > parseInt(expiration, 10)
  }
  
  logout() {
    localStorage.removeItem(this.tokenKey)
    localStorage.removeItem(this.userKey)
    localStorage.removeItem('auth_expiration')
  }
}
