import { Component, OnInit, ChangeDetectionStrategy, Inject} from '@angular/core';
import { SettingsIntegrationService } from '../../../services/settings.integration.service';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { ToasterService } from '../../../services/toaster.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IOption } from '../../../theme/ng-select/option.interface';
import { LedgerVM } from '../../../ledger/ledger.vm';

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
    public selectedBanksList: string = '';
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public options: IOption[] = []
    public lc: LedgerVM;
    public selectedBank: any;

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
        if(!this.inputData.bankList){
            // this.getAccounts()
        }
        console.log(this.inputData , 'drop')
        
        this.options = this.inputData.bankList.map(item => {
            return {
                label: `${item.bankName} ****${item.bankResource.accountNumber.slice(-4)}`, 
                value: item.bankResource.accountUniqueName, 
                additional: item 
            }
        })
          console.log('Options:', this.options);
    }

    // private getAccounts(fromDate: string, toDate: string, groupUniqueName: string, pageNumber?: number, requestedFrom?: string, refresh?: string, count: number = 20, query?: string, sortBy: string = '', order: string = 'asc') {
    //     this.isLoading = true;
    //     pageNumber = pageNumber ? pageNumber : 1;
    //     refresh = refresh ? refresh : 'false';
    //     this.contactService.GetContacts(fromDate, toDate, groupUniqueName, pageNumber, refresh, count, query, sortBy, order).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
    //         if (res?.status === 'success') {
    //             this.bankAccounts = res?.body?.results;
    //             console.log(this.bankAccounts)
    //         }
    //         const reLoginRequired = this.bankAccounts?.filter(bankaccount => bankaccount.reLoginRequired);
    //         this.reLoginRequired = (reLoginRequired?.length) ? true : false;

    //         this.isLoading = false;

    //         this.changeDetectionRef.detectChanges();
    //     });
    // }
    public selectedOption(event: { label: string; value: string; additional: any }){

        console.log('Selected bank:', event);

        if (event?.additional) {
            this.selectedBank = event.additional 
            console.log('Selected bank data:', this.selectedBank);
          }
    }
    
    public linkBankAccount(): void {
        let request = { bankAccountUniqueName: this.selectedBank?.bankResource?.uniqueName };
            let accountForm = {
                accountNumber: this.selectedBank?.bankResource?.accountNumber,
                accountUniqueName: this.inputData?.accountUniqueName,
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