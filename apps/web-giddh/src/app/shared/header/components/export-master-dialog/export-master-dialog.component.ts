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
import { ExportColumnsHelper } from '../../../helpers/export-columns.helper';

@Component({
    selector: 'app-export-master-dialog',
    templateUrl: './export-master-dialog.component.html',
    styleUrls: ['./export-master-dialog.component.scss'],
    standalone: false
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
    exportRequest.columnsToExport = ExportColumnsHelper.buildColumnsToExport(this.exportFormValue);
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
        this.toaster.showSnackBar("error", response?.message);
      }
    });
  }
}
