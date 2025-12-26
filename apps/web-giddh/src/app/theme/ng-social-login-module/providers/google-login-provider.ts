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
            // Check if already initialized
            if (this.isInitialize && this.auth2) {
                if (this.auth2.isSignedIn.get()) {
                    resolve(this.drawUser());
                } else {
                    resolve(null);
                }
                return;
            }

            // Enhanced script loading for Electron
            this.loadScript(this.loginProviderObj, () => {
                // Add a small delay to ensure script is fully loaded
                setTimeout(() => {
                    if (typeof gapi === 'undefined') {
                        console.error('Google API script failed to load');
                        reject(new Error('Google API script failed to load. Please check your internet connection.'));
                        return;
                    }

                    try {
                        gapi.load('auth2', () => {
                            try {
                                this.isInitialize = true;
                                this.auth2 = gapi.auth2.init({
                                    client_id: this.clientId,
                                    scope: 'email profile',
                                    prompt: 'select_account',
                                    ux_mode: 'popup'
                                });

                                this.auth2.then(() => {
                                    console.log('Google Auth2 initialized successfully');
                                    if (this.auth2.isSignedIn.get()) {
                                        resolve(this.drawUser());
                                    } else {
                                        resolve(null);
                                    }
                                }).catch((initError: any) => {
                                    console.error('Google Auth2 initialization error:', initError);
                                    reject(new Error('Google Auth2 initialization failed: ' + initError.message));
                                });
                            } catch (authInitError) {
                                console.error('Error initializing Google Auth2:', authInitError);
                                reject(new Error('Failed to initialize Google Auth2: ' + authInitError.message));
                            }
                        }, (loadError: any) => {
                            console.error('Error loading Google Auth2 module:', loadError);
                            reject(new Error('Failed to load Google Auth2 module'));
                        });
                    } catch (gapiError) {
                        console.error('Error accessing Google API:', gapiError);
                        reject(new Error('Google API access error: ' + gapiError.message));
                    }
                }, 100);
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
            // Check if auth2 is initialized
            if (!this.auth2 || !this.isInitialize) {
                console.log('Google Auth2 not initialized, attempting to initialize...');
                this.initialize().then(() => {
                    // Retry sign in after initialization
                    this.performSignIn(resolve, reject);
                }).catch((initError) => {
                    console.error('Failed to initialize Google Auth2:', initError);
                    reject(new Error('Google Auth2 initialization failed. Please try again.'));
                });
                return;
            }

            this.performSignIn(resolve, reject);
        });
    }

    private performSignIn(resolve: Function, reject: Function): void {
        try {
            if (!this.auth2) {
                reject(new Error('Google Auth2 not available'));
                return;
            }

            const signInOptions = {
                prompt: 'select_account'
            };

            const promise = this.auth2.signIn(signInOptions);
            promise.then(() => {
                console.log('Google sign-in successful');
                resolve(this.drawUser());
            }).catch((error: any) => {
                console.error('Google sign-in error:', error);
                if (error.error === 'popup_closed_by_user') {
                    reject(new Error('Sign-in was cancelled by user'));
                } else if (error.error === 'access_denied') {
                    reject(new Error('Access denied by user'));
                } else {
                    reject(new Error('Google sign-in failed: ' + (error.error || error.message || 'Unknown error')));
                }
            });
        } catch (error) {
            console.error('Exception during Google sign-in:', error);
            reject(new Error('Google sign-in exception: ' + error.message));
        }
    }

    public signOut(): Promise<void> {
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
