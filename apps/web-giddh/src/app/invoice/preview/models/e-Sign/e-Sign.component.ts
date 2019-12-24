import { takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { IRoleCommonResponseAndRequest } from '../../../models/api-models/Permission';
import { Esignature, PreviewInvoiceResponseClass } from '../../../../models/api-models/Invoice';
import { ToasterService } from '../../../../services/toaster.service';
import { AppState } from '../../../../store/roots';
import { Store } from '@ngrx/store';
import { DomSanitizer } from '@angular/platform-browser';
import { ReplaySubject } from 'rxjs';
import { InvoiceActions } from '../../../../actions/invoice/invoice.actions';
import { forIn } from 'apps/web-giddh/src/app/lodash-optimized';

@Component({
    selector: 'e-sign-modal-component',
    templateUrl: './e-Sign.component.html'
})

export class EsignModalComponent implements OnInit, OnDestroy {
    @Input() public base64Data: string;
    @Output() public confirmDeleteEvent: EventEmitter<boolean> = new EventEmitter(true);
    @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);

    public eSignModel: Esignature = new Esignature();
    public actionUrl: string = 'https://gateway.emsigner.com/eMsecure/SignerGateway/Index';
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private _toasty: ToasterService, private sanitizer: DomSanitizer,
        private store: Store<AppState>, private invoiceActions: InvoiceActions,
    ) {
        // this.eSignModel.authToken = '3Ru6iWp1qoWpjkz90fvRzheO8M0KpLxP0TEEk08jKfXL/4NdJUisPtWFw7A0gIja';
    }

    public ngOnInit() {
        this.store.select(p => p.invoice.invoiceData).pipe(takeUntil(this.destroyed$)).subscribe((o: PreviewInvoiceResponseClass) => {
            if (o && o.dataPreview) {
                this.eSignModel.ReferenceNumber = o.uniqueName;
                this.eSignModel.Name = o.company.name;
                this.eSignModel.File = o.dataPreview;
                this.eSignModel.SUrl = this.eSignModel.SUrl + o.uniqueName;
                this.eSignModel.CUrl = this.eSignModel.CUrl + o.uniqueName;
                this.eSignModel.FUrl = this.eSignModel.FUrl + o.uniqueName;
            }
        });
    }

    public onConfirmation(eSignForm) {
        $(eSignForm).attr('action', this.actionUrl);
        eSignForm = this.formOperation(eSignForm, 'add');
        let validateAdadhar = new RegExp(/^\d{4}\d{4}\d{4}$/g);
        if (this.eSignModel.AadhaarNumber) {
            let isValidate = validateAdadhar.test(this.eSignModel.AadhaarNumber);
            if (isValidate) {
                eSignForm.submit();
                this.closeModelEvent.emit(true);
            } else {
                this._toasty.errorToast('Invalid Aadhar No:' + this.eSignModel.AadhaarNumber);
            }
        } else {
            eSignForm.submit();
            this.closeModelEvent.emit(true);
        }
        eSignForm = this.formOperation(eSignForm, 'remove');
        $(eSignForm).attr('action', '');
    }

    /**
     * formOperation
     */
    public formOperation(eSignForm, action) {
        forIn(this.eSignModel, (val, key) => {
            if (key !== 'AadhaarNumber' && action === 'add') {
                $(eSignForm).append('<input type="hidden" id=' + key + ' name=' + key + ' value=' + val + ' />');
            } else if (key !== 'AadhaarNumber' && action === 'remove') {
                $('#eSignForm #' + key).remove();
            }
        });
        return eSignForm;
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
