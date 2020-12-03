import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BulkVoucherExportService } from 'apps/web-giddh/src/app/services/bulkvoucherexport.service';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';

@Component({
    selector: 'invoice-bulk-export',
    templateUrl: './bulk-export.component.html',
    styleUrls: [`./bulk-export.component.scss`]
})

export class BulkExportModal implements OnInit {
    /** Type of voucher */
    @Input() public type: string = "sales";
    /** Selected Vouchers */
    @Input() public voucherUniqueNames: any[] = [];
    /** Advance Search Parameters */
    @Input() public advanceSearch: any;
    /** From/To Date On Page */
    @Input() public dateRange: any;
    /** Total Items For Export */
    @Input() public totalItems: any = 0;
    /** Emit the close modal event */
    @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);

    /** Download Voucher Copy Options */
    public downloadCopyOptions: any[] = [
        { label: 'Original', value: 'ORIGINAL' },
        { label: 'Customer', value: 'CUSTOMER' },
        { label: 'Transport', value: 'TRANSPORT' }
    ];

    /** Selected download Voucher Copy Options */
    public copyTypes: any = [];
    /** Email Receivers */
    public recipients: any = [];

    constructor(private bulkVoucherExportService: BulkVoucherExportService, private generalService: GeneralService, private toaster: ToasterService) {

    }

    /**
     * Initializes the component
     *
     * @memberof BulkExportModal
     */
    public ngOnInit(): void {
        
    }

    /**
     * Export the vouchers
     *
     * @param {boolean} event
     * @memberof BulkExportModal
     */
    public exportVouchers(event: boolean): void {
        let getRequest: any = { from: "", to: "", type: "", mail: false };
        let postRequest: any;

        getRequest.from = this.dateRange.from;
        getRequest.to = this.dateRange.to;
        getRequest.type = this.type;
        getRequest.mail = event;

        postRequest = this.advanceSearch;
        postRequest.voucherUniqueNames = this.voucherUniqueNames;
        postRequest.copyTypes = this.copyTypes;

        delete postRequest.count;
        delete postRequest.page;

        if (event) {
            postRequest.sendTo = { recipients: this.recipients.split(",") };
        }

        this.bulkVoucherExportService.bulkExport(getRequest, postRequest).subscribe(response => {
            if (response.status === "success") {
                let blob = this.generalService.base64ToBlob(response.body, 'application/zip', 512);
                return saveAs(blob, this.type+`.zip`);
            } else {
                this.toaster.clearAllToaster();
                this.toaster.errorToast(response.message);
            }
        });
    }

    /**
     * Emit the close modal event
     *
     * @memberof BulkExportModal
     */
    public closeModal(): void {
        this.closeModelEvent.emit(true);
    }
}
