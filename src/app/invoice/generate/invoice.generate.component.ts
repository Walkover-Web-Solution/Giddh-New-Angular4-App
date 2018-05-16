import { createSelector } from 'reselect';
import { IOption } from './../../theme/ng-select/option.interface';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import * as _ from '../../lodash-optimized';
import { orderBy } from '../../lodash-optimized';
import * as moment from 'moment/moment';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { GenBulkInvoiceFinalObj, GenBulkInvoiceGroupByObj, GenerateBulkInvoiceRequest, GetAllLedgersForInvoiceResponse, GetAllLedgersOfInvoicesResponse, ILedgersInvoiceResult, InvoiceFilterClass, PreviewInvoiceResponseClass } from '../../models/api-models/Invoice';
import { InvoiceActions } from '../../actions/invoice/invoice.actions';
import { AccountService } from '../../services/account.service';
import { Observable } from 'rxjs/Observable';
import { ElementViewContainerRef } from '../../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { ModalDirective } from 'ngx-bootstrap';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';
import { IFlattenAccountsResultItem } from 'app/models/interfaces/flattenAccountsResultItem.interface';

const PARENT_GROUP_ARR = ['sundrydebtors', 'bankaccounts', 'revenuefromoperations', 'otherincome', 'cash'];
const COUNTS = [
  { label: '12', value: '12' },
  { label: '25', value: '25' },
  { label: '50', value: '50' },
  { label: '100', value: '100' }
];

const COMPARISON_FILTER = [
  { label: 'Greater Than', value: 'greaterThan' },
  { label: 'Less Than', value: 'lessThan' },
  { label: 'Greater Than or Equals', value: 'greaterThanOrEquals' },
  { label: 'Less Than or Equals', value: 'lessThanOrEquals' },
  { label: 'Equals', value: 'equals' }
];

@Component({
  styleUrls: ['./invoice.generate.component.css'],
  templateUrl: './invoice.generate.component.html'
})
export class InvoiceGenerateComponent implements OnInit, OnDestroy {
  @ViewChild(ElementViewContainerRef) public elementViewContainerRef: ElementViewContainerRef;
  @ViewChild('invoiceGenerateModel') public invoiceGenerateModel: ModalDirective;
  public accounts$: Observable<IOption[]>;
  public moment = moment;
  public showFromDatePicker: boolean = false;
  public showToDatePicker: boolean = false;
  public togglePrevGenBtn: boolean = false;
  public counts: IOption[] = COUNTS;
  public ledgerSearchRequest: InvoiceFilterClass = new InvoiceFilterClass();
  public filtersForEntryTotal: IOption[] = COMPARISON_FILTER;
  public ledgersData: GetAllLedgersOfInvoicesResponse;
  public selectedLedgerItems: string[] = [];
  public selectedCountOfAccounts: string[] = [];
  public allItemsSelected: boolean = false;
  public  modalRef: BsModalRef;
  public modalConfig = {
    animated: true,
    keyboard: false,
    backdrop: 'static',
    ignoreBackdropClick: true
  };
  public startDate: Date;
  public endDate: Date;
  private universalDate: Date[];
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private flattenAccountListStream$: Observable<IFlattenAccountsResultItem[]>;
  private isBulkInvoiceGenerated$: Observable<boolean>;
  private isUniversalDateApplicable: boolean = false;
  private isBulkInvoiceGeneratedWithoutErr$: Observable<boolean>;

  constructor(
    private modalService: BsModalService,
    private store: Store<AppState>,
    private invoiceActions: InvoiceActions,
    private _accountService: AccountService
  ) {
    // set initial values
    this.ledgerSearchRequest.page = 1;
    this.ledgerSearchRequest.count = 12;
    this.flattenAccountListStream$ = this.store.select(p => p.general.flattenAccounts).takeUntil(this.destroyed$);
    this.isBulkInvoiceGenerated$ = this.store.select(p => p.invoice.isBulkInvoiceGenerated).takeUntil(this.destroyed$);
    this.isBulkInvoiceGeneratedWithoutErr$ = this.store.select(p => p.invoice.isBulkInvoiceGeneratedWithoutErrors).takeUntil(this.destroyed$);
  }

