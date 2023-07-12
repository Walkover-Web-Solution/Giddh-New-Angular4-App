import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { InventoryService } from "../../../services/inventory.service";
import { takeUntil } from "rxjs/operators";
import { ReplaySubject } from "rxjs";

@Component({
    selector: "custom-units",
    templateUrl: "./custom-units.component.html",
    styleUrls: ["./custom-units.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomUnitsComponent implements OnInit, OnDestroy {
    public asideCreateUnitMenuState: string = 'out';
    public asideCreateGroupMenuState: string = 'out';
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public unitMappings: any[] = [];

    constructor(
        private inventoryService: InventoryService,
        private changeDetectionRef: ChangeDetectorRef
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

    /* Create unit aside pane open function */
    public createUnitToggleAsidePane(): void {
        this.asideCreateUnitMenuState = this.asideCreateUnitMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    /* Create unit aside pane open function */
    // public createGroupToggleAsidePane(): void {
    //     this.asideCreateGroupMenuState = this.asideCreateGroupMenuState === 'out' ? 'in' : 'out';
    //     this.toggleBodyClass();
    // }

    /* Aside pane toggle fixed class */
    public toggleBodyClass(): void {
        if (this.asideCreateUnitMenuState === 'in' || this.asideCreateGroupMenuState === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }

    public getUnitMappings(): void {
        this.unitMappings = [];
        this.inventoryService.getStockMappedUnit().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response?.body?.length) {
                this.unitMappings = response.body;
            }

            this.changeDetectionRef.detectChanges();
        });
    }
}