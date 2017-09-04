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
  public allPurchaseInvoices: IInvoicePurchaseResponse[] = [
        {
            account: {
                accountName: 'devansh nogst',
                gstIn: null,
                uniqueName: 'devanshnogst'
            },
            entryUniqueName: 'zz01504521377679',
            gstin: null,
            entryType: false,
            igstAmount: 30002.04,
            cgstAmount: 0,
            sgstAmount: 0,
            taxableValue: 0,
            particulars: 'devansh hsn',
            invoiceNo: '321',
            utgstAmount: 0,
            entryDate: '2017-08-20',
            voucherNo: 5
        },
        {
            account: {
                accountName: 'devansh',
                gstIn: '03EFIAJ111111Z1',
                uniqueName: 'devansh'
            },
            entryUniqueName: 'cfp1504251058218',
            gstin: '03EFIAJ111111Z1',
            entryType: false,
            igstAmount: 3000,
            cgstAmount: 0,
            sgstAmount: 0,
            taxableValue: 0,
            particulars: 'devansh hsn',
            invoiceNo: '3333',
            utgstAmount: 0,
            entryDate: '2017-08-20',
            voucherNo: 2
        },
        {
            account: {
                accountName: 'devansh nogst',
                gstIn: null,
                uniqueName: 'devanshnogst'
            },
            entryUniqueName: '3k01504523098974',
            gstin: null,
            entryType: false,
            igstAmount: 30002.04,
            cgstAmount: 0,
            sgstAmount: 0,
            taxableValue: 0,
            particulars: 'devansh hsn',
            invoiceNo: '1231',
            utgstAmount: 0,
            entryDate: '2017-08-20',
            voucherNo: 6
        },
        {
            account: {
                accountName: 'devansh nogst',
                gstIn: null,
                uniqueName: 'devanshnogst'
            },
            entryUniqueName: 'gr31504520672172',
            gstin: null,
            entryType: false,
            igstAmount: 30002.04,
            cgstAmount: 0,
            sgstAmount: 0,
            taxableValue: 0,
            particulars: 'devansh hsn',
            invoiceNo: '321',
            utgstAmount: 0,
            entryDate: '2017-08-20',
            voucherNo: 3
        },
        {
            account: {
                accountName: 'devansh',
                gstIn: '03EFIAJ111111Z1',
                uniqueName: 'devansh'
            },
            entryUniqueName: '0zq1504250944348',
            gstin: '03EFIAJ111111Z1',
            entryType: false,
            igstAmount: 3000,
            cgstAmount: 0,
            sgstAmount: 0,
            taxableValue: 0,
            particulars: 'devansh hsn',
            invoiceNo: '3333',
            utgstAmount: 0,
            entryDate: '2017-08-20',
            voucherNo: 1
        },
        {
            account: {
                accountName: 'devansh nogst',
                gstIn: null,
                uniqueName: 'devanshnogst'
            },
            entryUniqueName: '4rf1504520750544',
            gstin: null,
            entryType: false,
            igstAmount: 30002.04,
            cgstAmount: 0,
            sgstAmount: 0,
            taxableValue: 0,
            particulars: 'devansh hsn',
            invoiceNo: '321',
            utgstAmount: 0,
            entryDate: '2017-08-20',
            voucherNo: 4
        }
    ];

  public selectedGstrType: string;

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

  public mainInput = {
    start: moment().subtract(12, 'month'),
    end: moment().subtract(6, 'month')
  };

  public singleDate: any;

  public eventLog = '';
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  constructor(
    private router: Router,
    private location: Location,
    private store: Store<AppState>,
    private invoicePurchaseActions: InvoicePurchaseActions
  ) {
    console.log('Hi this is purchase invoice component');
    this.allPurchaseInvoicesBackup = this.allPurchaseInvoices;
  }

  public ngOnInit() {
    this.store.dispatch(this.invoicePurchaseActions.GetPurchaseInvoices());
    this.store.select(p => p.invoicePurchase.purchaseInvoices).takeUntil(this.destroyed$).subscribe((o) => {
      if (o && o.length) {
        this.allPurchaseInvoices = o;
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
  public filterPurchaseInvoice(searchString) {
    this.allPurchaseInvoices = _.cloneDeep(this.allPurchaseInvoicesBackup);
    if (searchString) {
      let allPurchaseInvoices = _.cloneDeep(this.allPurchaseInvoices);
      let patt = new RegExp(searchString);
      allPurchaseInvoices = allPurchaseInvoices.filter((invoice: IInvoicePurchaseResponse) => {
        return (patt.test(invoice.entryUniqueName) || patt.test(invoice.account.accountName) || patt.test(invoice.entryDate) || patt.test(invoice.invoiceNo) || patt.test(invoice.particulars));
      });

      this.allPurchaseInvoices = allPurchaseInvoices;
    } else {
      this.allPurchaseInvoices = _.cloneDeep(this.allPurchaseInvoicesBackup);
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

}
