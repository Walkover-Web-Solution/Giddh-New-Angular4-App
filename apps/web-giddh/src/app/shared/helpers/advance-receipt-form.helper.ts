import { IOption, AdjustedVoucherType, SubVoucher } from '../../app.constant';
import { VoucherTypeEnum } from '../../models/api-models/Sales';

/**
 * Helper class for advance receipt form operations
 */
export class AdvanceReceiptFormHelper {
    /**
     * Filters TDS/TCS taxes from company taxes
     *
     * @param {any[]} taxes - Array of company taxes
     * @returns {IOption[]} Filtered TDS/TCS taxes
     */
    public static filterTdsTaxes(taxes: any[]): IOption[] {
        const availableTdsTaxes: IOption[] = [];
        (Array.isArray(taxes) ? taxes : []).forEach(item => {
            if (item && (item.taxType === 'tdsrc' || item.taxType === 'tdspay')) {
                availableTdsTaxes.push({ value: item.uniqueName, label: item.name, additional: item });
            }
        });
        return availableTdsTaxes;
    }

    /**
     * Handles cancel operation for adjustment form
     *
     * @param {any} adjustVoucherForm - Adjustment voucher form
     * @returns {any} Filtered adjustment voucher form
     */
    public static handleCancel(adjustVoucherForm: any): any {
        if (adjustVoucherForm && adjustVoucherForm.adjustments) {
            adjustVoucherForm.adjustments = adjustVoucherForm.adjustments?.filter(item => {
                return item?.voucherNumber !== '' || item?.adjustmentAmount?.amountForAccount > 0;
            });
        }
        return adjustVoucherForm;
    }

    /**
     * Clears advance receipt adjustment form
     *
     * @param {Function} resetAdjustments - Function to reset adjustments
     * @returns {any} Cleared adjustment voucher form
     */
    public static clearForm(resetAdjustments: () => any[]): any {
        return {
            tdsTaxUniqueName: '',
            tdsAmount: {
                amountForAccount: 0
            },
            description: '',
            adjustments: resetAdjustments()
        };
    }

    /**
     * Assigns currency in adjust voucher form adjustments
     *
     * @param {any} adjustVoucherForm - Adjustment voucher form
     * @param {string} baseCurrencySymbol - Base currency symbol
     * @param {string} companyCurrency - Company currency code
     * @returns {any} Updated adjustment voucher form
     */
    public static assignCurrencyInAdjustments(
        adjustVoucherForm: any,
        baseCurrencySymbol: string,
        companyCurrency: string
    ): any {
        if (adjustVoucherForm?.adjustments?.length > 0) {
            adjustVoucherForm.adjustments = adjustVoucherForm.adjustments.map(item => {
                item.accountCurrency = item.accountCurrency ?? item.currency ?? { 
                    symbol: baseCurrencySymbol, 
                    code: companyCurrency 
                };
                return item;
            });
        }
        return adjustVoucherForm;
    }

    /**
     * Resets invoice list and current page
     *
     * @returns {{ adjustVoucherOptions: any[], referenceVouchersCurrentPage: number }}
     */
    public static resetInvoiceList(): { adjustVoucherOptions: any[], referenceVouchersCurrentPage: number } {
        return {
            adjustVoucherOptions: [],
            referenceVouchersCurrentPage: 1
        };
    }

    /**
     * Determines which vouchers to load based on module context
     *
     * @param {boolean} isVoucherModule - Whether in voucher module
     * @param {boolean} voucherForAdjustment - Whether voucher is for adjustment
     * @returns {'invoice' | 'advanceReceipt' | null} Type of vouchers to load
     */
    public static determineVoucherLoadType(
        isVoucherModule: boolean,
        voucherForAdjustment: boolean
    ): 'invoice' | 'advanceReceipt' | null {
        if (!isVoucherModule) {
            return 'invoice';
        } else {
            if (!voucherForAdjustment) {
                return 'advanceReceipt';
            }
        }
        return null;
    }

    /**
     * Maps adjusted voucher type to API voucher type
     *
     * @param {string} adjustedVoucherType - Adjusted voucher type
     * @param {number} voucherApiVersion - API version (1 or 2)
     * @returns {string} Mapped voucher type
     */
    public static mapVoucherType(adjustedVoucherType: string, voucherApiVersion: number): string {
        let voucherType = (adjustedVoucherType === AdjustedVoucherType.AdvanceReceipt || adjustedVoucherType === AdjustedVoucherType.Receipt) ? 'receipt' : adjustedVoucherType;

        if (voucherApiVersion === 2) {
            if (voucherType === AdjustedVoucherType.Sales) {
                voucherType = AdjustedVoucherType.SalesInvoice;
            } else if (voucherType === AdjustedVoucherType.Purchase) {
                voucherType = AdjustedVoucherType.PurchaseInvoice;
            } else if (voucherType === AdjustedVoucherType.Payment) {
                voucherType = VoucherTypeEnum.payment;
            } else if (voucherType === AdjustedVoucherType.Receipt) {
                voucherType = VoucherTypeEnum.receipt;
            } else if (voucherType === AdjustedVoucherType.Journal) {
                voucherType = AdjustedVoucherType.JournalVoucher;
            }
        }

        return voucherType;
    }
}
