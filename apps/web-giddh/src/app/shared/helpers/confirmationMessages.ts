export interface ConfirmationMessages {
    module: string;
    title: string;
    message1: string;
    message2: string;
}

export const confirmationMessages: ConfirmationMessages[] = [
    { module: 'sales', title: 'Confirmation', message1: 'Do you want to delete the voucher / invoice?', message2: 'It will be deleted permanently and will no longer be accessible from any other module.' },
    { module: 'proformaslist', title: 'Confirmation', message1: 'Do you want to delete the voucher?', message2: 'It will be deleted permanently and will no longer be accessible from any other module.' },
    { module: 'estimateslist', title: 'Confirmation', message1: 'Do you want to delete the voucher?', message2: 'It will be deleted permanently and will no longer be accessible from any other module.' },
    { module: 'purchase', title: 'Confirmation', message1: 'Ship', message2: '' },
    { module: 'purchaselist', title: 'Confirmation', message1: 'Ship', message2: '' }
];
