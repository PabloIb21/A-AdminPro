import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route } from '@angular/router';
import { tap } from 'rxjs/operators';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor( private usuarioService: UsuarioService,
                private router: Router) {}
  
  canLoad(route: Route, segments: import("@angular/router").UrlSegment[]) {
    return this.usuarioService.validarToken()
        .pipe(
          tap( estaAutenticado => {

            if ( !estaAutenticado ) {
              this.router.navigateByUrl('/login');
            }

          })
        );
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {

      return this.usuarioService.validarToken()
        .pipe(
          tap( estaAutenticado => {

            if ( !estaAutenticado ) {
              this.router.navigateByUrl('/login');
            }

          })
        );

  }
  
}
