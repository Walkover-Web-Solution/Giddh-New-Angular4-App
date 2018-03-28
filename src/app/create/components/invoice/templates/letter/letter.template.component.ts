import { Component, OnInit, EventEmitter, Output, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { VoucherClass, SalesTransactionItemClass, VOUCHER_TYPE_LIST, GenericRequestForGenerateSCD, SalesEntryClass } from '../../../../../models/api-models/Sales';
import { FormControl, Form, NgForm, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
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
  public isFormSubmitted: boolean = false;

  constructor(
    private _sanitizer: DomSanitizer,
    private _createHttpService: CreateHttpService,
    private _toasty: ToasterService,
    private fb: FormBuilder,
    private store: Store<AppState>
  ) {
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

  public emitTemplateData(data: any) {
    this.isFormSubmitted = true;
    this.isGenDtlCollapsed = false;
    this.isMlngAddrCollapsed = false;
    this.isOthrDtlCollapsed = false;

    if (this.CreateInvoiceForm.valid) {
      this._createHttpService.Generate(data).subscribe(response => {
        if (response.status === 'success') {
          this.base64Data = this._sanitizer.bypassSecurityTrustResourceUrl('data:application/pdf;base64,' + response.body);
          this.invoicePreviewModal.show();
        } else if (response.status === 'error') {
          this._toasty.errorToast(response.message, response.code);
        }
      });
    } else {
      this._toasty.errorToast('Please fill are red marked fields.', 'Validation check');
    }
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
    data.userDetails.billingDetails.address = data.userDetails.billingDetails.address ? [data.userDetails.billingDetails.address] : null;
    data.userDetails.shippingDetails.address = data.userDetails.shippingDetails.address ? [data.userDetails.shippingDetails.address] : null;

    data.companyDetails.address = data.companyDetails.address ? [data.companyDetails.address] : null;
    data.companyDetails.companyGstDetails.address = data.companyDetails.companyGstDetails.address ? [data.companyDetails.companyGstDetails.address] : null;

    console.log('data after conversion is :', data);
    this.emitTemplateData(data);
  }

  public convertDateForAPI(val: any): string {
    if (val) {
      try {
        return moment(val).format(GIDDH_DATE_FORMAT);
      } catch (error) {
        return '';
      }
    } else {
      return '';
    }
  }

  public resetInvoiceForm(f: NgForm) {
    f.form.reset();
    this.invFormData = new VoucherClass();
    // toggle all collapse
    this.isGenDtlCollapsed = true;
    this.isMlngAddrCollapsed = true;
    this.isOthrDtlCollapsed = true;
  }

  public addBlankRow() {
    const transactionEntries = this.CreateInvoiceForm.controls['entries'] as FormArray;
    transactionEntries.push(this.retunArrayData());
  }

  public autoFillShippingDetails() {
    // auto fill shipping address
    if (this.autoFillShipping) {
      this.invFormData.accountDetails.shippingDetails = _.cloneDeep(this.invFormData.accountDetails.billingDetails);
    }
  }

  public removeTransaction(entryIdx: number) {
    const transactionEntries = this.CreateInvoiceForm.controls['entries'] as FormArray;
    if (transactionEntries.length > 1 ) {
      transactionEntries.removeAt(entryIdx);
    } else {
      this._toasty.warningToast('Unable to delete a single transaction');
    }
  }

  ////////// Reactive form //////////////

  public retunArrayData() {
    return this.fb.group({
      entryDate: '',
      description: '',
      quantity: 0,
      rate: 0,
      discount: 0,
      amount: 0
    });
  }

  public setCreateInvoiceForm() {
    this.CreateInvoiceForm = this.fb.group({
      entries: this.fb.array([ this.retunArrayData() ]),
      userDetails: this.fb.group({
        countryCode: ['', Validators.required],
        userName: ['', Validators.required],
        userEmail: '',
        userMobileNumber: '',
        userCompanyName: ['', Validators.required],
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
          address: null,
          stateCode: null,
          stateName: null,
          panNumber: null
        })
      }),
      companyDetails: this.fb.group({
        name: ['', Validators.required],
        address: null,
        companyGstDetails: this.fb.group({
          gstNumber: null,
          address: null,
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
        invoiceNumber: ['', Validators.required],
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
