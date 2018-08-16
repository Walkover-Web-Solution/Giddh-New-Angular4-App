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
    if (this.router.routerState.snapshot.url.includes('create-invoice')) {
      this.router.navigate(['/create-invoice']);
    } else if (this.router.routerState.snapshot.url.includes('signup')) {
      // this.router.navigate(['signup']);
      this.router.navigateByUrl('signup');
    } else if (this.router.routerState.snapshot.url.includes('app/pages/settings')) {
      console.log('this.router.routerState.snapshot.url is :', this.router.routerState.snapshot.url);
      this.router.navigateByUrl(this.router.routerState.snapshot.url);
      // this.router.navigateByUrl('404');
    } else {
      this.router.navigate(['login']);
    }
  }
}
