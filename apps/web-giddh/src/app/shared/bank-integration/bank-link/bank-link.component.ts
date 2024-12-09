import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { take, takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IOption } from '../../../theme/ng-select/option.interface';
import { SettingIntegrationComponentStore } from '../../../settings/integration/utility/setting.integration.store';

@Component({
    selector: 'bank-link',
    styleUrls: ['./bank-link.component.scss'],
    templateUrl: './bank-link.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class BankLinkComponent implements OnInit {
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** List of connected bank accounts */
    public connectedBankAccounts: any[] = [];
    /** Hold selected bank */
    public selectedBanksList: string = '';
    /** Subject to unsubscribe from listeners. */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Hold options of dropdown  */
    public bankLinks: IOption[] = []
    /** Hold selected bank from dropdown/bankLinks */
    public selectedBank: any;
    /** Hold all connected bank */
    public bankAccounts: any[] = [];
    /** True if relogin required in any bank account */
    public reLoginRequired: boolean = false;

    constructor(
        private componentStore: SettingIntegrationComponentStore,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<BankLinkComponent>,
        @Inject(MAT_DIALOG_DATA) public inputData
    ) { }

    /**
     * Initializes the component
     *
     * @memberof BankLinkComponent
     */
    public ngOnInit(): void {
        if (!this.inputData?.bankList) {
            this.getAllBankAccounts();
        } else {
            this.setTransformBankListData(this.inputData?.bankList);
        }

        this.componentStore.updateAccount$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                this.dialogRef.close();
            }
        })

        this.componentStore.getAllBankAccountsList$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response?.body) {
                this.setTransformBankListData(response.body);
            }
        })
    }

    /**
     * This will use for select bank account
     * 
     * @param {*} event
     * @memberof BankLinkComponent
     */
    public selectedOption(event: any): void {
        if (event?.additional) {
            this.selectedBank = event.additional;
        }
    }

    /**
     * This will link all the connected bank accounts
     * 
     * @memberof BankLinkComponent
     */
    public linkBankAccount(): void {
        let request = { bankAccountUniqueName: this.selectedBank?.bankResource?.uniqueName };
        let accountForm = {
            accountNumber: this.selectedBank?.bankResource?.accountNumber,
            accountUniqueName: this.inputData?.accountUniqueName,
            paymentAlerts: []
        };
        this.componentStore.updateAccount({ accountForm, request });
    }

    /**
    * This will get all connected bank accounts
    *
    * @memberof BankLinkComponent
    */
    public getAllBankAccounts(): void {
        this.componentStore.getAllBankAccounts();
    }

    /**
     * Filter bank which are not linked and transform as label value format
     *
     * @private
     * @param {*} bankList
     * @memberof BankLinkComponent
     */
    private setTransformBankListData(bankList: any): void {
        this.bankLinks = bankList.filter(bank => Object.keys(bank.account).length === 0).map(item => {
            return {
                label: `${item.bankName} ****${item.bankResource?.accountNumber ? item.bankResource.accountNumber.slice(-4) : 'N/A'}`,
                value: item.bankResource.uniqueName,
                additional: item
            }
        });
    }
}