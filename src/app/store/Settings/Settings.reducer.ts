import * as _ from 'lodash';
import { Action } from '@ngrx/store';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { SETTINGS_INTEGRATION_ACTIONS } from '../../services/actions/settings/settings.integration.const';
import { SmsKeyClass, IntegrationPage, IntegrationPageClass, EmailKeyClass, RazorPayDetailsResponse, RazorPayClass } from '../../models/api-models/SettingsIntegraion';

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
    case SETTINGS_INTEGRATION_ACTIONS.GET_RAZOR_PAY_DETAILS_RESPONSE:
      let getRzrPayRes: BaseResponse<RazorPayDetailsResponse, string> = action.payload;
      if (getRzrPayRes.status === 'success') {
        newState.integration.razorPayForm = getRzrPayRes.body;
        return Object.assign({}, state, newState);
      }
      return state;
    case SETTINGS_INTEGRATION_ACTIONS.SAVE_RAZOR_PAY_DETAILS_RESPONSE:
    case SETTINGS_INTEGRATION_ACTIONS.UPDATE_RAZOR_PAY_DETAILS_RESPONSE:
      let svRzrPayRes: BaseResponse<RazorPayDetailsResponse, RazorPayClass> = action.payload;
      if (svRzrPayRes.status === 'success') {
        newState.integration.razorPayForm = svRzrPayRes.body;
        return Object.assign({}, state, newState);
      }
      return state;
    case SETTINGS_INTEGRATION_ACTIONS.DELETE_RAZOR_PAY_DETAILS_RESPONSE:
      let dltRzrPayRes: BaseResponse<string, string> = action.payload;
      if (dltRzrPayRes.status === 'success') {
        newState.integration.razorPayForm = null;
        return Object.assign({}, state, newState);
      }
      return state;
    default: {
      return state;
    }
  }
}
