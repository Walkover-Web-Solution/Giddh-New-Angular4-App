import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalConfiguration } from '../../theme/confirmation-modal/confirmation-modal.interface';
import { GeneralService } from '../../services/general.service';
import { NewConfirmationModalComponent } from '../../theme/new-confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-template-edit-dialog',
  templateUrl: './template-edit-dialog.component.html',
  styleUrls: ['./template-edit-dialog.component.scss']
})
export class TemplateEditDialogComponent implements OnInit {
    /** Invoice confirmation popup configuration */
    public InvoiceConfirmationConfiguration: ConfirmationModalConfiguration;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /* Hold invoice  type*/
    public selectedInvoiceType: any = '';

  constructor(
    public dialog: MatDialog,
    private generalService: GeneralService
  ) { }
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
  ngOnInit() {
  }

}
