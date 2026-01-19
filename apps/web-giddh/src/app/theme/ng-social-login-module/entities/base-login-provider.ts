import { LoginProvider } from './login-provider';
import { LoginProviderClass, SocialUser } from './user';

/**
 * BaseLoginProvider class
 * Implements BaseLoginProvider functionality
 */
export abstract class BaseLoginProvider implements LoginProvider {
    public abstract isInitialize: boolean;

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor() {
        //
    }

    public abstract initialize(): Promise<SocialUser>;

    public abstract signIn(): Promise<SocialUser>;

    public abstract signOut(): Promise<any>;

    /**
     * Loads script data
     */
    public loadScript(obj: LoginProviderClass, onload: any): void {
        /**
         * Handles if functionality
         */
        if (document.getElementById(obj.name)) {
            return;
        }
        const signInJS = document.createElement('script');
        signInJS.async = true;
        signInJS.src = obj.url;
        signInJS.onload = onload;
        /**
         * Handles if functionality
         */
        if (obj.name === 'LINKEDIN') {
            signInJS.async = false;
            signInJS.text = ('api_key: ' + obj.id)?.replace('\'', '');
        }
        document.head.appendChild(signInJS);
    }
}
