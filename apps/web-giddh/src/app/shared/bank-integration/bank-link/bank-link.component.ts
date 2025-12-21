import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { BehaviorSubject, ReplaySubject, Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IOption } from '../../../app.constant';
import { SettingIntegrationComponentStore } from '../../../settings/integration/utility/setting.integration.store';
import { filter, keys, map, slice } from '../../../lodash-optimized';

@Component({
    selector: 'bank-link',
    styleUrls: ['./bank-link.component.scss'],
    templateUrl: './bank-link.component.html',
    providers: [SettingIntegrationComponentStore],
    standalone: false
})

export class BankLinkComponent implements OnInit, OnDestroy {
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** List of connected bank accounts */
    public connectedBankAccounts: any[] = [];
    /** Hold selected bank */
    public defaultSelectedBank: any;
    /** Subject to unsubscribe from listeners. */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Track subscriptions manually for Angular 21 compatibility */
    private subscriptions: Subscription[] = [];
    /** Flag to track component destruction state */
    private isDestroying = false;
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
        this.componentStore.updateAccount$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                this.dialogRef?.close(true);
            }
        });
        this.setTransformBankListData(this.inputData.bankList);
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
        this.bankLinks = [];
        this.defaultSelectedBank = '';
        this.bankLinks = bankList.filter(bank => Object.keys(bank.account).length === 0).map(item => {
            return {
                label: `${item.bankName} ****${item.bankResource?.accountNumber ? item.bankResource?.accountNumber.slice(-4) : 'N/A'}`,
                value: item.bankResource.uniqueName,
                additional: item
            }
        });
        this.defaultSelectedBank = this.bankLinks[0]?.label;
        this.selectedOption(this.bankLinks[0]);
    }

    /**
    * Releases memory
    *
    * @memberof BankLinkComponent
    */
    public ngOnDestroy(): void {
        this.isDestroying = true;

        // Clean up all tracked subscriptions first
        this.subscriptions.forEach((subscription, index) => {
            try {
                if (subscription && !subscription.closed) {
                    subscription.unsubscribe();
                }
            } catch (error) {
                console.warn(`Error unsubscribing subscription ${index}:`, error);
            }
        });
        this.subscriptions = [];

        // Safely complete the destroyed$ subject
        try {
            if (this.destroyed$ && !this.destroyed$.closed) {
                this.destroyed$.next(true);
                this.destroyed$.complete();
            }
        } catch (error) {
            console.warn('Error completing destroyed$ subject:', error);
        }
    }

    /**
     * This will be use for when close the dialog
     *
     * @memberof BankLinkComponent
     */
    public closeDialog(): void {
        this.dialogRef.close(false);
    }

    /**
     * Helper method to track subscriptions for Angular 21 compatibility
     */
    protected addSubscription(subscription: Subscription): void {
        if (subscription && !subscription.closed) {
            this.subscriptions.push(subscription);
        }
    }


}
