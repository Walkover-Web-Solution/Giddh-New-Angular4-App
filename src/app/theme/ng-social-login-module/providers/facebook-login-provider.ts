import { BaseLoginProvider } from '../entities/base-login-provider';
import { LoginProviderClass, SocialUser } from '../entities/user';

declare let FB: any;

export class FacebookLoginProvider extends BaseLoginProvider {
  public static readonly PROVIDER_ID = 'FACEBOOK';

  public static drawUser(response: any): SocialUser {
    const user: SocialUser = new SocialUser();
    user.id = response.id;
    user.name = response.name;
    user.email = response.email;
    user.token = response.token;
    user.photoUrl = 'https://graph.facebook.com/' + response.id + '/picture?type=normal';
    return user;
  }
  public isInitialize: boolean;
  public loginProviderObj: LoginProviderClass = new LoginProviderClass();

  constructor(private clientId: string) {
    super();
    this.loginProviderObj.id = clientId;
    this.loginProviderObj.name = 'FACEBOOK';
    this.loginProviderObj.url = 'https://connect.facebook.net/en_US/sdk.js';
  }

  public initialize(): Promise<SocialUser> {
    return new Promise((resolve, reject) => {
      this.loadScript(this.loginProviderObj, () => {
        FB.init({
          appId: this.clientId,
          autoLogAppEvents: true,
          cookie: true,
          xfbml: true,
          version: 'v2.9'
        });
        this.isInitialize = true;
        FB.AppEvents.logPageView();

        FB.getLoginStatus(function(response: any) {
          if (response.status === 'connected') {
            const accessToken = FB.getAuthResponse()['accessToken'];
            FB.api('/me?fields=name,email,picture', (res: any) => {
              resolve(FacebookLoginProvider.drawUser(Object.assign({}, {token: accessToken}, res)));
            });
          }
        });
      });
    });
  }

  public signIn(): Promise<SocialUser> {
    return new Promise((resolve, reject) => {
      FB.login((response: any) => {
        if (response.authResponse) {
          const accessToken = FB.getAuthResponse()['accessToken'];
          FB.api('/me?fields=name,email,picture', (res: any) => {
            resolve(FacebookLoginProvider.drawUser(Object.assign({}, {token: accessToken}, res)));
          });
        }
      }, {scope: 'email,public_profile'});
    });
  }

  public signOut(): Promise<any> {
    return new Promise((resolve, reject) => {
      FB.logout((response: any) => {
        resolve();
      });
    });
  }

}
