import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { PurchaseOrderService } from '../../services/purchase-order.service';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { GeneralService } from '../../services/general.service';

@Component({
    selector: 'purchase-order-preview-modal',
    templateUrl: './purchase-order-preview.component.html',
    styleUrls: ['./purchase-order-preview.component.scss']
})

export class PurchaseOrderPreviewModalComponent implements OnInit, OnDestroy {
    /* Taking input po unique name */
    @Input() public purchaseOrderUniqueName: any;
    /* Taking input company unique name */
    @Input() public purchaseOrderCompanyUniqueName: any;
    /* Taking input account unique name */
    @Input() public purchaseOrderAccountUniqueName: any;
    /* Output emitter (boolean) */
    @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter();
    /* This will hold if api request is pending */
    public isLoading: boolean = false;
    /* This will hold if pdf preview loaded */
    public pdfPreviewLoaded: boolean = false;
    /* This will hold if pdf preview has error */
    public pdfPreviewHasError: boolean = false;
    /** Instance of PDF container iframe */
    @ViewChild('pdfContainer', { static: false }) pdfContainer: ElementRef;
    /** PDF file url created with blob */
    public sanitizedPdfFileUrl: any = '';
    /** PDF src */
    public pdfFileURL: any = '';
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        public purchaseOrderService: PurchaseOrderService,
        private domSanitizer: DomSanitizer,
        private generalService: GeneralService
    ) {

    }

    /**
     * Initializes the component
     *
     * @memberof PurchaseOrderPreviewModalComponent
     */
    public ngOnInit(): void {
        this.getPdf();
    }

    /**
     * This will hide the modal
     *
     * @memberof PurchaseOrderPreviewModalComponent
     */
    public hideModal(): void {
        this.closeModelEvent.emit(true);
    }

    /**
     * This will get the pdf
     *
     * @memberof PurchaseOrderPreviewModalComponent
     */
    public getPdf(): void {
        this.isLoading = true;
        this.pdfPreviewHasError = false;
        this.pdfPreviewLoaded = false;
        let getRequest = { companyUniqueName: this.purchaseOrderCompanyUniqueName, accountUniqueName: this.purchaseOrderAccountUniqueName, poUniqueName: this.purchaseOrderUniqueName };

        this.purchaseOrderService.getPdf(getRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                let blob: Blob = this.generalService.base64ToBlob(response.body, 'application/pdf', 512);
                const file = new Blob([blob], { type: 'application/pdf' });
                URL.revokeObjectURL(this.pdfFileURL);
                this.pdfFileURL = URL.createObjectURL(file);
                this.sanitizedPdfFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pdfFileURL);
                this.pdfPreviewLoaded = true;
            } else {
                this.pdfPreviewHasError = true;
            }
            this.isLoading = false;
        });
    }

    /**
     * Releases memory
     *
     * @memberof PurchaseOrderPreviewModalComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
