import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { environment } from 'src/environments/environment';

import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

import { Usuario } from 'src/models/usuario.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public usuario: Usuario;

  constructor( private http: HttpClient,
                private router: Router ) {}
  
  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get role(): 'ADMIN_ROLE' | 'USER_ROLE' {
    return this.usuario.rol;
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  guardarLocalStorage( token: string, menu: any ) {
    localStorage.setItem('token', token );
    localStorage.setItem('menu', JSON.stringify(menu) );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('menu');
    this.router.navigateByUrl('/login');
  }

  validarToken(): Observable<boolean> {

    return this.http.get(`${ base_url }/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map( (res: any) => {
        const { email, google, nombre, rol, img = '', uid } = res.usuario;
        this.usuario = new Usuario( nombre, email, '', img, google, rol, uid );
        this.guardarLocalStorage( res.token, res.menu );
        return true;
      }),
      catchError( error => of(false) )
    );

  }

  crearUsuario( formData: RegisterForm ) {
    
    return this.http.post( `${ base_url }/usuarios`, formData )
      .pipe(
        tap( (res: any) => {
          this.guardarLocalStorage( res.token, res.menu );
        })
      );

  }

  actualizarPerfil( data: { email: string, nombre: string, rol: string } ) {

    data = {
      ...data,
      rol: this.usuario.rol
    }

    return this.http.put( `${ base_url }/usuarios/${ this.uid }`, data, this.headers );
  }

  login( formData: LoginForm ) {

    return this.http.post( `${ base_url }/login`, formData )
      .pipe(
        tap( (res: any) => {
          this.guardarLocalStorage( res.token, res.menu );
        })
      );

  }

  cargarUsuarios( desde: number = 0 ) {
    const url = `${ base_url }/usuarios?desde=${ desde }`;
    return this.http.get<CargarUsuario>( url, this.headers )
      .pipe(
        map( res => {
          const usuarios = res.usuarios.map( 
            user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.rol, user.uid )
          );

          return {
            total: res.total,
            usuarios
          };
        })
      );
  }

  eliminarUsuario( usuario: Usuario ) {
    const url = `${ base_url }/usuarios/${ usuario.uid }`;
    return this.http.delete( url, this.headers );
  }

  actualizarUsuario( usuario: Usuario ) {
    return this.http.put( `${ base_url }/usuarios/${ usuario.uid }`, usuario, this.headers );
  }

}