  public ngOnInit() {

    // Get accounts
    this.flattenAccountListStream$.subscribe((data: IFlattenAccountsResultItem[]) => {
      let accounts: IOption[] = [];
      _.forEach(data, (item) => {
        // o.uniqueName === 'sundrydebtors' || o.uniqueName === 'bankaccounts' || o.uniqueName === 'cash' ||  o.uniqueName === 'revenuefromoperations' || o.uniqueName === 'otherincome'
        if (_.find(item.parentGroups, (o) => _.indexOf(PARENT_GROUP_ARR, o.uniqueName) !== -1 )) {
          accounts.push({ label: item.name, value: item.uniqueName });
        }
      });
      this.accounts$ = Observable.of(orderBy(accounts, 'label'));
    });

    this.store.select(p => p.invoice.ledgers)
      .takeUntil(this.destroyed$)
      .subscribe((o: GetAllLedgersForInvoiceResponse) => {
        if (o && o.results) {
          let a = _.cloneDeep(o);
          a.results = _.orderBy(a.results, (item: ILedgersInvoiceResult) => {
            return moment(item.entryDate, 'DD-MM-YYYY');
          }, 'desc');
          this.ledgersData = a;
        }
      });

    this.store.select(p => p.invoice.invoiceData)
      .takeUntil(this.destroyed$)
      .distinctUntilChanged((p: PreviewInvoiceResponseClass, q: PreviewInvoiceResponseClass) => {
        if (p && q) {
          return (p.templateUniqueName === q.templateUniqueName);
        }
        if ((p && !q) || (!p && q)) {
          return false;
        }
        return true;
      }).subscribe((o: PreviewInvoiceResponseClass) => {
        if (o) {
          this.getInvoiceTemplateDetails(o.templateUniqueName);
        }
      });

    // listen for bulk invoice generate and successfully generate and do the things
    this.isBulkInvoiceGenerated$.subscribe(result => {
      if (result) {
        this.toggleAllItems(false);
      }
    });
    this.isBulkInvoiceGeneratedWithoutErr$.subscribe(result => {
      if (result) {
        this.getLedgersOfInvoice();
      }
    });

    // Refresh report data according to universal date
    this.store.select(createSelector([(state: AppState) => state.session.applicationDate], (dateObj: Date[]) => {
      if (dateObj) {
        this.universalDate = _.cloneDeep(dateObj);
        this.ledgerSearchRequest.dateRange = this.universalDate;
        this.isUniversalDateApplicable = true;
        this.getLedgersOfInvoice();
      }
    })).subscribe();
  }

  public closeInvoiceModel(e) {
    if (e.action === 'generate') {
      this.selectedLedgerItems = [];
    }
    this.invoiceGenerateModel.hide();
    setTimeout(() => {
      this.store.dispatch(this.invoiceActions.ResetInvoiceData());
    }, 2000);
  }

  public getLedgersByFilters(f: NgForm) {
    if (f.valid) {
      this.isUniversalDateApplicable = false;
      this.selectedLedgerItems = [];
      this.getLedgersOfInvoice();
    }
  }

  public pageChanged(event: any): void {
    this.ledgerSearchRequest.page = event.page;
    this.selectedLedgerItems = [];
    this.togglePrevGenBtn = false;
    this.getLedgersOfInvoice();
  }

  public toggleAllItems(type: boolean) {
    if (type) {
      this.allItemsSelected = true;
    } else {
      this.allItemsSelected = false;
    }
    this.ledgersData.results = _.map(this.ledgersData.results, (item: ILedgersInvoiceResult) => {
      item.isSelected = this.allItemsSelected ? true : false;
      return item;
    });
    this.insertItemsIntoArr();
  }

  public toggleItem(item: any, action: boolean) {
    item.isSelected = action;
    if (action) {
      this.countAndToggleVar();
    } else {
      this.allItemsSelected = false;
    }
    this.insertItemsIntoArr();
  }

  public previewInvoice() {
    let model = {
      uniqueNames: _.uniq(this.selectedLedgerItems)
    };
    let res = _.find(this.ledgersData.results, (item: ILedgersInvoiceResult) => {
      return item.uniqueName === this.selectedLedgerItems[0];
    });
    this.store.dispatch(this.invoiceActions.ModifiedInvoiceStateData(model.uniqueNames));
    this.store.dispatch(this.invoiceActions.PreviewInvoice(res.account.uniqueName, model));
    this.showInvoiceModal();
  }

  public generateBulkInvoice(action: boolean) {
    if (this.selectedLedgerItems.length <= 0) {
      return false;
    }
    let arr: GenBulkInvoiceGroupByObj[] = [];
    _.forEach(this.ledgersData.results, (item: ILedgersInvoiceResult): void => {
      if (item.isSelected) {
        arr.push({ accUniqueName: item.account.uniqueName, uniqueName: item.uniqueName });
      }
    });
    let res = _.groupBy(arr, 'accUniqueName');
    let model: GenerateBulkInvoiceRequest[] = [];
    _.forEach(res, (item: any): void => {
      let obj: GenBulkInvoiceFinalObj = new GenBulkInvoiceFinalObj();
      obj.entries = [];
      _.forEach(item, (o: GenBulkInvoiceGroupByObj): void => {
        obj.accountUniqueName = o.accUniqueName;
        obj.entries.push(o.uniqueName);
      });
      model.push(obj);
    });
    this.store.dispatch(this.invoiceActions.GenerateBulkInvoice({combined: action}, model));
    this.selectedLedgerItems = [];
  }

