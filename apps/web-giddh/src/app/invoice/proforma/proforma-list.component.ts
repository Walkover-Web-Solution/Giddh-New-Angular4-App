import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProformaFilter, ProformaGetRequest, ProformaItem, ProformaResponse } from '../../models/api-models/proforma';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
import { ProformaActions } from '../../actions/proforma/proforma.actions';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Observable, ReplaySubject } from 'rxjs';
import * as moment from 'moment/moment';
import { cloneDeep } from '../../lodash-optimized';
import { ModalDirective, ModalOptions } from 'ngx-bootstrap';
import { InvoiceFilterClassForInvoicePreview, InvoicePreviewDetailsVm } from '../../models/api-models/Invoice';
import { InvoiceAdvanceSearchComponent } from '../preview/models/advanceSearch/invoiceAdvanceSearch.component';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';
import { InvoiceSetting } from '../../models/interfaces/invoice.setting.interface';

@Component({
  selector: 'app-proforma-list-component',
  templateUrl: './proforma-list.component.html',
  styleUrls: [`./proforma-list.component.scss`]
})

export class ProformaListComponent implements OnInit, OnDestroy {
  @ViewChild('advanceSearch') public advanceSearch: ModalDirective;
  @ViewChild(InvoiceAdvanceSearchComponent) public advanceSearchComponent: InvoiceAdvanceSearchComponent;
  @Input() public voucherType: 'proformas' | 'estimates' = 'proformas';
  public voucherData: ProformaResponse;

  public showAdvanceSearchModal: boolean = false;
  public showResetAdvanceSearchIcon: boolean = false;
  public selectedItems: string[] = [];
  public selectedCustomerUniqueName: string;
  public selectedVoucher: InvoicePreviewDetailsVm;
  public invoiceSetting: InvoiceSetting;
  public appSideMenubarIsOpen: boolean;

  public modalConfig: ModalOptions = {
    animated: true,
    keyboard: true,
    backdrop: 'static',
    ignoreBackdropClick: true
  };
  public datePickerOptions: any = {
    hideOnEsc: true,
    locale: {
      applyClass: 'btn-green',
      applyLabel: 'Go',
      fromLabel: 'From',
      format: 'D-MMM-YY',
      toLabel: 'To',
      cancelLabel: 'Cancel',
      customRangeLabel: 'Custom range'
    },
    ranges: {
      'This Month to Date': [
        moment().startOf('month'),
        moment()
      ],
      'This Quarter to Date': [
        moment().quarter(moment().quarter()).startOf('quarter'),
        moment()
      ],
      'This Financial Year to Date': [
        moment().startOf('year').subtract(9, 'year'),
        moment()
      ],
      'This Year to Date': [
        moment().startOf('year'),
        moment()
      ],
      'Last Month': [
        moment().subtract(1, 'month').startOf('month'),
        moment().subtract(1, 'month').endOf('month')
      ],
      'Last Quater': [
        moment().quarter(moment().quarter()).subtract(1, 'quarter').startOf('quarter'),
        moment().quarter(moment().quarter()).subtract(1, 'quarter').endOf('quarter')
      ],
      'Last Financial Year': [
        moment().startOf('year').subtract(10, 'year'),
        moment().endOf('year').subtract(10, 'year')
      ],
      'Last Year': [
        moment().startOf('year').subtract(1, 'year'),
        moment().endOf('year').subtract(1, 'year')
      ]
    },
    startDate: moment().subtract(30, 'days'),
    endDate: moment()
  };

  public showVoucherNoSearch: boolean = false;
  public voucherNumberInput: FormControl = new FormControl();

  public showCustomerSearch: boolean = false;
  public customerNameInput: FormControl = new FormControl();

  public sortRequestForUi: { sortBy: string, sort: string } = {sortBy: '', sort: ''};
  public advanceSearchFilter: ProformaFilter = new ProformaFilter();
  public allItemsSelected: boolean = false;
  public hoveredItemUniqueName: string;
  public clickedItemUniqueName: string;

