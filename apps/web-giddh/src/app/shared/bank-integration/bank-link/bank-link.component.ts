import { Component, OnInit, ChangeDetectionStrategy, Inject} from '@angular/core';
import { SettingsIntegrationService } from '../../../services/settings.integration.service';
import { take, takeUntil  } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { ToasterService } from '../../../services/toaster.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IOption } from '../../../theme/ng-select/option.interface';

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
    /** Hold selectedBank */
    public selectedBanks: string = '';
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public options: IOption[] = []

    constructor(
        private settingsIntegrationService: SettingsIntegrationService,
        private toasty: ToasterService,
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<BankLinkComponent>,
        @Inject(MAT_DIALOG_DATA) public inputData 
    ) {
        
    }


    /**
     * Initializes the component
     *
     * @memberof BankLinkComponent
     */
    public ngOnInit(): void {
        console.log(this.inputData)

         // Map bankList to dropdown options
         if (this.inputData?.bankList) {
            this.options = this.inputData.bankList.map((bank: any) => ({
                label: `Sandbox Finance ${bank.accountNumber?.slice(-4) || '****'}`,
                value: bank.uniqueName || '',
            }));
        }
        console.log('Dropdown options:', this.options);
    }

    public selectedOption(event:any){
        if(event?.value){
            this.selectedBanks = event.label;
        }
        console.log('Selected bank:', event);
    }
    public getAllBankAccounts(event: any): void {
        this.isLoading = true;
        this.connectedBankAccounts = [];

        this.settingsIntegrationService.getAllBankAccounts().pipe(take(1)).subscribe(response => {
            this.isLoading = false;
            if (response?.body) {
                this.connectedBankAccounts = response.body;
                console.log(this.connectedBankAccounts)
            }
        });
    }
    public linkBankAccount(bankAccount: any): void {
        let request = { bankAccountUniqueName: bankAccount?.accountBankTransactionTotal?.bankResource?.uniqueName };
            let accountForm = {
                accountNumber: bankAccount?.accountBankTransactionTotal?.bankResource?.accountNumber,
                accountUniqueName: bankAccount?.uniqueName,
                paymentAlerts: []
            };
        this.settingsIntegrationService.updateAccount(accountForm, request)
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (response) => {
                    if (response?.status === "success") {
                        if (response?.body?.message) {
                            this.toasty.clearAllToaster();
                            this.toasty.successToast(response?.body?.message);
                        }
                    }
                },
                error: (error) => {
                    this.toasty.clearAllToaster();
                    this.toasty.errorToast(error?.message || 'Something went wrong');
                }
            });
    }
}
