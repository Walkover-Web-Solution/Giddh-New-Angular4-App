import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { InventoryService } from "../../../services/inventory.service";
import { takeUntil } from "rxjs/operators";
import { ReplaySubject } from "rxjs";
import { MatDialog } from "@angular/material/dialog";

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

    constructor(
        private inventoryService: InventoryService,
        private dialog: MatDialog
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

    public closeCreateUnitModal(event: any): void {
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
}