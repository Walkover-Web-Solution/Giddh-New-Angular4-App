import { Component, OnInit, ViewChild, Input, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CustomTemplateResponse } from '../../../models/api-models/Invoice';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReplaySubject, take, takeUntil } from 'rxjs';
import { InvoiceUiDataService, TemplateContentUISectionVisibility } from '../../../services/invoice.ui.data.service';
import { cloneDeep } from '../../../lodash-optimized';
import { GeneralService } from '../../../services/general.service';
import { CommonService } from '../../../services/common.service';
import { ToasterService } from '../../../services/toaster.service';
import { TemplateDesignUISectionVisibility } from '../../../invoice/templates/edit-template/filters-container/design-filters/design.filters.component';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { IOption } from '../../../theme/ng-select/option.interface';
import { CountryNames } from '../../../shared/Enums/common.enum';
import { InvoiceService } from '../../../services/invoice.service';

@Component({
  selector: 'app-template-edit-filter',
  templateUrl: './template-edit-filter.component.html',
  styleUrls: ['./template-edit-filter.component.scss'],

})
export class TemplateEditFilterComponent implements OnInit {
  @Input() public design: boolean;
  @Input() public mode: string = 'create';
  public customTemplate: CustomTemplateResponse = new CustomTemplateResponse();
  public templateUISectionVisibility: TemplateDesignUISectionVisibility = new TemplateDesignUISectionVisibility();
  public fieldsAndVisibility: any;
  public logoAttached: boolean = false;
  public showLogo: boolean = true;
  public selectedTemplateUniqueName: string = 'gst_template_a';
  public presetFonts = [
    { label: 'Open Sans', value: 'Open Sans' },
    { label: 'Roboto', value: 'Roboto' },
    { label: 'Lato', value: 'Lato' },
    { label: 'Inter', value: 'Inter' }
  ];
  public presetFontsSize = [
    { label: '16px', value: 16 },
    { label: '14px', value: 14 },
    { label: '12px', value: 12 },
    { label: '10px', value: 10 }

  ];
  public formData: FormData;
  public files: any[] = [];
  public dragOver: boolean;
  public imagePreview: any;
  public isFileUploaded: boolean = false;
  public isFileUploadInProgress: boolean = false;
  public sampleTemplates: CustomTemplateResponse[];
  public companyUniqueName: string = '';
  public voucherType: string ='';
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  public showDeleteButton: boolean = false;
  /** fileinput element ref for clear value after remove attachment **/
  @ViewChild('fileInput', { static: false }) public logoFile: ElementRef;
  /** Default image size */
  public defaultImageSize: string = 'S';
  /** Stores the active company name */
  public companyName: string;
  public templateForm: FormGroup;
  @Input() public inputData: any;
  public imageSizes = [
    { label: 'S', value: 'S', px: '60' },
    { label: 'M', value: 'M', px: '80' },
    { label: 'L', value: 'L', px: '100' }
  ];

  // Content Variables
  /** Holds the value if company is Indian */
  public isIndianCompany: boolean = false;
  /* This will hold the value if Gst Composition will show/hide */
  public showGstComposition: boolean = false;
  /** Stores the active company name */
  public activeCompanyName: string;
  public showCompanyName: boolean;
      /** Hold list of suggestion items for Tribute.js */
      public suggestionList: any[] = [];
      public signatureSrc: string = '';
      public signatureImgAttached: boolean = false;
      public isSignatureUploadInProgress: boolean = false;
  constructor(private fb: FormBuilder,
    private generalService: GeneralService,
    private toasty: ToasterService,
    private store: Store<AppState>,
    private invoiceService: InvoiceService,
    private commonService: CommonService,
    private invoiceUiDataService: InvoiceUiDataService) {

  }

