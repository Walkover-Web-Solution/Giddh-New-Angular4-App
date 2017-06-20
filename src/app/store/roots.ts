import { routerReducer, RouterState } from '@ngrx/router-store';
import * as fromHome from './home/home.reducer';
import * as fromLogin from './authentication/authentication.reducer';

export interface AppState {
  router: RouterState;
  home: fromHome.HomeState;
  login: fromLogin.AuthenticationState;
}

export const reducers = {
  router: routerReducer,
  home: fromHome.homeReducer,
  login: fromLogin.AuthenticationReducer
};
