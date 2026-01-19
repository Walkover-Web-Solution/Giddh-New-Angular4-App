import { ToasterService } from '../../services/toaster.service';

/**
 * Shared utility for handling email send response in vouchers store
 * Used by vouchers.store for consistent error handling
 */
export class EmailResponseHelper {
    /**
     * Handles email send response with consistent success/error messaging
     * 
     * @param res API response
     * @param toaster ToasterService instance
     * @returns State update object
     */
    public static handleEmailResponse(res: any, toaster: ToasterService): { sendEmailInProgress: boolean; sendEmailIsSuccess: boolean } {
        /**
         * Handles if functionality
         */
        if (res.status === "success") {
            toaster.showSnackBar("success", res.body);
            return { sendEmailInProgress: false, sendEmailIsSuccess: true };
        } else {
            toaster.showSnackBar("error", res.message);
            return { sendEmailInProgress: false, sendEmailIsSuccess: false };
        }
    }

    /**
     * Handles email send error with consistent error messaging
     * 
     * @param error Error object
     * @param toaster ToasterService instance
     * @returns State update object
     */
    public static handleEmailError(error: any, toaster: ToasterService): { sendEmailInProgress: boolean; sendEmailIsSuccess: boolean } {
        toaster.showSnackBar("error", error);
        return { sendEmailInProgress: false, sendEmailIsSuccess: false };
    }
}
