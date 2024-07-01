import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ExportBodyRequest } from 'apps/web-giddh/src/app/models/api-models/DaybookRequest';
import { LedgerService } from 'apps/web-giddh/src/app/services/ledger.service';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { ReplaySubject, takeUntil } from 'rxjs';
import { ManageGroupsAccountsComponent } from '../new-manage-groups-accounts/manage-groups-accounts.component';
import { Store } from '@ngrx/store';
import { AppState } from 'apps/web-giddh/src/app/store';
import { GroupWithAccountsAction } from 'apps/web-giddh/src/app/actions/groupwithaccounts.actions';

@Component({
  selector: 'app-export-master-dialog',
  templateUrl: './export-master-dialog.component.html',
  styleUrls: ['./export-master-dialog.component.scss']
})
export class ExportMasterDialogComponent {
  /** Form Group for export  form */
  public exportFormValue: any;
  /** True if api call in progress */
  public isLoading: boolean = false;
  /** To destroy observers */
  public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  /* This will hold local JSON data */
  public localeData: any = {};
  /* This will hold common JSON data */
  public commonLocaleData: any = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public inputData,
    private ledgerService: LedgerService,
    private toaster: ToasterService,
    private router: Router,
    private dialogRef: MatDialogRef<ManageGroupsAccountsComponent>,
    private store: Store<AppState>,
    private groupWithAccountsAction: GroupWithAccountsAction
  ) { }


  /**
   * Master Export form value
   */
  public exportMaster(): void {
    let exportRequest: ExportBodyRequest = new ExportBodyRequest();
    exportRequest.exportType = this.inputData?.exportType;
    exportRequest.columnsToExport = [];
    const formValue = this.exportFormValue;
    if (formValue.openingBalance) {
      exportRequest.columnsToExport?.push("Opening Balance");
    }
    if (formValue.openingBalanceType) {
      exportRequest.columnsToExport?.push("Opening Balance Type");
    }
    if (formValue.foreignOpeningBalance) {
      exportRequest.columnsToExport?.push("Foreign Opening Balance");
    }
    if (formValue.foreignOpeningBalanceType) {
      exportRequest.columnsToExport?.push("Foreign Opening Balance Type");
    }
    if (formValue.currency) {
      exportRequest.columnsToExport?.push("Currency");
    }
    if (formValue.mobileNumber) {
      exportRequest.columnsToExport?.push("Mobile Number");
    }
    if (formValue.email) {
      exportRequest.columnsToExport?.push("Email");
    }
    if (formValue.attentionTo) {
      exportRequest.columnsToExport?.push("Attention to");
    }
    if (formValue.remark) {
      exportRequest.columnsToExport?.push("Remark");
    }
    if (formValue.address) {
      exportRequest.columnsToExport?.push("Address");
    }
    if (formValue.pinCode) {
      exportRequest.columnsToExport?.push("Pin Code");
    }
    if (formValue.taxNumber) {
      exportRequest.columnsToExport?.push("Tax Number");
    }
    if (formValue.partyType) {
      exportRequest.columnsToExport?.push("Party Type");
    }
    if (formValue.bankName) {
      exportRequest.columnsToExport?.push("Bank Name");
    }
    if (formValue.bankAccountNumber) {
      exportRequest.columnsToExport?.push("Bank Account Number");
    }
    if (formValue.ifscCode) {
      exportRequest.columnsToExport?.push("IFSC Code");
    }
    if (formValue.beneficiaryName) {
      exportRequest.columnsToExport?.push("Beneficiary Name");
    }
    if (formValue.branchName) {
      exportRequest.columnsToExport?.push("Branch Name");
    }
    if (formValue.swiftCode) {
      exportRequest.columnsToExport?.push("Swift Code");
    }
    this.isLoading = true;
    this.ledgerService.exportData(exportRequest).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
      this.isLoading = false;
      if (response?.status === "success") {
        this.toaster.showSnackBar("success", response?.body);
        this.dialogRef?.close();
        // for close master dialog
        this.store.dispatch(this.groupWithAccountsAction.HideAddAndManageFromOutside());
        document.querySelector('body')?.classList?.remove('master-page');
        this.router.navigate(['pages/downloads']);
      } else {
        this.toaster.showSnackBar("error", response?.body);
      }
    });
  }
}
