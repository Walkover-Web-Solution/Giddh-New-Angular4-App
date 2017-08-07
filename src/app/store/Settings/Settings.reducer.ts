import * as _ from 'lodash';
import { Action } from '@ngrx/store';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { SETTINGS_INTEGRATION_ACTIONS } from '../../services/actions/settings/settings.integration.const';
import { SmsKeyClass, IntegrationPage, IntegrationPageClass } from '../../models/api-models/SettingsIntegraion';

export interface SettingsState {
    integration: IntegrationPage;
}

export const initialState: SettingsState = {
    integration: new IntegrationPageClass()
};

export function SettingsReducer(state = initialState, action: Action): SettingsState {
  switch (action.type) {
    case SETTINGS_INTEGRATION_ACTIONS.GET_SMS_KEY_RESPONSE:
      let newState = _.cloneDeep(state);
      let res: BaseResponse<SmsKeyClass, string> = action.payload;
      if (res.status === 'success') {
        newState.integration.smsForm = res.body;
        return Object.assign({}, state, newState);
      }
      return state;
    default: {
      return state;
    }
  }
}
