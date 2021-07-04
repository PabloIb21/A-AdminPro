import { Component, OnInit } from '@angular/core';
import { rejects } from 'assert';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  
    this.getUsuarios().then( usuarios => {
      console.log(usuarios)
    });

    // const promesa = new Promise( ( resolve, reject ) => {

    //   if ( false ) {
    //     resolve('Hola Mundo');
    //   }else {
    //     reject('Algo salió mal');
    //   }

    // });

    // promesa.then( (mensaje) => {
    //   console.log( mensaje );
    // })
    // .catch( err => console.log('Error en mi promesa', err ) );

    // console.log('Fin del Init');

  }

  getUsuarios() {

    return new Promise( resolve => {

      fetch('https://reqres.in/api/users')
        .then( res => res.json() )
        .then( body => resolve(body.data) );

    });

  }

}
