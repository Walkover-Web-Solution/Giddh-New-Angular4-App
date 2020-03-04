import { Injectable } from '@angular/core';
import { LedgerServiceModule } from './ledger.service.module';

@Injectable({
    providedIn: LedgerServiceModule
})
export class LedgerUtilityService {

    public calculateApplicableVoucherType(voucherRequest: any): Array<string> {
        const { currentLedgerAccount, particularAccount, voucherData } = voucherRequest;
        const currentLedgerApplicableVouchers = this.findVouchers(particularAccount.type, currentLedgerAccount.parentGroups, voucherData);
        const particularAccountApplicableVouchers = this.findVouchers(particularAccount.type,
            particularAccount.selectedAccount ? particularAccount.selectedAccount.parentGroups : [],
            voucherData);
        console.log(currentLedgerApplicableVouchers, particularAccountApplicableVouchers);
        // Find common vouchers in both accounts and return
        const voucherList = currentLedgerApplicableVouchers.filter((currentLedgerVoucher) => particularAccountApplicableVouchers.indexOf(currentLedgerVoucher) > -1);
        return voucherList;
    }

    private findVouchers(transactionType: string, parentGroups: Array<any>, voucherData: Array<any>): Array<string> {
        if (parentGroups && voucherData) {
            console.log('ParentGroups: ', parentGroups);
            console.log('Voucher data: ', voucherData);
            let index = 0;
            let voucherDetailsByCategory = [...voucherData];
            while (parentGroups[index]) {
                console.log('Parent group: ', parentGroups[index]);
                let categoryVoucherDetails: any = voucherDetailsByCategory.filter(category => category.group === parentGroups[index].uniqueName);
                categoryVoucherDetails = categoryVoucherDetails.length ? categoryVoucherDetails.pop() : categoryVoucherDetails;
                console.log('categoryVoucherDetails: ', categoryVoucherDetails);
                if (categoryVoucherDetails.vouchers) {
                    return transactionType === 'CREDIT' ? categoryVoucherDetails.credit : categoryVoucherDetails.debit;
                } else if (categoryVoucherDetails.groups) {
                    index++;
                    console.log('New parent: ', parentGroups[index]);
                    voucherDetailsByCategory = [...(categoryVoucherDetails.groups)];
                } else {
                    return categoryVoucherDetails.default;
                }
            }
        }
    }
}