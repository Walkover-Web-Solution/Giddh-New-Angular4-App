import { Action } from '@ngrx/store';
import { SearchResponse } from '../../models/api-models/Search';
import { SearchActions } from '../../services/actions/search.actions';

export interface SearchState {
  value?: SearchResponse;
}

export const initialState: SearchState = {};

export function searchReducer(state = initialState, action: Action): SearchState {
  switch (action.type) {

    case SearchActions.SEARCH_RESPONSE: {
      return Object.assign({}, state, {
        value: action.payload
      });
    }
    default: {
      return state;
    }
  }
}
