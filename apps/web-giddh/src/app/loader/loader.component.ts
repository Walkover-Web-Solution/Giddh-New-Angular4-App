import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationStart, RouteConfigLoadEnd, Router } from '@angular/router';
import { Observable, of, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoaderState } from './loader';
import { LoaderService } from './loader.service';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'giddh-loader',
    standalone: false,
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

/**
 * LoaderComponent component
 * Handles loader functionality and user interactions
 */
export class LoaderComponent implements OnInit, OnDestroy {
    public showLoader: boolean = false;
    public navigationEnd$: Observable<boolean> = of(true);
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private loaderService: LoaderService,
        private cdref: ChangeDetectorRef,
        private router: Router
    ) { }

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit() {
        this.loaderService.loaderState.pipe(takeUntil(this.destroyed$)).subscribe((state: LoaderState) => {
            /**
             * Handles if functionality
             */
            if (state.show) {
                this.showLoader = true;
            } else {
                this.showLoader = false;
            }
            this.cdref.detectChanges();
        });

        this.router.events.pipe(takeUntil(this.destroyed$)).subscribe(event => {
            /**
             * Handles if functionality
             */
            if (event instanceof NavigationStart) {
                this.navigationEnd$ = of(false);
                this.cdref.detectChanges();
            } else if (event instanceof NavigationEnd || event instanceof RouteConfigLoadEnd) {
                this.navigationEnd$ = of(true);
                this.cdref.detectChanges();
            }
            /**
             * Handles if functionality
             */
            if (event instanceof NavigationCancel) {
                this.navigationEnd$ = of(true);
                this.cdref.detectChanges();
            }
        });
    }

    /**
     * Handles ngOnDestroy functionality
     */
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
