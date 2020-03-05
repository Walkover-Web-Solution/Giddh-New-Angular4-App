import { Injectable } from '@angular/core';
import { LedgerServiceModule } from './ledger.service.module';

@Injectable({
    providedIn: LedgerServiceModule
})
export class LedgerUtilityService {

    public calculateApplicableVoucherType(voucherRequest: any): Array<string> {
        const { currentLedgerAccount, particularAccount, voucherData } = voucherRequest;
        const currentLedgerApplicableVouchers = this.findVouchers(particularAccount.type, currentLedgerAccount.parentGroups, voucherData, true);
        const particularAccountApplicableVouchers = this.findVouchers(particularAccount.type,
            particularAccount.selectedAccount ? particularAccount.selectedAccount.parentGroups : [],
            voucherData);
        console.log(currentLedgerApplicableVouchers, particularAccountApplicableVouchers);
        let voucherList;
        if (currentLedgerApplicableVouchers && particularAccountApplicableVouchers) {
            // Find common vouchers in both accounts and return
            voucherList = currentLedgerApplicableVouchers.filter((currentLedgerVoucher) => particularAccountApplicableVouchers.indexOf(currentLedgerVoucher) > -1);
        } else {
            voucherList = [];
        }
        return voucherList;
    }

    private findVouchers(transactionType: string, parentGroups: Array<any>, voucherData: Array<any>, isCurrentLedgerAccount?: boolean): Array<string> {
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
                if (categoryVoucherDetails.hasVouchers) {
                    if (transactionType === 'CREDIT') {
                        return (isCurrentLedgerAccount) ? categoryVoucherDetails.debit : categoryVoucherDetails.credit;
                    } else if (transactionType === 'DEBIT') {
                        return (isCurrentLedgerAccount) ? categoryVoucherDetails.credit : categoryVoucherDetails.debit;
                    }
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
