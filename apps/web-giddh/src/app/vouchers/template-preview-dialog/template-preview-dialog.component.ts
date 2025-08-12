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
    console.log(this.data);
    this.getTemplatePreview();
  }

  /**
   * Get template preview
   *
   * @memberof TemplatePreviewDialogComponent
   */
  public getTemplatePreview(): void {
    this.invoiceTemplatesService.getTemplatePreview(this.data.type, this.data.uniqueName).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
      console.log(response);
      if (response?.status === 'success') {
        console.log(response);
        return;
        this.selectedInvoiceType = this.generalService.base64ToBlob(response.body.data, 'application/pdf', 512);
        const file = new Blob([this.selectedInvoiceType], { type: 'application/pdf' });
        URL.revokeObjectURL(this.pdfFileURL);
        this.pdfFileURL = URL.createObjectURL(file);
        this.sanitizedPdfFileUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pdfFileURL);
        this.isFileUploading = false;
      } else {
        this.isFileUploading = false;
        this.toasterService.showSnackBar('error', 'Failed to get template preview ');
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
