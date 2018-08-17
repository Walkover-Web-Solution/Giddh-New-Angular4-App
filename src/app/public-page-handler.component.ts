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
      let url = this.router.routerState.snapshot.url;
      url = url.replace('/app', '');
      console.log('this.router.routerState.snapshot.url is :', this.router.routerState.snapshot.url);
      console.log('the url is :', url);
      this.router.navigateByUrl(url);
      // this.router.navigateByUrl('404');
    } else {
      this.router.navigate(['login']);
    }
  }
}
