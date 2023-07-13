import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { InventoryService } from "../../../services/inventory.service";
import { takeUntil } from "rxjs/operators";
import { ReplaySubject } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { ToasterService } from "../../../services/toaster.service";

@Component({
    selector: "custom-units",
    templateUrl: "./custom-units.component.html",
    styleUrls: ["./custom-units.component.scss"]
})
export class CustomUnitsComponent implements OnInit, OnDestroy {
    /** Instance of create unit component */
    @ViewChild("createUnit", { static: false }) public createUnit: any;
    /** Holds unit mappings */
    public unitMappings: any[] = [];
    /** Modal instance */
    public matDialogRef: any;
    /** Holds unit details */
    public unitDetails: any = {};
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** Holds if edit form has data loaded */
    public hasEditFormLoaded: boolean = false;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /* Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private inventoryService: InventoryService,
        private dialog: MatDialog,
        private toaster: ToasterService
    ) {

    }

    /**
     * Lifecycle hook for init component
     *
     * @memberof CustomUnitsComponent
     */
    public ngOnInit(): void {
        document.querySelector('body').classList.add('custom-units');
        this.getUnitMappings();
    }

    /**
     * Lifecycle hook for destroy component
     *
     * @memberof CustomUnitsComponent
     */
    public ngOnDestroy(): void {
        document.querySelector('body').classList.remove('custom-units');
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Opens create unit modal
     *
     * @memberof CustomUnitsComponent
     */
    public openCreateUnitModal(): void {
        this.matDialogRef = this.dialog.open(this.createUnit, {
            width: '1000px',
            position: {
                right: '0',
                top: '14px'
            }
        });
    }

    /**
     * Closes create unit modal
     *
     * @param {boolean} event
     * @memberof CustomUnitsComponent
     */
    public closeCreateUnitModal(event: boolean): void {
        this.matDialogRef?.close();

        if (event) {
            this.getUnitMappings();
        }
    }

    /**
     * Get list of unit mappings
     *
     * @memberof CustomUnitsComponent
     */
    public getUnitMappings(): void {
        this.unitMappings = [];
        this.inventoryService.getStockMappedUnit().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response?.body?.length) {
                this.unitMappings = response.body;
            }
        });
    }

    /**
     * Get unit details to edit unit
     *
     * @param {string} uniqueName
     * @memberof CustomUnitsComponent
     */
    public editUnit(uniqueName: string): void {
        this.unitDetails = {};
        this.isLoading = true;

        this.inventoryService.getStockMappedUnitByUniqueName(uniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                this.unitDetails = response.body;
            } else {
                this.toaster.showSnackBar("error", response?.message);
            }
            this.isLoading = false;
        });
    }

    /**
     * Closes update unit form
     *
     * @param {boolean} event
     * @memberof CustomUnitsComponent
     */
    public closeUpdateUnit(event: boolean): void {
        this.unitDetails = {};

        if (event) {
            this.getUnitMappings();
        }
    }

    /**
     * Callback to handle if form has loaded
     *
     * @memberof CustomUnitsComponent
     */
    public formHasLoaded(): void {
        this.hasEditFormLoaded = true;
    }
}