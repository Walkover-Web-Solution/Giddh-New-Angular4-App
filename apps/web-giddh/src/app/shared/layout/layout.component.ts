import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'layout-main',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})

export class LayoutComponent implements OnInit, OnDestroy {
    @Input() public sideMenu: { isopen: boolean } = { isopen: true };
    /** This is used to show/hide loader */
    public showLoader: boolean = false;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private router: Router) {

    }

    /**
     * Initializes the component
     *
     * @memberof LayoutComponent
     */
    public ngOnInit(): void {
        this.router.events.pipe(takeUntil(this.destroyed$)).subscribe(event => {
            if (event instanceof RouteConfigLoadStart) {
                this.showLoader = true;
            }

            if (event instanceof RouteConfigLoadEnd) {
                this.showLoader = false;
            }
        });
    }

    /**
     * This will destroy all the memory used by this component
     *
     * @memberof LayoutComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
