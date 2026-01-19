/**
 * SocialUser class
 * Implements SocialUser functionality
 */
export class SocialUser {
    public provider: string;
    public id: string;
    public email: string;
    public name: string;
    public photoUrl: string;
    public token?: string;
}

/**
 * LoginProviderClass class
 * Implements LoginProviderClass functionality
 */
export class LoginProviderClass {
    public name: string;
    public id: string;
    public url: string;
}

/**
 * LinkedInResponse class
 * Implements LinkedInResponse functionality
 */
export class LinkedInResponse {
    public emailAddress: string;
    public firstName: string;
    public id: string;
    public lastName: string;
    public pictureUrl: string;
}
