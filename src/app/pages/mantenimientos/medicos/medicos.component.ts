import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Medico } from 'src/models/medico.model';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public cargando: boolean = true;
  public medicos: Medico[] = [];
  private imgSubs: Subscription;

  constructor( private medicoService: MedicoService,
                private modalImagenService: ModalImagenService,
                private busquedasService: BusquedasService ) { }

  ngOnInit(): void {
    this.cargarMedicos();
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe( delay(100) )
      .subscribe( img => this.cargarMedicos() );
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarMedicos() {
    this.cargando = true;
    this.medicoService.cargarMedicos()
      .subscribe( medicos => {
        this.cargando = false;
        this.medicos = medicos;
      });
  }

  buscar( termino: string ) {
    if ( termino.length === 0 ) {
      return this.cargarMedicos();
    }

    this.busquedasService.buscar( 'medicos', termino )
      .subscribe( (res: Medico[]) => {
        this.medicos = res;
      });
  }

  abrirModal( medico: Medico ) {
    this.modalImagenService.abrirModal( 'medicos', medico._id, medico.img );
  }

  borrarMedico( medico: Medico ) {
    Swal.fire({
      title: '¿Borrar médico?',
      text: `Está a punto de borrar a ${ medico.nombre }!`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar!'
    }).then((result) => {
      if (result.isConfirmed) {
        
        this.medicoService.eliminarMedico( medico._id )
          .subscribe( () => {

            this.cargarMedicos();
            Swal.fire(
              'Médico eliminado',
              `${ medico.nombre } fue eliminado correctamente`,
              'success'
            );

          });
      }
    });
  }

}
