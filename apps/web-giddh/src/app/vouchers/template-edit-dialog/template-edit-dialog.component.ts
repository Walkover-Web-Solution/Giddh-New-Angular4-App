import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CustomTemplateResponse } from '../../models/api-models/Invoice';
import { ReplaySubject, take, takeUntil } from 'rxjs';
import { InvoiceUiDataService } from '../../services/invoice.ui.data.service';
import { cloneDeep } from '../../lodash-optimized';
import { ToasterService } from '../../services/toaster.service';
import { InvoiceTemplatesService } from '../../services/invoice.templates.service';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
import { TemplateModeEnum, TemplateTypeEnum } from '../../models/api-models/Sales';
import { ConfirmModalComponent } from '../../theme/new-confirm-modal/confirm-modal.component';
import { CountryNames } from '../../shared/Enums/common.enum';

@Component({
  selector: 'app-template-edit-dialog',
  templateUrl: './template-edit-dialog.component.html',
  styleUrls: ['./template-edit-dialog.component.scss'],
  standalone:false
})
export class TemplateEditDialogComponent implements OnInit, OnDestroy {
  /** This will hold local JSON data */
  public localeData: any = {};
  /** This will hold common JSON data */
  public commonLocaleData: any = {};
  /* Hold invoice  type*/
  public selectedInvoiceType: any = '';
  /* Hold template data*/
  public templateData: any;
  /* Hold custom template data*/
  public customTemplate: CustomTemplateResponse = new CustomTemplateResponse();
  /* Destroyed$ subject*/
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject<boolean>();
  /** Current mode of the component (e.g., 'create', 'edit') */
  public readonly templateModeEnum = TemplateModeEnum;
  /* This will hold the value if Gst Composition will show/hide */
  public showGstComposition: boolean = false;
  /** Maximum allowed characters for footer message1 value and secondaryValue */
  private readonly message1MaxLength: number = 200;

