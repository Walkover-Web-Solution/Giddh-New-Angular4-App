import { Observable, of as observableOf, ReplaySubject } from 'rxjs';

import { takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChildren, ViewChild } from '@angular/core';
import { ILedgersInvoiceResult, InvoicePaymentRequest } from '../../../../models/api-models/Invoice';
import * as moment from 'moment/moment';
import { GIDDH_DATE_FORMAT } from '../../../../shared/helpers/defaultDateFormat';
import { IOption } from '../../../../theme/ng-virtual-select/sh-options.interface';
import { IFlattenAccountsResultItem } from '../../../../models/interfaces/flattenAccountsResultItem.interface';
import { AppState } from '../../../../store';
import { SettingsTagActions } from '../../../../actions/settings/tag/settings.tag.actions';
import { select, Store } from '@ngrx/store';
import { ShSelectComponent } from '../../../../theme/ng-virtual-select/sh-select.component';
import { orderBy } from '../../../../lodash-optimized';

@Component({
  selector: 'invoice-payment-model',
  templateUrl: './invoice.payment.model.component.html'
})

export class InvoicePaymentModelComponent implements OnInit, OnDestroy {

  @Input() public selectedInvoiceForDelete: ILedgersInvoiceResult;
  @Output() public closeModelEvent: EventEmitter<InvoicePaymentRequest> = new EventEmitter();
  @ViewChildren(ShSelectComponent) public allShSelectComponents: QueryList<ShSelectComponent>;
  @ViewChild('amountField') amountField;

  public paymentActionFormObj: InvoicePaymentRequest;
  public moment = moment;
  public showDatePicker: boolean = false;
  public showClearanceDatePicker: boolean = false;
  public paymentMode: IOption[] = [];
  public flattenAccountsStream$: Observable<IFlattenAccountsResultItem[]>;
  public isBankSelected: boolean = false;
  public tags: IOption[] = [];
  public dateMask = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public isActionSuccess$: Observable<boolean> = observableOf(false);

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private store: Store<AppState>,
    private _settingsTagActions: SettingsTagActions
  ) {
    this.flattenAccountsStream$ = this.store.pipe(select(s => s.general.flattenAccounts), takeUntil(this.destroyed$));

    this.paymentActionFormObj = new InvoicePaymentRequest();
    this.paymentActionFormObj.paymentDate = moment().toDate();
    this.isActionSuccess$ = this.store.pipe(select(s => s.invoice.invoiceActionUpdated), takeUntil(this.destroyed$));
    this.store.dispatch(this._settingsTagActions.GetALLTags());
  }

  public ngOnInit() {
    this.store.pipe(select(s => s.settings.tags), takeUntil(this.destroyed$)).subscribe((tags => {
      if (tags && tags.length) {
        let arr: IOption[] = [];
        tags.forEach(tag => {
          arr.push({value: tag.name, label: tag.name});
        });
        this.tags = orderBy(arr, 'name');
      }
    }));

    this.flattenAccountsStream$.subscribe(data => {
      if (data) {
        let paymentMode: IOption[] = [];
        data.forEach((item) => {
          let findBankIndx = item.parentGroups.findIndex((grp) => grp.uniqueName === 'bankaccounts' || grp.uniqueName === 'cash');
          if (findBankIndx !== -1) {
            paymentMode.push({label: item.name, value: item.uniqueName, additional: {parentUniqueName: item.parentGroups[1].uniqueName}});
          }
        });
        this.paymentMode = paymentMode;
      }
    });
    this.isActionSuccess$.subscribe(a => {
      if (a) {
        this.resetFrom();
      }
    });
  }

  public onConfirmation(formObj) {
    formObj.paymentDate = moment(formObj.paymentDate).format(GIDDH_DATE_FORMAT);
    this.closeModelEvent.emit(formObj);
    this.resetFrom();
  }

  public onCancel() {
    this.closeModelEvent.emit();
    this.resetFrom();
  }

  /**
   * setPaymentDate
   */
  public setPaymentDate(date) {
    this.paymentActionFormObj.paymentDate = _.cloneDeep(moment(date).format(GIDDH_DATE_FORMAT));
    this.showDatePicker = !this.showDatePicker;
  }

  public setClearanceDate(date) {
    this.showClearanceDatePicker = !this.showClearanceDatePicker;
    this.paymentActionFormObj.chequeClearanceDate = _.cloneDeep(moment(date).format(GIDDH_DATE_FORMAT));
  }

  public onSelectPaymentMode(event) {
    if (event && event.value) {
      this.paymentActionFormObj.accountUniqueName = event.value;
      if (event.additional.parentUniqueName === 'bankaccounts') {
        this.isBankSelected = true;
      } else {
        this.isBankSelected = false;
        this.paymentActionFormObj.chequeClearanceDate = '';
        this.paymentActionFormObj.chequeNumber = '';
      }
    } else {
      this.paymentActionFormObj.accountUniqueName = '';
      this.isBankSelected = false;
      this.paymentActionFormObj.chequeClearanceDate = '';
      this.paymentActionFormObj.chequeNumber = '';
    }

  }

  public onTagSelected(ev) {
    //
  }

  public resetFrom() {
    this.paymentActionFormObj = new InvoicePaymentRequest();
    this.paymentActionFormObj.paymentDate = moment().toDate();

    if (this.allShSelectComponents) {
      this.allShSelectComponents.forEach(sh => {
        sh.clear();
      });
    }

    this.isBankSelected = false;
    this.ngOnDestroy();
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public focusAmountField() {
      this.amountField.nativeElement.focus();
  }
}
