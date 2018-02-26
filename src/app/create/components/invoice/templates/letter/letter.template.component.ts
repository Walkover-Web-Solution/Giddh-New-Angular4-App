import { Component, OnInit, EventEmitter, Output, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { VoucherClass } from '../../../../../models/api-models/Sales';
import { FormControl, Form } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CreateHttpService } from '../../../../create-http-service';
import { ModalDirective } from 'ngx-bootstrap';

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
  @ViewChild('invoicePreviewModal') public invoicePreviewModal: ModalDirective;
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
      entries: [
          {
              entryDate: '26-02-2018',
              description: 'bla bla',
              quantity: 12,
              rate: 10,
              discount: 4,
              amount: 120

          }
      ],
      userDetails: {
        countryCode: 'in',
          userName: 'Mr name',
          userEmail: null,
          userMobileNumber: null,
          userCompanyName: 'User company name',
          billingDetails: {
              gstNumber: 236754567898765,
              address: [],
              stateCode: null,
              stateName: null,
              panNumber: null
          },
          shippingDetails: {
              gstNumber: null,
              address: [],
              stateCode: null,
              stateName: null,
              panNumber: null
          }
      },
      companyDetails: {
          name: 'Some name',
          address: null,
          companyGstDetails: {
              gstNumber: null,
              address: [],
              stateCode: null,
              stateName: null,
              panNumber: null
          }
      },
      signature: {
          slogan: null,
          ownerName: 'owner',
          signatureImage: null
      },
      invoiceDetails: {
          invoiceNumber: '12345',
          invoiceDate: '04-12-2017',
          dueDate: null
      },
      other: {
          note1: null,
          note2: null,
          shippingDate: null,
          shippedVia: null,
          customFields: {
              customField1: null,
              customFieldLabel1: null,
              customField2: null,
              customFieldLabel2: null,
              customField3: null,
              customFieldLabel3: null
          },
          trackingNumber: null
      }
  };

    this._createHttpService.Generate(dataToSend).subscribe(response => {
      if (response.status === 'success') {
        this.base64Data = this._sanitizer.bypassSecurityTrustResourceUrl('data:application/pdf;base64,' + response.body);
        this.invoicePreviewModal.show();
      }
    });

  }

  public doDestroy() {
    this.closeAndDestroyComponent.emit(true);
  }

  private initWithDummyData() {
    //
  }
}
