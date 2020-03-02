import { Component, OnInit, OnChanges, SimpleChanges, EventEmitter, Output, Input } from '@angular/core';
import { AdvanceReceiptAdjustment } from '../../models/api-models/AdvanceReceiptsAdjust';

@Component({
    selector: 'advance-receipt-adjustment-component',
    templateUrl: './advance-receipt-adjustment.component.html',
    styleUrls: [`./advance-receipt-adjustment.component.scss`]
})




export class AdvanceReceiptAdjustmentComponent implements OnInit, OnChanges {
    public tempDateParams: any = {};

    public advanceReceiptAdjustmentRequest: AdvanceReceiptAdjustment;
    @Input() public invoiceFormDetails;
    @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);
    constructor() {

    }
    ngOnInit() {

    }
    public onCancel() {
        this.closeModelEvent.emit(true);
    }
    public ngOnChanges(s: SimpleChanges) {
        console.log('advance reciept comp',this.invoiceFormDetails)
    }
}
