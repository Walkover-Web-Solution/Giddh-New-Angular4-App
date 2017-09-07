import { CustomConfig } from 'ng2-ui-auth';
import { IProviders } from 'ng2-ui-auth/config.service';
import { RequestMethod } from '@angular/http/http';
import { Observable } from 'rxjs/Observable';

export const GOOGLE_CLIENT_ID = '641015054140-3cl9c3kh18vctdjlrt9c8v0vs85dorv2.apps.googleusercontent.com';
export const TWITTER_CLIENT_ID = 'w64afk3ZflEsdFxd6jyB9wt5j';
export const LINKEDIN_CLIENT_ID = '75urm0g3386r26';

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
