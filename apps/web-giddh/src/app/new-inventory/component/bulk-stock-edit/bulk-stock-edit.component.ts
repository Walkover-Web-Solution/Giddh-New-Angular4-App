import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ToasterService } from '../../../services/toaster.service';
import { FormArray, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from 'apps/web-giddh/src/app/store';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';
import { TitleCasePipe } from '@angular/common';
import { CompanyActions } from '../../../actions/company.actions';
import { distinctUntilChanged } from "rxjs/operators";
@Component({
    selector: 'bulk-stock',
    templateUrl: './bulk-stock-edit.component.html',
    styleUrls: ['./bulk-stock-edit.component.scss'],
    providers: [TitleCasePipe]
})
export class BulkStockEditComponent implements OnInit, OnDestroy {

    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** This will use for customise column check values */
    public customiseColumns = [];
    /** Holds Inventory Type */
    public inventoryType: string;
    /** Holds Bulk Stock List come from API*/
    public bulkStockList: any;
    /** Holds Pagination Info*/
    public pagination: any;
    /** Holds Loader status */
    public isLoading: boolean = true;
    /** Taxes list */
    public taxes: any[] = [];
    /** Holds list of selected taxes */
    private selectedTaxes: any[] = [];
     /** True if tax selection box is open */
     public isTaxSelectionOpen: boolean = false;
     /** Holds list of taxes processed while tax selection box was closed */
    public processedTaxes: any[] = [];
     /** True if we need to show tax field. We are maintaining this because taxes are not getting reset on form reset */
     public showTaxField: boolean = true;

    public dropdownData = [{
        label: 'Inventory 1',
        value: '1'
    },
    {
        label: 'Inventory 2',
        value: '2'
    },
    {
        label: 'Inventory 3',
        value: '3'
    }];
    public tableHeadInput = {
        variantName: false,
        variantUniqueName: false,
        stockName: false,
        stockUniqueName: false,
        stockGroupName: false,
        hsn: false,
        sac: false,
        skuCode: false,
        purchaseUnit: false,
        salesRate: false,
        salesUnit: false,
        fixedAssetUnits: false,
        tax: false
    };
    /** UntypedFormArray Group for group UntypedFormArray */
    public bulkStockEditForm: UntypedFormGroup;
    public hideShowForm: UntypedFormGroup;
    public dropdownValues: any[] = [];
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private changeDetection: ChangeDetectorRef,
        private toaster: ToasterService,
        private route: ActivatedRoute,
        private formBuilder: UntypedFormBuilder,
        private store: Store<AppState>,
        private inventoryAction: InventoryAction,
        private titlecasePipe: TitleCasePipe,
        private companyAction: CompanyActions,
    ) {
        this.hideShowForm = this.formBuilder.group({

                variantName: [true],
                variantUniqueName: [false],

                stockName: [true],
                stockUniqueName: [false],
                stockGroupName: [true],               
                stockGroupUniqueName: [false],
                
                purchaseUnits: [false],
                purchaseAccountName: [false],
                purchaseAccountUniqueName: [false],
                purchaseRate: [true],
                purchaseTaxInclusive: [false],
            
                salesUnits: [false],
                salesAccountName: [false],
                salesAccountUniqueName: [false],
                salesRate: [true],
                salesTaxInclusive: [false],
            
                fixedAssetTaxInclusive: [false],
                    fixedAssetRate: [true],
                fixedAssetUnits: [false],
                fixedAssetAccountName: [false],
                fixedAssetAccountUniqueName: [false],
                
                hsnNo: [true],
                sacNo: [true],
                skuCode: [false],
                archive: [true],
                taxes: [false]

        });
        this.initBuldStockForm();
    }

    public ngOnInit(): void {
        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            if (params?.type) {
                if(params.type == 'fixedassets'){
                    this.inventoryType = 'FIXED_ASSETS';
                    this.hideShowForm.controls['fixedAssetUnits'].setValue(true);
                }else{
                    this.inventoryType = params?.type.toUpperCase();
                    this.hideShowForm.controls['purchaseUnits'].setValue(true);
                    this.hideShowForm.controls['salesUnits'].setValue(true);
                }
            }
        });
        this.store.dispatch(this.inventoryAction.GetListBulkStock({
            inventoryType: this.inventoryType, page: 1, count: 100, body: {
                "search": "",
                "searchBy": "",
                "sortBy": "",
                "sort": "",
                "expression": "GREATER_THAN",
                "rate": 0
            }
        }));
        this.getTaxes();
        this.store.pipe(select(select => select.inventory.bulkStock), takeUntil(this.destroyed$)).subscribe((res: any) => {
            if (res) {
                this.isLoading = false;
                this.initBuldStockForm();
                console.log("Store select call");
                this.bulkStockList = res.results;
                // this.convertArrayToDropDownObject();
                this.setPaginationData(res);

                res.results.forEach((row, index) => {
                    this.dropdownValues[index] = [];
                    this.dropdownValues[index].salesUnits = row.salesUnits;
                    this.dropdownValues[index].purchaseUnits = row.purchaseUnits;
                    this.dropdownValues[index].fixedAssetUnits = row.fixedAssetUnits;

                    this.addRow(row);
                });
                console.log("bulkStockEditForm", this.bulkStockEditForm);
                console.log("dropdownValues", this.dropdownValues);
            }
        });
        this.customiseColumns = [
            {
                "value": "closing",
                "label": "Closing",
                "checked": true
            },
            {
                "value": "contacts",
                "label": "Contacts",
                "checked": true
            },
            {
                "value": "state",
                "label": "State",
                "checked": true
            },
            {
                "value": "gstin",
                "label": "Tax Number",
                "checked": true
            },
            {
                "value": "comment",
                "label": "Comment",
                "checked": false
            }
        ];

        setTimeout(() => {
           
            console.log("hideShowForm", this.hideShowForm);
        }, 1000)
    }

    /**
     * This will use for init main formgroup     *
     * @private
     */
    private initBuldStockForm(): void {
        this.bulkStockEditForm = this.formBuilder.group({
            fields: this.formBuilder.array([])
        });
    }

    private addNewRow(controlValue): FormGroup{
        return this.formBuilder.group({
            variantName: [ controlValue.variantName , Validators.required],
            variantUniqueName: [controlValue.variantUniqueName, Validators.required],

            stockName: [controlValue.stockName, Validators.required],
            stockUniqueName: [controlValue.stockUniqueName, Validators.required],
            stockGroupName: [controlValue.stockGroupName, Validators.required],               
            stockGroupUniqueName: [controlValue.stockGroupUniqueName, Validators.required],
            
            purchaseUnits: [controlValue.purchaseUnits, Validators.required],
            purchaseAccountName: [controlValue.purchaseAccountName, Validators.required],
            purchaseAccountUniqueName: [controlValue.purchaseAccountUniqueName, Validators.required],
            purchaseRate: [controlValue.purchaseRate, Validators.required],
            purchaseTaxInclusive: [controlValue.purchaseTaxInclusive, Validators.required],
           
            salesUnits: [controlValue.salesUnits, Validators.required],
            salesAccountName: [controlValue.salesAccountName, Validators.required],
            salesAccountUniqueName: [controlValue.salesAccountUniqueName, Validators.required],
            salesRate: [controlValue.salesRate, Validators.required],
            salesTaxInclusive: [controlValue.salesTaxInclusive, Validators.required],
           
            fixedAssetTaxInclusive: [controlValue.fixedAssetTaxInclusive, Validators.required],
            fixedAssetRate: [controlValue.fixedAssetRate, Validators.required],
            fixedAssetUnits: [controlValue.fixedAssetUnits, Validators.required],
            fixedAssetAccountName: [controlValue.fixedAssetAccountName, Validators.required],
            fixedAssetAccountUniqueName: [controlValue.fixedAssetAccountUniqueName, Validators.required],
            
            hsnNo: [controlValue.hsnNo, Validators.required],
            sacNo: [controlValue.sacNo, Validators.required],
            skuCode: [controlValue.skuCode, Validators.required],
            archive: [controlValue.archive, Validators.required],
            taxes: [controlValue.taxes, Validators.required]
        })
    }

    addRow(data){
        this.bulkStockData.push(this.addNewRow(data));
    }

    get bulkStockData(): FormArray{
        return this.bulkStockEditForm.get("fields") as FormArray
    }

    removeSkill(i:number) {
        this.bulkStockData.removeAt(i);
    }

    onFormSubmit() {
        console.log(this.bulkStockEditForm.value);
    }

    /**
    * Get select value from select field
    */
    public selectField(e): void {
        console.log("Event: ", e);
    }

    /**
    * Get select value from select field
    */
    public setPaginationData(data: any): void {
        this.pagination = {
            currentPage: data?.page,
            itemsPerPage: data?.count,
            totalPages: data?.totalPages,
            totalItems: data?.totalItems
        }
    }

    /**
    * Change text into Title case
    */
    public titleCase(text: string) {
        return this.titlecasePipe.transform(text);
    }

    /**
     * Get select value from filter checkbox
    
     */
    public showSelectedHeaderColumns(e): void {
        console.log("Event: ", e);
    }

    public saveSelectedColumns(): void {
        this.changeDetection.detectChanges();
    }
    /**
  * Get Pagination page change event
  */
    public pageChanged(e): void {
        console.log("Page Changed Event: ", e);
        this.store.dispatch(this.inventoryAction.GetListBulkStock({
            inventoryType: this.inventoryType, page: e.page, count: 100, body: {
                "search": "",
                "searchBy": "",
                "sortBy": "",
                "sort": "",
                "expression": "GREATER_THAN",
                "rate": 0
            }
        }));
        this.changeDetection.detectChanges();
    }

    public toggleInput(key): void {
        this.hideTableHeadInput();
        this.tableHeadInput[key] = !this.tableHeadInput[key];

    }

    public hideTableHeadInput(): void {
        Object.entries(this.tableHeadInput).forEach(([key]) => {
            this.tableHeadInput[key] = false;
        });
    }

    public getInputIndex(index:number, key:string):void{
        console.log(`At index - ${index} and key is '${key}'`);
    }

     /**
     * Get taxes
     *
     * @memberof BulkStockEditComponent
     */
     public getTaxes(): void {
        this.store.dispatch(this.companyAction.getTax());
        this.store.pipe(select(state => state?.company?.taxes), distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.length > 0 && !this.processedTaxes?.length) {
                this.taxes = response || [];
                console.log("Taxes: ",this.taxes);
            }
            this.changeDetection.detectChanges();
        });
    }

    

    // public convertArrayToDropDownObject(): void {
    //     this.bulkStockList.forEach((x, i) => {
    //         if (x?.taxes?.length > 0) {

    //             if (x?.taxes?.length === 1) {
    //                 this.bulkStockList[i].taxes = [{
    //                     label: this.titleCase(x?.taxes[0]),
    //                     value: x?.taxes[0]
    //                 }];
    //             } else {
    //                 let newObject = [];
    //                 x.taxes.forEach((y) => {
    //                     newObject.push({
    //                         label: this.titleCase(y),
    //                         value: y
    //                     })
    //                 })
    //                 this.bulkStockList[i].taxes = newObject;
    //             }
    //         }
    //     });

    //     console.log("bulkStockList: ", this.bulkStockList)
    // }

    /**
    * Lifcycle hook for destroy event
    */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}