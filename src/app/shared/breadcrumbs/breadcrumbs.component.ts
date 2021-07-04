import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnDestroy {

  public titulo: string;
  public tituloSubs$: Subscription;

  constructor(private router: Router, private route: ActivatedRoute) {
    
    // console.log( route.snapshot.children[0].data );
    
    this.tituloSubs$ = this.getArgumentosRuta()
      .subscribe(({ titulo }) => {
        this.titulo = titulo;
        document.title = `AdminPro - ${titulo}`;
      });
  }

  ngOnDestroy() {
    this.tituloSubs$.unsubscribe();
  }

  getArgumentosRuta() {

    return this.router.events
      .pipe(
        filter(event => event instanceof ActivationEnd),
        filter((event: ActivationEnd) => event.snapshot.firstChild === null),
        map((event: ActivationEnd) => event.snapshot.data)
      );
  }

}
