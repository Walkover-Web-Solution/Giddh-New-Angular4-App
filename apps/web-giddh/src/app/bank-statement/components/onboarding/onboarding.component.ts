import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ReplaySubject, Observable } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { BankStatementComponentStore } from '../../store/bank-statement.store';

/**
 * Onboarding component for bank statement module
 * Provides initial setup and introduction to bank statement features
 * 
 * @export
 * @class OnboardingComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
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
    
    /** Generated email content */
    public generatedEmail$: Observable<string | null>;

    /**
     * Creates an instance of OnboardingComponent
     * 
     * @param {Router} router - Angular router service
     * @param {BankStatementComponentStore} bankStatementStore - Bank statement store
     * @memberof OnboardingComponent
     */
    constructor(
        private router: Router,
        private bankStatementStore: BankStatementComponentStore
    ) {
        this.isGeneratingEmail$ = this.bankStatementStore.isGeneratingEmail$;
        this.generatedEmail$ = this.bankStatementStore.generatedEmail$;
    }

    /**
     * Component initialization
     * 
     * @memberof OnboardingComponent
     */
    public ngOnInit(): void {
        // Subscribe to generated email changes
        this.generatedEmail$.pipe(
            takeUntil(this.destroyed$)
        ).subscribe((forwardedMail: string | null) => {
            if (forwardedMail) {
                this.router.navigate(['pages', 'bank-statement', 'create'], { queryParams: { forwardedMail } });
            }
        });
    }

    public hero(): void {
        this.isGeneratingEmail$.pipe(take(1)).subscribe((isGenerating: boolean) => {
            console.log(isGenerating);
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
