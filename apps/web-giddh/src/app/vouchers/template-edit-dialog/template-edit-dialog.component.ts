import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ConfirmationModalConfiguration } from '../../theme/confirmation-modal/confirmation-modal.interface';
import { GeneralService } from '../../services/general.service';
import { NewConfirmationModalComponent } from '../../theme/new-confirmation-modal/confirmation-modal.component';
import { CustomTemplateResponse } from '../../models/api-models/Invoice';
import { ReplaySubject, takeUntil } from 'rxjs';
import { InvoiceUiDataService } from '../../services/invoice.ui.data.service';

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
    public templateData: any;
    customTemplate: CustomTemplateResponse = new CustomTemplateResponse();
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject<boolean>();

  constructor(
    public dialog: MatDialog,
    private generalService: GeneralService,
    private invoiceUiDataService: InvoiceUiDataService,
    @Inject(MAT_DIALOG_DATA) public inputData: any
  ) {
    this.templateData = this.inputData;
   }
    // delete confirmation dialog
    public deleteVoucherDialog():void {
      this.InvoiceConfirmationConfiguration = this.generalService.getDeleteBranchTransferConfiguration(this.localeData, this.commonLocaleData, this.selectedInvoiceType,);
      this.dialog.open(NewConfirmationModalComponent, {
          panelClass: ['mat-dialog-md'],
          data: {
              configuration: this.InvoiceConfirmationConfiguration
          }
      });
  }
  public ngOnInit():void {
      this.invoiceUiDataService.customTemplate.pipe(takeUntil(this.destroyed$)).subscribe((template: CustomTemplateResponse) => {
        console.log(template);
        this.customTemplate = template;
      });
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
