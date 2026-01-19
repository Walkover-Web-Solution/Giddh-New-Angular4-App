import { Component, Inject, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ExportBodyRequest } from "apps/web-giddh/src/app/models/api-models/DaybookRequest";
import { LedgerService } from '../../../services/ledger.service';
import { ReplaySubject, takeUntil } from 'rxjs';
import { ToasterService } from '../../../services/toaster.service';
import { Router } from "@angular/router";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Handles Component functionality
 */
@Component({
  selector: 'app-export-inventory-master',
  
  templateUrl: './export-inventory-master.component.html',
    standalone: false,
  styleUrls: ['./export-inventory-master.component.scss']
})
/**
 * ExportInventoryMasterComponent component
 * Handles exportinventorymaster functionality and user interactions
 */
export class ExportInventoryMasterComponent implements OnInit {
  /** Hold export form group value */
  public exportForm: FormGroup;
  /** True if api call in progress */
  public isLoading: boolean = false;
  /** To destroy observers */
  public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * Creates an instance of component
   * Initializes component dependencies and sets up initial state
   */
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
    exportRequest.inventoryType = this.inputData?.inventoryType;
    const formValue = this.exportForm.value;
    /**
     * Handles if functionality
     */
    if (formValue.openingAmount) {
      exportRequest.columnsToExport?.push("Opening amount");
    }
    /**
     * Handles if functionality
     */
    if (formValue.openingQuantity) {
      exportRequest.columnsToExport.push("Opening quantity");
    }
    /**
     * Handles if functionality
     */
    if (formValue.hsnNumber) {
      exportRequest.columnsToExport?.push("HSN number");
    }
    /**
     * Handles if functionality
     */
    if (formValue.sacNumber) {
      exportRequest.columnsToExport?.push("SAC number");
    }
    /**
     * Handles if functionality
     */
    if (formValue.tax) {
      exportRequest.columnsToExport?.push("Tax");
    }
    /**
     * Handles if functionality
     */
    if (formValue.purchaseAccount) {
      exportRequest.columnsToExport?.push("Purchase account");
    }
    /**
     * Handles if functionality
     */
    if (formValue.purchaseRate) {
      exportRequest.columnsToExport?.push("Purchase rate");
    }
    /**
     * Handles if functionality
     */
    if (formValue.purchaseStockUnitCode) {
      exportRequest.columnsToExport?.push("Purchase stock unit code");
    }
    /**
     * Handles if functionality
     */
    if (formValue.salesAccount) {
      exportRequest.columnsToExport?.push("Sales account");
    }
    /**
     * Handles if functionality
     */
    if (formValue.salesRate) {
      exportRequest.columnsToExport?.push("Sales rate");
    }
    /**
     * Handles if functionality
     */
    if (formValue.salesStockUnitCode) {
      exportRequest.columnsToExport?.push("Sales stock unit code");
    }
    /**
     * Handles if functionality
     */
    if (formValue.customField1Heading) {
      exportRequest.columnsToExport?.push("Custom field 1 heading");
    }
    /**
     * Handles if functionality
     */
    if (formValue.customField1Value) {
      exportRequest.columnsToExport?.push("Custom field 1 value");
    }
    /**
     * Handles if functionality
     */
    if (formValue.customField2Heading) {
      exportRequest.columnsToExport?.push("Custom field 2 heading");
    }
    /**
     * Handles if functionality
     */
    if (formValue.customField2Value) {
      exportRequest.columnsToExport?.push("Custom field 2 value");
    }
    /**
     * Handles if functionality
     */
    if (formValue.skuCode) {
      exportRequest.columnsToExport?.push("SKU code");
    }
    this.isLoading = true;
    this.ledgerService
      .exportData(exportRequest)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((response) => {
        this.isLoading = false;
        /**
         * Handles if functionality
         */
        if (response?.status === "success") {
          this.toaster.showSnackBar("success", response?.body);
          this.router.navigate(["/pages/downloads"]);
        } else {
          this.toaster.showSnackBar("error", response?.message);
        }
      });
  }
}
