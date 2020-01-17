/**
 * RCM modal button configuration
 *
 * @export
 * @interface RcmModalButton
 */
export interface RcmModalButton {
    text: string; // Text to be displayed on the button
    cssClass?: string; // CSS class on the button
}

/**
 * RCM modal configuration
 *
 * @export
 * @interface RcmModalConfiguration
 */
export interface RcmModalConfiguration {
    headerText: string; // Text to be displayed in modal
    headerCssClass?: string; // Header CSS class
    messageText: string; // Message to be displayed in modal
    messageCssClass?: string; // Message CSS class
    footerText?: string; // Footer text to be displayed in modal (close to button)
    footerCssClass?: string // Footer CSS class
    buttons?: Array<RcmModalButton> // Buttons array depending on the type of modal
}

/** RCM actions performed by user */
export const RCM_ACTIONS = {
    YES: 'Yes',
    NO: 'No',
    CLOSE: 'Close'
}
