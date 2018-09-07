import { animate, Component, OnDestroy, OnInit, state, style, transition, trigger } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { BsDropdownConfig } from 'ngx-bootstrap';
import * as  moment from 'moment/moment';
import * as  _ from '../../lodash-optimized';
import { GeneratePurchaseInvoiceRequest, IInvoicePurchaseItem, IInvoicePurchaseResponse, ITaxResponse, PurchaseInvoiceService } from '../../services/purchase-invoice.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { InvoicePurchaseActions } from '../../actions/purchase-invoice/purchase-invoice.action';
import { ToasterService } from '../../services/toaster.service';
import { CompanyResponse } from '../../models/api-models/Company';
import { CompanyActions } from '../../actions/company.actions';
import 'rxjs/add/operator/distinct';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/map';
import { AccountService } from '../../services/account.service';
import { AccountRequestV2, AccountResponseV2, IAccountAddress } from '../../models/api-models/Account';
import { CommonPaginatedRequest } from '../../models/api-models/Invoice';
import { GstReconcileActions } from '../../actions/gst-reconcile/GstReconcile.actions';
import { Observable } from 'rxjs';
import { ReconcileActionState } from '../../store/GstReconcile/GstReconcile.reducer';
import { AlertConfig } from 'ngx-bootstrap/alert';

const otherFiltersOptions = [
  {name: 'GSTIN Empty', uniqueName: 'GSTIN Empty'},
  {name: 'GSTIN Filled', uniqueName: 'GSTIN Filled'},
  {name: 'Invoice Empty', uniqueName: 'Invoice Empty'},
  {name: 'Invoice Filled', uniqueName: 'Invoice Filled'}
];

const gstrOptions = [
  {name: 'GSTR1', uniqueName: 'gstr1-excel-export'},
  {name: 'GSTR2', uniqueName: 'gstr2-excel-export'},
  {name: 'GSTR3B', uniqueName: 'gstr3-excel-export'}
];

const purchaseReportOptions = [
  {name: 'Credit Note', uniqueName: 'Credit Note'},
  {name: 'Debit Note', uniqueName: 'Debit Note'}
];

const fileGstrOptions = [
  {name: 'Download Sheet', uniqueName: 'Download Sheet'},
  {name: 'Use JIOGST API', uniqueName: 'Use JIOGST API'}
];

