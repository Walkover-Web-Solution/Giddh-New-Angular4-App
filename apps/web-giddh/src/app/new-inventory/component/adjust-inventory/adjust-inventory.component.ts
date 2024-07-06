import { Component, OnInit, ViewChild, ElementRef, ViewChildren, TemplateRef } from '@angular/core';
import { GeneralService } from '../../../services/general.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ShSelectComponent } from '../../../theme/ng-virtual-select/sh-select.component';
import { AdjustInventoryComponentStore } from './utility/adjust-inventory.store';
import { AppState } from '../../../store';
import { Store } from '@ngrx/store';
import { WarehouseActions } from '../../../settings/warehouse/action/warehouse.action';
import { ReplaySubject, takeUntil } from 'rxjs';
import { SettingsUtilityService } from '../../../settings/services/settings-utility.service';
@Component({
    selector: 'adjust-inventory',
    templateUrl: './adjust-inventory.component.html',
    styleUrls: ['./adjust-inventory.component.scss'],
    providers: [AdjustInventoryComponentStore]
})

export class AdjustInventroyComponent implements OnInit {
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Holds company warehouses */
    public warehouses: Array<any>;
    public  panelOpenState = false;
    public countries: any[] = [
        {
            label: 'option-1',
            value: '#',

        },
        {
            label: 'option-2',
            value: '@',

        },
        {
            label: 'option-3',
            value: '$',

        },
        {
            label: 'option-4',
            value: '&',

        },
    ];
    public method: any[] = [
        {
            label: 'Percentage',
            value: 'PERCENTAGE',

        },
        {
            label: 'Number',
            value: '#',

        },
    ];
    public displayedColumns: any[] = ['select', 'position', 'name', 'weight', 'symbol'];
    public dataSource: any[] = [
        { position: 'Red', name: 5000, weight: 500, symbol: 5500 },
        { position: 'Green', name: 5000, weight: 500, symbol: 5500 },
        { position: 'Blue', name: 5000, weight: 500, symbol: 5500 },
    ];

    constructor(
        private store: Store<AppState>,
        private warehouseActions: WarehouseActions,
        private settingsUtilityService: SettingsUtilityService,
        private componentStore: AdjustInventoryComponentStore
    ) { }
    public ngOnInit(): void {
        this.getWarehouses();
    }

/**
 * Gets company warehouses
 *
 * @private
 * @memberof VoucherCreateComponent
 */
    private getWarehouses(): void {
        this.store.dispatch(this.warehouseActions.fetchAllWarehouses({ page: 1, count: 0 }));

        this.componentStore.warehouseList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                let warehouseResults = response.results?.filter(warehouse => !warehouse.isArchived);
                const warehouseData = this.settingsUtilityService.getFormattedWarehouseData(warehouseResults);
                this.warehouses = warehouseData.formattedWarehouses;
                console.log(this.warehouses);

            }
        });
    }
}
