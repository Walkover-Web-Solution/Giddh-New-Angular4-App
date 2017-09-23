import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { BsDropdownConfig } from 'ngx-bootstrap';
import * as  moment from 'moment';
import * as  _ from 'lodash';
import { IInvoicePurchaseResponse, PurchaseInvoiceService } from '../../services/purchase-invoice.service';

import { PipeTransform, Pipe, OnInit, trigger, state, style, transition, animate, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { InvoicePurchaseActions } from '../../services/actions/purchase-invoice/purchase-invoice.action';
import { ToasterService } from '../../services/toaster.service';
import { ComapnyResponse } from '../../models/api-models/Company';
import { CompanyActions } from '../../services/actions/company.actions';
import { saveAs } from 'file-saver';
import { AccountService } from '../../services/account.service';
import { AccountRequest } from '../../models/api-models/Account';

const otherFiltersOptions = [
  { name: 'GSTIN Empty', uniqueName: 'GSTIN Empty' },
  { name: 'GSTIN Filled', uniqueName: 'GSTIN Filled' },
  { name: 'Invoice Empty', uniqueName: 'Invoice Empty' },
  { name: 'Invoice Filled', uniqueName: 'Invoice Filled' }
];

const gstrOptions = [
  { name: 'GSTR1', uniqueName: 'GSTR1' },
  { name: 'GSTR2', uniqueName: 'GSTR2' }
];

const purchaseReportOptions = [
  { name: 'Credit Note', uniqueName: 'Credit Note' },
  { name: 'Debit Note', uniqueName: 'Debit Note' }
];

const fileGstrOptions = [
  { name: 'Download Sheet', uniqueName: 'Download Sheet' },
  { name: 'Use JIOGST API', uniqueName: 'Use JIOGST API' }
];

@Component({
  selector: 'invoice-purchase',
  templateUrl: './purchase.invoice.component.html',
  styleUrls: ['purchase.invoice.component.css'],
  providers: [{ provide: BsDropdownConfig, useValue: { autoClose: true } }],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        transform: 'translate3d(100%, 0, 0)'
      })),
      transition('in <=> out', animate('400ms ease-in-out')),
      // transition('out => in', animate('400ms ease-in-out'))
    ]),
  ]
})
export class PurchaseInvoiceComponent implements OnInit, OnDestroy {
  public allPurchaseInvoicesBackup: IInvoicePurchaseResponse[];
  public allPurchaseInvoices: IInvoicePurchaseResponse[] = [];
  public selectedDateForGSTR1: string = '';
  public selectedEntryTypeValue: string = '';
  public moment = moment;
  public selectedGstrType: string;
  public showGSTR1DatePicker: boolean = false;
  public accountAsideMenuState: string = 'out';

