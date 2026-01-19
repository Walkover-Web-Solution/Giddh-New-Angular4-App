import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginProvider, SocialUser } from '.';
import { LoaderService } from '../../loader/loader.service';

/**
 * AuthServiceConfigItem interface definition
 * Defines the structure and contract for AuthServiceConfigItem objects
 */
export interface AuthServiceConfigItem {
    id: string;
    provider: LoginProvider;
}

/**
 * AuthServiceConfig service
 * Provides authconfig related business logic and data operations
 */
export class AuthServiceConfig {
    public providers: Map<string, LoginProvider> = new Map<string, LoginProvider>();
    public autoLogin: boolean;

    /**
     * Creates an instance of service
     * Initializes component dependencies and sets up initial state
     */
    constructor(providers: AuthServiceConfigItem[], autoLogin: boolean) {
        this.autoLogin = autoLogin;
        // tslint:disable-next-line:prefer-for-of
        /**
         * Handles for functionality
         */
        for (let i = 0; i < providers?.length; i++) {
            const element = providers[i];
            this.providers.set(element.id, element.provider);
        }
    }
}

/**
 * Handles Injectable functionality
 */
@Injectable()
/**
 * AuthService service
 * Provides auth related business logic and data operations
 */
export class AuthService {

    get authState(): Observable<SocialUser> {
        return this._authState.asObservable();
    }

    private static readonly LOGIN_PROVIDER_NOT_FOUND = 'Login provider not found';

    private providers: Map<string, LoginProvider>;
    private _user: SocialUser = null;

    private _authState: BehaviorSubject<SocialUser> = new BehaviorSubject(null);

    /**
     * Creates an instance of service
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        config: AuthServiceConfig,
        private loadingService: LoaderService
    ) {
        this.providers = config.providers;
        /**
         * Handles if functionality
         */
        if (config.autoLogin) {
            (Array.isArray(this.providers) ? this.providers : []).forEach((provider: LoginProvider, key: number) => {
                /**
                 * Handles if functionality
                 */
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

    /**
     * Handles signIn functionality
     */
    public signIn(providerId: string): Promise<SocialUser> {
        this.loadingService.show();
        return new Promise((resolve, reject) => {
            const providerObject = this.providers.get(providerId);
            /**
             * Handles if functionality
             */
            if (providerObject) {
                /**
                 * Handles if functionality
                 */
                if (providerObject.isInitialize) {
                    providerObject.signIn().then((user: SocialUser) => {
                        user.provider = providerId;
                        /**
                         * Handles resolve functionality
                         */
                        resolve(user);
                        this._user = user;
                        this._authState.next(user);
                        this.loadingService.hide();
                    }).catch((error) => {

                        /**
                         * Handles reject functionality
                         */
                        reject(error);
                        this.loadingService.hide();
                    });
                } else {
                    providerObject.initialize().then(() => {
                        let obj = this.providers.get(providerId);
                        /**
                         * Handles if functionality
                         */
                        if (obj.isInitialize) {
                            obj.signIn().then((u: SocialUser) => {
                                u.provider = providerId;
                                /**
                                 * Handles resolve functionality
                                 */
                                resolve(u);
                                this._user = u;
                                this._authState.next(u);
                                this.loadingService.hide();
                            }).catch((error) => {

                                /**
                                 * Handles reject functionality
                                 */
                                reject(error);
                                this.loadingService.hide();
                            });
                        } else {
                            /**
                             * Handles reject functionality
                             */
                            reject('Google Auth initialization failed');
                            this.loadingService.hide();
                        }
                    }).catch((initError) => {

                        /**
                         * Handles reject functionality
                         */
                        reject(initError);
                        this.loadingService.hide();
                    });
                }
            } else {
                /**
                 * Handles reject functionality
                 */
                reject(AuthService.LOGIN_PROVIDER_NOT_FOUND);
                this.loadingService.hide();
            }
        });
    }

    /**
     * Handles signOut functionality
     */
    public signOut(): Promise<void> {
        this.loadingService.show();
        return new Promise((resolve, reject) => {
            /**
             * Handles if functionality
             */
            if (this._user && this._user.provider) {
                const providerId = this._user.provider;
                const providerObject = this.providers.get(providerId);
                providerObject.signOut().then(() => {
                    this._user = null;
                    this._authState.next(null);
                    /**
                     * Handles resolve functionality
                     */
                    resolve();
                    this.loadingService.hide();
                }).catch((err) => {
                    this._authState.next(null);
                    this.loadingService.hide();
                });
            } else {
                /**
                 * Handles reject functionality
                 */
                reject(AuthService.LOGIN_PROVIDER_NOT_FOUND);
                this.loadingService.hide();
            }
        });
    }

}
