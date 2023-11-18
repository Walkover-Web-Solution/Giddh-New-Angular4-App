import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { PAGINATION_LIMIT } from "apps/web-giddh/src/app/app.constant";
import { InventoryService } from "apps/web-giddh/src/app/services/inventory.service";
import { ReplaySubject, takeUntil } from "rxjs";

export interface PeriodicElement {
    name: string;
    price: string;
    radio: string;
    discount: string;
    quantity: string;
    delete: string;
}

const ELEMENT_DATA: any[] = [
    { name: 'Variant', price: '1.0079', radio: 'H', discount: '', quantity: '', delete: '' },
    { name: 'Variant', price: '1.0079', radio: 'H', discount: '', quantity: '', delete: '' },
    { name: 'Variant', price: '1.0079', radio: 'H', discount: '', quantity: '', delete: '' },
    { name: 'Variant', price: '1.0079', radio: 'H', discount: '', quantity: '', delete: '' }
];

@Component({
    selector: "customer-wise",
    templateUrl: "./customer-wise.component.html",
    styleUrls: ["./customer-wise.component.scss"]
})
export class CustomerWiseComponent implements OnInit, OnDestroy {
    /** Instance of Mat Dialog for Add Inventory */
    @ViewChild("addSearchModal") public addSearchModal: TemplateRef<any>;
    /*--- table ---*/
    displayedColumns: string[] = ['name', 'price', 'radio', 'discount', 'quantity', 'delete'];
    dataSource = ELEMENT_DATA;
    dataSourceChild = ELEMENT_DATA;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Pagination limit */
    public paginationLimit: number = PAGINATION_LIMIT;
    /** Holds Mat Dailog Reference*/
    public dialogRef: MatDialogRef<any>;
    /* Observable to unsubscribe all the store listeners */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Holds Group uniques name from Params */
    private groupUniqueName: 'sundrydebtors' | 'sundrycreditors';

    constructor(
        private dialog: MatDialog,
        private inventoryService: InventoryService,
        private route: ActivatedRoute
    ) {

    }

    /**
     * Lifecycle hook for init component
     *
     * @memberof CustomerWiseComponent
     */
    public ngOnInit(): void {
        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            this.groupUniqueName =  params.type === 'customer-wise'? 'sundrydebtors' : 'sundrycreditors';            
        });
        console.log("groupUniqueName",this.groupUniqueName);
    }

    /**
     * Open Add search modal
     *
     * @memberof CustomerWiseComponent
     */
    public openSearchModal(): void {
        this.dialogRef  = this.dialog.open(this.addSearchModal, {
            width: '650px'
        });
    }

    /**
     * Lifecycle hook for destroy component
     *
     * @memberof CustomerWiseComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}