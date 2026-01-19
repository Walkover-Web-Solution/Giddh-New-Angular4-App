import { Component, Inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { ReplaySubject, takeUntil } from 'rxjs';
import { GeneralService } from '../../services/general.service';
import { InvoiceTemplatesService } from '../../services/invoice.templates.service';
import { ToasterService } from '../../services/toaster.service';
import { VoucherTypeEnum } from '../utility/vouchers.const';

/**
 * Handles Component functionality
 */
@Component({
  selector: 'app-template-preview-dialog',
  templateUrl: './template-preview-dialog.component.html',
  styleUrls: ['./template-preview-dialog.component.scss'],
  standalone:false
})
/**
 * TemplatePreviewDialogComponent component
 * Handles templatepreviewdialog functionality and user interactions
 */
export class TemplatePreviewDialogComponent implements OnInit, OnDestroy {
  /* Hold invoice  type*/
  public selectedInvoiceType: any = '';
  /** Subject to unsubscribe from listeners */
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  /** PDF file url created with blob */
  public sanitizedPdfFileUrl: SafeUrl = null;
  /** Whether file is uploading */
  public isFileUploading: boolean = true;
  /** Holds PDF file value */
  public pdfFileURL: string = '';
  /** This will hold local JSON data */
  public localeData: any = {};
  /** This will hold common JSON data */
  public commonLocaleData: any = {};
  /** Dynamic template preview title */
  public templatePreviewTitle: string = '';

  /**
   * Creates an instance of component
   * Initializes component dependencies and sets up initial state
   */
  constructor(
    public dialog: MatDialog,
    private domSanitizer: DomSanitizer,
    private generalService: GeneralService,
    private invoiceTemplatesService: InvoiceTemplatesService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toasterService: ToasterService,
    private cdRef: ChangeDetectorRef
  ) { }

  /**
   * On init
   *
   * @memberof TemplatePreviewDialogComponent
   */
  public ngOnInit(): void {
    this.localeData = this.data?.localeData;
    this.commonLocaleData = this.data?.commonLocaleData;
    this.setTemplatePreviewTitle();
    this.getTemplatePreview();
  }

  /**
   * Set dynamic template preview title based on template type
   *
   * @memberof TemplatePreviewDialogComponent
   */
  private setTemplatePreviewTitle(): void {
    let templateType = '';
    // Map template types to display names
    /**
     * Handles switch functionality
     */
    switch (this.data?.type?.toLowerCase()) {
      case VoucherTypeEnum.sales:
      case VoucherTypeEnum.invoice:
        templateType = this.data?.commonLocaleData?.app_invoice;
        break;
      case VoucherTypeEnum.voucher:
        templateType = this.data?.commonLocaleData?.app_voucher;
        break;
      case VoucherTypeEnum.purchase:
      case VoucherTypeEnum.purchase_bill:
        templateType = this.data?.localeData?.purchase_bill;
        break;
      case VoucherTypeEnum.purchase_order:
        templateType = this.data?.localeData?.purchase_order;
        break;
      default:
        templateType = this.data?.commonLocaleData?.app_invoice;
        break;
    }
    
    // Replace [TEMPLATE_TYPE] placeholder with actual template type
    this.templatePreviewTitle = this.data?.localeData?.template_preview?.replace('[TEMPLATE_TYPE]', templateType) || `${templateType} Template Preview`;
  }

  /**
   * Get template preview
   *
   * @memberof TemplatePreviewDialogComponent
   */
  public getTemplatePreview(): void {
    this.invoiceTemplatesService.getTemplatePreview(this.data?.type, this.data?.uniqueName).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
      /**
       * Handles if functionality
       */
      if (response?.status === 'success') {
        this.selectedInvoiceType = this.generalService.base64ToBlob(response?.body?.data, 'application/pdf', 512);
        const file = new Blob([this.selectedInvoiceType], { type: 'application/pdf' });
        URL.revokeObjectURL(this.pdfFileURL);
        this.pdfFileURL = URL.createObjectURL(file);
        this.sanitizedPdfFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pdfFileURL);
        this.isFileUploading = false;
      } else {
        this.isFileUploading = false;
        this.sanitizedPdfFileUrl = null;
        this.toasterService.showSnackBar('error', this.localeData?.failed_to_get_template_preview || 'Failed to get template preview');
      }
      this.cdRef.detectChanges();
    });
  }

  /**
   * On destroy
   *
   * @memberof TemplatePreviewDialogComponent
   */
  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
