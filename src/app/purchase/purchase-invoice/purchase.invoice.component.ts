import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { BsDropdownConfig } from 'ngx-bootstrap';
import * as  moment from 'moment';
import * as  _ from 'lodash';
import { IInvoicePurchaseResponse } from '../../services/purchase-invoice.service';

import { PipeTransform, Pipe, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { InvoicePurchaseActions } from '../../services/actions/purchase-invoice/purchase-invoice.action';
import { ToasterService } from '../../services/toaster.service';
import { ComapnyResponse } from '../../models/api-models/Company';
import { CompanyActions } from '../../services/actions/company.actions';
@Pipe({ name: 'highlight' })
export class HighlightPipe implements PipeTransform {
  public transform(text: string, search): string {
    let pattern = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    pattern = pattern.split(' ').filter((t) => {
      return t.length > 0;
    }).join('|');
    let regex = new RegExp(pattern, 'gi');

    return search ? text.replace(regex, (match) => `<span class="highlight">${match}</span>`) : text;
  }
}

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
  providers: [{ provide: BsDropdownConfig, useValue: { autoClose: true } }, HighlightPipe]
})
export class PurchaseInvoiceComponent implements OnInit {
  public allPurchaseInvoicesBackup: IInvoicePurchaseResponse[];
  public allPurchaseInvoices: IInvoicePurchaseResponse[] = [];
  public selectedDateForGSTR1: string = '';
  public moment = moment;
  public selectedGstrType: string;
  public showGSTR1DatePicker: boolean = false;

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
  public mainInput = {
    start: moment().subtract(12, 'month'),
    end: moment().subtract(6, 'month')
  };

  public singleDate: any;

  public eventLog = '';
  private selectedRowIndex: number;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(
    private router: Router,
    private location: Location,
    private store: Store<AppState>,
    private invoicePurchaseActions: InvoicePurchaseActions,
    private toasty: ToasterService,
    private companyActions: CompanyActions
  ) {
    console.log('Hi this is purchase invoice component');
    this.store.select(p => p.session.companyUniqueName).takeUntil(this.destroyed$).subscribe((c) => {
      if (c) {
         this.activeCompanyUniqueName = _.cloneDeep(c);
      }
    });
    // this.store.select(p => p.company.companies).takeUntil(this.destroyed$).subscribe((c) => {
    //   if (c.length) {
    //     let companies = this.companies = _.cloneDeep(c);
    //     if (this.activeCompanyUniqueName) {
    //       let activeCompany = companies.find((o: ComapnyResponse) => o.uniqueName === this.activeCompanyUniqueName);
    //       if (activeCompany) {
    //         this.activeCompanyGstNumber = activeCompany.gstDetails;
    //       }
    //     }
    //   } else {
    //     this.store.dispatch(this.companyActions.RefreshCompanies());
    //   }
    // });
  }

  public ngOnInit() {
    this.store.dispatch(this.invoicePurchaseActions.GetPurchaseInvoices());
    this.store.select(p => p.invoicePurchase.purchaseInvoices).takeUntil(this.destroyed$).subscribe((o) => {
      if (o && o.length) {
        this.allPurchaseInvoices = _.cloneDeep(o);
        this.allPurchaseInvoicesBackup = _.cloneDeep(o);
      }
    });
  }
  public selectedDate(value: any, dateInput: any) {
    console.log('value is :', value);
    console.log('dateInput is :', dateInput);
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

  /**
   * onDownloadSheetGSTR1
   */
  public onDownloadSheetGSTR1() {
    if (this.selectedDateForGSTR1) {
      let check = moment(this.selectedDateForGSTR1, 'YYYY/MM/DD');
      let monthToSend = check.format('MM') + '-' + check.format('YYYY');

    } else {
      this.toasty.errorToast('Please select month');
    }
  }

  public setCurrentMonth() {
    this.selectedDateForGSTR1 = String(new Date());
  }

  public clearDate() {
    this.selectedDateForGSTR1 = '';
  }
}