  public setToday(model: string) {
    this.ledgerSearchRequest[model] = String(moment());
  }

  public clearDate(model: string) {
    this.ledgerSearchRequest[model] = '';
  }

  public getInvoiceTemplateDetails(templateUniqueName: string) {
    if (templateUniqueName) {
      this.store.dispatch(this.invoiceActions.GetTemplateDetailsOfInvoice(templateUniqueName));
    }else {
      this.store.dispatch(this.invoiceActions.GetTemplateDetailsOfInvoice('j8bzr0k3lh0khbcje8bh'));
    }
  }

  public showInvoiceModal() {
    this.invoiceGenerateModel.show();
  }

  public getLedgersOfInvoice() {
    this.store.dispatch(this.invoiceActions.GetAllLedgersForInvoice(this.prepareQueryParamsForLedgerApi(), this.prepareModelForLedgerApi()));
  }

  public prepareModelForLedgerApi() {
    let model: InvoiceFilterClass = {};
    let o = _.cloneDeep(this.ledgerSearchRequest);
    if (o && o.accountUniqueName) {
      model.accountUniqueName = o.accountUniqueName;
    }
    if (o.entryTotal) {
      model.entryTotal = o.entryTotal;
    }
    if (o.description) {
      model.description = o.description;
    }
    if (o.entryTotalBy === COMPARISON_FILTER[0].value) {
      model.totalIsMore = true;
    } else if (o.entryTotalBy === COMPARISON_FILTER[1].value) {
      model.totalIsLess = true;
    } else if (o.entryTotalBy === COMPARISON_FILTER[2].value) {
      model.totalIsMore = true;
      model.totalIsEqual = true;
    } else if (o.entryTotalBy === COMPARISON_FILTER[3].value) {
      model.totalIsLess = true;
      model.totalIsEqual = true;
    } else if (o.entryTotalBy === COMPARISON_FILTER[4].value) {
      model.totalIsEqual = true;
    }
    return model;
  }

  public prepareQueryParamsForLedgerApi() {
    let o = _.cloneDeep(this.ledgerSearchRequest);
    let fromDate = null;
    let toDate = null;
    if (this.universalDate && this.universalDate.length) {
      fromDate = moment(this.universalDate[0]).format(GIDDH_DATE_FORMAT);
      toDate = moment(this.universalDate[1]).format(GIDDH_DATE_FORMAT);
    } else {
      fromDate  = moment().subtract(30, 'days').format(GIDDH_DATE_FORMAT);
      toDate  = moment().format(GIDDH_DATE_FORMAT);
    }
    return {
      from: this.isUniversalDateApplicable ? fromDate : o.from,
      to: this.isUniversalDateApplicable ? toDate : o.to,
      count: o.count,
      page: o.page
    };
  }

  public bsValueChange(event: any) {
    if (event) {
      this.ledgerSearchRequest.from = moment(event[0]).format(GIDDH_DATE_FORMAT);
      this.ledgerSearchRequest.to = moment(event[1]).format(GIDDH_DATE_FORMAT);
    }
  }

  public countAndToggleVar() {
    let total: number = this.ledgersData.results.length;
    let count: number = 0;
    _.forEach(this.ledgersData.results, (item: ILedgersInvoiceResult) => {
      if (item.isSelected) {
        count++;
      }
    });
    if (count === total) {
      this.allItemsSelected = true;
    }
  }

  public insertItemsIntoArr() {
    _.forEach(this.ledgersData.results, (item: ILedgersInvoiceResult) => {
      let idx = _.indexOf(this.selectedLedgerItems, item.uniqueName);
      if (item.isSelected) {
        if (idx === -1) {
          this.selectedLedgerItems.push(item.uniqueName);
          this.selectedCountOfAccounts.push(item.account.uniqueName);
        }
      } else {
        if (idx !== -1) {
          this.selectedLedgerItems.splice(idx);
          this.selectedCountOfAccounts.splice(idx);
        }
      }
    });
    // check if all selected entries are from same account
    if (this.selectedCountOfAccounts.length) {
      this.togglePrevGenBtn = this.selectedCountOfAccounts.every(v => v === this.selectedCountOfAccounts[0]);
    }else {
      this.togglePrevGenBtn = false;
    }
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
