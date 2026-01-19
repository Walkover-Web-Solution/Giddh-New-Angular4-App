import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ReplaySubject } from "rxjs";
import { takeUntil } from "rxjs/operators";

/**
 * Handles Component functionality
 */
@Component({
    selector: "downloads",
    templateUrl: "./downloads.component.html",
    styleUrls: ["./downloads.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
/**
 * DownloadsComponent component
 * Handles downloads functionality and user interactions
 */
export class DownloadsComponent implements OnInit, OnDestroy {
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

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
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
            /**
             * Handles if functionality
             */
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
        /**
         * Handles if functionality
         */
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
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }


}
