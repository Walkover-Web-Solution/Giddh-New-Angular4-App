import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ReplaySubject, Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { BankStatementComponentStore } from '../../store/bank-statement.store';

@Component({
    selector: 'app-onboarding',
    templateUrl: './onboarding.component.html',
    styleUrls: ['./onboarding.component.scss'],
    providers: [BankStatementComponentStore]
})
export class OnboardingComponent implements OnInit, OnDestroy {
    /** Subject to handle component destruction */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Loading state for email generation */
    public isGeneratingEmail$: Observable<boolean>;
    /** Loading state for checking existing data */
    public isCheckingExistingData: boolean = true;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    
    constructor(
        private router: Router,
        private bankStatementStore: BankStatementComponentStore
    ) {
        this.isGeneratingEmail$ = this.bankStatementStore.isGeneratingEmail$;
    }

    /**
     * Component initialization
     * 
     * @memberof OnboardingComponent
     */
    public ngOnInit(): void {
        // Check if any data exists, if yes redirect to list page
        this.checkExistingDataAndRedirect();
        
        // Subscribe to generated email changes
        this.bankStatementStore.generatedEmail$.pipe(
            takeUntil(this.destroyed$)
        ).subscribe((forwardedMail: string | null) => {
            if (forwardedMail) {
                this.router.navigate(['/pages/bank-statement/create'], { queryParams: { forwardedMail } });
            }
        });
    }
    
    /**
     * Check if existing data is present and redirect to list page if found
     * 
     * @private
     * @memberof OnboardingComponent
     */
    private checkExistingDataAndRedirect(): void {
        // Set loading state to true
        this.isCheckingExistingData = true;
        
        // Call get all API to check if any data exists
        this.bankStatementStore.getAllEmailForwarding();
        
        // Subscribe to the result
        this.bankStatementStore.emailForwardingList$.pipe(
            filter(Boolean),
            takeUntil(this.destroyed$)
        ).subscribe((emailForwardingList) => {
            if (emailForwardingList && emailForwardingList.length > 0) {
                // Data exists, redirect to list page (keep loader visible during redirect)
                this.router.navigate(['/pages/bank-statement/list']);
            } else {
                // No data exists, show onboarding content
               setTimeout(() => {
                   this.isCheckingExistingData = false;
               }, 200);
            }
        });
    }

    /**
     * Generate email using store
     * 
     * @memberof OnboardingComponent
     */
    public getEmail(): void {
        this.bankStatementStore.generateEmail();
    }

    /**
     * Component cleanup
     * 
     * @memberof OnboardingComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
