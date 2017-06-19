import { Ng2UiAuthModule, CustomConfig } from 'ng2-ui-auth';

export const Configuration = {
  AppUrl
};
export class AuthProviders extends CustomConfig {
  public defaultHeaders = { 'Content-Type': 'application/json' };
  public providers = {
    google: {
      clientId: '641015054140-3cl9c3kh18vctdjlrt9c8v0vs85dorv2.apps.googleusercontent.com',
      url: Configuration.AppUrl + '/auth/google'
    },
    twitter: {
      clientId: 'w64afk3ZflEsdFxd6jyB9wt5j'
    },
    linkedin: {
      clientId: '75urm0g3386r26',
      type: '2.0',
      popupOptions: {
        width: 527,
        height: 582
      }
    }
  };
}

export const APP_DEFAULT_TITLE = 'Giddh -';

export const DEFAULT_TOASTER_OPTIONS = {
  showClose: true,
  timeout: 2500
};

export const DEFAULT_SERVER_ERROR_MSG = 'Something went wrong! Please try again.';
