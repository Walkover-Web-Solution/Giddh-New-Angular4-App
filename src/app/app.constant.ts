import { Ng2UiAuthModule, CustomConfig } from 'ng2-ui-auth';

export const Configuration = {
  AppUrl,
  ApiUrl,
  isElectron,
  OtpToken: '73k6G_GDzvhy4XE33EQCaKUnC0PHwEZBvf0qsZ3Q9S3ZBcXH-f_6JT_4fH-Qx1Y5LxIIwzqy7cFQVMoyUSXBfLL5WBX6oQWifweWIQlJQ8YkRZ1lAmu3oqwvNJXP1Y5ZTXDHO1IV5-Q63zwNbzxTFw=='
};
export class AuthProviders extends CustomConfig {
  public defaultHeaders = { 'Content-Type': 'application/json' };
  public providers = {
    google: {
      clientId: '641015054140-3cl9c3kh18vctdjlrt9c8v0vs85dorv2.apps.googleusercontent.com',
      url: Configuration.AppUrl
    },
    twitter: {
      clientId: 'w64afk3ZflEsdFxd6jyB9wt5j'
    },
    linkedin: {
      clientId: '75urm0g3386r26',
    }
  };
}

export const APP_DEFAULT_TITLE = 'Giddh -';

export const DEFAULT_TOASTER_OPTIONS = {
  closeButton: true, // show close button
  timeOut: 5000, // time to live
  enableHtml: false, // allow html in message. (UNSAFE)
  extendedTimeOut: 1000, // time to close after a user hovers over toast
  progressBar: true, // show progress bar
  toastClass: 'toast', // class on toast
  positionClass: 'toast-top-right', // class on toast
  titleClass: 'toast-title', // class inside toast on title
  messageClass: 'toast-message', // class inside toast on message
  tapToDismiss: true, // close on click
  onActivateTick: false
};

export const DEFAULT_SERVER_ERROR_MSG = 'Something went wrong! Please try again.';