@Component({
  selector: 'invoice-purchase',
  templateUrl: './purchase.invoice.component.html',
  styleUrls: ['purchase.invoice.component.css'],
  providers: [
    {
      provide: BsDropdownConfig, useValue: {autoClose: true},
    },
    {
      provide: AlertConfig, useValue: {}
    }],
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
  public allPurchaseInvoicesBackup: IInvoicePurchaseResponse;
  public allPurchaseInvoices: IInvoicePurchaseResponse = new IInvoicePurchaseResponse();
  public allTaxes: ITaxResponse[] = [];
  public selectedDateForGSTR1 = {};
  public selectedEntryTypeValue: string = '';
  public moment = moment;
  public selectedGstrType = {name: '', uniqueName: ''};
  public showGSTR1DatePicker: boolean = false;
  public accountAsideMenuState: string = 'out';
  public dropdownHeading: string = 'Select taxes';
  public isSelectedAllTaxes: boolean = false;
  public purchaseInvoiceObject: IInvoicePurchaseItem = new IInvoicePurchaseItem();
  public purchaseInvoiceRequestObject: GeneratePurchaseInvoiceRequest = new GeneratePurchaseInvoiceRequest();

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
  public gstrOptions: any[] = gstrOptions;
  public activeCompanyUniqueName: string;
  public activeCompanyGstNumber: string;
  public companies: CompanyResponse[];
  public isDownloadingFileInProgress: boolean = false;
  public timeCounter: number = 10; // Max number of seconds to wait
  public selectedRowIndex: number = null;
  public isReverseChargeSelected: boolean = false;
  public generateInvoiceArr: IInvoicePurchaseItem[] = [];
  public invoiceSelected: boolean = false;
  public editMode: boolean = false;
  public pageChnageState: boolean = false;
  public userEmail: string = '';
  public selectedServiceForGSTR1: 'JIO_GST' | 'TAX_PRO' | 'RECONCILE';
  public gstAuthenticated$: Observable<boolean>;
  public gstFoundOnGiddh$: Observable<boolean>;
  public gstNotFoundOnGiddhData$: Observable<ReconcileActionState>;
  public gstNotFoundOnPortalData$: Observable<ReconcileActionState>;
  public gstMatchedData$: Observable<ReconcileActionState>;
  public gstPartiallyMatchedData$: Observable<ReconcileActionState>;
  private intervalId: any;
  private undoEntryTypeChange: boolean = false;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private router: Router,
    private location: Location,
    private store: Store<AppState>,
    private invoicePurchaseActions: InvoicePurchaseActions,
    private toasty: ToasterService,
    private companyActions: CompanyActions,
    private purchaseInvoiceService: PurchaseInvoiceService,
    private accountService: AccountService,
    private _reconcileActions: GstReconcileActions
  ) {
    this.purchaseInvoiceObject.TaxList = [];
    this.purchaseInvoiceRequestObject.entryUniqueName = [];
    this.purchaseInvoiceRequestObject.taxes = [];
    this.selectedDateForGSTR1 = moment();
    this.store.select(p => p.session.companyUniqueName).takeUntil(this.destroyed$).subscribe((c) => {
      if (c) {
        this.activeCompanyUniqueName = _.cloneDeep(c);
      }
    });
    this.store.select(p => p.session.companies).take(1).subscribe((c) => {
      if (c.length) {
        let companies = this.companies = _.cloneDeep(c);
        if (this.activeCompanyUniqueName) {
          let activeCompany: any = companies.find((o: CompanyResponse) => o.uniqueName === this.activeCompanyUniqueName);
          if (activeCompany && activeCompany.gstDetails[0]) {
            this.activeCompanyGstNumber = activeCompany.gstDetails[0].gstNumber;
          } else {
            // this.toasty.errorToast('GST number not found.');
          }
        }
      } else {
        this.store.dispatch(this.companyActions.RefreshCompanies());
      }
    });
    this.gstAuthenticated$ = this.store.select(p => p.gstReconcile.gstAuthenticated).takeUntil(this.destroyed$);
    this.gstFoundOnGiddh$ = this.store.select(p => p.gstReconcile.gstFoundOnGiddh).takeUntil(this.destroyed$);
    this.gstNotFoundOnGiddhData$ = this.store.select(p => p.gstReconcile.gstReconcileData.notFoundOnGiddh).takeUntil(this.destroyed$);
    this.gstNotFoundOnPortalData$ = this.store.select(p => p.gstReconcile.gstReconcileData.notFoundOnPortal).takeUntil(this.destroyed$);
    this.gstMatchedData$ = this.store.select(p => p.gstReconcile.gstReconcileData.matched).takeUntil(this.destroyed$);
    this.gstPartiallyMatchedData$ = this.store.select(p => p.gstReconcile.gstReconcileData.partiallyMatched).takeUntil(this.destroyed$);
  }

  public ngOnInit() {

    let paginationRequest: CommonPaginatedRequest = new CommonPaginatedRequest();
    paginationRequest.page = 1;
    this.store.dispatch(this.invoicePurchaseActions.GetPurchaseInvoices(paginationRequest));
    this.store.select(p => p.invoicePurchase).takeUntil(this.destroyed$).subscribe((o) => {
      if (o.purchaseInvoices && o.purchaseInvoices.items) {
        this.allPurchaseInvoices = _.cloneDeep(o.purchaseInvoices);
        this.allPurchaseInvoicesBackup = _.cloneDeep(o.purchaseInvoices);
      }
      this.isDownloadingFileInProgress = o.isDownloadingFile;
      if (o.invoiceGenerateSuccess) {
        this.generateInvoiceArr = [];
        let event = {itemsPerPage: 10, page: this.allPurchaseInvoices.page};
        this.pageChanged(event);
      }
    });
    this.store.dispatch(this.invoicePurchaseActions.GetTaxesForThisCompany());
    this.store.select(p => p.invoicePurchase).takeUntil(this.destroyed$).subscribe((o) => {
      if (o.taxes && o.taxes.length) {
        this.allTaxes = _.cloneDeep(o.taxes);
      }
    });

    this.gstAuthenticated$.subscribe(s => {
      if (!s) {
        this.toggleSettingAsidePane(null, 'RECONCILE');
      } else {
        //  means user logged in gst portal
      }
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
    this.allPurchaseInvoices.items = _.cloneDeep(this.allPurchaseInvoicesBackup.items);

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

        allPurchaseInvoices.items = allPurchaseInvoices.items.filter((invoice: IInvoicePurchaseItem) => {
          return (patt.test(invoice.account.gstIn) || patt.test(invoice.entryUniqueName) || patt.test(invoice.account.name) || patt.test(invoice.entryDate) || patt.test(invoice.invoiceNumber) || patt.test(invoice.particular));
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
    allPurchaseInvoices.items = _.sortBy(allPurchaseInvoices.items, [filedName]);
    this.allPurchaseInvoices = allPurchaseInvoices;
  }

  /**
   * onSelectGstrOption
   */
  public onSelectGstrOption(gstrType) {
    this.selectedGstrType = gstrType;
    if (gstrType.name === 'GSTR2') {
      this.store.dispatch(this._reconcileActions.GstReconcileInvoiceRequest(
        this.moment(this.selectedDateForGSTR1).format('MMYYYY'), 'NOT_ON_PORTAL', '1', '10')
      );
    }
  }

  public monthChanged(selectedDateForGSTR1) {
    if (this.selectedGstrType.name === 'GSTR2') {
      this.store.dispatch(this._reconcileActions.GstReconcileInvoiceRequest(
        this.moment(selectedDateForGSTR1).format('MMYYYY'), 'NOT_ON_PORTAL', '1', '10')
      );
    }
  }

  /**
   * onUpdate
   */
  public onUpdate() {
    if (this.generateInvoiceArr.length === 1) {
      let dataToSave = _.cloneDeep(this.generateInvoiceArr[0]);
      let tax = _.cloneDeep(this.generateInvoiceArr[0].taxes[1]);
      if (!tax) {
        this.toasty.errorToast('Minimum 1 Tax should be selected in Voucher No.' + dataToSave.voucherNo);
        return false;
      }
      dataToSave.taxes[0] = tax;
      dataToSave.taxes.splice(1, 1);
      if (dataToSave.taxes.length > 1) {
        this.toasty.errorToast('Only 1 Tax should be selected in Voucher No.' + dataToSave.voucherNo);
        return false;
      } else if (dataToSave.taxes.length < 1) {
        this.toasty.errorToast('Minimum 1 Tax should be selected in Voucher No.' + dataToSave.voucherNo);
        return false;
      }
      this.store.dispatch(this.invoicePurchaseActions.GeneratePurchaseInvoice(dataToSave));
    } else {
      return;
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
   * onDownloadSheetGSTR
   */
  public onDownloadSheetGSTR(typeOfSheet: string) {
    if (this.selectedDateForGSTR1) {
      let check = moment(this.selectedDateForGSTR1, 'YYYY/MM/DD');
      let monthToSend = check.format('MM') + '-' + check.format('YYYY');
      if (this.activeCompanyGstNumber) {
        if (typeOfSheet === 'gstr1-excel-export' || 'gstr2-excel-export') {
          this.store.dispatch(this.invoicePurchaseActions.DownloadGSTR1Sheet(monthToSend, this.activeCompanyGstNumber, typeOfSheet));
        } else if (typeOfSheet === 'gstr1-error-export' || 'gstr2-error-export') {
          this.store.dispatch(this.invoicePurchaseActions.DownloadGSTR1ErrorSheet(monthToSend, this.activeCompanyGstNumber, typeOfSheet));
        }
      } else {
        this.toasty.errorToast('GST number not found.');
      }
    } else {
      this.toasty.errorToast('Please select month');
    }
  }

  public setCurrentMonth() {
    this.selectedDateForGSTR1 = moment();
  }

  public clearDate() {
    this.selectedDateForGSTR1 = {};
  }

  /**
   * onChangeEntryType
   */
  public onChangeEntryType(indx, value, accUniqName) {
    // console.log(value);
    clearInterval(this.intervalId);
    this.timeCounter = 10;
    if (indx > -1 && (value === 'composite' || value === '')) {
      this.selectedRowIndex = indx;
      this.selectedEntryTypeValue = value;
      this.isReverseChargeSelected = false;

      this.intervalId = setInterval(() => {
        // console.log('running...');
        this.timeCounter--;
        this.checkForCounterValue(this.timeCounter);
      }, 1000);
    } else if (value === 'reverse charge') {
      this.isReverseChargeSelected = true;
      this.selectedRowIndex = indx;
      this.intervalId = setInterval(() => {
        this.timeCounter--;
        this.checkForCounterValue(this.timeCounter);
      }, 1000);
      // this.selectTax({ target: { checked: true } }, selectedTax);
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
  public onUndoEntryTypeChange(idx, itemObj) {
    this.undoEntryTypeChange = true;
    // console.log(idx, itemObj);
    if (this.allPurchaseInvoices.items[idx].invoiceNumber === this.allPurchaseInvoicesBackup.items[idx].invoiceNumber) {
      this.allPurchaseInvoices.items[idx].entryType = _.cloneDeep(this.allPurchaseInvoicesBackup.items[idx].entryType);
      this.selectedRowIndex = idx;
      if (this.allPurchaseInvoices.items[idx].entryType !== 'reverse charge') {
        this.isReverseChargeSelected = false;
      }
    }
  }

  public getDefaultGstAddress(addresses) {
    if (addresses.length > 0) {
      return addresses.findIndex((o) => o.isDefault);
    } else {
      return false;
    }
  }

  /**
   * updateEntryType
   */
  public updateEntryType(indx, value) {
    if (indx > -1 && (value === 'composite' || value === '')) {
      let account: AccountRequestV2 = new AccountRequestV2();
      let defaultGstObj: IAccountAddress = new IAccountAddress();
      let isComposite: boolean;
      if (value === 'composite') {
        isComposite = true;
      } else if (value === '') {
        isComposite = false;
      }
      let data = _.cloneDeep(this.allPurchaseInvoices.items);
      let selectedRow = data[indx];
      let selectedAccName = selectedRow.account.uniqueName;
      this.accountService.GetAccountDetailsV2(selectedAccName).subscribe((accDetails) => {

        let addressesArr = _.cloneDeep(accDetails.body.addresses);
        let defaultAddressIdx: any = this.getDefaultGstAddress(addressesArr);
        let accountData: AccountResponseV2 = _.cloneDeep(accDetails.body);

        defaultGstObj = accountData.addresses[defaultAddressIdx];
        if (_.isNumber(defaultAddressIdx) && isComposite !== defaultGstObj.isComposite) {
          account.name = accountData.name;
          account.uniqueName = accountData.uniqueName;
          account.hsnNumber = accountData.hsnNumber;
          account.country = accountData.country;
          account.sacNumber = accountData.sacNumber;
          account.addresses = accountData.addresses;
          account.addresses[defaultAddressIdx].isComposite = isComposite;
          let parentGroup = accountData.parentGroups[accountData.parentGroups.length - 1];
          let reqObj = {
            groupUniqueName: parentGroup.uniqueName,
            accountUniqueName: account.uniqueName
          };

          this.accountService.UpdateAccountV2(account, reqObj).subscribe((res) => {
            if (res.status === 'success') {
              this.toasty.successToast('Entry type changed successfully.');
            } else {
              this.toasty.errorToast(res.message, res.code);
            }
          });
        } else {
          return;
        }
      });
    }
  }

  /**
   * toggleSettingAsidePane
   */
  public toggleSettingAsidePane(event, selectedService?: 'JIO_GST' | 'TAX_PRO' | 'RECONCILE'): void {
    if (event) {
      event.preventDefault();
    }
    if (selectedService) {
      this.selectedServiceForGSTR1 = selectedService;
    }
    this.accountAsideMenuState = this.accountAsideMenuState === 'out' ? 'in' : 'out';
  }

  /**
   * SelectAllTaxes
   */
  public selectAllTaxes(event) {
    if (event.target.checked) {
      this.purchaseInvoiceObject.isAllTaxSelected = true;
      this.allTaxes.forEach((tax: ITaxResponse) => tax.isSelected = true);
      this.purchaseInvoiceObject.TaxList = _.clone(this.allTaxes);
    } else {
      this.isSelectedAllTaxes = false;
      this.allTaxes.forEach((tax: ITaxResponse) => tax.isSelected = false);
      this.purchaseInvoiceObject.TaxList = _.clone(this.allTaxes);
    }
  }

  /**
   * KeepCountofSelectedOptions
   */
  public makeCount() {
    let count: number = 0;
    let purchaseInvoiceObject = _.cloneDeep(this.purchaseInvoiceObject);
    purchaseInvoiceObject.TaxList.forEach((tax: ITaxResponse) => {
      if (tax.isSelected) {
        count += 1;
      }
    });
    this.purchaseInvoiceObject = _.cloneDeep(purchaseInvoiceObject);
    return count;
  }

  /**
   * selectTaxOption
   */
  public selectTax(event, tax, idx) {
    if (event.target.checked) {
      // console.log(tax);
      this.allPurchaseInvoices.items[idx].taxes[1] = tax.uniqueName;
      // this.allPurchaseInvoices[idx].taxes[0] = tax.uniqueName;
      // console.log(this.allPurchaseInvoices.items[idx]);
    } else {
      event.preventDefault();
      this.toasty.errorToast('Minimun 1 tax should be selected.');
      return;
    }
  }

  /**
   * toggle dropdown heading
   */
  public onDDShown() {
    this.dropdownHeading = 'Selected Taxes';
  }

  /**
   * toggle dropdown heading
   */
  public onDDHidden(uniqueName: string, accountUniqueName: string) {
    let taxUniqueNames: string[] = [];
    this.dropdownHeading = 'Select Taxes';
    let purchaseInvoiceRequestObject = _.cloneDeep(this.purchaseInvoiceRequestObject);
    let purchaseInvoiceObject = _.cloneDeep(this.purchaseInvoiceObject);
    purchaseInvoiceRequestObject.entryUniqueName.push(uniqueName);
    purchaseInvoiceRequestObject.taxes = purchaseInvoiceObject.TaxList;
    for (let tax of purchaseInvoiceRequestObject.taxes) {
      taxUniqueNames.push(tax.uniqueName);
    }
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

  /**
   * generateInvoice
   */
  public generateInvoice(item, event) {
    if (event.target.checked) {
      this.generateInvoiceArr[0] = item; // temporary fix for single invoice generate
      this.invoiceSelected = true;
    } else {
      _.remove(this.generateInvoiceArr, (obj) => obj.entryUniqueName === item.entryUniqueName);
      this.invoiceSelected = false;
    }
    // console.log(this.generateInvoiceArr);
  }

  /**
   * editRow
   */
  public editRow(idx) {
    this.selectedRowIndex = idx;
    this.editMode = true;
    // console.log(idx);
  }

  /**
   * updateEntry
   */
  public updateEntry(invoiceObj) {
    // console.log(invoiceObj);
    let invoice = _.cloneDeep(invoiceObj);
    let dataToSave = {
      accountUniqueName: invoice.account.uniqueName,
      voucherNo: invoice.invoiceNumber,
      ledgerUniqname: invoice.entryUniqueName,
      sendToGstr2: invoice.sendToGstr2,
      availItc: invoice.availItc
    };
    this.store.dispatch(this.invoicePurchaseActions.UpdatePurchaseEntry(dataToSave));
    this.editMode = false;
    this.selectedRowIndex = null;
  }

  public pageChanged(event: any) {
    this.resetStateOnPageChange();
    let paginationRequest = new CommonPaginatedRequest();
    paginationRequest.page = _.cloneDeep(event.page);
    this.store.dispatch(this.invoicePurchaseActions.GetPurchaseInvoices(paginationRequest));
  }

  public reconcilePageChanged(event: any, action: string) {
    this.store.dispatch(this._reconcileActions.GstReconcileInvoiceRequest('', action, event.page));
  }

  /**
   * resetStateOnPageChange
   */
  public resetStateOnPageChange() {
    this.timeCounter = 10;
    clearInterval(this.intervalId);
    this.pageChnageState = true;
    this.generateInvoiceArr = [];
    this.selectedRowIndex = null;
    this.editMode = false;
  }

  /**
   * COMMENTED DUE TO PHASE-2
   * validateGstin
   */
  // public validateGstin(val, idx) {
  //   if (val && val.length === 15) {
  //     let code = val.substr(0, 2);
  //     console.log(code);
  //     let Gststate = this.stateList.filter((obj) => obj.code === code);
  //     if (_.isEmpty(Gststate)) {
  //       this.toasty.errorToast(val + ' Invalid GSTIN Number.');
  //     }
  //     console.log(Gststate);
  //   } else if (val) {
  //     this.toasty.errorToast(val + ' Invalid GSTIN Number.');
  //     console.log(idx);
  //   }
  // }

  /**
   * updateOncheck
   */
  public updateOncheck(invoiceObj, key, value) {
    let invoice = _.cloneDeep(invoiceObj) || {};
    invoice[key] = value;
    console.log(invoice);
    if (invoice.entryUniqueName) {
      this.updateEntry(invoice);
      /* commented for later use
      this.store.dispatch(this.invoicePurchaseActions.UpdateInvoice(invoiceObj));
      */
    }
  }

  public emailSheet(isDownloadDetailSheet: boolean) {
    let check = moment(this.selectedDateForGSTR1, 'YYYY/MM/DD');
    let monthToSend = check.format('MM') + '-' + check.format('YYYY');
    if (!monthToSend) {
      this.toasty.errorToast('Please select a month');
    } else if (!this.activeCompanyGstNumber) {
      this.toasty.errorToast('No GST Number found for selected company');
    } else {
      this.store.dispatch(this.invoicePurchaseActions.SendGSTR3BEmail(monthToSend, this.activeCompanyGstNumber, isDownloadDetailSheet, this.userEmail));
      this.userEmail = '';
    }
  }

  /**
   * fileJioGstReturn
   */
  public fileJioGstReturn(Via: 'JIO_GST' | 'TAX_PRO') {
    let check = moment(this.selectedDateForGSTR1, 'YYYY/MM/DD');
    let monthToSend = check.format('MM') + '-' + check.format('YYYY');
    if (this.activeCompanyGstNumber) {
      this.store.dispatch(this.invoicePurchaseActions.FileJioGstReturn(monthToSend, this.activeCompanyGstNumber, Via));
    } else {
      this.toasty.errorToast('GST number not found.');
    }
  }
}
