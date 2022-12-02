import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ReplaySubject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "downloads",
    templateUrl: "./downloads.component.html",
    styleUrls: ["./downloads.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
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
     * Releases all the observables to avoid memory leaks
     *
     * @memberof DownloadsComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Handles tab change
     *
     * @param {*} event
     * @memberof DownloadsComponent
     */
    public tabChanged(event: any): void {
        this.router.navigate(['pages', 'downloads', ((event?.index === 1) ? "imports" : "exports")]);
    }
}