import { Component, Input } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { includes } from '../../lodash-optimized';

@Component({
    selector: 'layout-main',
    templateUrl: './layout.component.html',
    standalone: false,
    styleUrls: ['./layout.component.scss']
})

export class LayoutComponent {
    @Input() public sideMenu: { isopen: boolean, isExpanded: boolean } = { isopen: true, isExpanded: false };
    /** True if it is subscription page */
    public isSubscriptionPage: boolean = false;

    constructor(
        private router: Router
    ) {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                if (this.router.url.includes("/pages/user-details/subscription")) {
                    this.isSubscriptionPage = true;
                } else {
                    this.isSubscriptionPage = false;
                }
            }
        });
    }
}
