import { Component, Inject, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ExportBodyRequest } from "apps/web-giddh/src/app/models/api-models/DaybookRequest";
import { LedgerService } from '../../../services/ledger.service';
import { ReplaySubject, takeUntil } from 'rxjs';
import { ToasterService } from '../../../services/toaster.service';
import { Router } from "@angular/router";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-export-inventory-master',
  templateUrl: './export-inventory-master.component.html',
  styleUrls: ['./export-inventory-master.component.scss']
})
export class ExportInventoryMasterComponent implements OnInit {
  /* This will hold local JSON data */
  @Input() public localeData: any = {};
  /* This will hold common JSON data */
  @Input() public commonLocaleData: any = {};
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
    private formBuilder: FormBuilder,
  ) { }

    /**
   *  This hook will use for component initialization
   *
   * @memberof ExportInventoryMasterComponent
   */
  public ngOnInit(): void {
    this.initExportForm();
  }
  /**
   * This will use for initial export form
   *
   * @memberof ExportInventoryMasterComponent
   */
  public initExportForm(): void {
    this.exportForm = this.formBuilder.group({
        stockGroupName: new FormControl(false),
        stockName: new FormControl(false),
        uniqueName: new FormControl(false),
        parentGroupName: new FormControl(false),
        parentGroupUniqueName: new FormControl(false),
        stockUnitCode: new FormControl(false),
        openingAmount: new FormControl(false),
        openingQuantity: new FormControl(false),
        hsnNumber: new FormControl(false),
        sacNumber: new FormControl(false),
        tax: new FormControl(false),
        purchaseAccount: new FormControl(false),
        purchaseRate: new FormControl(false),
        purchaseStockUnitCode: new FormControl(false),
        salesAccount: new FormControl(false),
        salesRate: new FormControl(false),
        salesStockUnitCode: new FormControl(false),
        customField1Heading: new FormControl(false),
        customField1Value: new FormControl(false),
        customField2Heading: new FormControl(false),
        customField2Value: new FormControl(false),
        skuCode: new FormControl(false),
        columnsToExport: new FormControl(false),
    });
}


  /**
   * Exports group/stock details
   *
   * @memberof ExportInventoryMasterComponent
   */
  public exportInventory(): void {
    let exportRequest: ExportBodyRequest = new ExportBodyRequest();
    exportRequest.exportType = this.inputData?.exportType;
    exportRequest.columnsToExport = [];
    exportRequest.groupUniqueNames = this.inputData?.groupUniqueNames;
    const formValue = this.exportForm.value;
    if (formValue.stockGroupName) {
      exportRequest.columnsToExport?.push("Stock group name");
    }
    if (formValue.stockName) {
      exportRequest.columnsToExport?.push("Stock name");
    }
    if (formValue.uniqueName) {
      exportRequest.columnsToExport?.push("Unique name");
    }
    if (formValue.parentGroupName) {
      exportRequest.columnsToExport?.push("Parent group name");
    }
    if (formValue.parentGroupUniqueName) {
      exportRequest.columnsToExport?.push("Parent group unique name");
    }
    if (formValue.stockUnitCode) {
      exportRequest.columnsToExport.push("Stock unit code");
    }
    if (formValue.openingAmount) {
      exportRequest.columnsToExport?.push("Opening amount");
    }
    if (formValue.openingQuantity) {
      exportRequest.columnsToExport.push("Opening quantity");
    }
    if (formValue.hsnNumber) {
      exportRequest.columnsToExport?.push("HSN number");
    }
    if (formValue.sacNumber) {
      exportRequest.columnsToExport?.push("SAC number");
    }
    if (formValue.tax) {
      exportRequest.columnsToExport?.push("Tax");
    }
    if (formValue.purchaseAccount) {
      exportRequest.columnsToExport?.push("Purchase account");
    }
    if (formValue.purchaseRate) {
      exportRequest.columnsToExport?.push("Purchase rate");
    }
    if (formValue.purchaseStockUnitCode) {
      exportRequest.columnsToExport?.push("Purchase stock unit code");
    }
    if (formValue.salesAccount) {
      exportRequest.columnsToExport?.push("Sales account");
    }
    if (formValue.salesRate) {
      exportRequest.columnsToExport?.push("Sales rate");
    }
    if (formValue.salesStockUnitCode) {
      exportRequest.columnsToExport?.push("Sales stock unit code");
    }
    if (formValue.customField1Heading) {
      exportRequest.columnsToExport?.push("Custom field 1 heading");
    }
    if (formValue.customField1Value) {
      exportRequest.columnsToExport?.push("Custom field 1 value");
    }
    if (formValue.customField2Heading) {
      exportRequest.columnsToExport?.push("Custom field 2 heading");
    }
    if (formValue.customField2Value) {
      exportRequest.columnsToExport?.push("Custom field 2 value");
    }
    if (formValue.skuCode) {
      exportRequest.columnsToExport?.push("SKU code");
    }
    this.isLoading = true;
    this.ledgerService
      .exportData(exportRequest)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response) => {
        this.isLoading = false;
        if (response?.status === "success") {
          this.toaster.successToast(response?.body);
          this.router.navigate(["/pages/downloads"]);
        } else {
          this.toaster.errorToast(response?.message);
        }
      });
  }
}
