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
  * Closes the dialog.
  *
  * @memberof TemplateEditDialogComponent
  */
  public closeDialog(): void {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      panelClass: ['mat-dialog-md'],
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

    data = this.newLineToBR(data);
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
        textUnderSlogan.label = '';
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
    data = this.newLineToBR(data);
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
      msg1.label = '';
    }
  }

  /**
   * newLineToBR method
   *
   * @param {*} template
   * @returns
   * @memberof TemplateEditDialogComponent
   */
  public newLineToBR(template: any): any {
    const footerData = template?.sections?.['footer']?.data;
    if (footerData?.['message1'] && typeof footerData['message1']?.label === 'string') {
      footerData['message1'].label = footerData['message1'].label.replace(/(?:\r\n|\r|\n)/g, '<br />');
    } else if (footerData?.['message1']) {
      footerData['message1'].label = '';
    }
    if (footerData?.['companyAddress'] && typeof footerData['companyAddress']?.label === 'string') {
      footerData['companyAddress'].label = footerData['companyAddress'].label.replace(/(?:\r\n|\r|\n)/g, '<br />');
    } else if (footerData?.['companyAddress']) {
      footerData['companyAddress'].label = '';
    }
    if (footerData?.['slogan'] && typeof footerData['slogan']?.label === 'string') {
      footerData['slogan'].label = footerData['slogan'].label.replace(/(?:\r\n|\r|\n)/g, '<br />');
    }
    return template;
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
