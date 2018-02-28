import { Component, OnInit, EventEmitter, Output, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { VoucherClass, SalesTransactionItemClass, VOUCHER_TYPE_LIST, GenericRequestForGenerateSCD, SalesEntryClass } from '../../../../../models/api-models/Sales';
import { FormControl, Form, NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CreateHttpService } from '../../../../create-http-service';
import { ModalDirective } from 'ngx-bootstrap';
import { ToasterService } from '../../../../../services/toaster.service';
import { EMAIL_REGEX_PATTERN } from '../../../../../shared/helpers/universalValidations';
import * as moment from 'moment';
import { IOption } from '../../../../../theme/ng-virtual-select/sh-options.interface';
import { GIDDH_DATE_FORMAT, GIDDH_DATE_FORMAT_UI } from '../../../../../shared/helpers/defaultDateFormat';
import { BaseResponse } from '../../../../../models/api-models/BaseResponse';
import { contriesWithCodes } from '../../../../../shared/helpers/countryWithCodes';
import { Observable } from 'rxjs/Observable';
import { AppState } from '../../../../../store';
import { Store } from '@ngrx/store';
import { SelectComponent } from '../../../../../theme/ng-select/select.component';

@Component({
  selector: 'letter-template',
  templateUrl: './letter.template.component.html',
  styleUrls: [
    '../template.component.scss',
    './letter.template.component.scss'
  ],
  // encapsulation: ViewEncapsulation.Native
})

export class LetterTemplateComponent implements OnInit, OnDestroy {
  public universalDate: Date;
  @Output() public closeAndDestroyComponent: EventEmitter<any> = new EventEmitter();
  @ViewChild('invoicePreviewModal') public invoicePreviewModal: ModalDirective;

  public invFormData: VoucherClass;
  public isGenDtlCollapsed: boolean = true;
  public isMlngAddrCollapsed: boolean = true;
  public isOthrDtlCollapsed: boolean = true;
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

  public typeaheadNoResultsOfCustomer: boolean = false;
  public pageList: IOption[] = VOUCHER_TYPE_LIST;
  public selectedPage: string = VOUCHER_TYPE_LIST[0].value;
  public updateAccount: boolean = false;
  public dueAmount: number;
  public countrySource: IOption[] = [];
  public giddhDateFormat: string = GIDDH_DATE_FORMAT;
  public giddhDateFormatUI: string = GIDDH_DATE_FORMAT_UI;
  public autoFillShipping: boolean = true;

  // reactive form
  public CreateInvoiceForm: FormGroup;
  public statesSource$: Observable<IOption[]> = Observable.of([]);

  constructor(
    private _sanitizer: DomSanitizer,
    private _createHttpService: CreateHttpService,
    private _toasty: ToasterService,
    private fb: FormBuilder,
    private store: Store<AppState>
  ) {
    console.log(`hello from LetterTemplateComponent`);
    this.invFormData = new VoucherClass();
    this.setCreateInvoiceForm();
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
    // bind countries
    contriesWithCodes.map(c => {
      this.countrySource.push({ value: c.countryflag, label: `${c.countryflag} - ${c.countryName}` });
    });

    // bind state sources
    this.store.select(p => p.general.states).takeUntil(this.destroyed$).subscribe((states) => {
      let arr: IOption[] = [];
        if (states) {
          states.map(d => {
            arr.push({ label: `${d.code} - ${d.name}`, value: d.code });
          });
        }
        this.statesSource$ = Observable.of(arr);
    });
  }

  public ngOnDestroy() {
    //
  }

  public xml2string(node) {
    if (typeof (XMLSerializer) !== 'undefined') {
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

  public _arrayBufferToBase64(buffer) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
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

    // const dataToSend = {
    //   entries: [
    //     {
    //       entryDate: '26-02-2018',
    //       description: 'bla bla',
    //       quantity: 12,
    //       rate: 10,
    //       discount: 4,
    //       amount: 120
    //     }
    //   ],
    //   userDetails: {
    //     countryCode: 'in',
    //     userName: 'Mr name',
    //     userEmail: null,
    //     userMobileNumber: null,
    //     userCompanyName: 'User company name',
    //     billingDetails: {
    //       gstNumber: 236754567898765,
    //       address: [],
    //       stateCode: null,
    //       stateName: null,
    //       panNumber: null
    //     },
    //     shippingDetails: {
    //       gstNumber: null,
    //       address: [],
    //       stateCode: null,
    //       stateName: null,
    //       panNumber: null
    //     }
    //   },
    //   companyDetails: {
    //     name: 'Some name',
    //     address: null,
    //     companyGstDetails: {
    //       gstNumber: null,
    //       address: [],
    //       stateCode: null,
    //       stateName: null,
    //       panNumber: null
    //     }
    //   },
    //   signature: {
    //     slogan: null,
    //     ownerName: 'owner',
    //     signatureImage: null
    //   },
    //   invoiceDetails: {
    //     invoiceNumber: '12345',
    //     invoiceDate: '04-12-2017',
    //     dueDate: null
    //   },
    //   other: {
    //     note1: null,
    //     note2: null,
    //     shippingDate: null,
    //     shippedVia: null,
    //     customFields: {
    //       customField1: null,
    //       customFieldLabel1: null,
    //       customField2: null,
    //       customFieldLabel2: null,
    //       customField3: null,
    //       customFieldLabel3: null
    //     },
    //     trackingNumber: null
    //   }
    // };

    this._createHttpService.Generate(data).subscribe(response => {
      if (response.status === 'success') {
        this.base64Data = this._sanitizer.bypassSecurityTrustResourceUrl('data:application/pdf;base64,' + response.body);
        this.invoicePreviewModal.show();
      }
    });

  }

  public doDestroy() {
    this.closeAndDestroyComponent.emit(true);
  }

  /////// Taken from Sales ////////
  public onSubmitInvoiceForm(f?: NgForm) {
    let data: any = _.cloneDeep(this.CreateInvoiceForm.value);
    console.log('data is :', data.invoiceDetails.dueDate);
    data.invoiceDetails.dueDate = data.invoiceDetails.dueDate ? moment(data.invoiceDetails.dueDate).format(GIDDH_DATE_FORMAT) : '';
    data.invoiceDetails.invoiceDate = data.invoiceDetails.invoiceDate ? moment(data.invoiceDetails.invoiceDate).format(GIDDH_DATE_FORMAT) : '';
    data.other.shippingDate = data.other.shippingDate ? moment(data.other.shippingDate).format(GIDDH_DATE_FORMAT) : '';
    data.entries.forEach((entry) => {
      entry.entryDate = entry.entryDate ? moment(entry.entryDate).format(GIDDH_DATE_FORMAT) : '';
    });
    console.log('data after conversion is :', data);
    this.emitTemplateData(data);
    // let txnErr: boolean;
    // // before submit request making some validation rules
    // // check for account uniquename
    // if (data.accountDetails) {
    //   if (!data.accountDetails.uniqueName) {
    //     if (this.typeaheadNoResultsOfCustomer) {
    //       this._toasty.warningToast('Need to select Bank/Cash A/c or Customer Name');
    //     }else {
    //       this._toasty.warningToast('Customer Name can\'t be empty');
    //     }
    //     return;
    //   }
    //   if (data.accountDetails.email) {
    //     if (!EMAIL_REGEX_PATTERN.test(data.accountDetails.email)) {
    //       this._toasty.warningToast('Invalid Email Address.');
    //       return;
    //     }
    //   }
    // }

    // // replace /n to br in case of message
    // if (data.templateDetails.other.message2 && data.templateDetails.other.message2.length > 0) {
    //   data.templateDetails.other.message2 = data.templateDetails.other.message2.replace(/\n/g, '<br />');
    // }

    // // replace /n to br for (shipping and billing)
    // if (data.accountDetails.shippingDetails.address && data.accountDetails.shippingDetails.address.length && data.accountDetails.shippingDetails.address[0].length > 0) {
    //   data.accountDetails.shippingDetails.address[0] = data.accountDetails.shippingDetails.address[0].replace(/\n/g, '<br />');
    // }
    // if (data.accountDetails.billingDetails.address && data.accountDetails.billingDetails.address.length && data.accountDetails.billingDetails.address[0].length > 0) {
    //   data.accountDetails.billingDetails.address[0] = data.accountDetails.billingDetails.address[0].replace(/\n/g, '<br />');
    // }

    // // convert date object
    // data.voucherDetails.voucherDate = this.convertDateForAPI(data.voucherDetails.voucherDate);
    // data.voucherDetails.dueDate = this.convertDateForAPI(data.voucherDetails.dueDate);
    // data.templateDetails.other.shippingDate = this.convertDateForAPI(data.templateDetails.other.shippingDate);

    // // check for valid entries and transactions
    // if ( data.entries) {
    //   _.forEach(data.entries, (entry) => {
    //     _.forEach(entry.transactions, (txn: SalesTransactionItemClass) => {
    //       // convert date object
    //       txn.date = this.convertDateForAPI(txn.date);
    //       // will get errors of string and if not error then true boolean
    //       let txnResponse = txn.isValid();
    //       if (txnResponse !== true) {
    //         this._toasty.warningToast(txnResponse);
    //         txnErr = true;
    //         return false;
    //       }else {
    //         txnErr = false;
    //       }
    //     });
    //   });
    // } else {
    //   this._toasty.warningToast('At least a single entry needed to generate sales-invoice');
    //   return;
    // }

    // // if txn has errors
    // if (txnErr) {
    //   return false;
    // }

    // // set voucher type
    // data.entries = data.entries.map((entry) => {
    //   entry.voucherType = this.pageList.find(p => p.value === this.selectedPage).label;
    //   return entry;
    // });

    // let obj: GenericRequestForGenerateSCD = {
    //   voucher : data,
    //   updateAccountDetails: this.updateAccount
    // };

    // if (this.dueAmount && this.dueAmount > 0) {
    //   obj.paymentAction = {
    //     action: 'paid',
    //     amount: this.dueAmount
    //   };
    // }

    // // this.salesService.generateGenericItem(obj).takeUntil(this.destroyed$).subscribe((response: BaseResponse<any, GenericRequestForGenerateSCD>) => {
    // //   if (response.status === 'success') {
    // //     // reset form and other
    // //     this.resetInvoiceForm(f);
    // //     if (typeof response.body === 'string') {
    // //       this._toasty.successToast(response.body);
    // //     } else {
    // //       try {
    // //         this._toasty.successToast(`Entry created successfully with Voucher Number: ${response.body.voucherDetails.voucherNumber}`);
    // //       } catch (error) {
    // //         this._toasty.successToast('Voucher Generated Successfully');
    // //       }
    // //     }
    // //   } else {
    // //     this._toasty.errorToast(response.message, response.code);
    // //   }
    // //   this.updateAccount = false;
    // // });
  }

  public convertDateForAPI(val: any): string {
    if (val) {
      try {
        return moment(val).format(GIDDH_DATE_FORMAT);
      } catch (error) {
        return '';
      }
    }else {
      return '';
    }
  }

  public resetInvoiceForm(f: NgForm) {
    f.form.reset();
    this.invFormData = new VoucherClass();
    this.typeaheadNoResultsOfCustomer = false;
    // toggle all collapse
    this.isGenDtlCollapsed = true;
    this.isMlngAddrCollapsed = true;
    this.isOthrDtlCollapsed = true;
  }

  public addBlankRow(txn: SalesTransactionItemClass) {
    // if transaction is valid then add new row else show toasty
    // let txnResponse = txn.isValid();
    // if (txnResponse !== true) {
    //   this._toasty.warningToast(txnResponse);
    //   return;
    // }
    // let entry: SalesEntryClass = new SalesEntryClass();
    // this.invFormData.entries.push(entry);
    // // set default date
    // this.invFormData.entries.forEach((e) => {
    //   e.transactions.forEach((t: SalesTransactionItemClass) => {
    //     t.date = this.universalDate || new Date();
    //   });
    // });
  }

  public autoFillShippingDetails() {
    // auto fill shipping address
    if (this.autoFillShipping) {
      this.invFormData.accountDetails.shippingDetails = _.cloneDeep(this.invFormData.accountDetails.billingDetails);
    }
  }

  public removeTransaction(entryIdx: number) {
    if (this.invFormData.entries.length > 1 ) {
      this.invFormData.entries = _.remove(this.invFormData.entries, (entry, index) => {
        return index !== entryIdx;
      });
    }else {
      this._toasty.warningToast('Unable to delete a single transaction');
    }
  }

  ////////// Reactive form //////////////

  public retunArrayData() {
    return this.fb.group({
      entryDate: '',
      description: '',
      quantity: 1,
      rate: 2,
      discount: 3,
      amount: 4
    });
  }

  public setCreateInvoiceForm() {
    this.CreateInvoiceForm = this.fb.group({
      entries: this.fb.array([ this.retunArrayData() ]),
      userDetails: this.fb.group({
        countryCode: '',
        userName: '',
        userEmail: '',
        userMobileNumber: '',
        userCompanyName: '',
        billingDetails: this.fb.group({
          gstNumber: null,
          address: null,
          stateCode: null,
          stateName: null,
          panNumber: null
        }),
        shippingDetails: this.fb.group({
          autoFillShipping: null,
          gstNumber: null,
          address: [],
          stateCode: null,
          stateName: null,
          panNumber: null
        })
      }),
      companyDetails: this.fb.group({
        name: '',
        address: '',
        companyGstDetails: this.fb.group({
          gstNumber: null,
          address: [],
          stateCode: null,
          stateName: null,
          panNumber: null
        })
      }),
      signature: this.fb.group({
        slogan: null,
        ownerName: '',
        signatureImage: null
      }),
      invoiceDetails: this.fb.group({
        invoiceNumber: null,
        invoiceDate: null,
        dueDate: null
      }),
      other: this.fb.group({
        note1: null,
        note2: null,
        shippingDate: null,
        shippedVia: null,
        trackingNumber: null,
        customFields: this.fb.group({
          customField1: null,
          customFieldLabel1: null,
          customField2: null,
          customFieldLabel2: null,
          customField3: null,
          customFieldLabel3: null
        })
      })
    });
  }

  public getStateCode(type: string, statesEle: SelectComponent) {
    let gstVal = _.cloneDeep(this.invFormData.accountDetails[type].gstNumber);
    if (gstVal.length >= 2) {
      this.statesSource$.take(1).subscribe(st => {
        let s = st.find(item => item.value === gstVal.substr(0, 2));
        if (s) {
          this.invFormData.accountDetails[type].stateCode = s.value;
        } else {
          this.invFormData.accountDetails[type].stateCode = null;
          this._toasty.clearAllToaster();
          this._toasty.warningToast('Invalid GSTIN.');
        }
        statesEle.disabled = true;
      });
    } else {
      statesEle.disabled = false;
      this.invFormData.accountDetails[type].stateCode = null;
    }
  }

  public txnChangeOccurred() {
    //
  }
}
