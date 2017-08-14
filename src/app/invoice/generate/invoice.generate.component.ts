import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { InvoiceFilterClass, GetAllLedgersOfInvoicesResponse, ILedgersInvoiceResult, GenBulkInvoiceGroupByObj, GenBulkInvoiceFinalObj } from '../../models/api-models/Invoice';
import { InvoiceActions } from '../../services/actions/invoice/invoice.actions';
import { INameUniqueName } from '../../models/interfaces/nameUniqueName.interface';
import { InvoiceState } from '../../store/Invoice/invoice.reducer';
import { AccountService } from '../../services/account.service';
import { Observable } from 'rxjs/Observable';
import { Select2OptionData } from '../../shared/theme/select2/select2.interface';

const COUNTS = [12, 25, 50, 100];
const COMPARISION_FILTER = [
  {name: 'Greater Than', uniqueName: 'greaterThan'},
  {name: 'Less Than', uniqueName: 'lessThan'},
  {name: 'Greater Than or Equals', uniqueName: 'greaterThanOrEquals'},
  {name: 'Less Than or Equals', uniqueName: 'lessThanOrEquals'},
  {name: 'Equals', uniqueName: 'equals'}
];

@Component({
  styleUrls: ['./invoice.generate.component.css'],
  templateUrl: './invoice.generate.component.html'
})
export class InvoiceGenerateComponent implements OnInit {

  public accounts$: Observable<Select2OptionData[]>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private modalRef: BsModalRef;
  private config = {
    animated: true,
    keyboard: false,
    backdrop: true,
    ignoreBackdropClick: true
  };
  private select2Options: Select2Options = {
    multiple: false,
    width: '100%',
    placeholder: 'Select Accounts',
    allowClear: true
  };
  private counts: number[] = COUNTS;
  private ledgerSearchRequest: InvoiceFilterClass = new InvoiceFilterClass();
  private filtersForEntryTotal: INameUniqueName[] = COMPARISION_FILTER;
  private ledgersData: GetAllLedgersOfInvoicesResponse;
  private selectedLedgerItems: string[] = [];
  private allItemsSelected: boolean = false;

  constructor(
    private modalService: BsModalService,
    private store: Store<AppState>,
    private invoiceActions: InvoiceActions,
    private _accountService: AccountService
  ) {}

  public ngOnInit() {
    // set initial values
    this.ledgerSearchRequest.from = moment().subtract(30, 'days').format('DD-MM-YYYY');
    this.ledgerSearchRequest.to = moment().format('DD-MM-YYYY');
    this.ledgerSearchRequest.page = 1;
    this.ledgerSearchRequest.count = 12;

    // Get accounts
    this._accountService.GetFlattenAccounts('', '').takeUntil(this.destroyed$).subscribe(data => {
      if (data.status === 'success') {
        let accounts: Select2OptionData[] = [];
        data.body.results.map(d => {
          // Select only sundry debtors account
          if (d.parentGroups.find((o) => o.uniqueName === 'sundrydebtors')) {
            accounts.push({ text: d.name, id: d.uniqueName });
          }
        });
        this.accounts$ = Observable.of(accounts);
      }
    });

    this.store.select(p => p.invoice).takeUntil(this.destroyed$).subscribe((o: InvoiceState) => {
      if (o.generate && o.generate.ledgers) {
        this.ledgersData = _.cloneDeep(o.generate.ledgers);
        _.map(this.ledgersData.results, (item: ILedgersInvoiceResult) => {
            item.isSelected = false;
            return o;
        });
      }
    });
    this.getLedgersOfInvoice();
  }

