import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ToasterService } from '../../../services/toaster.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from 'apps/web-giddh/src/app/store';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';
import { TitleCasePipe } from '@angular/common';
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
    private inventoryType:string;
    /** Holds Bulk Stock List come from API*/
    public bulkStockList:any;
    /** Holds Pagination Info*/
    public pagination:any;
    public isLoading: boolean= true;

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
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private changeDetection: ChangeDetectorRef,
        private toaster: ToasterService,
        private route: ActivatedRoute,
        private formBuilder: UntypedFormBuilder,
        private store: Store<AppState>,
        private inventoryAction: InventoryAction,
        private titlecasePipe: TitleCasePipe
    ) { }

    public ngOnInit(): void {
        this.changeDetection.detectChanges();
        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            if (params?.type) {
                this.inventoryType = params.type == 'fixedassets' ? 'FIXED_ASSETS' :  params?.type.toUpperCase();
                this.initBuldStockForm();
            }
        });
        this.store.dispatch(this.inventoryAction.GetListBulkStock({ inventoryType: this.inventoryType, page: 1 , count: 100}));
        this.store.pipe(select(select => select.inventory.bulkStock), takeUntil(this.destroyed$)).subscribe((res: any) => {
            if(res){
                this.isLoading = false
                console.log("Res: ", res);
                this.bulkStockList = res.results;
                this.convertArrayToDropDownObject();
                this.setPaginationData(res)
            }
        });

    //    setTimeout(()=>{

    //    },1000)

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
    }

    /**
     * This will use for init main formgroup     *
     * @private
     */
    private initBuldStockForm(): void {
        this.bulkStockEditForm = this.formBuilder.group({
            dateOfSupply: ['', Validators.required],
            challanNo: [null],
            uniqueName: [null],
            note: [''],
        });
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
    public setPaginationData(data:any): void {
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
    public titleCase(text:string){
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

    public convertArrayToDropDownObject(): void{
        this.bulkStockList.forEach( (x,i) => {
            if(x?.taxes.length > 0){                       

                if(x?.taxes.length === 1){
                    this.bulkStockList[i].taxes = [{
                        label: this.titleCase(x?.taxes[0]),
                        value: x?.taxes[0]
                    }];
                }else{
                    let newObject = [];
                    x.taxes.forEach( (y) => {
                        newObject.push({
                            label: this.titleCase(y),
                            value: y
                        })
                    })
                    this.bulkStockList[i].taxes = newObject;
                }
            }
        });

        console.log("bulkStockList: ",this.bulkStockList)
    }

    /**
    * Lifcycle hook for destroy event
    */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
