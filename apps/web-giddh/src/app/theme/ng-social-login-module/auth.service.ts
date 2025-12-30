import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginProvider, SocialUser } from '.';
import { LoaderService } from '../../loader/loader.service';

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
        for (let i = 0; i < providers?.length; i++) {
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

    constructor(
        config: AuthServiceConfig,
        private loadingService: LoaderService
    ) {
        this.providers = config.providers;
        if (config.autoLogin) {
            (Array.isArray(this.providers) ? this.providers : []).forEach((provider: LoginProvider, key: number) => {
                if (provider) {
                    provider.initialize().then((user: SocialUser) => {
                        user.provider = key.toString();
                        this._user = user;
                        this._authState.next(user);
                    }).catch((err) => {

                    });
                }
            });
        }
    }

    public signIn(providerId: string): Promise<SocialUser> {
        this.loadingService.show();
        return new Promise((resolve, reject) => {
            const providerObject = this.providers.get(providerId);
            if (providerObject) {
                if (providerObject.isInitialize) {
                    providerObject.signIn().then((user: SocialUser) => {
                        user.provider = providerId;
                        resolve(user);
                        this._user = user;
                        this._authState.next(user);
                        this.loadingService.hide();
                    }).catch((error) => {
                        console.error('Google login error:', error);
                        reject(error);
                        this.loadingService.hide();
                    });
                } else {
                    providerObject.initialize().then(() => {
                        let obj = this.providers.get(providerId);
                        if (obj.isInitialize) {
                            obj.signIn().then((u: SocialUser) => {
                                u.provider = providerId;
                                resolve(u);
                                this._user = u;
                                this._authState.next(u);
                                this.loadingService.hide();
                            }).catch((error) => {
                                console.error('Google login error after initialization:', error);
                                reject(error);
                                this.loadingService.hide();
                            });
                        } else {
                            reject('Google Auth initialization failed');
                            this.loadingService.hide();
                        }
                    }).catch((initError) => {
                        console.error('Google Auth initialization error:', initError);
                        reject(initError);
                        this.loadingService.hide();
                    });
                }
            } else {
                reject(AuthService.LOGIN_PROVIDER_NOT_FOUND);
                this.loadingService.hide();
            }
        });
    }

    public signOut(): Promise<void> {
        this.loadingService.show();
        return new Promise((resolve, reject) => {
            if (this._user && this._user.provider) {
                const providerId = this._user.provider;
                const providerObject = this.providers.get(providerId);
                providerObject.signOut().then(() => {
                    this._user = null;
                    this._authState.next(null);
                    resolve();
                    this.loadingService.hide();
                }).catch((err) => {
                    this._authState.next(null);
                    this.loadingService.hide();
                });
            } else {
                reject(AuthService.LOGIN_PROVIDER_NOT_FOUND);
                this.loadingService.hide();
            }
        });
    }

}
