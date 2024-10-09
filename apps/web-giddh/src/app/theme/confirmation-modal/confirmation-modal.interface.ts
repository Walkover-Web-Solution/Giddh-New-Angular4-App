/**
 * Confirmation modal button configuration
 *
 * @export
 * @interface ConfirmationModalButton
 */
export interface ConfirmationModalButton {
    text: string; // Text to be displayed on the button
    cssClass?: string; // CSS class on the button
    color?: string; // CSS class on the button
}

/**
 * Confirmation modal configuration
 *
 * @export
 * @interface ConfirmationModalConfiguration
 */
export interface ConfirmationModalConfiguration {
    headerText: string; // Text to be displayed in modal
    headerCssClass?: string; // Header CSS class
    messageText: string; // Message to be displayed in modal
    messageCssClass?: string; // Message CSS class
    footerText?: string; // Footer text to be displayed in modal (close to button)
    footerCssClass?: string; // Footer CSS class
    disableRipple?: boolean;
    actionBtnWrapperCssClass?:String; // Button alignment css class
    buttons?: Array<ConfirmationModalButton>; // Buttons array depending on the type of modal
}

/** Confirmation actions performed by user */
export const CONFIRMATION_ACTIONS = {
    YES: 'Yes',
    NO: 'No',
    CLOSE: 'Close'
}
