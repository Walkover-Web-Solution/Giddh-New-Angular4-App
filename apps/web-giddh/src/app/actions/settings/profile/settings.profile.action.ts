import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { map, switchMap } from 'rxjs/operators';
import { SettingsProfileService } from '../../../services/settings.profile.service';
import { CustomActions } from '../../../store/custom-actions';

export const SETTINGS_PROFILE_ACTIONS = {
    GET_PROFILE_INFO: 'GET_PROFILE_INFO',
    UPDATE_PROFILE: 'UPDATE_PROFILE'
};

@Injectable()
export class SettingsProfileActions {

    public GetProfileInfo$: Observable<Action> = createEffect(() => this.action$
        .pipe(
            ofType(SETTINGS_PROFILE_ACTIONS.GET_PROFILE_INFO),
            switchMap((action: CustomActions) => this.settingsProfileService.GetProfileInfo()),
            map(res => ({ type: 'PROFILE_INFO_RESPONSE', payload: res }))
        ));

    constructor(
        private action$: Actions,
        private settingsProfileService: SettingsProfileService
    ) { }

    public GetProfileInfo(): CustomActions {
        return {
            type: SETTINGS_PROFILE_ACTIONS.GET_PROFILE_INFO,
        };
    }
}
