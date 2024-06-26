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
      openingBalance: new FormControl(false),
      openingBalanceType: new FormControl(false),
      foreignOpeningBalance: new FormControl(false),
      foreignOpeningBalanceType: new FormControl(false),
      currency: new FormControl(false),
      mobileNumber: new FormControl(false),
      email: new FormControl(false),
      attentionTo: new FormControl(false),
      remark: new FormControl(false),
      address: new FormControl(false),
      pinCode: new FormControl(false),
      taxNumber: new FormControl(false),
      partyType: new FormControl(false),
      bankName: new FormControl(false),
      bankAccountNumber: new FormControl(false),
      ifscCode: new FormControl(false),
      beneficiaryName: new FormControl(false),
      branchName: new FormControl(false),
      swiftCode: new FormControl(false),
    })
  }

  public exportMaster(): void {
    let exportRequest: ExportBodyRequest = new ExportBodyRequest();
    exportRequest.exportType = this.inputData?.exportType;
    exportRequest.columnsToExport = [];
    // exportRequest.groupUniqueNames = [];
    const formValue = this.exportForm.value;
    if (formValue.openingBalance) {
      exportRequest.columnsToExport?.push("Opening Balance")
    }
    if (formValue.openingBalanceType) {
      exportRequest.columnsToExport?.push("Opening Balance Type")
    }
    if (formValue.foreignOpeningBalance) {
      exportRequest.columnsToExport?.push("Foreign Opening Balance")
    }
    if (formValue.foreignOpeningBalanceType) {
      exportRequest.columnsToExport?.push("Foreign Opening Balance Type")
    }
    if (formValue.currency) {
      exportRequest.columnsToExport?.push("Currency")
    }
    if (formValue.mobileNumber) {
      exportRequest.columnsToExport?.push("Mobile Number")
    }
    if (formValue.email) {
      exportRequest.columnsToExport?.push("Email")
    }
    if (formValue.attentionTo) {
      exportRequest.columnsToExport?.push("Attention to")
    }
    if (formValue.remark) {
      exportRequest.columnsToExport?.push("Remark")
    }
    if (formValue.address) {
      exportRequest.columnsToExport?.push("Address")
    }
    if (formValue.pinCode) {
      exportRequest.columnsToExport?.push("Pin Code")
    }
    if (formValue.taxNumber) {
      exportRequest.columnsToExport?.push("Tax Number")
    }
    if (formValue.partyType) {
      exportRequest.columnsToExport?.push("Party Type")
    }
    if (formValue.bankName) {
      exportRequest.columnsToExport?.push("Bank Name")
    }
    if (formValue.bankAccountNumber) {
      exportRequest.columnsToExport?.push("Bank Account Number")
    }
    if (formValue.ifscCode) {
      exportRequest.columnsToExport?.push("IFSC Code")
    }
    if (formValue.beneficiaryName) {
      exportRequest.columnsToExport?.push("Beneficiary Name")
    }
    if (formValue.branchName) {
      exportRequest.columnsToExport?.push("Branch Name")
    }
    if (formValue.swiftCode) {
      exportRequest.columnsToExport?.push("Swift Code")
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
