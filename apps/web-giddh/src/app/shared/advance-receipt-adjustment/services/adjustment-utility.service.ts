import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'any'
})
export class AdjustmentUtilityService {

    /**
     * This will convert the new response format for adjustments in old response format
     *
     * @param {*} data
     * @returns {*}
     * @memberof AdjustmentUtilityService
     */
    public getVoucherAdjustmentObject(data: any): any {
        if (data?.adjustments?.length > 0) {
            data.voucherAdjustments = { adjustments: this.formatAdjustmentsObject(data.adjustments) };
            delete data.adjustments;

            let totalAdjustmentAmount = 0;
            let totalAdjustmentCompanyAmount = 0;
            data.voucherAdjustments?.adjustments?.forEach(adjustment => {
                totalAdjustmentAmount += Number(adjustment.adjustmentAmount ? adjustment.adjustmentAmount.amountForAccount : 0);
                totalAdjustmentCompanyAmount += Number(adjustment.adjustmentAmount ? adjustment.adjustmentAmount.amountForCompany : 0);
            });

            data.voucherAdjustments.totalAdjustmentAmount = totalAdjustmentAmount;
            data.voucherAdjustments.totalAdjustmentCompanyAmount = totalAdjustmentCompanyAmount;
        }
        return data;
    }

    /**
     * Formats the adjustment object
     *
     * @param {*} adjustments
     * @returns {*}
     * @memberof AdjustmentUtilityService
     */
    public formatAdjustmentsObject(adjustments: any): any {
        adjustments?.map(adjustment => {
            adjustment.adjustmentAmount = adjustment.amount;
            adjustment.balanceDue = adjustment.unadjustedAmount;
            delete adjustment.amount;
            delete adjustment.unadjustedAmount;
            return adjustment;
        });

        return adjustments;
    }

    /**
     * This will convert the old response format for adjustments in new response format
     *
     * @param {*} data
     * @returns {*}
     * @memberof AdjustmentUtilityService
     */
    public getAdjustmentObject(data: any): any {
        if (data?.transactions?.length > 0) {
            data?.transactions?.forEach(transaction => {
                if (transaction?.voucherAdjustments?.adjustments?.length > 0) {
                    transaction.voucherAdjustments.adjustments.map(adjustment => {
                        adjustment.amount = adjustment.adjustmentAmount;
                        adjustment.unadjustedAmount = adjustment.balanceDue;
                        delete adjustment.adjustmentAmount;
                        delete adjustment.balanceDue;
                        return adjustment;
                    });

                    transaction.adjustments = transaction.voucherAdjustments.adjustments;
                    delete transaction.voucherAdjustments;
                }
            });
        }

        return data;
    }

    /**
     * This will convert the old response format for adjustments in new response format
     *
     * @param {*} data
     * @returns {*}
     * @memberof AdjustmentUtilityService
     */
    public getAdjustmentObjectVoucherModule(data: any): any {
        if (data?.voucherAdjustments?.adjustments?.length > 0) {
            data.voucherAdjustments.adjustments.map(adjustment => {
                adjustment.amount = adjustment.adjustmentAmount;
                adjustment.unadjustedAmount = adjustment.balanceDue;
                delete adjustment.adjustmentAmount;
                delete adjustment.balanceDue;
                return adjustment;
            });

            data.adjustments = data.voucherAdjustments.adjustments;
            delete data.voucherAdjustments;
        }

        return data;
    }
}