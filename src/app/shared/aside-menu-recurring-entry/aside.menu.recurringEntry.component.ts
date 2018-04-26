import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IOption } from '../../theme/ng-select/ng-select';
import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import { InvoiceActions } from '../../actions/invoice/invoice.actions';
import { RecurringInvoice } from '../../models/interfaces/RecurringInvoice';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap';

@Component({
  selector: 'app-aside-recurring-entry',
  templateUrl: './aside.menu.recurringEntry.component.html',
  styles: [`
    :host {
      position: fixed;
      left: auto;
      top: 0;
      right: 0;
      bottom: 0;
      width: 480px;
      z-index: 1045;
    }

    #close {
      display: none;
    }

    :host.in #close {
      display: block;
      position: fixed;
      left: -41px;
      top: 0;
      z-index: 5;
      border: 0;
      border-radius: 0;
    }

    :host .container-fluid {
      padding-left: 0;
      padding-right: 0;
    }

    :host .aside-pane {
      width: 480px;
    }
  `],
})

export class AsideMenuRecurringEntryComponent implements OnInit, OnChanges {
  public IsNotExpirable: boolean;

  public today: Date = new Date();
  public maxEndDate: Date = new Date();
  public intervalOptions: IOption[];
  public timeOptions: IOption[];
  public isLoading: boolean;
  public form: FormGroup;
  public config: Partial<BsDatepickerConfig> = {dateInputFormat: 'DD-MM-YYYY'};
  @Input() public voucherNumber: string;
  @Input() public mode: 'create' | 'update' = 'create';
  @Input() public invoice: RecurringInvoice;
  @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);

  constructor(private _store: Store<AppState>,
              private _fb: FormBuilder,
              private _invoiceActions: InvoiceActions) {
    //
    this.form = this._fb.group({
      voucherNumber: [this.voucherNumber, Validators.required],
      duration: ['', Validators.required],
      nextCronDate: [moment().format('DD-MM-YYYY'), Validators.required],
      cronEndDate: ['', Validators.required],
    });
    this.form.controls.nextCronDate.valueChanges.subscribe(p => {
      this.maxEndDate = p;
      const {cronEndDate} = this.form.value;
      const end = moment(cronEndDate, cronEndDate instanceof Date ? null : 'DD-MM-YYYY');
      const next = moment(p);
      if (end.isValid() && next.isAfter(end)) {
        this.form.controls.cronEndDate.patchValue('');
      }
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.invoice) {
      this.form.patchValue({
        voucherNumber: this.invoice.voucherNumber,
        duration: this.invoice.duration.toLowerCase(),
        nextCronDate: this.invoice.nextCronDate,
        cronEndDate: this.invoice.cronEndDate
      });
    }
  }

  public ngOnInit() {
    this.intervalOptions = [
      {label: 'Weekly', value: 'weekly'},
      {label: 'Quarterly', value: 'qarterly'},
      {label: 'Halfyearly', value: 'halfyearly'},
      {label: 'Yearly', value: 'yearly'}
    ];

    this.timeOptions = [
      {label: '1st', value: '1'},
      {label: '2nd', value: '2'},
      {label: '3rd', value: '3'},
      {label: '4th', value: '4'},
      {label: '5th', value: '5'},
    ];
    this._store.select(p => p.invoice.recurringInvoiceData)
      .subscribe(p => {
        this.isLoading = p.isRequestInFlight;
        if (p.isRequestSuccess) {
          this.closeAsidePane(null);
        }
      });
  }

  public closeAsidePane(event) {
    this.closeAsideEvent.emit(event);
  }

  public isExpirableChanged({checked}) {
    this.IsNotExpirable = checked;
    this.form.controls.cronEndDate.setValidators(!checked ? Validators.required : null);
  }

  public saveRecurringInvoice() {
    console.log(this.form.value);
    if (this.form.valid && !this.isLoading) {
      this.isLoading = true;
      const cronEndDate = this.IsNotExpirable ? '' : this.getFormattedDate(this.form.value.cronEndDate);
      const nextCronDate = this.getFormattedDate(this.form.value.nextCronDate);
      const invoiceModel: RecurringInvoice = {...this.form.value, cronEndDate, nextCronDate};
      if (this.mode === 'create') {
        this._store.dispatch(this._invoiceActions.createRecurringInvoice(invoiceModel));
      } else {
        this._store.dispatch(this._invoiceActions.updateRecurringInvoice(invoiceModel));
      }
    }
  }

  public getFormattedDate(date): string {
    return moment(date, date instanceof Date ? null : 'DD-MM-YYYY').format('DD-MM-YYYY');
  }
}
