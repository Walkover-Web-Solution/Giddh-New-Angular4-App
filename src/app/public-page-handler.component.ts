import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'publicPageHandler',
  styles: [``],
  template: ``
})
export class PublicPageHandlerComponent {

  public localState: any;

  constructor(
    public route: ActivatedRoute,
    private router: Router) {
      console.log('this.route.snapshot.url.toString() is :', this.route.snapshot.url);
      // if (this.route.snapshot.url.findIndex((e) => e.path === 'create-invoice') > -1) {
      //   this.router.navigate(['/create-invoice']);
      // } else if (this.route.snapshot.url.findIndex((e) => e.path === 'signup') > -1) {
      //   this.router.navigate(['/signup']);
      // } else {
      //   this.router.navigate(['/login']);
      // }

    if (this.router.routerState.snapshot.url.includes('create-invoice')) {
      this.router.navigate(['/create-invoice']);
    } else if (this.router.routerState.snapshot.url.includes('signup')) {
      this.router.navigate(['/signup']);
    } else {
        this.router.navigate(['/login']);
    }
    }
}
