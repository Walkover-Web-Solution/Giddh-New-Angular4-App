/**
 * Initiating the interface to create list of confirmation messages
 *
 * @export
 * @interface ConfirmationMessages
 */
export interface ConfirmationMessages {
    module: string;
    title: string;
    message1: string;
    message2: string;
}

/**
 * Creating list of confirmation messages
 *
 * @export
 * @interface ConfirmationMessages
 */
export const confirmationMessages: ConfirmationMessages[] = [
    { module: 'sales', title: 'Confirmation', message1: 'Do you want to delete the voucher(s) / invoice(s)?', message2: 'It will be deleted permanently and will no longer be accessible from any other module.' },
    { module: 'proformaslist', title: 'Confirmation', message1: 'Do you want to delete the voucher(s)?', message2: 'They will be deleted permanently and will no longer be accessible from any other module.' },
    { module: 'estimateslist', title: 'Confirmation', message1: 'Do you want to delete the voucher(s)?', message2: 'They will be deleted permanently and will no longer be accessible from any other module.' },
    { module: 'purchase', title: 'Confirmation', message1: 'Do you want to delete the record?', message2: 'It will be deleted permanently and will no longer be accessible from any other module.' },
    { module: 'purchaselist', title: 'Confirmation', message1: 'Do you want to delete the selected records?', message2: 'They will be deleted permanently and will no longer be accessible from any other module.' },
    { module: 'credit note', title: 'Confirmation', message1: 'Do you want to delete the selected vouchers?', message2: 'They will be deleted permanently and will no longer be accessible from any other module.' },
    { module: 'debit note', title: 'Confirmation', message1: 'Do you want to delete the selected vouchers?', message2: 'They will be deleted permanently and will no longer be accessible from any other module.' },
];
