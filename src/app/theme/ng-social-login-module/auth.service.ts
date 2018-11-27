import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginProvider, SocialUser } from '.';

export interface AuthServiceConfigItem {
  id: string;
  provider: LoginProvider;
}

export class AuthServiceConfig {
  public providers: Map<string, LoginProvider> = new Map<string, LoginProvider>();
  public autoLogin: boolean;

  constructor(providers: AuthServiceConfigItem[], autoLogin: boolean) {
    this.autoLogin = autoLogin;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < providers.length; i++) {
      const element = providers[i];
      this.providers.set(element.id, element.provider);
    }
  }
}

@Injectable()
export class AuthService {

  get authState(): Observable<SocialUser> {
    return this._authState.asObservable();
  }

  private static readonly LOGIN_PROVIDER_NOT_FOUND = 'Login provider not found';

  private providers: Map<string, LoginProvider>;
  private _user: SocialUser = null;

  private _authState: BehaviorSubject<SocialUser> = new BehaviorSubject(null);

  constructor(config: AuthServiceConfig) {
    this.providers = config.providers;
    if (config.autoLogin) {
      this.providers.forEach((provider: LoginProvider, key: string) => {
        if (provider) {
          provider.initialize().then((user: SocialUser) => {
            user.provider = key;
            this._user = user;
            this._authState.next(user);
          }).catch((err) => {
            // this._authState.next(null);
          });
        }
      });
    }
  }

  public signIn(providerId: string): Promise<SocialUser> {
    return new Promise((resolve, reject) => {
      const providerObject = this.providers.get(providerId);
      if (providerObject) {
        if (providerObject.isInitialize) {
          providerObject.signIn().then((user: SocialUser) => {
            user.provider = providerId;
            resolve(user);
            this._user = user;
            this._authState.next(user);
          });
        } else {
          providerObject.initialize();
          setTimeout(() => {
            let obj = this.providers.get(providerId);
            if (obj.isInitialize) {
              obj.signIn().then((u: SocialUser) => {
                u.provider = providerId;
                resolve(u);
                this._user = u;
                this._authState.next(u);
              });
            } else {
              reject('something went wrong');
            }
          }, 1000);
        }
      } else {
        reject(AuthService.LOGIN_PROVIDER_NOT_FOUND);
      }
    });
  }

  public signOut(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this._user && this._user.provider) {
        const providerId = this._user.provider;
        const providerObject = this.providers.get(providerId);
        providerObject.signOut().then(() => {
          this._user = null;
          this._authState.next(null);
          resolve();
        }).catch((err) => {
          this._authState.next(null);
        });
      } else {
        reject(AuthService.LOGIN_PROVIDER_NOT_FOUND);
      }
    });
  }

}
