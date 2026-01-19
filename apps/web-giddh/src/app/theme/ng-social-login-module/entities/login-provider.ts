import { SocialUser } from './user';

/**
 * LoginProvider interface definition
 * Defines the structure and contract for LoginProvider objects
 */
export interface LoginProvider {
    isInitialize: boolean;

    /**
     * Initializes ialize
     */
    initialize(): Promise<SocialUser>;

    /**
     * Handles signIn functionality
     */
    signIn(): Promise<SocialUser>;

    /**
     * Handles signOut functionality
     */
    signOut(): Promise<any>;
}
