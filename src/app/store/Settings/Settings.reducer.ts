import * as _ from 'lodash';
import { Action } from '@ngrx/store';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { SETTINGS_INTEGRATION_ACTIONS } from '../../services/actions/settings/settings.integration.const';
import { SmsKeyClass, IntegrationPage, IntegrationPageClass, EmailKeyClass } from '../../models/api-models/SettingsIntegraion';

export interface SettingsState {
  integration: IntegrationPage;
}

export const initialState: SettingsState = {
  integration: new IntegrationPageClass()
};

export function SettingsReducer(state = initialState, action: Action): SettingsState {
  let newState = _.cloneDeep(state);
  switch (action.type) {
    case SETTINGS_INTEGRATION_ACTIONS.GET_SMS_KEY_RESPONSE:
      let gtsmsres: BaseResponse<SmsKeyClass, string> = action.payload;
      if (gtsmsres.status === 'success') {
        newState.integration.smsForm = gtsmsres.body;
        return Object.assign({}, state, newState);
      }
      return state;
    case SETTINGS_INTEGRATION_ACTIONS.CREATE_SMS_KEY_RESPONSE:
      let crtsmsres: BaseResponse<string, SmsKeyClass> = action.payload;
      if (crtsmsres.status === 'success') {
        newState.integration.smsForm = crtsmsres.request;
        return Object.assign({}, state, newState);
      }
      return state;
    case SETTINGS_INTEGRATION_ACTIONS.GET_EMAIL_KEY_RESPONSE:
      let gtemlres: BaseResponse<EmailKeyClass, string> = action.payload;
      if (gtemlres.status === 'success') {
        newState.integration.emailForm = gtemlres.body;
        return Object.assign({}, state, newState);
      }
      return state;
    case SETTINGS_INTEGRATION_ACTIONS.CREATE_EMAIL_KEY_RESPONSE:
      let crtemlres: BaseResponse<string, EmailKeyClass> = action.payload;
      if (crtemlres.status === 'success') {
        newState.integration.emailForm = crtemlres.request;
        return Object.assign({}, state, newState);
      }
      return state;
    default: {
      return state;
    }
  }
}
