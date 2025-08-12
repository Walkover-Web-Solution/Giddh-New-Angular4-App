import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationModalConfiguration } from '../../theme/confirmation-modal/confirmation-modal.interface';
import { CustomTemplateResponse } from '../../models/api-models/Invoice';
import { ReplaySubject, take, takeUntil } from 'rxjs';
import { InvoiceUiDataService } from '../../services/invoice.ui.data.service';
import { cloneDeep } from '../../lodash-optimized';
import { ToasterService } from '../../services/toaster.service';
import { InvoiceTemplatesService } from '../../services/invoice.templates.service';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
import { TemplateModeEnum } from '../../models/api-models/Sales';

@Component({
  selector: 'app-template-edit-dialog',
  templateUrl: './template-edit-dialog.component.html',
  styleUrls: ['./template-edit-dialog.component.scss']
})
export class TemplateEditDialogComponent implements OnInit, OnDestroy {
  /** Invoice confirmation popup configuration */
  public InvoiceConfirmationConfiguration: ConfirmationModalConfiguration;
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
  public templateModeEnum = TemplateModeEnum;

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
    this.invoiceUiDataService.customTemplate.pipe(takeUntil(this.destroyed$)).subscribe((template: CustomTemplateResponse) => {
      this.customTemplate = template;
    });
  }

  /**
  * Closes the dialog.
  *
  * @memberof TemplateEditDialogComponent
  */
  public closeDialog(): void {
    this.dialogRef.close(false);
  }

  /**
   * Create template
   *
   * @param {string} vouchertyp
   * @memberof TemplateEditDialogComponent
   */
  public createTemplate(vouchertyp: string) {
    let data = cloneDeep(this.invoiceUiDataService.customTemplate.getValue());
    data.type = vouchertyp;
    let copiedTemplate = cloneDeep(data);
    if (data.name) {
      data = this.newLineToBR(data);
      // data.sections['table'].content['taxes'].field = 'taxes';
      data.sections['footer'].data['grandTotal'].field = 'grandTotal';
      // if (data.sections[1].content[8].field === 'taxes' && data.sections[1].content[7].field !== 'taxableValue') {
      //   data.sections[1].content[8].field = 'taxableValue';
      // }
      data.copyFrom = copiedTemplate?.uniqueName;
      if (data.fontSize) {
        data.fontSmall = data.fontSize - 4;
        data.fontDefault = data.fontSize;
        data.fontMedium = data.fontSize - 2;
      }
      if (!data.sections['footer'].data['textUnderSlogan']?.display || !data?.sections['footer']?.data['textUnderSlogan']?.label) {
        // If user checks the checkbox but didn't provide label then remove the selection
        if (!data.sections['footer'].data['textUnderSlogan']) {
          data.sections['footer'].data['textUnderSlogan'] = {
            label: '',
            display: false
          };
        } else {
          data.sections['footer'].data['textUnderSlogan'].display = false;
          data.sections['footer'].data['textUnderSlogan'].label = '';
        }
      }
      delete data['uniqueName'];
      if (data.templateType?.toLowerCase() !== 'gst_template_a' && data.templateType?.toLowerCase() !== 'gst_template_e' && data.templateType?.toLowerCase() !== 'thermal_template' && data.templateType?.toLowerCase() !== 'tally_template') {
        delete data?.sections?.header?.data?.showCompanyAddress;
        delete data?.sections?.header?.data?.showQrCode;
        delete data?.sections?.header?.data?.showEInvoiceDetails;
        delete data?.sections?.table?.data?.showDescriptionInRows;
        delete data?.sections?.footer?.data?.showNotesAtLastPage;
        delete data?.sections?.footer?.data?.showMessage2;
        delete data?.sections?.footer?.data?.textUnderSlogan;
      }

      if (vouchertyp === 'voucher') {
        data.sections['header'].data['invoiceDate'].label = data.sections['header'].data['voucherDate'].label;
        data.sections['header'].data['invoiceNumber'].label = data.sections['header'].data['voucherNumber'].label;
      } else {
        data.sections['header'].data['voucherDate'].label = data.sections['header'].data['invoiceDate'].label;
        data.sections['header'].data['voucherNumber'].label = data.sections['header'].data['invoiceNumber'].label;
      }

      this.store.pipe(select(state => state.session), take(1)).subscribe(session => {
        const companyName = session.companies.find((company) => company?.uniqueName === session.companyUniqueName)?.name;
        if (!data?.sections?.header?.data['companyName']?.label) {
          data.sections['header'].data['companyName'].label = companyName;
        }
        if (!data?.sections?.footer?.data['companyName']?.label) {
          data.sections['footer'].data['companyName'].label = companyName;
        }
      });

      this.invoiceTemplatesService.saveTemplates(data).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
        if (res?.status === 'success') {
          this.toasty.successToast('Template Saved Successfully.');
          this.dialogRef.close(true);
        } else {
          this.toasty.errorToast(res?.message, res?.code);
          this.dialogRef.close(false);
        }
      });
    } else {
      this.toasty.errorToast('Please enter template name.');
    }
  }

  /**
   * Update template
   *
   * @param {string} templateType
   * @memberof TemplateEditDialogComponent
   */
  public updateTemplate(templateType: string) {
    let data = cloneDeep(this.invoiceUiDataService.customTemplate.getValue());
    if (data.name) {
      data.updatedAt = null;
      data.updatedBy = null;
      // data.copyFrom = 'gst_template_a'; // this should be dynamic
      data.sections['header'].data['address'].label = '';
      data.sections['table'].data['taxes'].field = 'taxes';
      data.sections['footer'].data['grandTotal'].field = 'grandTotal';
      // if (data.sections[1].content[8].field === 'taxes' && data.sections[1].content[7].field !== 'taxableValue') {
      //   data.sections[1].content[8].field = 'taxableValue';
      // }
      if (data.fontSize) {
        data.fontSize = Number(data.fontSize);
        data.fontSmall = data.fontSize - 4;
        data.fontDefault = data.fontSize;
        data.fontMedium = data.fontSize - 2;
      }
      if (!data.sections['footer'].data['message1']?.display || !data?.sections['footer']?.data['message1']?.label) {
        // If user checks the checkbox but didn't provide label then remove the selection
        data.sections['footer'].data['message1'].display = false;
        data.sections['footer'].data['message1'].label = '';
      }
      if (!data.sections['footer'].data['textUnderSlogan']?.display || !data?.sections['footer']?.data['textUnderSlogan']?.label) {
        // If user checks the checkbox but didn't provide label then remove the selection
        data.sections['footer'].data['textUnderSlogan'].display = false;
        data.sections['footer'].data['textUnderSlogan'].label = '';
      }
      data = this.newLineToBR(data);
      this.invoiceTemplatesService.updateTemplate(data?.uniqueName, data).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
        if (res?.status === 'success') {
          this.toasty.successToast('Template Updated Successfully.');
          this.invoiceUiDataService.resetCustomTemplate();
          this.invoiceUiDataService.setLogoPath('');
          this.invoiceUiDataService.unusedImageSignature = '';
          this.dialogRef.close(true);
        } else {
          this.toasty.errorToast(res?.message, res?.code);
          this.dialogRef.close(false);
        }
      });
    } else {
      this.toasty.errorToast('Please enter template name.');
    }
  }



  /**
 * Replaces new line characters with <br /> tags in specific template fields.
 *
 * @param {*} template The template object to update
 * @returns {*} The updated template object
 * @memberof TemplateEditFilterComponent
 */
  public newLineToBR(template): void {
    template.sections['footer'].data['message1'].label = template.sections['footer'].data['message1'].label ? template.sections['footer'].data['message1'].label?.replace(/(?:\r\n|\r|\n)/g, '<br />') : template.sections['footer'].data['message1'].label = '';
    template.sections['footer'].data['companyAddress'].label = template.sections['footer'].data['companyAddress'].label ? template.sections['footer'].data['companyAddress'].label?.replace(/(?:\r\n|\r|\n)/g, '<br />') : template.sections['footer'].data['companyAddress'].label = '';
    template.sections['footer'].data['slogan'].label = template.sections['footer'].data['slogan'].label?.replace(/(?:\r\n|\r|\n)/g, '<br />');
    return template;
  }

  /**
  * Angular lifecycle hook that is called when the component is destroyed.
  * Releases memory and cleans up subscriptions.
  *
  * @memberof TemplateEditDialogComponent
  */
  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
