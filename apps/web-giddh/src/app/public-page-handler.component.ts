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
      this.router.navigateByUrl('signup');
    } else if (this.router.routerState.snapshot.url.includes('app/pages/settings')) {
      let url = this.router.routerState.snapshot.url;
      url = url.replace('/app', '');
      this.router.navigateByUrl(url);
    } else {
      // console.log('the last else');
      // let url = this.router.routerState.snapshot.url;
      // url = url.replace('/app/', '');
      // console.log('the formatted url is :', url);
      // let existingRouteIndx = this.router.config.findIndex((r) => url.startsWith(r.path));
      // console.log('existingRouteIndx is :', existingRouteIndx);
      // if (existingRouteIndx > -1) {
      //   console.log('YES');
      //   this.router.navigateByUrl(url);
      // } else {
      //   console.log('NO');
      //   this.router.navigateByUrl('404');
      // }

      // this.router.navigateByUrl(url).then((res) => {
      //   console.log('the res then success is :', res);
      // }).catch((err) => {
      //   console.log('the err from catch is :', err);
      // });

      // console.log('last else');
      this.router.navigate(['login']);
      // // this.router.navigateByUrl('404');
    }
  }
}
