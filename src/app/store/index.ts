/*
 * Reducers: this file contains boilerplate code to handle debugging
 * in development mode, as well as integrate the store with HMR.
 * Customize your own reducers in `root.ts`.
 */
import { compose } from '@ngrx/core/compose';
import { ActionReducer, combineReducers } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { storeLogger } from 'ngrx-store-logger';
import { reducers, AppState } from './roots';
import { localStorageSync } from 'ngrx-store-localstorage';
export { reducers, AppState } from './roots';

declare const ENV: string;

// Generate a reducer to set the root state in dev mode for HMR
function stateSetter(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action) => {
    if (action.type === 'SET_ROOT_STATE') {
      return action.payload;
    }
    return reducer(state, action);
  };
}

const DEV_REDUCERS = [stateSetter, storeFreeze, storeLogger()];

const developmentReducer: any = compose(...DEV_REDUCERS, localStorageSync({ keys: ['session'], rehydrate: true }), combineReducers)(reducers);
const productionReducer = compose(localStorageSync({ keys: ['session'], rehydrate: true }), combineReducers)(reducers);

export function rootReducer(state: any, action: any) {
  if (ENV !== 'development') {
    return productionReducer(state, action);
  } else {
    return developmentReducer(state, action);
  }
}
