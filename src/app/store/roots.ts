import { routerReducer, RouterState } from '@ngrx/router-store';
import * as fromHome from './home/home.reducer';
import * as fromLogin from './authentication/authentication.reducer';
import * as fromCompany from './Company/company.reducer';

export interface AppState {
  router: RouterState;
  home: fromHome.HomeState;
  login: fromLogin.AuthenticationState;

  company: fromCompany.CurrentCompanyState;
}

export const reducers = {
  router: routerReducer,
  home: fromHome.homeReducer,
  company: fromCompany.CompanyReducer,
  login: fromLogin.AuthenticationReducer
};
