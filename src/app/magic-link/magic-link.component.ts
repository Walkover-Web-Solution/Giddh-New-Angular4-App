import { from } from 'rxjs/observable/from';
import { BaseResponse } from './../models/api-models/BaseResponse';
import { IMagicLinkLedgerResponse, IMagicLinkLedgerRequest } from './../models/api-models/MagicLink';
import { MagicLinkService } from './../services/magic-link.service';
import { Component, OnInit, ViewEncapsulation, Inject, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';
import * as _ from 'lodash';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { ToasterService } from 'app/services/toaster.service';
import { DOCUMENT } from '@angular/platform-browser';
import { ReplaySubject } from 'rxjs';
import { WindowRef } from 'app/shared/helpers/window.object';

@Component({
  selector: 'magic',
  templateUrl: './magic-link.component.html',
  styleUrls: ['./magic-link.component.css']
})
export class MagicLinkComponent implements OnInit {

  public ledgerData: IMagicLinkLedgerResponse = new IMagicLinkLedgerResponse();
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
    },
    startDate: moment().subtract(30, 'days'),
    endDate: moment()
  };

  public searchText: string = '';
  public selectedTab: string = '';
  public isResponsive:boolean = false;
  public reckoningDebitTotal;
  public reckoningCreditTotal;
  private id: string;
  private fromDate: string;
  private toDate: string;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private route: ActivatedRoute, private _magicLinkService: MagicLinkService, private _toaster: ToasterService, @Inject(DOCUMENT) private document: Document, private winRef: WindowRef) {
    this.ledgerData.account = { name: '', uniqueName: '' };
    this.ledgerData.ledgerTransactions = {
      forwardedBalance: { amount: 0, type: '', description: '' },
      creditTotal: 0,
      debitTotal: 0,
      balance: { amount: 0, type: '' },
      ledgers: [],
      totalTransactions: 0,
      totalCreditTransactions: 0,
      totalDebitTransactions: 0
    };
  }

  public ngOnInit() {
    this.route.queryParams
      .filter(params => params.id)
      .subscribe(params => {
        if (params && params.id) {
          this.id = params.id;
          let DataToSend = {
            data: {
              id: params.id
            }
          };
          this._magicLinkService.GetMagicLinkData(DataToSend).subscribe((response: BaseResponse<IMagicLinkLedgerResponse, IMagicLinkLedgerRequest>) => {
            if (response.status === 'success') {
              this.ledgerData = _.cloneDeep(response.body);
              this.ledgerData.ledgerTransactions.ledgers = this.filterLedgers(response.body.ledgerTransactions.ledgers);
              this.calReckoningTotal();
            }
          });
        }
      });
      // this.document.body.classList.add('magicPage');
      this.document.body.classList.remove('unresponsive');
      this.onWindowResize();
  }

  public filterLedgers(ledgerTransactions) {
    return _.each(ledgerTransactions, (lgr) => {
      lgr.hasDebit = false;
      lgr.hasCredit = false;
      if (lgr.transactions.length > 0) {
        return _.each(lgr.transactions, (txn) => {
          if (txn.type === 'DEBIT') {
            return lgr.hasDebit = true;
          } else if (txn.type === 'CREDIT') {
            return lgr.hasCredit = true;
          }
        });
      }
    });
  }

  /**
   * onDateRangeSelected
   */
  public onDateRangeSelected(value) {
    this.fromDate = moment(value.picker.startDate).format('DD-MM-YYYY');
    this.toDate = moment(value.picker.endDate).format('DD-MM-YYYY');
    let DataToSend = {
      data: {
        id: this.id,
        from: this.fromDate,
        to: this.toDate
      }
    };
    this._magicLinkService.GetMagicLinkData(DataToSend).subscribe((response: BaseResponse<IMagicLinkLedgerResponse, IMagicLinkLedgerRequest>) => {
      if (response.status === 'success') {
        this.ledgerData = _.cloneDeep(response.body);
        this.ledgerData.ledgerTransactions.ledgers = this.filterLedgers(response.body.ledgerTransactions.ledgers);
        this.calReckoningTotal();
      }
    });
  }

  public checkCompEntry(ledger) {
    let unq = ledger.uniqueName;
    ledger.isCompoundEntry = true
    _.each(this.ledgerData.ledgerTransactions.ledgers, (lgr) => {
      if (unq == lgr.uniqueName) {
        lgr.isCompoundEntry = true
      } else {
          lgr.isCompoundEntry = false
      }
    });
  }
  

  public downloadInvoice(invoiceNumber) {
    this._magicLinkService.DownloadInvoice(this.id, invoiceNumber).subscribe((response: BaseResponse<any, any>) => {
      if (response.status === 'success') {
        let blobData;
        blobData = this.base64ToBlob(response.body, 'application/pdf', 512);
        return saveAs(blobData, invoiceNumber + '.pdf');
      }
    });
  }
  
  public base64ToBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    let offset = 0;
    while (offset < byteCharacters.length) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);
      let byteNumbers = new Array(slice.length);
      let i = 0;
      while (i < slice.length) {
        byteNumbers[i] = slice.charCodeAt(i);
        i++;
      }
      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
      offset += sliceSize;
    }
    return new Blob(byteArrays, { type: contentType });
  }
  
  /**
   * downloadPurchaseInvoice
   */
  public downloadPurchaseInvoice(invoiceNumber) {
    this._toaster.errorToast("Invoice for "+invoiceNumber+ " cannot be downloaded now.");
  }

  // check if responsive mode ON
  @HostListener('window:resize')
  public onWindowResize() {
   let width = this.winRef.nativeWindow.innerWidth;
   if (width > 992) {
     this.selectedTab = '';
     this.isResponsive = false;
   } else {
     this.isResponsive = true;
   }
  }


  /**
   * calReckoningTotal
   */
  public calReckoningTotal() {
    this.reckoningDebitTotal = this.ledgerData.ledgerTransactions.debitTotal;
    this.reckoningCreditTotal = this.ledgerData.ledgerTransactions.creditTotal;
    if (this.ledgerData.ledgerTransactions.balance.type == 'CREDIT') {
      this.reckoningDebitTotal += this.ledgerData.ledgerTransactions.balance.amount;
      this.reckoningCreditTotal += this.ledgerData.ledgerTransactions.forwardedBalance.amount;
    } else if (this.ledgerData.ledgerTransactions.balance.type == 'DEBIT'){
      this.reckoningCreditTotal += this.ledgerData.ledgerTransactions.balance.amount;
      this.reckoningDebitTotal += this.ledgerData.ledgerTransactions.forwardedBalance.amount;
    }
  }
  
  public ngOnDestroy(): void {
    this.document.body.classList.add('unresponsive');    
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
