import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { IRoleCommonResponseAndRequest } from '../../../models/api-models/Permission';
import { ILedgersInvoiceResult } from '../../../../models/api-models/Invoice';
import * as moment from 'moment/moment';
import { GIDDH_DATE_FORMAT } from '../../../../shared/helpers/defaultDateFormat';
import { Observable } from 'rxjs/Observable';
import { IOption } from '../../../../theme/ng-virtual-select/sh-options.interface';
import { IFlattenAccountsResultItem } from '../../../../models/interfaces/flattenAccountsResultItem.interface';
import { Store } from '../../../../../../node_modules/@ngrx/store';
import { AppState } from '../../../../store';
import { createSelector } from '../../../../../../node_modules/reselect';
import { ReplaySubject } from '../../../../../../node_modules/rxjs/ReplaySubject';
import { IForceClear } from '../../../../models/api-models/Sales';
import { TagRequest } from '../../../../models/api-models/settingsTags';
import { SettingsTagActions } from '../../../../actions/settings/tag/settings.tag.actions';

@Component({
  selector: 'perform-action-on-invoice-model',
  templateUrl: './invoice.action.model.component.html'
})

export class PerformActionOnInvoiceModelComponent implements OnInit, OnDestroy {

  @Input() public selectedInvoiceForDelete: ILedgersInvoiceResult;
  @Output() public closeModelEvent: EventEmitter<number> = new EventEmitter();
  public paymentActionFormObj: any = {};
  public moment = moment;
  public showDatePicker: boolean = false;
  public showClearanceDatePicker: boolean = false;
  public paymentMode$: Observable<IOption[]>;
  public flattenAccountsStream$: Observable<IFlattenAccountsResultItem[]>;
  public forceClear$: Observable<IForceClear> = Observable.of({status: false});
  public isBankSelected: boolean = false;
  public tags$: Observable<TagRequest[]>;
  public dateMask = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public isActionSuccess$: Observable<boolean> = Observable.of(false);

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private store: Store<AppState>,
    private _settingsTagActions: SettingsTagActions
  ) {
    this.flattenAccountsStream$ = this.store.select(createSelector([(s: AppState) => s.general.flattenAccounts], (s) => {
      // console.log('flattenAccountsStream$');
      return s;
    })).takeUntil(this.destroyed$);
    this.isActionSuccess$ = this.store.select(s => s.invoice.invoiceActionUpdated);
    this.store.dispatch(this._settingsTagActions.GetALLTags());
  }

  public ngOnInit() {
    this.tags$ = this.store.select(createSelector([(state: AppState) => state.settings.tags], (tags) => {
      if (tags && tags.length) {
        _.map(tags, (tag) => {
          tag.value = tag.name;
          tag.label = tag.name;
        });
        return _.orderBy(tags, 'name');
      }
    })).takeUntil(this.destroyed$);

    this.flattenAccountsStream$.subscribe(data => {
      if (data) {
        let paymentMode: IOption[] = [];
        _.forEach(data, (item) => {
          let findBankIndx = item.parentGroups.findIndex((grp) => grp.uniqueName === 'bankaccounts' || grp.uniqueName === 'cash');
          if (findBankIndx !== -1) {
            paymentMode.push({label: item.name, value: item.uniqueName, additional: { parentUniqueName: item.parentGroups[1].uniqueName}});
          }
        });
        this.paymentMode$ = Observable.of(paymentMode);
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
    // if (this.isBankSelected) {
    //   formObj.chequeClearanceDate = moment(formObj.chequeClearanceDate).format(GIDDH_DATE_FORMAT);
    // } else {
    //   delete formObj['chequeClearanceDate'];
    // }
    this.closeModelEvent.emit(formObj);
    this.resetFrom();
  }

  public onCancel() {
    this.closeModelEvent.emit(0);
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

  /**
   * resetFrom
   */
  public resetFrom() {
    this.paymentActionFormObj = {};
    this.forceClear$ = Observable.of({status: true});
    this.paymentActionFormObj.paymentDate = moment();
    // this.paymentActionFormObj.chequeClearanceDate = moment();
    this.isBankSelected = false;
    this.ngOnDestroy();
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
