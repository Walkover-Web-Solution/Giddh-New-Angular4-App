import { Component, OnInit, ViewChild, Input, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CustomTemplateResponse } from '../../../models/api-models/Invoice';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReplaySubject, take, takeUntil } from 'rxjs';
import { InvoiceUiDataService } from '../../../services/invoice.ui.data.service';
import { cloneDeep } from '../../../lodash-optimized';
import { GeneralService } from '../../../services/general.service';
import { CommonService } from '../../../services/common.service';
import { ToasterService } from '../../../services/toaster.service';
import { TemplateDesignUISectionVisibility } from '../../../invoice/templates/edit-template/filters-container/design-filters/design.filters.component';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { IOption } from '../../../theme/ng-select/option.interface';

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
  public logoAttached: boolean = false;
  public showLogo: boolean = true;
  public selectedTemplateUniqueName: string = 'gst_template_a';
  public _presetFonts = [
    { label: 'Open Sans', value: 'Open Sans' },
    { label: 'Roboto', value: 'Roboto' },
    { label: 'Lato', value: 'Lato' },
    { label: 'Inter', value: 'Inter' }
  ];
  public _presetFontsSize = [
    { label: '16px', value: 16 },
    { label: '14px', value: 14 },
    { label: '12px', value: 12 },
    { label: '10px', value: 10 }

  ];
  public presetFonts = this._presetFonts;
  public presetFontsSize = this._presetFontsSize;
  public formData: FormData;
  public files: any[] = [];
  public dragOver: boolean;
  public imagePreview: any;
  public isFileUploaded: boolean = false;
  public isFileUploadInProgress: boolean = false;
  public sampleTemplates: CustomTemplateResponse[];
  public companyUniqueName: string = '';
  public templateType: any;
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


  constructor(private fb: FormBuilder,
    private generalService: GeneralService,
    private toasty: ToasterService,
    private store: Store<AppState>,
    private commonService: CommonService,
    private invoiceUiDataService: InvoiceUiDataService) {

  }

  ngOnInit() {
    this.templateType = this.inputData?.voucherType;
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
      if (this.inputData.mode === 'create') {
        this.initForm();
      } else {
        this.initForm(this.customTemplate);
      }
      this.setFontAndFontSize();

      let op = {
        header: {},
        table: {},
        footer: {}
      };


      if (this.customTemplate && this.customTemplate.sections) {
        op.header = this.customTemplate.sections.header.data;
        op.table = this.customTemplate.sections.table.data;
        op.footer = this.customTemplate.sections.footer.data;
        this.templateForm.get('sections').patchValue(op);

        this.invoiceUiDataService.setFieldsAndVisibility(op);
        if (this.customTemplate.logoSize) {
          this.defaultImageSize = this.customTemplate.logoSize === '100' ? 'L' :
            this.customTemplate.logoSize === '80' ? 'M' : 'S';
          this.templateForm.get('logoSize').patchValue(this.customTemplate.logoSize);
          this.templateForm.get('defaultImageSize').patchValue(this.defaultImageSize);
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

    });

    this.invoiceUiDataService.logoPath.pipe(takeUntil(this.destroyed$)).subscribe((path: string) => {
      if (!path) {
        this.showDeleteButton = false;
        this.logoAttached = false;
        this.isFileUploaded = false;
        this.defaultImageSize = 'S';
        this.templateForm.get('defaultImageSize').patchValue('S');
        const preview: any = document.getElementById('logoImage');
        preview?.setAttribute('src', '');
      }
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
      fontMedium: [customTemplate?.fontMedium ?? ''],
      fontLarge: [customTemplate?.fontLarge ?? ''],
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
      sample: [customTemplate?.sample ?? null],
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
      sections: this.fb.group({
        header: this.fb.group({
          data: this.fb.group({
            shippingDate: this.fb.group({ label: ['Ship Date'], display: [true], width: [null] }),
            showEInvoiceDetails: this.fb.group({ label: [''], display: [false], width: [null] }),
            customField1: this.fb.group({ label: [''], display: [true], width: [null] }),
            customField2: this.fb.group({ label: [''], display: [true], width: [null] }),
            shippedVia: this.fb.group({ label: ['Ship Via'], display: [true], width: [null] }),
            customField3: this.fb.group({ label: [''], display: [true], width: [null] }),
            companyName: this.fb.group({ label: [''], display: [true], width: [null] }),
            displayExchangeRate: this.fb.group({ label: [''], display: [false], width: [null] }),
            displayLutNumber: this.fb.group({ label: [''], display: [false], width: [null] }),
            displayPlaceOfSupply: this.fb.group({ label: [''], display: [false], width: [null] }),
            displayPlaceOfCountry: this.fb.group({ label: [''], display: [false], width: [null] }),
            dueDate: this.fb.group({ label: ['Due Date'], display: [true], width: [null] }),
            gstComposition: this.fb.group({ label: ['Registered under Composition Scheme'], display: [true], width: [null] }),
            gstin: this.fb.group({ label: ['GSTIN'], display: [true], width: [null] }),
            shippingGstin: this.fb.group({ label: ['GSTIN'], display: [true], width: [null] }),
            voucherNumber: this.fb.group({ label: ['Voucher No.'], display: [true], width: [null] }),
            customerEmail: this.fb.group({ label: [''], display: [true], width: [null] }),
            invoiceNumber: this.fb.group({ label: ['Invoice No.'], display: [true], width: [null] }),
            showQrCode: this.fb.group({ label: [''], display: [false], width: [null] }),
            voucherDate: this.fb.group({ label: ['Voucher Date'], display: [true], width: [null] }),
            customerMobileNumber: this.fb.group({ label: [''], display: [true], width: [null] }),
            attentionTo: this.fb.group({ label: ['Attention To'], display: [true], width: [null] }),
            pan: this.fb.group({ label: ['PAN'], display: [true], width: [null] }),
            trackingNumber: this.fb.group({ label: ['Tracking No.'], display: [true], width: [null] }),
            formNameInvoice: this.fb.group({ label: ['INVOICE'], display: [true], width: [null] }),
            billingGstin: this.fb.group({ label: ['GSTIN'], display: [true], width: [null] }),
            address: this.fb.group({ label: [''], display: [true], width: [null] }),
            billingState: this.fb.group({ label: ['State'], display: [true], width: [null] }),
            invoiceDate: this.fb.group({ label: ['Invoice Date'], display: [true], width: [null] }),
            customerName: this.fb.group({ label: [''], display: [true], width: [null] }),
            formNameTaxInvoice: this.fb.group({ label: ['TAX INVOICE'], display: [true], width: [null] }),
            shippingAddress: this.fb.group({ label: ['Shipping Address'], display: [true], width: [null] }),
            shippingState: this.fb.group({ label: ['State'], display: [true], width: [null] }),
            billingAddress: this.fb.group({ label: ['Billing Address'], display: [true], width: [null] }),
            warehouseAddress: this.fb.group({ label: [''], display: [true], width: [null] }),
            showCompanyAddress: this.fb.group({ label: [''], display: [true], width: [null] }),
          })
        }),
        table: this.fb.group({
          data: this.fb.group({
            date: this.fb.group({ label: ['Date'], display: [true], width: ['10'] }),
            item: this.fb.group({ label: ['Description'], display: [true], width: ['10'] }),
            total: this.fb.group({ label: ['Total'], display: [true], width: ['10'] }),
            quantity: this.fb.group({ label: ['Qty.'], display: [true], width: ['10'] }),
            sNo: this.fb.group({ label: ['#'], display: [true], width: ['10'] }),
            rate: this.fb.group({ label: ['Rate/ Item'], display: [true], width: ['10'] }),
            showVariantImage: this.fb.group({ label: ['Display Image'], display: [false], width: ['15'] }),
            taxableValue: this.fb.group({ label: ['Taxable Amt.'], display: [true], width: ['10'] }),
            previousDue: this.fb.group({ label: ['Previous Due'], display: [false], width: [null] }),
            description: this.fb.group({ label: ['Some label'], display: [true], width: ['10'] }),
            discount: this.fb.group({ label: ['Dis./ Item'], display: [true], width: ['10'] }),
            taxes: this.fb.group({ label: ['Taxes'], display: [true], width: ['10'] }),
            displayBaseCurrency: this.fb.group({ label: [''], display: [true], width: [null] }),
            showDescriptionInRows: this.fb.group({ label: [''], display: [false], width: [null] }),
            amountBeforeDiscount: this.fb.group({ label: ['Total Before Dis.'], display: [true], width: [null] }),
            hsnSac: this.fb.group({ label: ['HSN/SAC'], display: [true], width: ['10'] }),
            otherTaxBifurcation: this.fb.group({ label: ['TCS'], display: [true], width: [null] }),
            totalQuantity: this.fb.group({ label: ['Total Quantity'], display: [true], width: [null] }),
          })
        }),
        footer: this.fb.group({
          data: this.fb.group({
            totalTax: this.fb.group({ label: ['Total Tax*'], display: [true], width: [null] }),
            displayExportMessage: this.fb.group({ label: [''], display: [false], width: [null] }),
            thanks: this.fb.group({ label: ['Thank You for your business.'], display: [true], width: [null] }),
            taxableAmount: this.fb.group({ label: ['Sub Total'], display: [true], width: [null] }),
            otherDeduction: this.fb.group({ label: [''], display: [true], width: [null] }),
            imageSignature: this.fb.group({ label: [''], display: [false], width: [null] }),
            grandTotal: this.fb.group({ label: ['Invoice Total'], display: [true], width: [null] }),
            totalInWords: this.fb.group({ label: ['Invoice Total (In words)'], display: [true], width: [null] }),
            totalDue: this.fb.group({ label: ['Total Due'], display: [true], width: [null] }),
            companyAddress: this.fb.group({ label: [''], display: [true], width: [null] }),
            companyName: this.fb.group({ label: [''], display: [true], width: [null] }),
            slogan: this.fb.group({ label: [''], display: [true], width: [null] }),
            textUnderSlogan: this.fb.group({ label: [''], display: [true], width: [null] }),
            showNotesAtLastPage: this.fb.group({ label: [''], display: [false], width: [null] }),
            message1: this.fb.group({ label: [''], display: [true], width: [null] }),
            showMessage2: this.fb.group({ label: [''], display: [true], width: [null] }),
            tcs: this.fb.group({ label: ['TCS'], display: [true], width: [null] }),
            tds: this.fb.group({ label: ['TDS'], display: [true], width: [null] }),
            taxBifurcation: this.fb.group({ label: ['Tax Bifurcation'], display: [false], width: [null] }),
          })
        })
      }),
      copyFrom: [customTemplate?.copyFrom ?? 'gst_template_a'],
      logoUniqueName: [customTemplate?.logoUniqueName ?? null],
      templateType: [customTemplate?.templateType ?? 'gst_template_a'],
      defaultImageSize: ['S']
    });

    // Patch sections from customTemplate if available
    if (customTemplate?.sections) {
      this.patchFormGroup(this.templateForm.get('sections') as FormGroup, customTemplate.sections);
    }
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
          this.presetFonts = this._presetFonts;
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


}
