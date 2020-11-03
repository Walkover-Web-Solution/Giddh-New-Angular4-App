import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { PurchaseOrderService } from '../../services/purchase-order.service';
import { ToasterService } from '../../services/toaster.service';
import { PdfJsViewerComponent } from 'ng2-pdfjs-viewer';
import { base64ToBlob } from '../helpers/helperFunctions';

@Component({
    selector: 'purchase-order-preview-modal',
    templateUrl: './purchase-order-preview.component.html',
    styleUrls: ['./purchase-order-preview.component.scss']
})

export class PurchaseOrderPreviewModalComponent implements OnInit {
    /* Taking input po unique name */
    @Input() public purchaseOrderUniqueName: any;
    /* Taking input company unique name */
    @Input() public purchaseOrderCompanyUniqueName: any;
    /* Taking input account unique name */
    @Input() public purchaseOrderAccountUniqueName: any;
    /* Output emitter (boolean) */
    @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter();
    /* Instance of pdf viewer */
    @ViewChild(PdfJsViewerComponent) public pdfViewer: PdfJsViewerComponent;
    /* This will hold if api request is pending */
    public isLoading: boolean = false;
    /* This will hold count of pdf pages */
    public pageCount: number = 0;
    /* This will hold if pdf preview loaded */
    public pdfPreviewLoaded: boolean = false;
    /* This will hold if pdf preview has error */
    public pdfPreviewHasError: boolean = false;

    constructor(public purchaseOrderService: PurchaseOrderService, private toaster: ToasterService) {

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

        this.purchaseOrderService.getPdf(getRequest).subscribe(response => {
            if (response) {
                let blob: Blob = base64ToBlob(response.body, 'application/pdf', 512);
                this.pdfViewer.pdfSrc = blob;
                this.pdfViewer.showSpinner = true;
                this.pdfViewer.refresh();
                this.pdfPreviewLoaded = true;
            } else {
                this.pdfPreviewHasError = true;
            }
            this.isLoading = false;
        });
    }

    /**
     * Callback for pdf pages loaded
     *
     * @param {number} count
     * @memberof PurchaseOrderPreviewModalComponent
     */
    public pagesLoaded(count: number): void {
        this.pageCount = count;
    }
}