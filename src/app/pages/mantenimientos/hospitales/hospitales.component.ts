import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Hospital } from 'src/models/hospital.mode';

import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { BusquedasService } from 'src/app/services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[];
  public cargando: boolean = true;
  private imgSubs: Subscription;

  constructor( private hospitalService: HospitalService,
                private modalImagenService: ModalImagenService,
                private busquedasService: BusquedasService ) { }

  ngOnInit(): void {
    this.cargarHospitales();
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe( delay(100) )
      .subscribe( img => this.cargarHospitales() );
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  buscar( termino: string ) {

    if ( termino.length === 0 ) {
      return this.cargarHospitales();
    }

    this.busquedasService.buscar( 'hospitales', termino )
      .subscribe( (res: Hospital[]) => {
        this.hospitales = res;
      });
  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.cargarHospitales()
      .subscribe( res => {
        this.cargando = false
        this.hospitales = res;
      });
  }

  guardarCambios( hospital: Hospital ) {
    this.hospitalService.actualizarHospital( hospital._id, hospital.nombre )
      .subscribe( () => {
        Swal.fire('Actualizado', hospital.nombre, 'success');
      });
  }

  eliminarHospital( hospital: Hospital ) {
    this.hospitalService.eliminarHospital( hospital._id )
      .subscribe( () => {
        this.cargarHospitales();
        Swal.fire('Eliminado', hospital.nombre, 'success');
      });
  }

  async abrirSweetAlert() {
    const { value = '' } = await Swal.fire<string>({
      title: 'Crear Hospital',
      input: 'text',
      inputLabel: 'Ingrese el nombre del nuevo hospital',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true
    })
    
    if ( value.trim().length > 0 ) {
      this.hospitalService.crearHospital( value )
        .subscribe( (res: any) => {
          this.hospitales.push( res.hospital );
        });
    }
  }

  abrirModal( hospital: Hospital ) {
    this.modalImagenService.abrirModal( 'hospitales', hospital._id, hospital.img );
  }

}
