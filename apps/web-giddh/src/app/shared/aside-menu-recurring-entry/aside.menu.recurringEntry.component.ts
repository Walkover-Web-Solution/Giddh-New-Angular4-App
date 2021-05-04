import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { IOption } from '../../theme/ng-select/ng-select';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store';
import { InvoiceActions } from '../../actions/invoice/invoice.actions';
import { RecurringInvoice } from '../../models/interfaces/RecurringInvoice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ReplaySubject } from 'rxjs';
import { ToasterService } from "../../services/toaster.service";
import { takeUntil } from 'rxjs/operators';
import { RecurringVoucherService } from '../../services/recurring-voucher.service';
import { GIDDH_DATE_FORMAT } from '../helpers/defaultDateFormat';

@Component({
	selector: 'app-aside-recurring-entry',
	templateUrl: './aside.menu.recurringEntry.component.html',
	styleUrls: ['./aside.menu.recurringEntry.component.scss'],
})

export class AsideMenuRecurringEntryComponent implements OnInit, OnChanges, OnDestroy {
	public IsNotExpirable: boolean;
	public today: Date = new Date();
	public maxEndDate: Date = new Date();
	public intervalOptions: IOption[];
	public timeOptions: IOption[];
	public isLoading: boolean = false;
	public isDeleteLoading: boolean;
	public form: FormGroup;
	public config: Partial<BsDatepickerConfig> = { dateInputFormat: GIDDH_DATE_FORMAT };
	@Input() public voucherNumber: string;
	@Input() public voucherType?: string;
	@Input() public mode: 'create' | 'update' = 'create';
    @Input() public invoice: RecurringInvoice;
    /** True, if organization type is company and it has more than one branch (i.e. in addition to HO) */
    @Input() public isCompany: boolean;
	@Output() public closeAsideEvent: EventEmitter<RecurringInvoice> = new EventEmitter(true);

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This holds giddh date format */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;

	constructor(private store: Store<AppState>,
		private _fb: FormBuilder,
		private _toaster: ToasterService,
		private _invoiceActions: InvoiceActions, private recurringVoucherService: RecurringVoucherService) {
		this.today.setDate(this.today.getDate() + 1);
		this.form = this._fb.group({
			voucherNumber: [this.voucherNumber, Validators.required],
			duration: ['', Validators.required],
			nextCronDate: ['', Validators.required],
			cronEndDate: ['', Validators.required],
		});
		this.form.controls.nextCronDate.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(p => {
			this.maxEndDate = p;
			const { cronEndDate } = this.form.value;
			const end = moment(cronEndDate, cronEndDate instanceof Date ? null : GIDDH_DATE_FORMAT);
			const next = moment(p);
			if (end.isValid() && next.isAfter(end)) {
				this.form.controls.cronEndDate?.patchValue('');
			}
		});
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes.voucherNumber) {
			this.form.controls.voucherNumber?.patchValue(this.voucherNumber);
		}
		if (this.invoice) {
			this.form?.patchValue({
				voucherNumber: this.invoice.voucherNumber,
				duration: this.invoice.duration.toLowerCase(),
				nextCronDate: this.invoice.nextCronDate && moment(this.invoice.nextCronDate, GIDDH_DATE_FORMAT).toDate(),
				cronEndDate: this.invoice.cronEndDate && moment(this.invoice.cronEndDate, GIDDH_DATE_FORMAT).toDate()
			});
			if (!this.invoice.cronEndDate) {
				this.isExpirableChanged({ checked: true });
			}
		}
	}

	public ngOnInit() {

		this.intervalOptions = [
            { label: 'Weekly', value: 'weekly' },
            { label: 'Monthly', value: 'monthly' },
			{ label: 'Quarterly', value: 'quarterly' },
			{ label: 'Halfyearly', value: 'halfyearly' },
			{ label: 'Yearly', value: 'yearly' }

		];

		this.timeOptions = [
			{ label: '1st', value: '1' },
			{ label: '2nd', value: '2' },
			{ label: '3rd', value: '3' },
			{ label: '4th', value: '4' },
			{ label: '5th', value: '5' },
        ];

		this.store.pipe(select(state => state.invoice.recurringInvoiceData), takeUntil(this.destroyed$)).subscribe(response => {
            this.isLoading = response.isRequestInFlight;
            this.isDeleteLoading = response.isDeleteRequestInFlight;
            if (response.isRequestSuccess) {
                this.closeAsidePane(null);
                this.store.dispatch(this._invoiceActions.resetRecurringInvoiceRequest());
            }
        });
	}

	public closeAsidePane(event: RecurringInvoice) {
		this.closeAsideEvent.emit(event);
		this.ngOnDestroy();
	}

	public deleteInvoice() {
        this.isDeleteLoading = true;

        this.recurringVoucherService.deleteRecurringVouchers(this.invoice.uniqueName).subscribe(response => {
            if(response) {
                this.isDeleteLoading = null;
                this.closeAsidePane(null);
                if(response.status === "success") {
                    this._toaster.successToast(response.body);
                } else {
                    this._toaster.successToast(response.message);
                }
            }
        });
	}

	public isExpirableChanged({ checked }) {
		this.IsNotExpirable = checked;
		if (checked) {
			this.form.controls.cronEndDate.setValidators([]);
		} else {
			this.form.controls.cronEndDate.setValidators(Validators.required);
		}
		this.form.controls.cronEndDate.updateValueAndValidity();
	}

	public saveRecurringInvoice() {
		if (this.mode === 'update') {
			if (this.form.controls.cronEndDate.invalid) {
				this._toaster.errorToast('Date should be greater than today');
				return;
			}
		} else {
			if (this.form.invalid) {
				this._toaster.errorToast('All * fields should be valid and filled');
				return;
			}
		}

		if (this.form.controls.cronEndDate.valid && this.form.controls.voucherNumber.valid && this.form.controls.duration.valid && !this.isLoading) {
			this.isLoading = true;
			const cronEndDate = this.IsNotExpirable ? '' : this.getFormattedDate(this.form.value.cronEndDate);
			const nextCronDate = this.getFormattedDate(this.form.value.nextCronDate);
			const invoiceModel: RecurringInvoice = { ...this.invoice, ...this.form.value, cronEndDate, nextCronDate };
			if (this.voucherType) {
				invoiceModel.voucherType = this.voucherType;
			}
			if (this.mode === 'update') {
				this.store.dispatch(this._invoiceActions.updateRecurringInvoice(invoiceModel));
			} else {
				this.store.dispatch(this._invoiceActions.createRecurringInvoice(invoiceModel));
			}
		} else {
			this._toaster.errorToast('All * fields should be valid and filled');
		}

	}

	public getFormattedDate(date): string {
		return moment(date, date instanceof Date ? null : GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
	}

	public ngOnDestroy() {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}
}
