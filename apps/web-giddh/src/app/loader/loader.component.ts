import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationStart, RouteConfigLoadEnd, Router } from '@angular/router';
import { Observable, of, ReplaySubject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoaderState } from './loader';
import { LoaderService } from './loader.service';

@Component({
    selector: 'giddh-loader',
    standalone: false,
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class LoaderComponent implements OnInit, OnDestroy {
    public showLoader: boolean = false;
    public navigationEnd$: Observable<boolean> = of(true);
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Track subscriptions manually for Angular 21 compatibility */
    private subscriptions: Subscription[] = [];
    /** Flag to track component destruction state */
    private isDestroying = false;

    constructor(
        private loaderService: LoaderService,
        private cdref: ChangeDetectorRef,
        private router: Router
    ) { }

    public ngOnInit() {
        this.loaderService.loaderState.pipe(takeUntil(this.destroyed$)).subscribe((state: LoaderState) => {
            if (state.show) {
                this.showLoader = true;
            } else {
                this.showLoader = false;
            }
            this.cdref.detectChanges();
        });

        this.router.events.pipe(takeUntil(this.destroyed$)).subscribe(event => {
            if (event instanceof NavigationStart) {
                this.navigationEnd$ = of(false);
                this.cdref.detectChanges();
            } else if (event instanceof NavigationEnd || event instanceof RouteConfigLoadEnd) {
                this.navigationEnd$ = of(true);
                this.cdref.detectChanges();
            }
            if (event instanceof NavigationCancel) {
                this.navigationEnd$ = of(true);
                this.cdref.detectChanges();
            }
        });
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Helper method to track subscriptions for Angular 21 compatibility
     */
    protected addSubscription(subscription: Subscription): void {
        if (subscription && !subscription.closed) {
            this.subscriptions.push(subscription);
        }
    }


}
