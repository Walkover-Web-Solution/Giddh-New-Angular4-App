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
    /** Instance of create unit group component */
    @ViewChild("createUnitGroup", { static: false }) public createUnitGroup: any;
    /** Holds unit groups */
    public unitGroups: any[] = [];
    /** Holds unit mappings */
    public unitMappings: any[] = [];
    /** Modal instance */
    public matDialogRef: any;
    /** Holds unit details */
    public unitDetails: any = {};
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** True if get all unit groups api call in progress */
    public isGroupListLoading: boolean = false;
    /** True if get all units api call in progress */
    public isUnitListLoading: boolean = false;
    /** Holds if edit form has data loaded */
    public hasEditFormLoaded: boolean = false;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Holds selected group data */
    public selectedGroup: any = {};
    /** Holds selected unit index */
    public selectedUnitIndex: number = null;
    /** Holds selected unit group index */
    public selectedUnitGroupIndex: number = null;
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
        this.getUnitGroups();
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
     * Get list of unit groups
     *
     * @memberof CustomUnitsComponent
     */
    public getUnitGroups(resetSelectedGroup: boolean = true, reloadUnitMappings: boolean = true): void {
        this.unitGroups = [];
        if (resetSelectedGroup) {
            this.selectedGroup = {};
            this.selectedUnitGroupIndex = 0;
        }
        this.isGroupListLoading = true;
        this.inventoryService.getStockUnitGroups().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response?.body?.length) {
                this.unitGroups = response.body;
                if (resetSelectedGroup) {
                    this.selectedGroup = this.unitGroups[0];
                }
                if (reloadUnitMappings) {
                    this.getUnitMappings();
                }
            }
            this.isGroupListLoading = false;
        });
    }

    /**
     * Get list of unit mappings
     *
     * @memberof CustomUnitsComponent
     */
    public getUnitMappings(): void {
        this.selectedUnitIndex = null;
        this.unitDetails = {};
        this.unitMappings = [];
        this.isUnitListLoading = true;
        this.inventoryService.getStockMappedUnit([this.selectedGroup?.uniqueName]).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response?.body?.length) {
                this.unitMappings = response.body;
            }
            this.isUnitListLoading = false;
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
        this.selectedUnitIndex = null;

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

    /**
     * Opens create unit modal
     *
     * @memberof CustomUnitsComponent
     */
    public openCreateUnitGroupModal(): void {
        this.matDialogRef = this.dialog.open(this.createUnitGroup, {
            width: '760px',
            position: {
                right: '0',
                top: '14px'
            }
        });
    }

    /**
     * Closes create unit modal
     *
     * @param {*} event
     * @memberof CustomUnitsComponent
     */
    public closeCreateUnitGroupModal(event: any): void {
        this.matDialogRef?.close();

        if (event) {
            this.getUnitGroups();
        }
    }

    /**
     * Closes update unit group form
     *
     * @param {*} event
     * @memberof CustomUnitsComponent
     */
    public closeUpdateUnitGroup(event: any): void {
        if (event?.action) {
            if (event?.action === "delete") {
                this.getUnitGroups();
            } else {
                let reloadUnitMappings = this.selectedGroup?.uniqueName !== event?.data?.uniqueName;
                this.selectedGroup = event?.data;
                this.getUnitGroups(false, reloadUnitMappings);
            }
        }
    }

    /**
     * Track by function
     *
     * @param {number} index
     * @param {*} item
     * @returns {void}
     * @memberof CustomUnitsComponent
     */
    public trackByGroup(index: number, item: any): void {
        return item?.uniqueName;
    }
}