  public isGetAllInProcess$: Observable<boolean>;
  public isDeleteVoucherSuccess$: Observable<boolean>;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private proformaActions: ProformaActions) {
    this.advanceSearchFilter.page = 1;
    this.advanceSearchFilter.count = 10;

    this.isGetAllInProcess$ = this.store.pipe(select(s => s.proforma.getAllInProcess), takeUntil(this.destroyed$));
    this.isDeleteVoucherSuccess$ = this.store.pipe(select(s => s.proforma.isDeleteProformaSuccess), takeUntil(this.destroyed$));
  }

  ngOnInit() {
    this.getAll();

    this.store
      .pipe(select(s => s.proforma.vouchers), takeUntil(this.destroyed$))
      .subscribe(resp => {
        if (resp) {
          resp.results = resp.results.map(item => {
            item.isSelected = false;
            item.uniqueName = item.proformaNumber;

            let dueDate = item.expiryDate ? moment(item.expiryDate, 'DD-MM-YYYY') : null;

            if (dueDate) {
              if (dueDate.isAfter(moment()) || ['paid', 'cancel'].includes(item.action)) {
                item.expiredDays = null;
              } else {
                let dueDays = dueDate ? moment().diff(dueDate, 'days') : null;
                item.isSelected = false;
                item.expiredDays = dueDays;
              }
            } else {
              item.expiredDays = null;
            }

            return item;
          });
          this.voucherData = cloneDeep(resp);
        }
      });

    this.voucherNumberInput.valueChanges.pipe(
      debounceTime(700),
      distinctUntilChanged(),
      takeUntil(this.destroyed$)
    ).subscribe(s => {
      if (this.voucherType === 'proformas') {
        this.advanceSearchFilter.proformaNumber = s;
      } else {
        this.advanceSearchFilter.estimateNumber = s;
      }
      this.getAll();
      if (s === '') {
        this.showVoucherNoSearch = false;
      }
    });

    this.customerNameInput.valueChanges.pipe(
      debounceTime(700),
      distinctUntilChanged(),
      takeUntil(this.destroyed$)
    ).subscribe(s => {
      this.advanceSearchFilter.q = s;
      this.getAll();
      if (s === '') {
        this.showCustomerSearch = false;
      }
    });

    this.store.pipe(select(s => s.invoice.settings), takeUntil(this.destroyed$)).subscribe(settings => {
      this.invoiceSetting = settings;
    });

    this.store.pipe(select(s => s.general.sideMenuBarOpen), takeUntil(this.destroyed$))
      .subscribe(result => this.appSideMenubarIsOpen = result);

    this.isDeleteVoucherSuccess$.subscribe(res => {
      if (res && this.selectedVoucher) {
        this.selectedVoucher = null;
        this.getAll();
      }
    });
  }

  public getAll() {
    this.store.dispatch(this.proformaActions.getAll(this.advanceSearchFilter, this.voucherType));
  }

  public clickedOutside(event, el, fieldName: string) {
    if (fieldName === 'voucherNumber') {
      if (this.voucherNumberInput.value !== null && this.voucherNumberInput.value !== '') {
        return;
      }
    } else if (fieldName === 'customerName') {
      if (this.customerNameInput.value !== null && this.customerNameInput.value !== '') {
        return;
      }
    }
    // if (this.invoiceSearchRequest[fieldName] !== '') {
    //   return;
    // }

    if (this.childOf(event.target, el)) {
      return;
    } else {
      if (fieldName === 'voucherNumber') {
        this.showVoucherNoSearch = false;
      } else if (fieldName === 'customerName') {
        this.showCustomerSearch = false;
      }
    }
  }

  /* tslint:disable */
  public childOf(c, p) {
    while ((c = c.parentNode) && c !== p) {
    }
    return !!c;
  }

  public toggleSearch(fieldName: string, el: any) {
    if (fieldName === 'voucherNumber') {
      this.showVoucherNoSearch = true;
      this.showCustomerSearch = false;
    } else if (fieldName === 'customerName') {
      this.showVoucherNoSearch = false;
      this.showCustomerSearch = true;
    }

    setTimeout(() => {
      el.focus();
    }, 200);
  }

  public toggleAllItems(type: boolean) {
    this.allItemsSelected = type;
  }

  public toggleItem(item: any, action: boolean) {
    item.isSelected = action;
    if (!action) {
      this.allItemsSelected = false;
    }
    this.itemStateChanged(item);
  }

  public toggleAdvanceSearchPopup() {
    this.showAdvanceSearchModal = !this.showAdvanceSearchModal;
    this.advanceSearch.toggle();
  }

  public itemStateChanged(item: any) {
    let index = this.selectedItems.findIndex(f => f === item.uniqueName);

    if (index > -1) {
      this.selectedItems = this.selectedItems.filter(f => f !== item.uniqueName);
    } else {
      this.selectedItems.push(item.uniqueName);
    }
  }

  public toggleBodyClass() {
    if (this.selectedVoucher) {
      document.querySelector('body').classList.add('fixed');
    } else {
      document.querySelector('body').classList.remove('fixed');
    }
  }

  public onSelectInvoice(invoice: ProformaItem) {
    let obj: InvoicePreviewDetailsVm = new InvoicePreviewDetailsVm();
    obj.voucherDate = this.voucherType === 'proformas' ? invoice.proformaDate : invoice.estimateDate;
    obj.voucherNumber = this.voucherType === 'proformas' ? invoice.proformaNumber : invoice.estimateNumber;
    obj.uniqueName = obj.voucherNumber;
    obj.grandTotal = invoice.grandTotal;
    obj.voucherType = this.voucherType;
    obj.account = {name: invoice.customerName, uniqueName: invoice.customerUniqueName};

    this.selectedVoucher = obj;
  }

  public dateRangeChanged(event: any) {
    this.showResetAdvanceSearchIcon = true;
    if (event) {
      this.advanceSearchFilter.from = moment(event.picker.startDate).format(GIDDH_DATE_FORMAT);
      this.advanceSearchFilter.to = moment(event.picker.endDate).format(GIDDH_DATE_FORMAT);
    }
    this.getAll();
  }

  public sortButtonClicked(type: 'asc' | 'desc', columnName: string) {

    if (this.advanceSearchFilter.sort !== type || this.advanceSearchFilter.sortBy !== columnName) {
      this.advanceSearchFilter.sort = type;
      this.advanceSearchFilter.sortBy = columnName;
      this.getAll();
    }
    // this.sortRequestForUi.sort = type;
    // this.sortRequestForUi.sortBy = columnName;
  }

  public applyAdvanceSearch(request: InvoiceFilterClassForInvoicePreview) {
    this.showResetAdvanceSearchIcon = true;
    // if (!request.invoiceDate && !request.dueDate) {
    //   request.from = this.invoiceSearchRequest.from;
    //   request.to = this.invoiceSearchRequest.to;
    // }
    this.getAll();
  }

  public resetAdvanceSearch() {
    this.showResetAdvanceSearchIcon = false;
    if (this.advanceSearchComponent && this.advanceSearchComponent.allShSelect) {
      this.advanceSearchComponent.allShSelect.forEach(f => {
        f.clear();
      });
    }
    // reset dateRangePicker
    this.datePickerOptions = {...this.datePickerOptions, startDate: moment().subtract(30, 'days'), endDate: moment()};

    this.advanceSearchFilter = new ProformaFilter();
    this.advanceSearchFilter.page = 1;
    this.advanceSearchFilter.count = 10;

    this.getAll();
  }

  public pageChanged(ev: any): void {
    this.advanceSearchFilter.page = ev.page;
    this.getAll();
  }

  public deleteVoucher() {
    let request: ProformaGetRequest = new ProformaGetRequest();
    request.proformaNumber = this.selectedVoucher.voucherNumber;
    request.accountUniqueName = this.selectedVoucher.account.uniqueName;
    this.store.dispatch(this.proformaActions.deleteProforma(request, 'proformas'));
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
