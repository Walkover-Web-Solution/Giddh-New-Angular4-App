import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';
import { SettingsTaxesService } from '../../../services/settings.taxes.service';
import { CustomActions } from '../../../store/custom-actions';

export const SETTINGS_TAXES_ACTIONS = {
    CREATE_TAX: 'CREATE_TAX',
    UPDATE_TAX: 'UPDATE_TAX'
};

@Injectable()
export class SettingsTaxesActions {

    public CreateTax$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_TAXES_ACTIONS.CREATE_TAX),
            switchMap((action: CustomActions) => this.settingsTaxesService.CreateTax(action.payload)),
            map(res => ({ type: 'CREATE_TAX_RESPONSE', payload: res }))
        ));

    constructor(
        private action$: Actions,
        private settingsTaxesService: SettingsTaxesService
    ) { }

    public CreateTax(payload: any): CustomActions {
        return {
            type: SETTINGS_TAXES_ACTIONS.CREATE_TAX,
            payload
        };
    }
}
