import { Component, OnInit, Input, ViewChild, OnDestroy, EventEmitter, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { IOption } from '../../../../theme/ng-select/option.interface';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { ShSelectComponent } from 'apps/web-giddh/src/app/theme/ng-virtual-select/sh-select.component';
import { SettingsTaxesActions } from 'apps/web-giddh/src/app/actions/settings/taxes/settings.taxes.action';
import { takeUntil } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { AppState } from 'apps/web-giddh/src/app/store';
import { ReplaySubject, of as observableOf, Observable } from 'rxjs';
@Component({
    selector: 'receipt-entry',
    templateUrl: './receipt-entry-modal.component.html',
    styleUrls: ['./receipt-entry-modal.component.scss'],
})

export class ReceiptEntryModalComponent implements OnInit, OnDestroy {
    @Input() public transaction: any;
    @Input() public activeCompany: any;
    @Input() public receiptEntries: any[] = [];
    @Output() public entriesList: EventEmitter<any> = new EventEmitter();

    @ViewChild('referenceType') public referenceType: ShSelectComponent;

    public modalRef: BsModalRef;
    public selectInvNoDateAmount: IOption[] = [];
    public selectRef: IOption[] = [
        { label: "Receipt", value: "receipt" },
        { label: "Advance Receipt", value: "advanceReceipt" },
        { label: "Against  Reference", value: "againstReference" }
    ];
    public totalEntries: number = 0;
    public isValidForm: boolean = false;
    public amountErrorMessage: string = "Amount can't be greater than Credit Amount.";
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public taxList: IOption[] = [];
    public taxListSource$: Observable<IOption[]> = observableOf([]);

    constructor(private toaster: ToasterService, private settingsTaxesActions: SettingsTaxesActions, private store: Store<AppState>) {

    }

    public ngOnInit(): void {
        if (this.activeCompany && this.activeCompany.countryV2 && this.activeCompany.countryV2.alpha2CountryCode) {
            this.getTaxList(this.activeCompany.countryV2.alpha2CountryCode);
        }

        this.addNewEntry();
    }

    public addNewEntry(): void {
        this.receiptEntries[this.totalEntries] = {
            type: '',
            note: '',
            tax: '',
            invoiceNo: '',
            amount: 0
        }
    }

    public validateAmount(event: KeyboardEvent): void {
        if ((event.keyCode === 9 || event.keyCode === 13) && this.transaction && this.transaction.amount) {
            let receiptTotal = 0;

            this.receiptEntries.forEach(receipt => {
                receiptTotal += parseFloat(receipt.amount);
            });

            if (receiptTotal < this.transaction.amount) {
                this.totalEntries++;
                this.addNewEntry();
            } else if (receiptTotal > this.transaction.amount) {
                this.toaster.clearAllToaster();
                this.toaster.errorToast(this.amountErrorMessage);
            } else {
                this.isValidForm = true;
            }
        }
    }

    public emitEntries(): void {
        let receiptTotal = 0;

        this.receiptEntries.forEach(receipt => {
            receiptTotal += parseFloat(receipt.amount);
        });

        if (receiptTotal < this.transaction.amount) {
            this.toaster.clearAllToaster();
            this.toaster.errorToast(this.amountErrorMessage);
        } else if (receiptTotal > this.transaction.amount) {
            this.toaster.clearAllToaster();
            this.toaster.errorToast(this.amountErrorMessage);
        } else {
            this.entriesList.emit(this.receiptEntries);
        }
    }

    public getTaxList(countryCode): void {
        this.store.pipe(select(state => state.settings.taxes), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                Object.keys(res.taxes).forEach(key => {
                    this.taxList.push({ label: res.taxes[key].label, value: res.taxes[key].value });
                });
                this.taxListSource$ = observableOf(this.taxList);
            } else {
                this.store.dispatch(this.settingsTaxesActions.GetTaxList(countryCode));
            }
        });
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}