  ngOnInit() {
    console.log(this.inputData);
    this.voucherType = this.inputData?.voucherType;
    this.sampleTemplates = this.inputData?.templateList;
    let companyUniqueName = null;
    let companies = null;
    this.store.pipe(select(state => state.session), take(1)).subscribe(session => {
      companyUniqueName = session.companyUniqueName;
      companies = session.companies;
      this.companyUniqueName = session.companyUniqueName;
      this.companyName = session.companies.find((company) => company?.uniqueName === session.companyUniqueName)?.name ?? '';
    });
    this.invoiceUiDataService.initCustomTemplate(companyUniqueName, companies, this.inputData.defaultTemplate);
    this.files = []; // local uploading files array

    this.invoiceUiDataService.customTemplate.pipe(takeUntil(this.destroyed$)).subscribe((template: CustomTemplateResponse) => {
      this.customTemplate = cloneDeep(template);

      let op = {
        header: {},
        table: {},
        footer: {}
      };


      if (this.customTemplate && this.customTemplate.sections) {
        op.header = this.customTemplate.sections.header.data;
        op.table = this.customTemplate.sections.table.data;
        op.footer = this.customTemplate.sections.footer.data;

        this.invoiceUiDataService.setFieldsAndVisibility(op);
        if (this.customTemplate.logoSize) {
          this.defaultImageSize = this.customTemplate.logoSize === '100' ? 'L' :
            this.customTemplate.logoSize === '80' ? 'M' : 'S';
        }
        if (this.customTemplate.logoUniqueName) {
          this.logoAttached = true;
          this.isFileUploaded = false;
          if (!this.invoiceUiDataService.isLogoUpdateInProgress) {
            this.showDeleteButton = true;
            let preview: any = document.getElementById('logoImage');
            preview?.setAttribute('src', ApiUrl + 'company/' + this.companyUniqueName + '/image/' + template.logoUniqueName);
          }
        }
      }
      if (this.customTemplate.templateType === 'tally_template') {
        this.customTemplate.sections.footer.data.imageSignature.display = true;
        this.customTemplate.sections.footer.data.slogan.display = false;
        if (this.voucherType !== 'sales') {
            this.customTemplate.sections['header'].data['invoiceDate'].label = this.customTemplate.sections['header'].data['voucherDate'].label;
            this.customTemplate.sections['header'].data['invoiceNumber'].label = this.customTemplate.sections['header'].data['voucherNumber'].label;
        } else {
            this.customTemplate.sections['header'].data['voucherDate'].label = this.customTemplate.sections['header'].data['invoiceDate'].label;
            this.customTemplate.sections['header'].data['voucherNumber'].label = this.customTemplate.sections['header'].data['invoiceNumber'].label;
        }
    }
    this.assignImageSignature();
      if (this.inputData.mode === 'create') {
        this.initForm();
      } else {
        this.initForm(this.customTemplate);
      }

      this.setFontAndFontSize();

    });

    this.invoiceService.getEmailContentSuggestions('account').pipe(takeUntil(this.destroyed$)).subscribe(response => {
      console.log('response', response);
      if (response?.body) {
          this.suggestionList = response.body?.accountSuggestions?.map(item => ({
              key: item,
              value: item
          }));
      }
  });

  this.invoiceUiDataService.selectedSection.pipe(takeUntil(this.destroyed$)).subscribe((info: TemplateContentUISectionVisibility) => {
      this.templateUISectionVisibility = cloneDeep(info);
  });

  this.invoiceUiDataService.isCompanyNameVisible.pipe(takeUntil(this.destroyed$)).subscribe((yesOrNo: boolean) => {
      this.showCompanyName = cloneDeep(yesOrNo);
  });

  this.invoiceUiDataService.fieldsAndVisibility.pipe(takeUntil(this.destroyed$)).subscribe((obj) => {
      this.fieldsAndVisibility = cloneDeep(obj);
  });

    this.invoiceUiDataService.fieldsAndVisibility.pipe(takeUntil(this.destroyed$)).subscribe((obj) => {
      this.fieldsAndVisibility = cloneDeep(obj);
    });

    this.invoiceUiDataService.logoPath.pipe(takeUntil(this.destroyed$)).subscribe((path: string) => {
      if (!path) {
        this.showDeleteButton = false;
        this.logoAttached = false;
        this.isFileUploaded = false;
        this.defaultImageSize = 'S';
      }
    });

    this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
      if (activeCompany?.countryV2?.countryName) {
        this.showGstComposition = activeCompany.countryV2.countryName === 'India';
      } else {
        this.showGstComposition = false;
      }
      this.activeCompanyName = activeCompany?.name;
      this.isIndianCompany = activeCompany?.countryV2?.countryName === CountryNames.INDIA;
    });
  }

  /**
   * Recursively patches values from a source object into a nested FormGroup.
   * - group: The FormGroup to patch.
   * - values: The object with values to patch (may be deeply nested).
   */
  private patchFormGroup(group: FormGroup, values: any) {
    if (!values) return;
    Object.keys(values).forEach(key => {
      const control = group.get(key);
      if (control instanceof FormGroup && values[key] && typeof values[key] === 'object' && !Array.isArray(values[key])) {
        // Only patch if the value is an object and the control exists
        this.patchFormGroup(control, values[key]);
      } else if (control && values[key] !== undefined) {
        control.patchValue(values[key], { emitEvent: false });
      }
    });
  }

  public initForm(customTemplate?: CustomTemplateResponse): void {
    this.templateForm = this.fb.group({
      createdBy: this.fb.group({
        name: [customTemplate?.createdBy?.name ?? null],
        email: [customTemplate?.createdBy?.email ?? null],
        uniqueName: [customTemplate?.createdBy?.uniqueName ?? null],
        mobileNo: [customTemplate?.createdBy?.mobileNo ?? null]
      }),
      uniqueName: [customTemplate?.uniqueName ?? 'gst_template_a'],
      name: [customTemplate?.name ?? ''],
      fontSize: [customTemplate?.fontSize ?? 14],
      fontMedium: [customTemplate?.fontMedium ?? 12],
      fontDefault: [customTemplate?.fontDefault ?? 14],
      fontSmall: [customTemplate?.fontSmall ?? 10],
      createdAt: [customTemplate?.createdAt ?? null],
      updatedAt: [customTemplate?.updatedAt ?? null],
      updatedBy: this.fb.group({
        name: [customTemplate?.updatedBy?.name ?? null],
        email: [customTemplate?.updatedBy?.email ?? null],
        uniqueName: [customTemplate?.updatedBy?.uniqueName ?? null],
        mobileNo: [customTemplate?.updatedBy?.mobileNo ?? null]
      }),
      templateColor: [customTemplate?.templateColor ?? '#AB1F00'],
      tableColor: [customTemplate?.tableColor ?? '#f2f3f4'],
      font: [customTemplate?.font ?? 'Inter'],
      topMargin: [customTemplate?.topMargin ?? 10],
      leftMargin: [customTemplate?.leftMargin ?? 10],
      rightMargin: [customTemplate?.rightMargin ?? 10],
      bottomMargin: [customTemplate?.bottomMargin ?? 10],
      logoPosition: [customTemplate?.logoPosition ?? 'center/left/right'],
      logoSize: [customTemplate?.logoSize ?? 'small/medium/large'],
      isDefault: [customTemplate?.isDefault ?? false],
      isDefaultForVoucher: [customTemplate?.isDefaultForVoucher ?? false],
      showSectionsInline: [customTemplate?.showSectionsInline ?? false],
      defaultImageSize: [this.defaultImageSize],
      templateType: [customTemplate?.templateType ?? 'gst_template_a'],
      sections: this.fb.group({
        header: this.fb.group({
          data: this.createHeaderDataGroup(customTemplate)
        }),
        table: this.fb.group({
          data: this.createTableDataGroup(customTemplate)
        }),
        footer: this.fb.group({
          data: this.createFooterDataGroup(customTemplate)
        })
      })
    });
  }

  private createHeaderDataGroup(customTemplate?: CustomTemplateResponse): FormGroup {
    const headerData = customTemplate?.sections?.header?.data ?? {};
    return this.fb.group({
      shippingDate: this.fb.group({ label: [headerData.shippingDate?.label ?? 'Ship Date'], display: [headerData.shippingDate?.display ?? true], width: [headerData.shippingDate?.width ?? null] }),
      showEInvoiceDetails: this.fb.group({ label: [headerData.showEInvoiceDetails?.label ?? ''], display: [headerData.showEInvoiceDetails?.display ?? false], width: [headerData.showEInvoiceDetails?.width ?? null] }),
      documentTitle: this.fb.group({ label: [headerData.documentTitle?.label ?? ''], display: [headerData.documentTitle?.display ?? true], width: [headerData.documentTitle?.width ?? null] }),
      customField1: this.fb.group({ label: [headerData.customField1?.label ?? ''], display: [headerData.customField1?.display ?? true], width: [headerData.customField1?.width ?? null] }),
      customField2: this.fb.group({ label: [headerData.customField2?.label ?? ''], display: [headerData.customField2?.display ?? true], width: [headerData.customField2?.width ?? null] }),
      shippedVia: this.fb.group({ label: [headerData.shippedVia?.label ?? 'Ship Via'], display: [headerData.shippedVia?.display ?? true], width: [headerData.shippedVia?.width ?? null] }),
      customField3: this.fb.group({ label: [headerData.customField3?.label ?? ''], display: [headerData.customField3?.display ?? true], width: [headerData.customField3?.width ?? null] }),
      companyName: this.fb.group({ label: [headerData.companyName?.label ?? ''], display: [headerData.companyName?.display ?? true], width: [headerData.companyName?.width ?? null] }),
      displayExchangeRate: this.fb.group({ label: [headerData.displayExchangeRate?.label ?? ''], display: [headerData.displayExchangeRate?.display ?? false], width: [headerData.displayExchangeRate?.width ?? null] }),
      displayLutNumber: this.fb.group({ label: [headerData.displayLutNumber?.label ?? ''], display: [headerData.displayLutNumber?.display ?? false], width: [headerData.displayLutNumber?.width ?? null] }),
      displayPlaceOfSupply: this.fb.group({ label: [headerData.displayPlaceOfSupply?.label ?? ''], display: [headerData.displayPlaceOfSupply?.display ?? false], width: [headerData.displayPlaceOfSupply?.width ?? null] }),
      displayPlaceOfCountry: this.fb.group({ label: [headerData.displayPlaceOfCountry?.label ?? ''], display: [headerData.displayPlaceOfCountry?.display ?? false], width: [headerData.displayPlaceOfCountry?.width ?? null] }),
      dueDate: this.fb.group({ label: [headerData.dueDate?.label ?? 'Due Date'], display: [headerData.dueDate?.display ?? true], width: [headerData.dueDate?.width ?? null] }),
      gstComposition: this.fb.group({ label: [headerData.gstComposition?.label ?? 'Registered under Composition Scheme'], display: [headerData.gstComposition?.display ?? true], width: [headerData.gstComposition?.width ?? null] }),
      gstin: this.fb.group({ label: [headerData.gstin?.label ?? 'GSTIN'], display: [headerData.gstin?.display ?? true], width: [headerData.gstin?.width ?? null] }),
      shippingGstin: this.fb.group({ label: [headerData.shippingGstin?.label ?? 'GSTIN'], display: [headerData.shippingGstin?.display ?? true], width: [headerData.shippingGstin?.width ?? null] }),
      voucherNumber: this.fb.group({ label: [headerData.voucherNumber?.label ?? 'Voucher No.'], display: [headerData.voucherNumber?.display ?? true], width: [headerData.voucherNumber?.width ?? null] }),
      customerEmail: this.fb.group({ label: [headerData.customerEmail?.label ?? ''], display: [headerData.customerEmail?.display ?? true], width: [headerData.customerEmail?.width ?? null] }),
      invoiceNumber: this.fb.group({ label: [headerData.invoiceNumber?.label ?? 'Invoice No.'], display: [headerData.invoiceNumber?.display ?? true], width: [headerData.invoiceNumber?.width ?? null] }),
      showQrCode: this.fb.group({ label: [headerData.showQrCode?.label ?? ''], display: [headerData.showQrCode?.display ?? false], width: [headerData.showQrCode?.width ?? null] }),
      voucherDate: this.fb.group({ label: [headerData.voucherDate?.label ?? 'Voucher Date'], display: [headerData.voucherDate?.display ?? true], width: [headerData.voucherDate?.width ?? null] }),
      customerMobileNumber: this.fb.group({ label: [headerData.customerMobileNumber?.label ?? ''], display: [headerData.customerMobileNumber?.display ?? true], width: [headerData.customerMobileNumber?.width ?? null] }),
      attentionTo: this.fb.group({ label: [headerData.attentionTo?.label ?? 'Attention To'], display: [headerData.attentionTo?.display ?? true], width: [headerData.attentionTo?.width ?? null] }),
      pan: this.fb.group({ label: [headerData.pan?.label ?? 'PAN'], display: [headerData.pan?.display ?? true], width: [headerData.pan?.width ?? null] }),
      trackingNumber: this.fb.group({ label: [headerData.trackingNumber?.label ?? 'Tracking No.'], display: [headerData.trackingNumber?.display ?? true], width: [headerData.trackingNumber?.width ?? null] }),
      formNameInvoice: this.fb.group({ label: [headerData.formNameInvoice?.label ?? 'INVOICE'], display: [headerData.formNameInvoice?.display ?? true], width: [headerData.formNameInvoice?.width ?? null] }),
      billingGstin: this.fb.group({ label: [headerData.billingGstin?.label ?? 'GSTIN'], display: [headerData.billingGstin?.display ?? true], width: [headerData.billingGstin?.width ?? null] }),
      address: this.fb.group({ label: [headerData.address?.label ?? ''], display: [headerData.address?.display ?? true], width: [headerData.address?.width ?? null] }),
      billingState: this.fb.group({ label: [headerData.billingState?.label ?? 'State'], display: [headerData.billingState?.display ?? true], width: [headerData.billingState?.width ?? null] }),
      invoiceDate: this.fb.group({ label: [headerData.invoiceDate?.label ?? 'Invoice Date'], display: [headerData.invoiceDate?.display ?? true], width: [headerData.invoiceDate?.width ?? null] }),
      customerName: this.fb.group({ label: [headerData.customerName?.label ?? ''], display: [headerData.customerName?.display ?? true], width: [headerData.customerName?.width ?? null] }),
      formNameTaxInvoice: this.fb.group({ label: [headerData.formNameTaxInvoice?.label ?? 'TAX INVOICE'], display: [headerData.formNameTaxInvoice?.display ?? true], width: [headerData.formNameTaxInvoice?.width ?? null] }),
      shippingAddress: this.fb.group({ label: [headerData.shippingAddress?.label ?? 'Shipping Address'], display: [headerData.shippingAddress?.display ?? true], width: [headerData.shippingAddress?.width ?? null] }),
      shippingState: this.fb.group({ label: [headerData.shippingState?.label ?? 'State'], display: [headerData.shippingState?.display ?? true], width: [headerData.shippingState?.width ?? null] }),
      billingAddress: this.fb.group({ label: [headerData.billingAddress?.label ?? 'Billing Address'], display: [headerData.billingAddress?.display ?? true], width: [headerData.billingAddress?.width ?? null] }),
      warehouseAddress: this.fb.group({ label: [headerData.warehouseAddress?.label ?? ''], display: [headerData.warehouseAddress?.display ?? true], width: [headerData.warehouseAddress?.width ?? null] }),
      showCompanyAddress: this.fb.group({ label: [headerData.showCompanyAddress?.label ?? ''], display: [headerData.showCompanyAddress?.display ?? true], width: [headerData.showCompanyAddress?.width ?? null] }),
    });
  }

  private createTableDataGroup(customTemplate?: CustomTemplateResponse): FormGroup {
    const tableData = customTemplate?.sections?.table?.data ?? {};
    return this.fb.group({
      date: this.fb.group({ label: [tableData.date?.label ?? 'Date'], display: [tableData.date?.display ?? true], width: [tableData.date?.width ?? '10'] }),
      item: this.fb.group({ label: [tableData.item?.label ?? 'Description'], display: [tableData.item?.display ?? true], width: [tableData.item?.width ?? '10'] }),
      total: this.fb.group({ label: [tableData.total?.label ?? 'Total'], display: [tableData.total?.display ?? true], width: [tableData.total?.width ?? '10'] }),
      quantity: this.fb.group({ label: [tableData.quantity?.label ?? 'Qty.'], display: [tableData.quantity?.display ?? true], width: [tableData.quantity?.width ?? '10'] }),
      sNo: this.fb.group({ label: [tableData.sNo?.label ?? '#'], display: [tableData.sNo?.display ?? true], width: [tableData.sNo?.width ?? '10'] }),
      rate: this.fb.group({ label: [tableData.rate?.label ?? 'Rate/ Item'], display: [tableData.rate?.display ?? true], width: [tableData.rate?.width ?? '10'] }),
      showVariantImage: this.fb.group({ label: [tableData.showVariantImage?.label ?? 'Display Image'], display: [tableData.showVariantImage?.display ?? false], width: [tableData.showVariantImage?.width ?? '15'] }),
      taxableValue: this.fb.group({ label: [tableData.taxableValue?.label ?? 'Taxable Amt.'], display: [tableData.taxableValue?.display ?? true], width: [tableData.taxableValue?.width ?? '10'] }),
      previousDue: this.fb.group({ label: [tableData.previousDue?.label ?? 'Previous Due'], display: [tableData.previousDue?.display ?? false], width: [tableData.previousDue?.width ?? null] }),
      description: this.fb.group({ label: [tableData.description?.label ?? 'Some label'], display: [tableData.description?.display ?? true], width: [tableData.description?.width ?? '10'] }),
      discount: this.fb.group({ label: [tableData.discount?.label ?? 'Dis./ Item'], display: [tableData.discount?.display ?? true], width: [tableData.discount?.width ?? '10'] }),
      taxes: this.fb.group({ label: [tableData.taxes?.label ?? 'Taxes'], display: [tableData.taxes?.display ?? true], width: [tableData.taxes?.width ?? '10'] }),
      displayBaseCurrency: this.fb.group({ label: [tableData.displayBaseCurrency?.label ?? ''], display: [tableData.displayBaseCurrency?.display ?? true], width: [tableData.displayBaseCurrency?.width ?? null] }),
      showDescriptionInRows: this.fb.group({ label: [tableData.showDescriptionInRows?.label ?? ''], display: [tableData.showDescriptionInRows?.display ?? false], width: [tableData.showDescriptionInRows?.width ?? null] }),
      amountBeforeDiscount: this.fb.group({ label: [tableData.amountBeforeDiscount?.label ?? 'Total Before Dis.'], display: [tableData.amountBeforeDiscount?.display ?? true], width: [tableData.amountBeforeDiscount?.width ?? null] }),
      hsnSac: this.fb.group({ label: [tableData.hsnSac?.label ?? 'HSN/SAC'], display: [tableData.hsnSac?.display ?? true], width: [tableData.hsnSac?.width ?? '10'] }),
      otherTaxBifurcation: this.fb.group({ label: [tableData.otherTaxBifurcation?.label ?? 'TCS'], display: [tableData.otherTaxBifurcation?.display ?? true], width: [tableData.otherTaxBifurcation?.width ?? null] }),
      totalQuantity: this.fb.group({ label: [tableData.totalQuantity?.label ?? 'Total Quantity'], display: [tableData.totalQuantity?.display ?? true], width: [tableData.totalQuantity?.width ?? null] }),
    });
  }

  private createFooterDataGroup(customTemplate?: CustomTemplateResponse): FormGroup {
    const footerData = customTemplate?.sections?.footer?.data ?? {};
    return this.fb.group({
      totalTax: this.fb.group({ label: [footerData.totalTax?.label ?? 'Total Tax*'], display: [footerData.totalTax?.display ?? true], width: [footerData.totalTax?.width ?? null] }),
      displayExportMessage: this.fb.group({ label: [footerData.displayExportMessage?.label ?? ''], display: [footerData.displayExportMessage?.display ?? false], width: [footerData.displayExportMessage?.width ?? null] }),
      thanks: this.fb.group({ label: [footerData.thanks?.label ?? 'Thank You for your business.'], display: [footerData.thanks?.display ?? true], width: [footerData.thanks?.width ?? null] }),
      taxableAmount: this.fb.group({ label: [footerData.taxableAmount?.label ?? 'Sub Total'], display: [footerData.taxableAmount?.display ?? true], width: [footerData.taxableAmount?.width ?? null] }),
      otherDeduction: this.fb.group({ label: [footerData.otherDeduction?.label ?? ''], display: [footerData.otherDeduction?.display ?? true], width: [footerData.otherDeduction?.width ?? null] }),
      imageSignature: this.fb.group({ label: [footerData.imageSignature?.label ?? ''], display: [footerData.imageSignature?.display ?? false], width: [footerData.imageSignature?.width ?? null] }),
      grandTotal: this.fb.group({ label: [footerData.grandTotal?.label ?? 'Invoice Total'], display: [footerData.grandTotal?.display ?? true], width: [footerData.grandTotal?.width ?? null] }),
      totalInWords: this.fb.group({ label: [footerData.totalInWords?.label ?? 'Invoice Total (In words)'], display: [footerData.totalInWords?.display ?? true], width: [footerData.totalInWords?.width ?? null] }),
      totalDue: this.fb.group({ label: [footerData.totalDue?.label ?? 'Total Due'], display: [footerData.totalDue?.display ?? true], width: [footerData.totalDue?.width ?? null] }),
      companyAddress: this.fb.group({ label: [footerData.companyAddress?.label ?? ''], display: [footerData.companyAddress?.display ?? true], width: [footerData.companyAddress?.width ?? null] }),
      companyName: this.fb.group({ label: [footerData.companyName?.label ?? ''], display: [footerData.companyName?.display ?? true], width: [footerData.companyName?.width ?? null] }),
      slogan: this.fb.group({ label: [footerData.slogan?.label ?? ''], display: [footerData.slogan?.display ?? true], width: [footerData.slogan?.width ?? null] }),
      textUnderSlogan: this.fb.group({ label: [footerData.textUnderSlogan?.label ?? ''], display: [footerData.textUnderSlogan?.display ?? true], width: [footerData.textUnderSlogan?.width ?? null] }),
      showNotesAtLastPage: this.fb.group({ label: [footerData.showNotesAtLastPage?.label ?? ''], display: [footerData.showNotesAtLastPage?.display ?? false], width: [footerData.showNotesAtLastPage?.width ?? null] }),
      message1: this.fb.group({ label: [footerData.message1?.label ?? ''], display: [footerData.message1?.display ?? true], width: [footerData.message1?.width ?? null] }),
      showMessage2: this.fb.group({ label: [footerData.showMessage2?.label ?? ''], display: [footerData.showMessage2?.display ?? true], width: [footerData.showMessage2?.width ?? null] }),
      tcs: this.fb.group({ label: [footerData.tcs?.label ?? 'TCS'], display: [footerData.tcs?.display ?? true], width: [footerData.tcs?.width ?? null] }),
      tds: this.fb.group({ label: [footerData.tds?.label ?? 'TDS'], display: [footerData.tds?.display ?? true], width: [footerData.tds?.width ?? null] }),
      taxBifurcation: this.fb.group({ label: [footerData.taxBifurcation?.label ?? 'Tax Bifurcation'], display: [footerData.taxBifurcation?.display ?? false], width: [footerData.taxBifurcation?.width ?? null] }),
    });
  }


  /**
   * onDesignChange
   */
  public onDesignChange(fieldName: string, value: string): void {
    let template: CustomTemplateResponse;
    if (fieldName === 'uniqueName') { // change whole template
      const selectedTemplate = cloneDeep(this.sampleTemplates.find((t: CustomTemplateResponse) => (t?.uniqueName === value)));
      template = selectedTemplate ? selectedTemplate : cloneDeep(this.customTemplate);

      if (this.inputData?.mode === 'update' && selectedTemplate) {
        template.uniqueName = cloneDeep(this.customTemplate?.uniqueName);
        template.name = cloneDeep(this.customTemplate.name);
        this.templateForm.get('uniqueName').patchValue(template.uniqueName);
        this.templateForm.get('name').patchValue(template.name);
      }
    } else { // change specific field
      template = cloneDeep(this.customTemplate);
      template[fieldName] = value;
      this.templateForm.get(fieldName).patchValue(value);
    }
    template.copyFrom = cloneDeep(value);
    this.selectedTemplateUniqueName = value;
    template.sections['header'].data['companyName'].label = this.companyName;
    template.sections['footer'].data['companyName'].label = this.companyName;
    this.templateForm.get('copyFrom').patchValue(value);
    const labelControl = this.templateForm.get('sections.header.data.companyName.label');
    const labelControlFooter = this.templateForm.get('sections.footer.data.companyName.label');
    if (labelControl) {
      labelControl.patchValue(this.companyName);
    }
    if (labelControlFooter) {
      labelControlFooter.patchValue(this.companyName);
    }
    this.invoiceUiDataService.setCustomTemplate(cloneDeep(template));
  }

  public onFontSelect(font: IOption) {
    this.onValueChange('font', font?.value);
    this.templateForm.get('font').patchValue(font?.value);
  }

  public onFontSizeSelect(fontSize: IOption) {
    if (!fontSize?.value) {
      let template = cloneDeep(this.customTemplate);
      this.onValueChange('fontSize', template.fontSize);
      this.templateForm.get('fontSize').patchValue(template.fontSize);
    } else {
      this.onValueChange('fontSize', fontSize?.value);
      this.templateForm.get('fontSize').patchValue(fontSize?.value);
    }
  }

  public validatePrintSetting(val: number, idx: number, marginPosition: string): void {
    let paddingCordinatesValue = [200, 200, 200, 200];
    let paddingCordinates = ['Top', 'Left', 'Bottom', 'Right'];
    if (val > paddingCordinatesValue[idx]) {
      let maxVal = paddingCordinatesValue[idx];
      this.customTemplate[marginPosition] = maxVal;
      this.templateForm.get(marginPosition).patchValue(maxVal);
      this.invoiceUiDataService.setCustomTemplate(this.customTemplate);
      this.toasty.errorToast(paddingCordinates[idx] + ' margin cannot be more than ' + paddingCordinatesValue[idx]);
    }
  }

  public resetPrintSetting() {
    let template = cloneDeep(this.customTemplate);
    template.topMargin = 10;
    template.bottomMargin = 10;
    template.leftMargin = 10;
    template.rightMargin = 10;
    this.templateForm.get('topMargin').patchValue(template.topMargin);
    this.templateForm.get('bottomMargin').patchValue(template.bottomMargin);
    this.templateForm.get('leftMargin').patchValue(template.leftMargin);
    this.templateForm.get('rightMargin').patchValue(template.rightMargin);
    this.customTemplate = cloneDeep(template);
    this.setFontAndFontSize();
    this.onValueChange(null, null);
  }



  public setFontAndFontSize() {
    if (this.customTemplate) {
      if (this.customTemplate.font) {
        if (this.customTemplate.templateType === 'tally_template') {
          this.presetFonts = [
            { label: 'Open Sans', value: 'Open Sans' },
            { label: 'Roboto', value: 'Roboto' }
          ];
        } else {
          this.presetFonts = this.presetFonts;
        }

        this.presetFonts.map(font => {
          if (font?.value === this.customTemplate.font) {
            this.templateForm.get('font').patchValue(font.value);
          }
        });
      }

      if (this.customTemplate.fontSize) {
        this.presetFontsSize.map(fontSize => {
          if (fontSize?.value == this.customTemplate.fontSize) {
            this.templateForm.get('fontSize').patchValue(fontSize.label);
          }
        });
      }
    }
  }

  /**
   * Uploads logo
   *
   * @memberof DesignFiltersContainerComponent
   */
  public uploadLogo(): void {
    let file = null;
    let selectedFile: any = null;
    selectedFile = document.getElementById("logo-edit");
    if (selectedFile?.files?.length) {
      file = selectedFile?.files[0];

      this.generalService.getSelectedFile(file, (blob, file) => {
        this.isFileUploadInProgress = true;
        this.invoiceUiDataService.isLogoUpdateInProgress = true;
        this.previewFile(file);

        this.commonService.uploadFile({ file: blob, fileName: file.name }).pipe(takeUntil(this.destroyed$)).subscribe(response => {
          this.isFileUploadInProgress = false;
          if (response?.status === 'success') {
            this.showDeleteButton = true;
            this.onValueChange('logoUniqueName', response.body?.uniqueName);
            this.isFileUploaded = true;
            this.invoiceUiDataService.isLogoUpdateInProgress = false;
            this.toasty.successToast('File uploaded successfully.');
          } else {
            this.toasty.showSnackBar("error", response.message);
          }
        });
      });
    }
  }

  public previewFile(file: any) {
    let preview: any = document.getElementById('logoImage');
    let reader = new FileReader();

    reader.onloadend = () => {
      preview.src = reader.result;
      this.invoiceUiDataService.setLogoPath(preview.src);
    };

    if (file) {
      reader.readAsDataURL(file);
      this.logoAttached = true;
    } else {
      preview.src = '';
      this.logoAttached = false;
      this.invoiceUiDataService.setLogoPath('');
    }
  }

  /**
     * onValueChange
     */
  public onValueChange(fieldName: string, value: string): void {
    let template = cloneDeep(this.customTemplate);
    if (fieldName) {
      template[fieldName] = value;
      this.templateForm.get(fieldName).patchValue(value);
    }
    this.invoiceUiDataService.setCustomTemplate(template);
  }

  public toogleLogoVisibility(show?: boolean): void {
    if (!this.isFileUploaded) {
      this.showLogo = show ? show : !this.showLogo;
      this.invoiceUiDataService.setLogoVisibility(this.showLogo);
    }
  }

  public deleteLogo(): void {
    this.onValueChange('logoUniqueName', null);
    this.invoiceUiDataService.setLogoPath('');
    this.files = []; // local uploading files array
    this.logoAttached = false;
    this.isFileUploaded = false;
    this.isFileUploadInProgress = false;
    this.showDeleteButton = false;
    if (this.logoFile && this.logoFile.nativeElement) {
      this.logoFile.nativeElement.value = "";
    }
  }

  public changeColor(primaryColor: string, secondaryColor: string): void {
    let template = cloneDeep(this.customTemplate);
    template.templateColor = primaryColor;
    template.tableColor = secondaryColor;
    this.templateForm.get('templateColor').patchValue(primaryColor);
    this.templateForm.get('tableColor').patchValue(secondaryColor);
    this.invoiceUiDataService.setCustomTemplate(template);
  }

  /**
  * This will be use for on change field visibility
  *
  * @param {string} fieldName
  * @param {string} value
  * @memberof DesignFiltersContainerComponent
  */
  public onChangeFieldVisibility(fieldName: string, value: string): void {
    let template = cloneDeep(this.customTemplate);
    if (fieldName) {
      template[fieldName] = value;
      this.templateForm.get(fieldName).patchValue(value);
    }
    this.invoiceUiDataService.setCustomTemplate(template);
  }

      /**
     * Assigns image signature for CREATE and UPDATE flow
     *
     * @memberof ContentFilterComponent
     */
      public assignImageSignature(): void {
        if (this.customTemplate?.sections?.footer?.data?.imageSignature?.label) {
            this.signatureSrc = ApiUrl + 'company/' + this.companyUniqueName + '/image/' + this.customTemplate.sections.footer.data.imageSignature.label;
            this.signatureImgAttached = true;
        } else {
            this.signatureSrc = '';
            this.signatureImgAttached = false;
        }
    }


}