  private showInvoiceModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, Object.assign({}, this.config, {class: 'gray modal-liquid'}));
  }

  private closeInvoiceModel(e) {
    console.log(e, 'closeInvoiceModel');
    this.modalRef.hide();
  }

  private getLedgersByFilters(f: NgForm) {
    if (f.valid) {
      this.getLedgersOfInvoice();
    }
  }

  private showNewInvoiceCreate() {
    console.log ('showNewInvoiceCreate open modal');
  }

  private getLedgersOfInvoice() {
    this.store.dispatch(this.invoiceActions.GetAllLedgersForInvoice(this.prepareQueryParamsForLedgerApi(), this.prepareModelForLedgerApi()));
  }

  private prepareModelForLedgerApi() {
    let model: InvoiceFilterClass = {};
    let o = _.cloneDeep(this.ledgerSearchRequest);
    if (o.accountUniqueName) {
      model.accountUniqueName = o.accountUniqueName;
    }
    if (o.entryTotal) {
      model.entryTotal = o.entryTotal;
    }
    if (o.description) {
      model.description = o.description;
    }
    if (o.entryTotalBy === COMPARISION_FILTER[0].uniqueName) {
      model.totalIsMore = true;
    }else if (o.entryTotalBy === COMPARISION_FILTER[1].uniqueName) {
      model.totalIsLess = true;
    }else if (o.entryTotalBy === COMPARISION_FILTER[2].uniqueName) {
      model.totalIsMore = true;
      model.totalIsEqual = true;
    }else if (o.entryTotalBy === COMPARISION_FILTER[3].uniqueName) {
      model.totalIsLess = true;
      model.totalIsEqual = true;
    }else if (o.entryTotalBy === COMPARISION_FILTER[4].uniqueName) {
      model.totalIsEqual = true;
    }
    return model;
  }

  private prepareQueryParamsForLedgerApi() {
    let o = _.cloneDeep(this.ledgerSearchRequest);
    return {
      from: o.from,
      to: o.to,
      count: o.count,
      page: o.page
    };
  }

  private toggleItem(item: any, action: boolean) {
    item.isSelected = action;
    if (action) {
      this.countAndToggleVar();
    }else {
      this.allItemsSelected = false;
    }
    this.insertItemsIntoArr();
  }

  private countAndToggleVar() {
    let total: number = this.ledgersData.results.length;
    let count: number = 0;
    _.forEach(this.ledgersData.results, (item: ILedgersInvoiceResult) => {
      if (item.isSelected) {
        count ++;
      }
    });
    if (count === total) {
      this.allItemsSelected = true;
    }
  }

  private toggleAllItems(type: boolean) {
    if (type) {
      this.allItemsSelected = true;
    }else {
      this.allItemsSelected = false;
    }
    this.ledgersData.results = _.map(this.ledgersData.results, (item: ILedgersInvoiceResult) => {
      item.isSelected = this.allItemsSelected ? true : false;
      return item;
    });
    this.insertItemsIntoArr();
  }

  private insertItemsIntoArr() {
    _.forEach(this.ledgersData.results, (item: ILedgersInvoiceResult) => {
      let idx = _.indexOf(this.selectedLedgerItems, item.uniqueName);
      if (item.isSelected) {
        if (idx === -1) {
          this.selectedLedgerItems.push(item.uniqueName);
        }
      }else {
        if (idx !== -1) {
          this.selectedLedgerItems.splice(idx);
        }
      }
    });
  }

  private prevAndGenInv() {
    let model = {
      uniqueNames: _.uniq(this.selectedLedgerItems)
    };
    let res = _.find(this.ledgersData.results, (item: ILedgersInvoiceResult) => {
      return item.uniqueName === this.selectedLedgerItems[0];
    });
    console.log ('before api', model, res.uniqueName);
  }

  private generateBulkInvoice(action: boolean) {
    if (this.selectedLedgerItems.length <= 0) {
      return false;
    }
    let arr: GenBulkInvoiceGroupByObj[] = [];
    _.forEach(this.ledgersData.results, (item: ILedgersInvoiceResult) => {
      if (item.isSelected) {
        arr.push({accUniqueName: item.account.uniqueName, uniqueName: item.uniqueName});
      }
    });
    let res = _.groupBy(arr, 'accUniqueName');
    let final = [];
    _.forEach(res, (items: GenBulkInvoiceGroupByObj) => {
      let obj: GenBulkInvoiceFinalObj = new GenBulkInvoiceFinalObj();
      obj.entries = [];
      _.forEach(items, (o: GenBulkInvoiceGroupByObj) => {
        obj.accountUniqueName = o.accUniqueName;
        obj.entries.push(o.uniqueName);
      });
      final.push(obj);
    });
    console.log ('before api', action, final);
  }

}
