import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { IOption } from '../../theme/ng-select/ng-select';
import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import { InvoiceActions } from '../../actions/invoice/invoice.actions';
import { RecurringInvoice } from '../../models/interfaces/RecurringInvoice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { ReplaySubject } from 'rxjs';
import { ToasterService } from "../../services/toaster.service";

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
	public isLoading: boolean;
	public isDeleteLoading: boolean;
	public form: FormGroup;
	public config: Partial<BsDatepickerConfig> = { dateInputFormat: 'DD-MM-YYYY' };
	@Input() public voucherNumber: string;
	@Input() public voucherType?: string;
	@Input() public mode: 'create' | 'update' = 'create';
	@Input() public invoice: RecurringInvoice;
	@Output() public closeAsideEvent: EventEmitter<RecurringInvoice> = new EventEmitter(true);

	private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

	constructor(private _store: Store<AppState>,
		private _fb: FormBuilder,
		private _toaster: ToasterService,
		private _invoiceActions: InvoiceActions) {
		this.today.setDate(this.today.getDate() + 1);
		this.form = this._fb.group({
			voucherNumber: [this.voucherNumber, Validators.required],
			duration: ['', Validators.required],
			nextCronDate: ['', Validators.required],
			cronEndDate: ['', Validators.required],
		});
		this.form.controls.nextCronDate.valueChanges.subscribe(p => {
			this.maxEndDate = p;
			const { cronEndDate } = this.form.value;
			const end = moment(cronEndDate, cronEndDate instanceof Date ? null : 'DD-MM-YYYY');
			const next = moment(p);
			if (end.isValid() && next.isAfter(end)) {
				this.form.controls.cronEndDate.patchValue('');
			}
		});
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes.voucherNumber) {
			this.form.controls.voucherNumber.patchValue(this.voucherNumber);
		}
		if (this.invoice) {
			this.form.patchValue({
				voucherNumber: this.invoice.voucherNumber,
				duration: this.invoice.duration.toLowerCase(),
				nextCronDate: this.invoice.nextCronDate && moment(this.invoice.nextCronDate, 'DD-MM-YYYY').toDate(),
				cronEndDate: this.invoice.cronEndDate && moment(this.invoice.cronEndDate, 'DD-MM-YYYY').toDate()
			});
			if (!this.invoice.cronEndDate) {
				this.isExpirableChanged({ checked: true });
			}
		}
	}

	public ngOnInit() {
		this.intervalOptions = [
			{ label: 'Weekly', value: 'weekly' },
			{ label: 'Quarterly', value: 'quarterly' },
			{ label: 'Halfyearly', value: 'halfyearly' },
			{ label: 'Yearly', value: 'yearly' },
			{ label: 'Monthly', value: 'monthly' }
		];

		this.timeOptions = [
			{ label: '1st', value: '1' },
			{ label: '2nd', value: '2' },
			{ label: '3rd', value: '3' },
			{ label: '4th', value: '4' },
			{ label: '5th', value: '5' },
		];
		this._store.select(p => p.invoice.recurringInvoiceData)
			.subscribe(p => {
				this.isLoading = p.isRequestInFlight;
				this.isDeleteLoading = p.isDeleteRequestInFlight;
				if (p.isRequestSuccess) {
					this.closeAsidePane(null);
				}
			});
	}

	public closeAsidePane(event: RecurringInvoice) {
		this.closeAsideEvent.emit(event);
		this.ngOnDestroy();
	}

	public deleteInvoice() {
		this.isDeleteLoading = true;
		this._store.dispatch(this._invoiceActions.deleteRecurringInvoice(this.invoice.uniqueName));
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
				this._store.dispatch(this._invoiceActions.updateRecurringInvoice(invoiceModel));
			} else {
				this._store.dispatch(this._invoiceActions.createRecurringInvoice(invoiceModel));
			}
		} else {
			this._toaster.errorToast('All * fields should be valid and filled');
		}

	}

	public getFormattedDate(date): string {
		return moment(date, date instanceof Date ? null : 'DD-MM-YYYY').format('DD-MM-YYYY');
	}

	public ngOnDestroy() {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}
}
