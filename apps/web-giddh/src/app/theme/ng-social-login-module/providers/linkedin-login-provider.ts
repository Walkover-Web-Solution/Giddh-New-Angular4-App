import { BaseLoginProvider } from '../entities/base-login-provider';
import { LinkedInResponse, LoginProviderClass, SocialUser } from '../entities/user';

declare let IN: any;

export class LinkedinLoginProvider extends BaseLoginProvider {
  public static readonly PROVIDER_ID = 'LINKEDIN';
  public isInitialize: boolean;
  public loginProviderObj: LoginProviderClass = new LoginProviderClass();

  constructor(private clientId: string) {
    super();
    this.loginProviderObj.id = clientId;
    this.loginProviderObj.name = 'LINKEDIN';
    this.loginProviderObj.url = 'https://platform.linkedin.com/in.js';
  }

  public initialize(): Promise<SocialUser> {
    return new Promise((resolve, reject) => {
      this.loadScript(this.loginProviderObj, () => {
        IN.init({
          api_key: this.clientId,
          authorize: true,
          onLoad: this.onLinkedInLoad()
        });
        this.isInitialize = true;
        IN.Event.on(IN, 'auth', () => {
          if (IN.User.isAuthorized()) {
            IN.API.Raw(
              '/people/~:(id,first-name,last-name,email-address,picture-url)'
            ).result((res: LinkedInResponse) => {
              resolve(this.drawUser(res));
            });
          }
        });

      });
    });
  }

  public onLinkedInLoad() {
    IN.Event.on(IN, 'systemReady', () => {
      IN.User.refresh();
    });
  }

  public drawUser(response: LinkedInResponse): SocialUser {
    const user: SocialUser = new SocialUser();
    user.id = response.emailAddress;
    user.name = response.firstName + ' ' + response.lastName;
    user.email = response.emailAddress;
    user.photoUrl = response.pictureUrl;
    user.token = IN.ENV.auth.oauth_token;
    return user;
  }

  public signIn(): Promise<SocialUser> {
    return new Promise((resolve, reject) => {
      IN.User.authorize(() => {
        IN.API.Raw('/people/~:(id,first-name,last-name,email-address,picture-url)').result((res: LinkedInResponse) => {
          resolve(this.drawUser(res));
        });
      });
    });
  }

  public signOut(): Promise<any> {
    return new Promise((resolve, reject) => {
      IN.User.logout((response: any) => {
        resolve();
      }, (err: any) => {
        reject(err);
      });
    });
  }

}
