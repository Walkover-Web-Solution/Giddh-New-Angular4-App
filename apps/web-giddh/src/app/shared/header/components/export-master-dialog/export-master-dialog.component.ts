import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ExportBodyRequest } from 'apps/web-giddh/src/app/models/api-models/DaybookRequest';
import { LedgerService } from 'apps/web-giddh/src/app/services/ledger.service';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { ReplaySubject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-export-master-dialog',
  templateUrl: './export-master-dialog.component.html',
  styleUrls: ['./export-master-dialog.component.scss']
})
export class ExportMasterDialogComponent implements OnInit {
  /** Form Group for export  form */
  public exportForm: FormGroup;
  /** True if api call in progress */
  public isLoading: boolean = false;
  /** To destroy observers */
  public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    @Inject(MAT_DIALOG_DATA) public inputData,
    private ledgerService: LedgerService,
    private toaster: ToasterService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.initExportForm();
  }

  public initExportForm(): void {
    this.exportForm = this.formBuilder.group({
      groupName: new FormControl(false),
      taxNumber: new FormControl(false),
      email: new FormControl(false),
      openingBalance: new FormControl(false),
    })
  }

  public exportMaster(): void {
    let exportRequest: ExportBodyRequest = new ExportBodyRequest();
    exportRequest.exportType = this.inputData?.exportType;
    exportRequest.columnsToExport = [];
    const formValue = this.exportForm.value;
    if (formValue.groupName) {
      exportRequest.columnsToExport?.push("Group Name")
    }
    if (formValue.openingBalance) {
      exportRequest.columnsToExport?.push("Opening Balance")
    }
    if (formValue.taxNumber) {
      exportRequest.columnsToExport?.push("Tax Number")
    }
    if (formValue.email) {
      exportRequest.columnsToExport?.push("Email")
    }
    this.isLoading = true;
    this.ledgerService.exportData(exportRequest).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
      this.isLoading = false;
      console.log(response?.status)
      if (response?.status === "success") {
        this.toaster.showSnackBar("success", response?.body);
        this.router.navigate(['pages/downloads'])
      } else {
        this.toaster.showSnackBar("error", response?.body);
      }
    });
  }
}
