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
        } else if (this.router.routerState.snapshot.url.includes('pages/settings')) {
            this.router.navigateByUrl('pages/setting');
        } else {
            if (isElectron) {
                this.router.navigate(['/login']);
            } else {
                this.router.navigate(['login']);
            }
        }
    }
}
