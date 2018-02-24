import { Component, OnInit, EventEmitter, Output, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { VoucherClass } from '../../../../../models/api-models/Sales';
import { FormControl, Form } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CreateHttpService } from '../../../../create-http-service';

@Component({
  selector: 'letter-template',
  templateUrl: './letter.template.component.html',
  styleUrls: [
    '../template.component.scss',
    './letter.template.component.scss'
  ],
  encapsulation: ViewEncapsulation.Native
})

export class LetterTemplateComponent implements OnInit, OnDestroy  {
  @Output() public closeAndDestroyComponent: EventEmitter<any> = new EventEmitter();
  public selectedFiles: any;
  public logoPath: any;
  public data: VoucherClass;
  public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  public name: string = 'August 09, 2017';
  public name1: string = 'GSTIN: 11AAAAAA000A1Z0';
  public name2: string = 'PAN: AAACW9768L';
  public base64Data: SafeResourceUrl = '';
  public planHtml: any;
  public css = `  <style>
  .logo-wrap {
    width: 120px;
  }
  figure {
      height: 50px;
      overflow: hidden;
    }
</style>`;

  constructor(private _sanitizer: DomSanitizer, private _createHttpService: CreateHttpService) {
    console.log (`hello from LetterTemplateComponent`);
  }

  public readUrl(event: any) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (item: any) => {
        this.logoPath = item.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  public clearUploadedImg() {
    this.logoPath = null;
  }

  public ngOnInit() {
    this.data = new VoucherClass();
    this.initWithDummyData();
    console.log (this.data);
  }

  public ngOnDestroy() {
    //
  }

  public xml2string(node) {
    if (typeof(XMLSerializer) !== 'undefined') {
       let serializer = new XMLSerializer();
       return serializer.serializeToString(node);
    } else if (node.xml || 1 === 1) {
       return node.xml;
    }
 }

  public stringToUtf16ByteArray(str) {
      let bytes = [];
    for (let i = 0; i < str.length; ++i) {
        let charCode = str.charCodeAt(i);
        // tslint:disable-next-line:no-bitwise
        bytes.push((charCode & 0xFF00) >>> 8);
        // tslint:disable-next-line:no-bitwise
        bytes.push(charCode & 0xFF);
    }
      return bytes;
  }

  public _arrayBufferToBase64( buffer ) {
    let binary = '';
    let bytes = new Uint8Array( buffer );
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
  }

  public emitTemplateData(data: any) {
    // data.append(this.css);
    // const styles = document.getElementById('sometemplate');
    // const dataHTML = data;
    // const a = this.xml2string(dataHTML);
    // let htmlStr = _.cloneDeep(a.replace('&lt;', '<').replace('&gt;', '>').replace('&lt;', '<').replace('&gt;', '>'));
    // const stringToUtf16ByteArray = this.stringToUtf16ByteArray(htmlStr);
    // const _arrayBufferToBase64 = this._arrayBufferToBase64(stringToUtf16ByteArray);
    // this.base64Data = this._sanitizer.bypassSecurityTrustResourceUrl('data:application/pdf;base64,' + _arrayBufferToBase64);

    const dataToSend = {
      invoice: {
        uniqueName: null,
        logo: '',
        company: {
          name: 'New SN Corp',
          gstNumber: '238789789789798',
          address: ['4545'],
          stateCode: '23',
          panNumber: 'ARLPA0061H'
        },
        customerName: 'Cash',
        account: {
          name: 'Cash',
          uniqueName: 'cash',
          address: [],
          attentionTo: '',
          email: null,
          mobileNumber: null,
          billingDetails: {
            gstNumber: null,
            address: ['THis is billing addressss.'],
            stateCode: '',
            stateName: '',
            panNumber: null,
            addressStr: 'THis is billing addressss.'
          },
          shippingDetails: {
            gstNumber: null,
            address: [],
            stateCode: '',
            stateName: '',
            panNumber: null,
            addressStr: null
          }
        },
        templateUniqueName: 'aiuvpbjc0noozg8d0ax3',
        roundOff: {
          transaction: {
            accountUniqueName: 'roundoff',
            amount: 0.5,
            accountName: 'Round Off',
            description: 'Round Off'
          },
          uniqueName: '############',
          isTransaction: true,
          balanceType: 'CREDIT'
        },
        balanceStatus: 'EMPTY',
        balanceStatusSealPath: '',
        commonDiscounts: [],
        entries: [{
          uniqueName: '6fl1515494854597',
          discounts: [],
          taxes: [{
            rate: 2.5,
            accountName: 'CGST',
            accountUniqueName: 'cgst',
            amount: 1.25,
            type: 'DEBIT'
          }, {
            rate: 2.5,
            accountName: 'SGST',
            accountUniqueName: 'sgst',
            amount: 1.25,
            type: 'DEBIT'
          }],
          transactions: [{
            accountName: 'Sales536',
            accountUniqueName: 'sales',
            type: 'DEBIT',
            amount: 50,
            hsnNumber: null,
            sacNumber: null,
            description: '',
            quantity: null,
            stockUnit: '',
            category: 'income',
            taxableValue: 50,
            date: null,
            isStockTxn: null,
            stockDetails: {
              name: null,
              uniqueName: null
            },
            rate: null
          }],
          description: '',
          taxableValue: 50,
          discountTotal: 0,
          nonTaxableValue: 0,
          entryDate: '09-01-2018',
          taxList: [],
          voucherType: null,
          entryTotal: 52.5
        }],
        totalTaxableValue: 50,
        grandTotal: 52,
        totalInWords: null,
        subTotal: 50,
        totalDiscount: 0,
        totalTax: 2.5,
        invoiceDetails: {
          invoiceNumber: '##########',
          invoiceDate: '09-01-2018',
          dueDate: '28-11-2018'
        },
        other: {
          message1: 'Facebook',
          message2: null,
          shippingDate: '',
          shippedVia: null,
          trackingNumber: null,
          customField1: null,
          customField2: null,
          customField3: null,
          slogan: 'New SN Corp'
        },
        // tslint:disable-next-line:max-line-length
        // dataPreview: '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',
        gstTaxesTotal: [{
          total: 1.25,
          uniqueName: 'cgst',
          name: 'CGST'
        }, {
          total: 1.25,
          uniqueName: 'sgst',
          name: 'SGST'
        }]
      },
      uniqueNames: ['6fl1515494854597'],
      validateTax: true,
      updateAccountDetails: false
    };

    this._createHttpService.Generate(dataToSend).subscribe(response => {
      console.log('the response is :', response);
    });

  }

  public doDestroy() {
    this.closeAndDestroyComponent.emit(true);
  }

  private initWithDummyData() {
    //
  }
}
