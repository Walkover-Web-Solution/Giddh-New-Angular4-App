import { Action } from '@ngrx/store';

export interface SettingsState {
    branches: any[];
    profile: any;
    taxes: any[];
    integrations: any;
}

const initialSettingsState: SettingsState = {
    branches: [],
    profile: null,
    taxes: [],
    integrations: null
};

export function SettingsReducer(state: SettingsState = initialSettingsState, action: Action): SettingsState {
    return state;
}
