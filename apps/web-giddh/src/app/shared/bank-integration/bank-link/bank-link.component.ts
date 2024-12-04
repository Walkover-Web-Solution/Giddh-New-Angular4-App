import { Component, OnInit, ChangeDetectionStrategy,} from '@angular/core';
import { SettingsIntegrationService } from '../../../services/settings.integration.service';
import { take } from 'rxjs/operators';

@Component({
    selector: 'bank-link',
    styleUrls: ['./bank-link.component.scss'],
    templateUrl: './bank-link.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class BankLinkComponent implements OnInit {
     /** True if api call in progress */
     public isLoading: boolean = false;
     /** List of connected bank accounts */
    public connectedBankAccounts: any[] = [];
    // Define the bank options
    bankOptions = [
        { value: 'bank1', label: 'Bank 1' },
        { value: 'bank2', label: 'Bank 2' },
        // ... add more banks as needed
    ];

    constructor(
        private settingsIntegrationService: SettingsIntegrationService 
    ) {
        
    }


    /**
     * Initializes the component
     *
     * @memberof BankLinkComponent
     */
    public ngOnInit(): void {
        

       
    }
    public getAllBankAccounts(): void {
        this.isLoading = true;
        this.connectedBankAccounts = [];

        this.settingsIntegrationService.getAllBankAccounts().pipe(take(1)).subscribe(response => {
            this.isLoading = false;
            if (response?.body) {
                this.connectedBankAccounts = response.body;
                console.log(this.connectedBankAccounts)

                this.connectedBankAccounts.forEach(bankAccount => {
                    if (bankAccount?.bankResource?.payor?.length > 0) {
                        bankAccount?.bankResource?.payor.forEach(payor => {
    
                        });
                    }
                });
            }
        });
    }
      // Method to handle bank selection
    onBankSelected(selectedBank: any) {
        console.log('Selected bank:', selectedBank);
        // Add your logic to handle the selected bank
    }
}
