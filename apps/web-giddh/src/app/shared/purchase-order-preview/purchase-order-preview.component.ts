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
    /* Taking input all the params */
    @Input() public purchaseOrderUniqueName: any;
    @Input() public purchaseOrderCompanyUniqueName: any;
    @Input() public purchaseOrderAccountUniqueName: any;
    /* Output emitter (boolean) */
    @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter();

    @ViewChild(PdfJsViewerComponent) public pdfViewer: PdfJsViewerComponent;

    public isLoading: boolean = false;
    public pdfBlob: any;
    public pageCount: number = 0;

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
        let getRequest = { companyUniqueName: this.purchaseOrderCompanyUniqueName, accountUniqueName: this.purchaseOrderAccountUniqueName, poUniqueName: this.purchaseOrderUniqueName };

        this.purchaseOrderService.getPdf(getRequest).subscribe(response => {
            if (response) {
                let blob: Blob = base64ToBlob(response.body, 'application/pdf', 512);
                this.pdfViewer.pdfSrc = blob;
                this.pdfViewer.showSpinner = true;
                this.pdfViewer.refresh();
            }
            this.isLoading = false;
        });
    }

    public pagesLoaded(count: number): void {
        this.pageCount = count;
    }
}