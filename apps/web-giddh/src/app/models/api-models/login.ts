/**
 * SignUpWithPassword interface definition
 * Defines the structure and contract for SignUpWithPassword objects
 */
export interface SignUpWithPassword {
    email: string;
    password: string;
    mobileNo?: string;
}

/**
 * LoginWithPassword interface definition
 * Defines the structure and contract for LoginWithPassword objects
 */
export interface LoginWithPassword {
    uniqueKey: string;
    password: string;
}
