/**
 * Interface for email forwarding configuration request
 */
export interface EmailForwardingRequest {
    accountUniqueName?: string;
    originalEmail?: string;
    forwardedMail: string;
    password?: string;
}

/**
 * Interface for confirmation data within email forwarding response
 */
export interface ConfirmationData {
    requestId: string;
    originalEmail: string;
    forwardedEmail: string;
    confirmLink: string;
    cancelLink: string;
}

/**
 * Interface for email forwarding configuration response
 */
export interface EmailForwardingResponse {
    confirmationData: ConfirmationData[];
    originalEmail: string;
    uniqueName: string;
    account: {name: string, uniqueName: string};
    forwardedMail: string;
    isPasswordSet: boolean;
}

/** Constant for "You are not allowed" message */
export const YOU_ARE_NOT_ALLOWED = "YOU_ARE_NOT_ALLOWED";