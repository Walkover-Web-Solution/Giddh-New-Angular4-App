import * as _ from 'lodash';
import { Action } from '@ngrx/store';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { SETTINGS_INTEGRATION_ACTIONS } from '../../services/actions/settings/settings.integration.const';
import { SmsKeyClass, IntegrationPage, IntegrationPageClass, EmailKeyClass } from '../../models/api-models/SettingsIntegraion';

export interface SettingsState {
<<<<<<< HEAD
  integration: IntegrationPage;
}

export const initialState: SettingsState = {
  integration: new IntegrationPageClass()
=======
    integration: IntegrationPage;
    profile: object;
}

export const initialState: SettingsState = {
    integration: new IntegrationPageClass(),
    profile: {}
>>>>>>> Setting profile midway.
};

export function SettingsReducer(state = initialState, action: Action): SettingsState {
  let newState = _.cloneDeep(state);
  switch (action.type) {
    case SETTINGS_INTEGRATION_ACTIONS.GET_SMS_KEY_RESPONSE:
      let res: BaseResponse<SmsKeyClass, string> = action.payload;
      if (res.status === 'success') {
        newState.integration.smsForm = res.body;
        return Object.assign({}, state, newState);
      }
      return state;
    case SETTINGS_INTEGRATION_ACTIONS.GET_EMAIL_KEY_RESPONSE:
      let r: BaseResponse<EmailKeyClass, string> = action.payload;
      if (r.status === 'success') {
        newState.integration.emailForm = r.body;
        return Object.assign({}, state, newState);
      }
      return state;
    default: {
      return state;
    }
  }
}
