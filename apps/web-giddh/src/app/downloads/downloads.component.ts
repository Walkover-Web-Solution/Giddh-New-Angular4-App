import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ReplaySubject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "downloads",
    templateUrl: "./downloads.component.html",
    styleUrls: ["./downloads.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class DownloadsComponent implements OnInit, OnDestroy {
    /** Track subscriptions manually for Angular 21 compatibility */
    private subscriptions: Subscription[] = [];
    /** Flag to track component destruction state */
    private isDestroying = false;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Index of selected tab */
    public selectedTabIndex: number = 0;
    /** Active tab name */
    public activeTab: string;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private route: ActivatedRoute,
        private router: Router
    ) {

    }

    /**
     * Initializes the component
     *
     * @memberof DownloadsComponent
     */
    public ngOnInit(): void {
        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            if (params['type'] && this.activeTab !== params['type']) {
                this.activeTab = params['type'];
                this.selectedTabIndex = (this.activeTab === "imports") ? 1 : 0;
            }
        });
    }

    /**
     * Callback for tab change event
     * @param {any} event - Tab change event
     * @memberof DownloadsComponent
     */
    public tabChanged(event: any): void {
        if (event?.index === 0) {
            this.router.navigate(['/pages/downloads/exports']);
        } else if (event?.index === 1) {
            this.router.navigate(['/pages/downloads/imports']);
        }
    }

    /**
     * Releases all the observables to avoid memory leaks
     *
     * @memberof DownloadsComponent
     */
    public ngOnDestroy(): void {
        this.isDestroying = true;

        // Clean up all tracked subscriptions first
        this.subscriptions.forEach((subscription, index) => {
            try {
                if (subscription && !subscription.closed) {
                    subscription.unsubscribe();
                }
            } catch (error) {
                console.warn(`Error unsubscribing subscription ${index}:`, error);
            }
        });
        this.subscriptions = [];

        // Safely complete the destroyed$ subject
        try {
            if (this.destroyed$ && !this.destroyed$.closed) {
                this.destroyed$.next(true);
                this.destroyed$.complete();
            }
        } catch (error) {
            console.warn('Error completing destroyed$ subject:', error);
        }
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
