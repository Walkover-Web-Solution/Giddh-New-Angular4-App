export interface ConfirmationModalButton {
    text?: string;
    type?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
    cssClass?: string;
    disabled?: boolean;
    action?: () => void;
    color?: string;
}

export interface ConfirmationModalConfiguration {
    title?: string;
    message?: string;
    messageHtml?: string;
    messageText?: string;
    messageCssClass?: string;
    icon?: string;
    iconClass?: string;
    showCloseButton?: boolean;
    backdrop?: boolean | 'static';
    keyboard?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    centered?: boolean;
    buttons?: ConfirmationModalButton[];
    customClass?: string;
    data?: any;
    headerText?: string;
    headerCssClass?: string;
    footerText?: string;
    footerCssClass?: string;
    disableRipple?: boolean;
}

export interface ConfirmationModalResult {
    action?: string;
    data?: any;
    dismissed?: boolean;
}