  public datePickerOptions: any = {
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
      'Last 1 Day': [
        moment().subtract(1, 'days'),
        moment()
      ],
      'Last 7 Days': [
        moment().subtract(6, 'days'),
        moment()
      ],
      'Last 30 Days': [
        moment().subtract(29, 'days'),
        moment()
      ],
      'Last 6 Months': [
        moment().subtract(6, 'months'),
        moment()
      ],
      'Last 1 Year': [
        moment().subtract(12, 'months'),
        moment()
      ]
    }
  };
  public otherFilters: any[] = otherFiltersOptions;
  public gstrOptions: any[] = gstrOptions;
  public purchaseReportOptions: any[] = purchaseReportOptions;
  public fileGstrOptions: any[] = fileGstrOptions;
  public activeCompanyUniqueName: string;
  public activeCompanyGstNumber: string;
  public companies: ComapnyResponse[];
  public isDownloadingFileInProgress: boolean = false;
  public mainInput = {
    start: moment().subtract(12, 'month'),
    end: moment().subtract(6, 'month')
  };
  public singleDate: any;
  public timeCounter: number = 10; // Max number of seconds to wait
  public eventLog = '';
  public selectedRowIndex: number;
  public intervalId: any;
  public undoEntryTypeChange: boolean = false;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(
    private router: Router,
    private location: Location,
    private store: Store<AppState>,
    private invoicePurchaseActions: InvoicePurchaseActions,
    private toasty: ToasterService,
    private companyActions: CompanyActions,
    private purchaseInvoiceService: PurchaseInvoiceService,
    private accountService: AccountService
  ) {
    this.selectedDateForGSTR1 = String(moment());
    // console.log('Hi this is purchase invoice component');
    this.store.select(p => p.session.companyUniqueName).takeUntil(this.destroyed$).subscribe((c) => {
      if (c) {
        this.activeCompanyUniqueName = _.cloneDeep(c);
      }
    });
    this.store.select(p => p.session.companies).takeUntil(this.destroyed$).subscribe((c) => {
      if (c.length) {
        let companies = this.companies = _.cloneDeep(c);
        if (this.activeCompanyUniqueName) {
          let activeCompany: any = companies.find((o: ComapnyResponse) => o.uniqueName === this.activeCompanyUniqueName);
          if (activeCompany && activeCompany.gstDetails[0]) {
            this.activeCompanyGstNumber = activeCompany.gstDetails[0].gstNumber;
          } else {
            this.toasty.errorToast('GST number not found.');
          }
        }
      } else {
        this.store.dispatch(this.companyActions.RefreshCompanies());
      }
    });
  }

  public ngOnInit() {
    this.store.dispatch(this.invoicePurchaseActions.GetPurchaseInvoices());
    this.store.select(p => p.invoicePurchase).takeUntil(this.destroyed$).subscribe((o) => {
      if (o.purchaseInvoices && o.purchaseInvoices.length) {
        this.allPurchaseInvoices = _.cloneDeep(o.purchaseInvoices);
        this.allPurchaseInvoicesBackup = _.cloneDeep(o.purchaseInvoices);
      }
      this.isDownloadingFileInProgress = o.isDownloadingFile;
    });
  }
  public selectedDate(value: any, dateInput: any) {
    // console.log('value is :', value);
    // console.log('dateInput is :', dateInput);
    // dateInput.start = value.start;
    // dateInput.end = value.end;
  }

  /**
   * filterPurchaseInvoice
   */
  public filterPurchaseInvoice(searchString: string) {
    this.allPurchaseInvoices = _.cloneDeep(this.allPurchaseInvoicesBackup);

    if (searchString) {

      let isValidInput: boolean = true;
      let patt: RegExp;
      searchString = searchString.replace(/\\/g, '\\\\');

      try {
        patt = new RegExp(searchString);
      } catch (e) {
        isValidInput = false;
      }

      if (isValidInput) {
        let allPurchaseInvoices = _.cloneDeep(this.allPurchaseInvoices);

        allPurchaseInvoices = allPurchaseInvoices.filter((invoice: IInvoicePurchaseResponse) => {
          return (patt.test(invoice.account.gstIn) || patt.test(invoice.entryUniqueName) || patt.test(invoice.account.accountName) || patt.test(invoice.entryDate) || patt.test(invoice.invoiceNo) || patt.test(invoice.particulars));
        });

        this.allPurchaseInvoices = allPurchaseInvoices;
      }
    }

  }

  /**
   * sortInvoicesBy
   */
  public sortInvoicesBy(filedName: string) {
    let allPurchaseInvoices = _.cloneDeep(this.allPurchaseInvoices);
    allPurchaseInvoices = _.sortBy(allPurchaseInvoices, [filedName]);
    this.allPurchaseInvoices = allPurchaseInvoices;
  }

  /**
   * onSelectGstrOption
   */
  public onSelectGstrOption(gstrType) {
    this.selectedGstrType = gstrType;
  }

  /**
   * onUpdate
   */
  public onUpdate() {
    if (this.selectedRowIndex > -1) {
      let data = _.cloneDeep(this.allPurchaseInvoices);
      let dataToSave = data[this.selectedRowIndex];
      this.store.dispatch(this.invoicePurchaseActions.UpdatePurchaseInvoice(dataToSave));
    }
  }

  /**
   * onSelectRow
   */
  public onSelectRow(indx) {
    this.selectedRowIndex = indx;
  }

  public arrayBufferToBase64(buffer) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  /**
   * onDownloadSheetGSTR1
   */
  public onDownloadSheetGSTR1(typeOfSheet: string) {
    if (this.selectedDateForGSTR1) {
      let check = moment(this.selectedDateForGSTR1, 'YYYY/MM/DD');
      let monthToSend = check.format('MM') + '-' + check.format('YYYY');
      if (this.activeCompanyGstNumber) {
        if (typeOfSheet === 'gstr1') {
          this.store.dispatch(this.invoicePurchaseActions.DownloadGSTR1Sheet(monthToSend, this.activeCompanyGstNumber));
        } else if (typeOfSheet === 'gstr1_error') {
          this.store.dispatch(this.invoicePurchaseActions.DownloadGSTR1ErrorSheet(monthToSend, this.activeCompanyGstNumber));
        }
      } else {
        this.toasty.errorToast('GST number not found.');
      }
    } else {
      this.toasty.errorToast('Please select month');
    }
  }

  public setCurrentMonth() {
    this.selectedDateForGSTR1 = String(moment());
  }

  public clearDate() {
    this.selectedDateForGSTR1 = '';
  }

  /**
   * onChangeEntryType
   */
  public onChangeEntryType(indx, value) {
    clearInterval(this.intervalId);
    this.timeCounter = 10;
    if (indx > -1 && (value === 'composite' || value === '')) {
      this.selectedRowIndex = indx;
      this.selectedEntryTypeValue = value;

      this.intervalId = setInterval(() => {
        // console.log('running...');
        this.timeCounter--;
        this.checkForCounterValue(this.timeCounter);
      }, 1000);
    }
  }

  /**
   * checkForCounterValue
   */
  public checkForCounterValue(counterValue) {
    if (this.intervalId && (counterValue === 0 || this.undoEntryTypeChange) && this.intervalId._state === 'running') {
      clearInterval(this.intervalId);
      this.timeCounter = 10;
      if (!this.undoEntryTypeChange) {
        this.updateEntryType(this.selectedRowIndex, this.selectedEntryTypeValue);
      }
      this.undoEntryTypeChange = false;
    }
  }

  /**
   * onUndoEntryTypeChange
   */
  public onUndoEntryTypeChange() {
    this.undoEntryTypeChange = true;
  }

  /**
   * updateEntryType
   */
  public updateEntryType(indx, value) {
    if (indx > -1 && (value === 'composite' || value === '')) {
      let account: AccountRequest = new AccountRequest();
      let isComposite: boolean;
      if (value === 'composite') {
        isComposite = true;
      } else if (value === '') {
        isComposite = false;
      }
      let data = _.cloneDeep(this.allPurchaseInvoices);
      let selectedRow = data[indx];
      let selectedAccName = selectedRow.account.uniqueName;
      this.accountService.GetAccountDetails(selectedAccName).subscribe((accDetails) => {
        let accountData: any = _.cloneDeep(accDetails.body);
        account.name = accountData.name;
        account.uniqueName = accountData.uniqueName;
        account.hsnNumber = accountData.hsnNumber;
        account.city = accountData.city;
        account.pincode = accountData.pincode;
        account.country = accountData.country;
        account.sacNumber = accountData.sacNumber;
        account.stateCode = accountData.stateCode;
        account.isComposite = isComposite;
        this.accountService.UpdateAccount(account, selectedAccName).subscribe((res) => {
          if (res.status === 'success') {
            this.toasty.successToast('Entry type changed successfully.');
          } else {
            this.toasty.errorToast(res.message, res.code);
          }
        });
      });
    }
  }

  /**
   * toggleSettingAsidePane
   */
  public toggleSettingAsidePane(event): void {
    if (event) {
      event.preventDefault();
    }
    this.accountAsideMenuState = this.accountAsideMenuState === 'out' ? 'in' : 'out';
  }

  /**
   * ngOnDestroy
   */
  public ngOnDestroy() {
    // Call the Update Entry Type API
    // If user change the page and counter is running...
    if (this.intervalId && this.intervalId._state === 'running') {
      this.updateEntryType(this.selectedRowIndex, this.selectedEntryTypeValue);
    }
  }
}
