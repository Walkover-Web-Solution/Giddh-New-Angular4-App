import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';
import { SettingsIntegrationService } from '../../services/settings.integration.service';
import { CustomActions } from '../../store/custom-actions';

export const SETTINGS_INTEGRATION_ACTIONS = {
    GET_SMS_KEY: 'GET_SMS_KEY',
    GET_EMAIL_KEY: 'GET_EMAIL_KEY'
};

@Injectable()
export class SettingsIntegrationActions {

    public GetSMSKey$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_INTEGRATION_ACTIONS.GET_SMS_KEY),
            switchMap((action: CustomActions) => this.settingsIntegrationService.GetSMSKey()),
            map(res => ({ type: 'SMS_KEY_RESPONSE', payload: res }))
        ));

    constructor(
        private action$: Actions,
        private settingsIntegrationService: SettingsIntegrationService
    ) { }

    public GetSMSKey(): CustomActions {
        return {
            type: SETTINGS_INTEGRATION_ACTIONS.GET_SMS_KEY,
        };
    }
}
