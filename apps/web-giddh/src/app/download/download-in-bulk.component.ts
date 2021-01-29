import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
    selector: 'download',
    templateUrl: './download-in-bulk.component.html',
    styleUrls: ['./download-in-bulk.component.scss'],
})

export class DownloadInBulkComponent implements OnInit, OnDestroy {
    /** This holds url to download */
    public downloadUrl: string = '';
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private route: ActivatedRoute) {

    }

    /**
     * Initializes the component
     *
     * @memberof DownloadBulkInvoiceComponent
     */
    public ngOnInit(): void {
        this.route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if(response && response.url) {
                this.downloadUrl = response.url;
            }
        });
    }

    /**
     * Releases the memory
     *
     * @memberof DownloadBulkInvoiceComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
