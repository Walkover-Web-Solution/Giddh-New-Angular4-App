import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectedInvoices } from 'apps/web-giddh/src/app/models/api-models/Invoice';
import { TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
@Component({
    selector: 'app-generate-ewaybill-dialog',
    templateUrl: './generateEWayBill.component.html',
    styleUrls: [`./generateEWayBill.component.scss`],
    standalone:false
})

export class GenerateEWayBillComponent {
    @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);
    /** Create E-way bill event emitter */
    @Output() public createEWayBillEvent: EventEmitter<void> = new EventEmitter();
    @Input() public ChildSelectedInvoicesList: any[];
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    public invoiceList: SelectedInvoices[] = [];
    /** Reference to dialog */
    public dialogRef: MatDialogRef<any>;

    constructor(private dialog: MatDialog) {

    }

    public onCancel() {
        this.closeModelEvent.emit(true);
    }

    public createEWayBill() {
        this.createEWayBillEvent.emit();
    }

    /**
     * Opens the dialog with the provided template
     *
     * @param {TemplateRef<any>} template
     * @memberof GenerateEWayBillComponent
     */
    public openModal(template: TemplateRef<any>) {
        this.dialogRef = this.dialog.open(template, { panelClass: 'mat-dialog-md' });
    }

}
