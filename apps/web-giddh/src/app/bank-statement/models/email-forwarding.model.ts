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
    uniqueName: string;
    account: any;
    forwardedMail: string;
}
