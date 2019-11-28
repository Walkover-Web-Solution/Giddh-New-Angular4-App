import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from '@ngrx/effects';
import { SettingsWarehouseService } from '../../../services/settings.warehouse.service';
import { switchMap, map } from 'rxjs/operators';
import { CustomActions } from '../../../store/customActions';

@Injectable()
export class WarehouseActions {

    /** Action to create warehouse */
    public static readonly CREATE_WAREHOUSE = 'CREATE_WAREHOUSE';
    /** Action to handle warehouse response */
    public static readonly CREATE_WAREHOUSE_RESPONSE = 'CREATE_WAREHOUSE_RESPONSE';
    /** Action to get all warehouse */
    public static readonly GET_WAREHOUSE = 'GET_WAREHOUSE';
    /** Action to handle all warehouse response */
    public static readonly GET_WAREHOUSE_RESPONSE = 'GET_WAREHOUSE_RESPONSE';

    @Effect()
    private createWarehouse$ = this.action$.pipe(
        ofType(WarehouseActions.CREATE_WAREHOUSE),
        switchMap((action: CustomActions) => this.settingsWarehouseService.createWarehouse(action.payload)),
        map((response) => { console.log('Warehouse created: ', response);})
    );

    /** @ignore */
    constructor(
        private action$: Actions,
        private settingsWarehouseService: SettingsWarehouseService
    ) { }

    /**
     * Returns the action to create a warehouse
     *
     * @param {*} params Request parameters for create warehouse service
     * @returns {CustomActions} Action to create warehouse
     * @memberof WarehouseActions
     */
    createWarehouse(params: any): CustomActions {
        return { type: WarehouseActions.CREATE_WAREHOUSE, payload: params };
    }
}
