import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
    selector: 'download-bulk-invoice',
    templateUrl: './download-bulk-invoice.component.html',
    styleUrls: ['./download-bulk-invoice.component.scss'],
})
export class DownloadBulkInvoiceComponent implements OnInit {
    /* it will store current page url */
    public downloadUrl: string = '';

    constructor(private route: ActivatedRoute) {

    }

    public ngOnInit() {
        this.route.queryParams.subscribe(response => {
            if(response && response.url) {
                this.downloadUrl = response.url;
            }
        });
    }
}
