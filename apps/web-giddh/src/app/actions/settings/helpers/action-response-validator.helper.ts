import { BaseResponse } from '../../../models/api-models/BaseResponse';
import { CustomActions } from '../../../store/custom-actions';
import { ToasterService } from '../../../services/toaster.service';

/**
 * Shared utility for validating API responses in action classes
 * Used across settings actions for consistent response handling
 */
export class ActionResponseValidatorHelper {
    /**
     * Validates API response and returns appropriate action
     * Shows toast messages based on response status and showToast flag
     * 
     * @param response API response to validate
     * @param successAction Action to return on success
     * @param toasty ToasterService instance for showing messages
     * @param showToast Whether to show toast messages
     * @param errorAction Action to return on error (defaults to EmptyAction)
     * @returns CustomActions based on response status
     */
    public static validateResponse<TResponse, TRequest>(
        response: BaseResponse<TResponse, TRequest>,
        successAction: CustomActions,
        toasty: ToasterService,
        showToast: boolean = false,
        errorAction: CustomActions = { type: 'EmptyAction' }
    ): CustomActions {
        /**
         * Handles if functionality
         */
        if (response?.status === 'error') {
            /**
             * Handles if functionality
             */
            if (showToast) {
                toasty.errorToast(response.message);
            }
            return errorAction;
        } else {
            /**
             * Handles if functionality
             */
            if (showToast && typeof response.body === 'string') {
                toasty.successToast(response.body);
            }
        }
        return successAction;
    }
}
