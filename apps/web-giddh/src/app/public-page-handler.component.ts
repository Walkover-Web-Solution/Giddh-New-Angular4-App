import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../environments/environment';

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
            this.router.navigate(['login']);
        }
    }
}
