import { BaseLoginProvider } from '../entities/base-login-provider';
import { LoginProviderClass, SocialUser } from '../entities/user';

declare let gapi: any;
declare let google: any;

export class GoogleLoginProvider extends BaseLoginProvider {
    public static readonly PROVIDER_ID = 'GOOGLE';
    public isInitialize: boolean;
    public loginProviderObj: LoginProviderClass = new LoginProviderClass();
    private auth2: any;

    constructor(private clientId: string) {
        super();
        this.loginProviderObj.id = clientId;
        this.loginProviderObj.name = 'GOOGLE';
        this.loginProviderObj.url = 'https://accounts.google.com/gsi/client';
    }

    public initialize(): Promise<SocialUser> {
        return new Promise((resolve, reject) => {
            this.loadScript(this.loginProviderObj, () => {
                try {
                    // Initialize Google Identity Services
                    if (typeof google !== 'undefined' && google.accounts) {
                        this.isInitialize = true;
                        resolve(null); // GSI doesn't need pre-authentication
                    } else {
                        // Fallback to gapi.auth2
                        gapi.load('auth2', () => {
                            try {
                                this.auth2 = gapi.auth2.getAuthInstance();

                                if (!this.auth2) {
                                    this.auth2 = gapi.auth2.init({
                                        client_id: this.clientId,
                                        scope: 'email profile'
                                    });
                                }

                                this.auth2.then(() => {
                                    this.isInitialize = true;
                                    if (this.auth2.isSignedIn.get()) {
                                        resolve(this.drawUser());
                                    } else {
                                        resolve(null);
                                    }
                                }).catch((initError: any) => {
                                    console.error('Google OAuth initialization error:', initError);
                                    reject(initError);
                                });
                            } catch (error) {
                                console.error('Google OAuth setup error:', error);
                                reject(error);
                            }
                        });
                    }
                } catch (error) {
                    console.error('Google initialization error:', error);
                    reject(error);
                }
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
            try {
                // Try Google Identity Services first
                if (typeof google !== 'undefined' && google.accounts && google.accounts.oauth2) {
                    const client = google.accounts.oauth2.initTokenClient({
                        client_id: this.clientId,
                        scope: 'email profile',
                        callback: (response: any) => {
                            if (response.error) {
                                console.error('GSI Error:', response.error);
                                reject(new Error(`Google authentication failed: ${response.error}`));
                                return;
                            }
                            // For GSI, we need to get user info separately
                            this.getUserInfoFromToken(response.access_token).then(resolve).catch(reject);
                        }
                    });

                    client.requestAccessToken();

                } else if (this.auth2) {

                    this.auth2.signIn({
                        prompt: 'select_account'
                    }).then((googleUser: any) => {
                        resolve(this.drawUser());
                    }).catch((error: any) => {
                        console.error('Google OAuth Error:', error);
                        let errorMessage = 'Google authentication failed';
                        if (error.error) {
                            errorMessage += ` (${error.error})`;
                        }
                        const enhancedError = new Error(errorMessage);
                        (enhancedError as any).originalError = error;
                        reject(enhancedError);
                    });

                } else {
                    reject(new Error('Google OAuth not initialized'));
                }

            } catch (error) {
                console.error('Exception during Google sign-in:', error);
                reject(error);
            }
        });
    }

    private async getUserInfoFromToken(accessToken: string): Promise<SocialUser> {
        try {
            const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`);
            const userInfo = await response.json();
            const user: SocialUser = new SocialUser();
            user.id = userInfo.id;
            user.name = userInfo.name;
            user.email = userInfo.email;
            user.photoUrl = userInfo.picture;
            user.token = accessToken;
            return user;
        } catch (error) {
            throw new Error('Failed to get user info from Google');
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
