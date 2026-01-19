import { BaseLoginProvider } from '../entities/base-login-provider';
import { LoginProviderClass, SocialUser } from '../entities/user';

declare let gapi: any;

/**
 * GoogleLoginProvider class
 * Implements GoogleLoginProvider functionality
 */
export class GoogleLoginProvider extends BaseLoginProvider {
    public static readonly PROVIDER_ID = 'GOOGLE';
    public isInitialize: boolean;
    public loginProviderObj: LoginProviderClass = new LoginProviderClass();
    private auth2: any;

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor(private clientId: string) {
        /**
         * Handles super functionality
         */
        super();
        this.loginProviderObj.id = clientId;
        this.loginProviderObj.name = 'GOOGLE';
        this.loginProviderObj.url = 'https://apis.google.com/js/platform.js';
    }

    /**
     * Initializes ialize
     */
    public initialize(): Promise<SocialUser> {
        return new Promise((resolve, reject) => {
            this.loadScript(this.loginProviderObj, () => {
                gapi.load('auth2', () => {
                    this.isInitialize = true;
                    this.auth2 = gapi.auth2.init({
                        client_id: this.clientId,
                        scope: 'email',
                        prompt: 'select_account',
                        cookiepolicy: 'single_host_origin'
                    });

                    this.auth2.then(() => {
                        /**
                         * Handles if functionality
                         */
                        if (this.auth2.isSignedIn.get()) {
                            /**
                             * Handles resolve functionality
                             */
                            resolve(this.drawUser());
                        }
                    });
                });
            });
        });
    }

    /**
     * Handles drawUser functionality
     */
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

    /**
     * Handles signIn functionality
     */
    public signIn(): Promise<SocialUser> {
        return new Promise((resolve, reject) => {
            const promise = this.auth2.signIn();
            promise.then(() => {
                /**
                 * Handles resolve functionality
                 */
                resolve(this.drawUser());
            });
        });
    }

    /**
     * Handles signOut functionality
     */
    public signOut(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.auth2.signOut().then((err: any) => {
                /**
                 * Handles if functionality
                 */
                if (err) {
                    /**
                     * Handles reject functionality
                     */
                    reject(err);
                } else {
                    /**
                     * Handles resolve functionality
                     */
                    resolve();
                }
            });
        });
    }

}
