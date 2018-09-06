import { BaseLoginProvider } from '../entities/base-login-provider';
import { LoginProviderClass, SocialUser } from '../entities/user';

declare let gapi: any;

export class GoogleLoginProvider extends BaseLoginProvider {
  public static readonly PROVIDER_ID = 'GOOGLE';
  public isInitialize: boolean;
  public loginProviderObj: LoginProviderClass = new LoginProviderClass();
  private auth2: any;

  constructor(private clientId: string) {
    super();
    this.loginProviderObj.id = clientId;
    this.loginProviderObj.name = 'GOOGLE';
    this.loginProviderObj.url = 'https://apis.google.com/js/platform.js';
  }

  public initialize(): Promise<SocialUser> {
    return new Promise((resolve, reject) => {
      this.loadScript(this.loginProviderObj, () => {
        gapi.load('auth2', () => {
          this.isInitialize = true;
          this.auth2 = gapi.auth2.init({
            client_id: this.clientId,
            scope: 'email'
          });

          this.auth2.then(() => {
            if (this.auth2.isSignedIn.get()) {
              resolve(this.drawUser());
            }
          });
        });
      });
    });
  }

  public drawUser(): SocialUser {
    const user: SocialUser = new SocialUser();
    const profile = this.auth2.currentUser.get().getBasicProfile();
    const authResponseObj = this.auth2.currentUser.get().getAuthResponse(true);
    user.id = profile.getId();
    user.name = profile.getName();
    user.email = profile.getEmail();
    user.photoUrl = profile.getImageUrl();
    user.token = authResponseObj.access_token;
    return user;
  }

  public signIn(): Promise<SocialUser> {
    return new Promise((resolve, reject) => {
      const promise = this.auth2.signIn();
      promise.then(() => {
        resolve(this.drawUser());
      });
    });
  }

  public signOut(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.auth2.signOut().then((err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

}
