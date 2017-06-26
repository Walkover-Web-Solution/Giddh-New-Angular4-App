import * as fromVerifyMobileReducer from './authentication/verifyMobile.reducer';
import { routerReducer, RouterState } from '@ngrx/router-store';
import * as fromHome from './home/home.reducer';
import * as fromLogin from './authentication/authentication.reducer';
import * as fromCompany from './Company/company.reducer';
import * as fromGroupAndAccounts from './GroupWithAccounts/groupwithaccounts.reducer';

export interface AppState {
  router: RouterState;
  home: fromHome.HomeState;
  login: fromLogin.AuthenticationState;
  session: fromLogin.SessionState;

  company: fromCompany.CurrentCompanyState;
  groupwithaccounts: fromGroupAndAccounts.CurrentGroupAndAccountState;
  verifyMobile: fromVerifyMobileReducer.VerifyMobileState;
}

export const reducers = {
  router: routerReducer,
  home: fromHome.homeReducer,
  company: fromCompany.CompanyReducer,
  login: fromLogin.AuthenticationReducer,
  session: fromLogin.SessionReducer,
  groupwithaccounts: fromGroupAndAccounts.GroupsWithAccountsReducer,
  verifyMobile: fromVerifyMobileReducer.VerifyMobileReducer
};
