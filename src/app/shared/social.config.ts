import { CustomConfig } from 'ng2-ui-auth';
import { IProviders } from 'ng2-ui-auth/config.service';
import { RequestMethod } from '@angular/http/http';
import { Observable } from 'rxjs/Observable';

export const GOOGLE_CLIENT_ID = '641015054140-3cl9c3kh18vctdjlrt9c8v0vs85dorv2.apps.googleusercontent.com';
export const GOOGLE_SECRET_KEY = 'eWzLFEb_T9VrzFjgE40Bz6_l';
export const TWITTER_CLIENT_ID = 'w64afk3ZflEsdFxd6jyB9wt5j';
export const TWITTER_SECRET_KEY = '62GfvL1A6FcSEJBPnw59pjVklVI4QqkvmA1uDEttNLbUl2ZRpy';
export const LINKEDIN_CLIENT_ID = '75urm0g3386r26';
export const LINKEDIN_SECRET_KEY = '3AJTvaKNOEG4ISJ0';

export const GoogleLoginElectronConfig = {
  clientId: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_SECRET_KEY,
  authorizationUrl: 'https://accounts.google.com/o/oauth2/auth',
  tokenUrl: 'https://accounts.google.com/o/oauth2/token',
  useBasicAuthorizationHeader: false,
  redirectUri: 'http://localhost'
};

export const AdditionalGoogleLoginParams = {
  scope: ['email']
};

export const AdditionalLinkedinLoginParams = {
  scope: ['r_emailaddress'],
  state: 'STATE',
  type: '2.0'
};

export const LinkedinLoginElectronConfig = {
  clientId: LINKEDIN_CLIENT_ID,
  clientSecret: LINKEDIN_SECRET_KEY,
  authorizationUrl: 'https://www.linkedin.com/uas/oauth2/authorization',
  tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
  useBasicAuthorizationHeader: false,
  redirectUri: 'http://test.giddh.com/login' || 'http://localhost'
};

export class MyAuthConfig extends CustomConfig {
  public defaultHeaders = { 'Content-Type': 'application/json' };
  public providers: IProviders = {
    google: {
      clientId: GOOGLE_CLIENT_ID, exchangeForToken: (options: { code?: string, state?: string }, userData?: any) => {
        return null;
      }
    },
    twitter: {
      clientId: TWITTER_CLIENT_ID, exchangeForToken: (options: { code?: string, state?: string }, userData?: any) => {
        return null;
      }
    },
    linkedin: {
      clientId: LINKEDIN_CLIENT_ID,
      exchangeForToken: (options: { code?: string, state?: string }, userData?: any) => {
        return null;
      },
      redirectUri: 'http://test.giddh.com' + '/login/'
    }
  };
}