  constructor(
    public dialog: MatDialog,
    private invoiceUiDataService: InvoiceUiDataService,
    private invoiceTemplatesService: InvoiceTemplatesService,
    private toasty: ToasterService,
    private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) public inputData: any,
    public dialogRef: MatDialogRef<any>
  ) {
    this.templateData = this.inputData;
  }

  /**
   * Angular lifecycle hook that is called after data-bound properties are initialized.
   * Initializes company, template, and UI data for the template editor.
   *
   * @memberof TemplateEditDialogComponent
   */
  public ngOnInit(): void {
    this.localeData = this.inputData?.localeData;
    this.commonLocaleData = this.inputData?.commonLocaleData;
    this.invoiceUiDataService.customTemplate.pipe(takeUntil(this.destroyed$)).subscribe((template: CustomTemplateResponse) => {
      this.customTemplate = template;
    });

    this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
      this.showGstComposition = activeCompany?.countryV2?.countryName === CountryNames.INDIA;
    });
  }

  /**
   * Number of Note 1 fields that exceed the strict 200 character limit.
   * Strict length applies only when notes are not shown on the last page.
   *
   * @readonly
   * @type {number}
   * @memberof TemplateEditDialogComponent
   */
  public get message1CharacterLimitErrorCount(): number {
    const footerData = this.customTemplate?.sections?.['footer']?.data;
    if (footerData?.['showNotesAtLastPage']?.display || !footerData?.['message1']?.display) {
      return 0;
    }
    const message1 = footerData?.['message1'];
    let errorCount = 0;
    if (this.isCharacterLimitExceeded(message1?.value)) {
      errorCount++;
    }
    if (this.customTemplate?.enableSecondaryLanguage && this.isCharacterLimitExceeded(message1?.secondaryValue)) {
      errorCount++;
    }
    return errorCount;
  }

  /**
   * True when the template name is empty.
   *
   * @readonly
   * @type {boolean}
   * @memberof TemplateEditDialogComponent
   */
  public get isTemplateNameMissing(): boolean {
    return !this.customTemplate?.name?.trim();
  }

  /**
   * Total validation errors shown on the save button badge (name + Note 1).
   *
   * @readonly
   * @type {number}
   * @memberof TemplateEditDialogComponent
   */
  public get templateSaveErrorCount(): number {
    return (this.isTemplateNameMissing ? 1 : 0) + this.message1CharacterLimitErrorCount;
  }

  /**
   * Tooltip listing the current save-blocking errors.
   *
   * @readonly
   * @type {string}
   * @memberof TemplateEditDialogComponent
   */
  public get templateSaveErrorTooltip(): string {
    const errors: string[] = [];
    if (this.isTemplateNameMissing) {
      errors.push(this.localeData?.please_enter_template_name);
    } else if (this.message1CharacterLimitErrorCount) {
      errors.push(this.localeData?.message1_character_limit_exceeded);
    }
    return errors.join(', ');
  }

  /**
   * Closes the dialog.
   *
   * @memberof TemplateEditDialogComponent
   */
  public closeDialog(): void {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      panelClass: ['mat-dialog-sm'],
      data: {
        title: this.commonLocaleData?.app_confirmation,
        body: this.localeData?.close_popup,
        ok: this.commonLocaleData?.app_yes,
        cancel: this.commonLocaleData?.app_no,
        permanentlyDeleteMessage: ''
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.dialogRef.close(false);
      }
    });
  }

  /**
   * createTemplate method
   *
   * @memberof TemplateEditDialogComponent
   */
  public createTemplate(): void {
    let data = cloneDeep(this.invoiceUiDataService.customTemplate.getValue());
    data.type = this.inputData.templateType;
    let copiedTemplate = cloneDeep(data);
    if (!data.name) {
      this.toasty.errorToast(this.localeData?.please_enter_template_name);
      return;
    }
    if (this.message1CharacterLimitErrorCount) {
      this.toasty.errorToast(this.localeData?.message1_character_limit_exceeded);
      return;
    }

    if (data?.sections?.footer?.data?.['grandTotal']) {
      data.sections['footer'].data['grandTotal'].field = 'grandTotal';
    }
    data.copyFrom = copiedTemplate?.uniqueName;
    this.setFontSizesUpdate(data);
    this.ensureTextUnderSlogan(data);
    delete data['uniqueName'];
    this.cleanTemplateFields(data);
    this.syncVoucherLabels(data);

    this.store.pipe(select(state => state.session), take(1)).subscribe(session => {
      const companyName = session?.companies?.find((company) => company?.uniqueName === session?.companyUniqueName)?.name;
      if (!data?.sections?.header?.data?.['companyName']?.label) {
        if (data?.sections?.header?.data?.['companyName']) {
          data.sections['header'].data['companyName'].label = companyName;
        }
      }
      if (!data?.sections?.footer?.data?.['companyName']?.label) {
        if (data?.sections?.footer?.data?.['companyName']) {
          data.sections['footer'].data['companyName'].label = companyName;
        }
      }
    });
    this.invoiceTemplatesService.saveTemplates(data).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
      if (res?.status === 'success') {
        this.toasty.successToast(this.localeData?.template_saved_successfully);
        this.dialogRef.close(true);
      } else {
        this.toasty.errorToast(res?.message, res?.code);
      }
    });
  }

  /**
   * ensureTextUnderSlogan method
   *
   * @private
   * @param {*} data
   * @memberof TemplateEditDialogComponent
   */
  private ensureTextUnderSlogan(data: any): void {
    const textUnderSlogan = data?.sections?.['footer']?.data?.['textUnderSlogan'];
    if (!textUnderSlogan?.display || !textUnderSlogan?.label) {
      if (!textUnderSlogan && data?.sections?.['footer']?.data) {
        data.sections['footer'].data['textUnderSlogan'] = { label: '', display: false };
      } else if (textUnderSlogan) {
        textUnderSlogan.display = false;
        textUnderSlogan.label = textUnderSlogan.label || '';
      }
    }
  }

  /**
   * cleanTemplateFields method
   *
   * @private
   * @param {*} data
   * @memberof TemplateEditDialogComponent
   */
  private cleanTemplateFields(data: any): void {
    const specialTypes = [TemplateTypeEnum.GstTemplateA, TemplateTypeEnum.ThermalTemplate, TemplateTypeEnum.TallyTemplate];
    if (!specialTypes.includes((data?.templateType || '').toLowerCase())) {
      delete data?.sections?.header?.data?.showCompanyAddress;
      delete data?.sections?.header?.data?.showQrCode;
      delete data?.sections?.header?.data?.showEInvoiceDetails;
      delete data?.sections?.table?.data?.showDescriptionInRows;
      delete data?.sections?.footer?.data?.showNotesAtLastPage;
      delete data?.sections?.footer?.data?.showMessage2;
      delete data?.sections?.footer?.data?.textUnderSlogan;
    }
  }

  /**
   * syncVoucherLabels method
   *
   * @private
   * @param {*} data
   * @memberof TemplateEditDialogComponent
   */
  private syncVoucherLabels(data: any): void {
    if (this.inputData?.templateType === 'voucher') {
      if (data?.sections?.header?.data?.['invoiceDate'] && data?.sections?.header?.data?.['voucherDate']) {
        data.sections['header'].data['invoiceDate'].label = data.sections['header'].data['voucherDate'].label;
      }
      if (data?.sections?.header?.data?.['invoiceNumber'] && data?.sections?.header?.data?.['voucherNumber']) {
        data.sections['header'].data['invoiceNumber'].label = data.sections['header'].data['voucherNumber'].label;
      }
    } else {
      if (data?.sections?.header?.data?.['voucherDate'] && data?.sections?.header?.data?.['invoiceDate']) {
        data.sections['header'].data['voucherDate'].label = data.sections['header'].data['invoiceDate'].label;
      }
      if (data?.sections?.header?.data?.['voucherNumber'] && data?.sections?.header?.data?.['invoiceNumber']) {
        data.sections['header'].data['voucherNumber'].label = data.sections['header'].data['invoiceNumber'].label;
      }
    }
  }

  /**
   * updateTemplate method
   *
   * @memberof TemplateEditDialogComponent
   */
  public updateTemplate(): void {
    let data = cloneDeep(this.invoiceUiDataService.customTemplate.getValue());
    if (!data.name) {
      this.toasty.errorToast(this.localeData?.please_enter_template_name);
      return;
    }
    if (this.message1CharacterLimitErrorCount) {
      this.toasty.errorToast(this.localeData?.message1_character_limit_exceeded);
      return;
    }

    data.updatedAt = null;
    data.updatedBy = null;
    if (data?.sections?.header?.data?.['address']) {
      data.sections['header'].data['address'].label = '';
    }
    if (data?.sections?.table?.data?.['taxes']) {
      data.sections['table'].data['taxes'].field = 'taxes';
    }
    if (data?.sections?.footer?.data?.['grandTotal']) {
      data.sections['footer'].data['grandTotal'].field = 'grandTotal';
    }
    this.setFontSizesUpdate(data);
    this.ensureMessage1(data);
    this.ensureTextUnderSlogan(data);
    this.invoiceTemplatesService.updateTemplate(data?.uniqueName, data).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
      if (res?.status === 'success') {
        this.toasty.successToast(this.localeData?.template_updated_successfully);
        this.invoiceUiDataService.setLogoPath('');
        this.invoiceUiDataService.unusedImageSignature = '';
        this.dialogRef.close(true);
      } else {
        this.toasty.errorToast(res?.message, res?.code);
        this.dialogRef.close(false);
      }
    });
  }

  /**
   * setFontSizesUpdate method
   *
   * @private
   * @param {*} data
   * @memberof TemplateEditDialogComponent
   */
  private setFontSizesUpdate(data: any): void {
    if (data?.fontSize) {
      data.fontSize = Number(data.fontSize);
      data.fontSmall = data.fontSize - 4;
      data.fontDefault = data.fontSize;
      data.fontMedium = data.fontSize - 2;
    }
  }

  /**
   * Checks whether the given string exceeds the Note 1 character limit.
   *
   * @private
   * @param {string} value Field value
   * @returns {boolean} True if the value is over the limit
   * @memberof TemplateEditDialogComponent
   */
  private isCharacterLimitExceeded(value: string): boolean {
    return (value?.length || 0) > this.message1MaxLength;
  }

  /**
   * ensureMessage1 method
   *
   * @private
   * @param {*} data
   * @memberof TemplateEditDialogComponent
   */
  private ensureMessage1(data: any): void {
    const msg1 = data?.sections?.['footer']?.data?.['message1'];
    if (msg1 && (!msg1?.display || !msg1?.label)) {
      msg1.display = false;
      msg1.label = msg1.label || '';
      data.message1 = data.message1 || '';
      data.secondaryMessage1 = data.secondaryMessage1 || '';
    }
  }

  /**
   * ngOnDestroy method
   *
   * @memberof TemplateEditDialogComponent
   */
  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
