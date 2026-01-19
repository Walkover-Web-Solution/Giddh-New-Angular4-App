import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectedInvoices } from 'apps/web-giddh/src/app/models/api-models/Invoice';
import { TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
/**
 * Handles Component functionality
 */
@Component({
    selector: 'app-generate-ewaybill-dialog',
    templateUrl: './generateEWayBill.component.html',
    styleUrls: [`./generateEWayBill.component.scss`],
    standalone:false
})

/**
 * GenerateEWayBillComponent component
 * Handles generateewaybill functionality and user interactions
 */
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

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(private dialog: MatDialog) {

    }

    /**
     * Handles cancel event
     */
    public onCancel() {
        this.closeModelEvent.emit(true);
    }

    /**
     * Creates new ewaybill
     */
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
