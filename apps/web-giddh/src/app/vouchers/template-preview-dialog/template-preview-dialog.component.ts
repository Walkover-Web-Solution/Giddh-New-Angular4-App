import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { ReplaySubject, takeUntil } from 'rxjs';
import { GeneralService } from '../../services/general.service';
import { InvoiceTemplatesService } from '../../services/invoice.templates.service';
import { ToasterService } from '../../services/toaster.service';

@Component({
  selector: 'app-template-preview-dialog',
  templateUrl: './template-preview-dialog.component.html',
  styleUrls: ['./template-preview-dialog.component.scss']
})
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

  constructor(
    public dialog: MatDialog,
    private domSanitizer: DomSanitizer,
    private generalService: GeneralService,
    private invoiceTemplatesService: InvoiceTemplatesService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toasterService: ToasterService
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
    switch (this.data?.type?.toLowerCase()) {
      case 'sales':
      case 'invoice':
        templateType = 'Invoice';
        break;
      case 'purchase':
      case 'purchase_bill':
        templateType = 'Purchase Bill';
        break;
      case 'purchase_order':
        templateType = 'Purchase Order';
        break;
      default:
        templateType = 'Invoice';
        break;
    }
    
    // Replace [TEMPLATE_TYPE] placeholder with actual template type
    this.templatePreviewTitle = this.localeData?.template_preview?.replace('[TEMPLATE_TYPE]', templateType) || `${templateType} Template Preview`;
  }

  /**
   * Get template preview
   *
   * @memberof TemplatePreviewDialogComponent
   */
  public getTemplatePreview(): void {
    this.invoiceTemplatesService.getTemplatePreview(this.data.type, false, null, this.data.uniqueName).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
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
        this.toasterService.showSnackBar('error', this.localeData?.failed_to_get_template_preview);
      }
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
