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
    @ViewChild("createUnit", { static: false }) public createUnit: any;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public unitMappings: any[] = [];
    public matDialogRef: any;
    public unitDetails: any = {};
    public isLoading: boolean = false;

    constructor(
        private inventoryService: InventoryService,
        private dialog: MatDialog,
        private toaster: ToasterService
    ) {

    }

    public ngOnInit(): void {
        document.querySelector('body').classList.add('custom-units');

        this.getUnitMappings();
    }

    public ngOnDestroy(): void {
        document.querySelector('body').classList.remove('custom-units');
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public openCreateUnitModal(): void {
        this.matDialogRef = this.dialog.open(this.createUnit, {
            width: '1000px',
            position: {
                right: '0',
                top: '14px'
            }
        });
    }

    public closeCreateUnitModal(event: boolean): void {
        this.matDialogRef?.close();

        if (event) {
            this.getUnitMappings();
        }
    }

    public getUnitMappings(): void {
        this.unitMappings = [];
        this.inventoryService.getStockMappedUnit().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response?.body?.length) {
                this.unitMappings = response.body;
            }
        });
    }

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

    public closeUpdateUnit(event: boolean): void {
        this.unitDetails = {};
        
        if (event) {
            this.getUnitMappings();
        }
    }
}