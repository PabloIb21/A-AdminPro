import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { Usuario } from 'src/models/usuario.model';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {
  
  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];

  public imgSubs: Subscription;
  public desde: number = 0;
  public cargando: boolean = true;

  constructor( private usuarioService: UsuarioService,
                private busquedasService: BusquedasService,
                private modalImagenService: ModalImagenService ) { }
  
  ngOnDestroy() {
    this.imgSubs.unsubscribe();
  }
  
  ngOnInit(): void {
    this.cargarUsuarios();

    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe( delay(100) )
      .subscribe( img => this.cargarUsuarios() );
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.cargarUsuarios( this.desde )
    .subscribe( ({ total, usuarios }) => {
      this.totalUsuarios = total;
      this.usuarios = usuarios;
      this.usuariosTemp = usuarios;
      this.cargando = false;
    });
  }

  cambiarPagina( valor: number ) {
    this.desde += valor;
    if ( this.desde < 0 ) {
      this.desde = 0;
    } else if ( this.desde >= this.totalUsuarios ) {
      this.desde -= valor;
    }

    this.cargarUsuarios();
  }

  buscar( termino: string ) {

    if ( termino.length === 0 ) {
      return this.usuarios = this.usuariosTemp;
    }

    this.busquedasService.buscar( 'usuarios', termino )
      .subscribe( (res: Usuario[]) => {
        this.usuarios = res;
      });
  }

  eliminarUsuario( usuario: Usuario ) {

    if ( usuario.uid === this.usuarioService.uid ) {
      return Swal.fire('Error', 'No puede borrar su propio usuario', 'error');
    }
  
    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Está a punto de borrar a ${ usuario.nombre }!`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar!'
    }).then((result) => {
      if (result.isConfirmed) {
        
        this.usuarioService.eliminarUsuario( usuario )
          .subscribe( () => {

            this.cargarUsuarios();
            Swal.fire(
              'Usuario eliminado',
              `${ usuario.nombre } fue eliminado correctamente`,
              'success'
            );

          });
      }
    });

  }

  cambiarRole( usuario: Usuario ) {
    this.usuarioService.actualizarUsuario( usuario )
      .subscribe( res => {
        console.log(res);
      });
  }

  abrirModal( usuario: Usuario ) {
    this.modalImagenService.abrirModal( 'usuarios', usuario.uid, usuario.img );
  }

}
