import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
    selector: 'download-bulk-invoice',
    templateUrl: './download-bulk-invoice.component.html',
    styleUrls: ['./download-bulk-invoice.component.scss'],
})
export class DownloadBulkInvoiceComponent implements OnInit {
    /* it will store current page url */
    public currentPageUrl: string = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
    ){}

    public ngOnInit() {
        this.currentPageUrl = this.router.url;
    }
}
