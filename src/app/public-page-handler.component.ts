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

    console.log('CHECK the url is :', this.router.routerState.snapshot.url);

    if (this.router.routerState.snapshot.url.includes('create-invoice')) {
      this.router.navigate(['/create-invoice']);
    } else if (this.router.routerState.snapshot.url.includes('signup')) {
      // this.router.navigate(['signup']);
      this.router.navigateByUrl('signup');
    } else {
      this.router.navigate(['login']);
      // this.router.navigateByUrl('404');
    }
  }
}
