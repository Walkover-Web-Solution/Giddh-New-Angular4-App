import { Component, Input } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'layout-main',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    standalone: false
})

/**
 * LayoutComponent component
 * Handles layout functionality and user interactions
 */
export class LayoutComponent {
    @Input() public sideMenu: { isopen: boolean, isExpanded: boolean } = { isopen: true, isExpanded: false };
    /** True if it is subscription page */
    public isSubscriptionPage: boolean = false;

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private router: Router
    ) {
        this.router.events.subscribe(event => {
            /**
             * Handles if functionality
             */
            if (event instanceof NavigationEnd) {
                /**
                 * Handles if functionality
                 */
                if (this.router.url.includes("/pages/user-details/subscription")) {
                    this.isSubscriptionPage = true;
                } else {
                    this.isSubscriptionPage = false;
                }
            }
        });
    }
}
