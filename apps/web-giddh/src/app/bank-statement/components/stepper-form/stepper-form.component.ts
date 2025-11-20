import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatStepper } from '@angular/material/stepper';
import { ReplaySubject, interval, Subject, BehaviorSubject, Observable } from 'rxjs';
import { filter, takeUntil, switchMap, startWith, takeWhile, debounceTime, delay } from 'rxjs/operators';
import { BankStatementComponentStore } from '../../store/bank-statement.store';
import { ToasterService } from '../../../services/toaster.service';
import { EmailForwardingResponse } from '../../models/email-forwarding.model';
import { EMAIL_VALIDATION_REGEX, API_BULK_FETCH_LIMIT } from '../../../app.constant';
import { cloneDeep } from '../../../lodash-optimized';
import { LocaleService } from '../../../services/locale.service';
import { CommonActions } from '../../../actions/common.actions';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store';

/**
 * Interface for bank statement form data
 */
export interface BankStatementFormData {
    // Step 1: Bank Details
    bankName: string;
    accountNumber: string;
    accountType: string;
    branchName: string;
    ifscCode: string;
    
    // Step 2: Statement Details
    statementFile: File | null;
    statementFormat: string;
    fromDate: Date | null;
    toDate: Date | null;
    openingBalance: number | null;
    closingBalance: number | null;
    
    // Step 3: Processing Options
    autoReconcile: boolean;
    reconcileRules: string[];
    notificationEmail: string;
    generateReport: boolean;
}

/**
 * Stepper form component for creating/editing bank statements
 * Provides a multi-step form for bank statement data entry
 * 
 * @export
 * @class StepperFormComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
    selector: 'app-stepper-form',
    templateUrl: './stepper-form.component.html',
    styleUrls: ['./stepper-form.component.scss'],
    providers: [BankStatementComponentStore]
})
export class StepperFormComponent implements OnInit, OnDestroy, AfterViewInit {
    /** ViewChild reference to the stepper */
    @ViewChild('stepper', { static: false }) stepper!: MatStepper;
    /** Subject to handle component destruction */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Form groups for each step */
    public emailForwardingForm: FormGroup;
    /** Loading state for checking existing data */
    public isCheckingExistingData: boolean = true;
    
    /** This will hold local JSON data */
    public localeData: any = {};
    
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    
    /** Loading state for the component */
    public isLoading: boolean = false;
    
    /** Edit mode flag */
    public isEditMode: boolean = false;
    
    // /** Generated email content */
    // public generatedEmail$: Observable<string | null>;
    /** Forwarded mail domain */
    public forwardedMailDomain: string = '';
    /** Flag to show/hide email input field */
    public isEditingEmail: boolean = false;
    public lastEmail: string = '';
    /** Email forwarding response data for template usage */
    public emailForwardingResponse: EmailForwardingResponse | null = null;
    /** Subject to stop polling when data is received */
    private stopPolling$ = new Subject<void>();
    /** Current step from query params */
    public currentStep: number = 0;
    /** Minimum allowed step (prevents going back) */
    public minAllowedStep: number = 0;
    /** Target step to navigate to after view init */
    private targetStepIndex: number | null = null;
    /** Stores the search results for accounts */
    private accountSearchResponseSubject = new BehaviorSubject<any[]>([]);
    public accountSearchResponse$: Observable<any[]> = this.accountSearchResponseSubject.asObservable();
    /** Default result count for account searches */
    public defaultCount = API_BULK_FETCH_LIMIT;
    /** Request parameters for account searches */
    public accountSearchRequest: any = {
        isLoading: false,
        q: ''
    };
    
    /**
     * Creates an instance of StepperFormComponent
     * 
     * @param {FormBuilder} formBuilder - Angular form builder service
     * @param {Router} router - Angular router service
     * @param {ActivatedRoute} route - Angular activated route service
     * @param {ToasterService} toaster - Toaster service for notifications
     * @param {BankStatementComponentStore} bankStatementStore - Bank statement store
     * @param {LocaleService} localeService - Locale service for translations
     * @param {CommonActions} commonActions - Common actions for store
     * @param {Store<AppState>} store - Store for app state
     * @memberof StepperFormComponent
     */
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private toaster: ToasterService,
        private bankStatementStore: BankStatementComponentStore,
        private localeService: LocaleService,
        private store: Store<AppState>
    ) {
        this.initializeForms();
    }

    /**
     * Component initialization
     * 
     * @memberof StepperFormComponent
     */
    public ngOnInit(): void {
        // Load translations
        this.loadTranslations();
        
        // Check if any data exists, if yes redirect to list page
        // this.checkExistingDataAndRedirect();
        
        this.getEmailFromQueryParams();
        this.setupAccountSearchSubscription();
        
        // Load initial accounts for dropdown
        this.searchAccount();

        this.bankStatementStore.createUpdateEmailForwardingIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((response: unknown) => {
                if (response && response['uniqueName']) {
                    this.isLoading = false;
                    if (this.isEditMode) {
                      this.router.navigate(['pages/bank-statement/list']);
                    } else {
                        this.router.navigate(['pages/bank-statement/create'], { 
                            queryParams: { 
                                forwardedMail: this.emailForwardingForm.value.forwardedMail + this.forwardedMailDomain,
                                uniqueName: response['uniqueName'],
                                step: 2
                            }
                        });
                    }
                } else if (response === null || response === false) {
                    // Handle error case - keep user on current step
                    this.isLoading = false;
                }
            });
    }


    /**
     * Load translations for the component
     * 
     * @private
     * @memberof StepperFormComponent
     */
    private loadTranslations(): void {
        // Load common locale data
        this.store.pipe(select(state => state.session.commonLocaleData), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.commonLocaleData = response;
            }
        });

        // Load component-specific locale data
        if (this.localeService.language) {
            this.localeService.getLocale('bank-statement', this.localeService.language).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response) {
                    this.localeData = response;
                }
            });
        }
    }

    /**
     * After view initialization - navigate to target step if set
     * 
     * @memberof StepperFormComponent
     */
    public ngAfterViewInit(): void {
        if (this.targetStepIndex !== null) {
            setTimeout(() => {
                this.navigateToStep(this.targetStepIndex!);
                this.targetStepIndex = null;
            }, 100);
        }
    }

    /**
     * Component cleanup
     * 
     * @memberof StepperFormComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        
        // Clean up polling subject
        if (!this.stopPolling$.closed) {
            this.stopPolling$.next();
            this.stopPolling$.complete();
        }
    }

    /**
     * Initializes all form groups
     * 
     * @private
     * @memberof StepperFormComponent
     */
    private initializeForms(): void {
        this.emailForwardingForm = this.formBuilder.group({
            forwardedMail: ['', [Validators.required]],
            originalEmail: [''],
            password: [''],
            accountUniqueName: [''],
            uniqueName: ['']
        });

        this.emailForwardingForm.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(() => {
            console.log('Form value changed:', this.emailForwardingForm.value);
        });
    }

    /**
     * Checks if component is in edit mode and loads data
     * 
     * @private
     * @memberof StepperFormComponent
     */
    private checkEditMode(): void {
        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            if (params['uniqueName']) {
                this.isEditMode = true;
                this.handleUniqueName(params['uniqueName']);
                
                // In edit mode, ensure we stay on the correct step
                if (this.currentStep > 0) {
                    setTimeout(() => {
                        if (this.stepper && this.currentStep <= this.stepper.steps.length) {
                            this.stepper.selectedIndex = this.currentStep - 1;
                        }
                    }, 100);
                }
            }
        });
    }

    /**
     * Gets email from query parameters
     * 
     * @private
     * @memberof StepperFormComponent
     */
    private getEmailFromQueryParams(): void {
        this.route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe(queryParams => {
            // Handle step navigation from query params
            if (queryParams['step']) {
                const stepNumber = parseInt(queryParams['step'], 10);
                if (!isNaN(stepNumber) && stepNumber >= 1) {
                    this.currentStep = stepNumber;
                    this.minAllowedStep = stepNumber - 1; // Convert to 0-based index for minimum allowed step
                    
                    // Convert 1-based to 0-based index
                    const targetStepIndex = stepNumber - 1;
                    
                    console.log(`Will navigate to step ${stepNumber} (index ${targetStepIndex}), minimum allowed step index: ${this.minAllowedStep}`);
                    
                    // Navigate immediately if stepper is available, otherwise store for later
                    if (this.stepper) {
                        setTimeout(() => {
                            this.navigateToStep(targetStepIndex);
                        }, 100);
                    } else {
                        this.targetStepIndex = targetStepIndex;
                    }
                }
                this.checkEditMode();
            }
            
            if (queryParams['forwardedMail']) {
                const [emailWithoutDomain, domain] = queryParams['forwardedMail'].split('@');
                this.forwardedMailDomain = `@${domain}`;
                this.emailForwardingForm.patchValue({
                    forwardedMail: emailWithoutDomain
                });
            } else {
                // Redirect to list page
                this.router.navigate(['/pages/bank-statement/list']);
            }
            if (queryParams['uniqueName']) {
                this.handleUniqueName(queryParams['uniqueName']);
            }
        });
    }

    private handleUniqueName(uniqueName: string): void {
        this.emailForwardingForm.patchValue({
            uniqueName: uniqueName
        });
                
        // Start polling after 20 seconds delay
        if (this.currentStep === 2) {
            interval(5000).pipe(
                startWith(0), // Start immediately
                delay(20000), // Wait 20 seconds before first call
                switchMap(() => {
                    this.bankStatementStore.getEmailForwardingDetails(uniqueName);
                    return this.bankStatementStore.emailForwardingDetails$;
                }),
                filter(Boolean),
                takeUntil(this.destroyed$),
                takeUntil(this.stopPolling$) // Stop polling when stopPolling$ emits
            ).subscribe((response: EmailForwardingResponse) => {
                if (Array.isArray(response?.confirmationData) && response.confirmationData.length > 0) {
                    // Save response for template usage
                    this.emailForwardingResponse = response;
                    // Stop the polling interval
                    this.stopPolling$.next();
                    this.stopPolling$.complete();
                }
            });
        }
    }

    /**
     * Validates and proceeds to next step
     * 
     * @param {MatStepper} stepper - Material stepper reference
     * @param {FormGroup} currentForm - Current step form
     * @param {number} stepNumber - Current step number
     * @memberof StepperFormComponent
     */
    public nextStep(stepper: MatStepper, currentForm: FormGroup, stepNumber: number): void {
        if (stepNumber === 1 && currentForm.get('forwardedMail').valid) {
            this.bankStatementStore.createEmailForwarding(
                {
                    forwardedMail: this.emailForwardingForm.value.forwardedMail + this.forwardedMailDomain
                }
            );
        } else {
            this.markFormGroupTouched(currentForm);
        }
    }

    /**
     * Goes to previous step (only if allowed)
     * 
     * @param {MatStepper} stepper - Material stepper reference
     * @memberof StepperFormComponent
     */
    public previousStep(stepper: MatStepper): void {
        const targetStep = stepper.selectedIndex - 1;
        if (targetStep >= this.minAllowedStep) {
            stepper.previous();
        } else {
            console.log(`Cannot go back to step ${targetStep}. Minimum allowed step is ${this.minAllowedStep}`);
            this.toaster.showSnackBar("error", "Cannot go back to previous step");
        }
    }

    /**
     * Navigates to a specific step
     * 
     * @param {number} stepIndex - Step index to navigate to (0-based)
     * @memberof StepperFormComponent
     */
    public navigateToStep(stepIndex: number): void {
        console.log(`Attempting to navigate to step index ${stepIndex}`);
        console.log(`Stepper available:`, !!this.stepper);
        console.log(`Stepper steps length:`, this.stepper?.steps?.length);
        console.log(`Current stepper selectedIndex:`, this.stepper?.selectedIndex);
        
        if (this.stepper && stepIndex >= 0 && stepIndex < this.stepper.steps.length) {
            // For linear steppers, mark all previous steps as completed
            for (let i = 0; i < stepIndex; i++) {
                const step = this.stepper.steps.get(i);
                if (step) {
                    step.completed = true;
                    step.editable = false;
                }
            }
            
            // Navigate to the target step
            this.stepper.selectedIndex = stepIndex;
            console.log(`✅ Successfully navigated to step index ${stepIndex} (step ${stepIndex + 1})`);
            console.log(`New stepper selectedIndex:`, this.stepper.selectedIndex);
        } else {
            console.warn(`❌ Cannot navigate to step index ${stepIndex}. Stepper available: ${!!this.stepper}, Steps length: ${this.stepper?.steps?.length}`);
        }
    }

    /**
     * Marks all form controls as touched to show validation errors
     * 
     * @private
     * @param {FormGroup} formGroup - Form group to mark as touched
     * @memberof StepperFormComponent
     */
    private markFormGroupTouched(formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach(key => {
            const control = formGroup.get(key);
            control?.markAsTouched();
        });
    }

    /**
     * Submits the complete form
     * 
     * @memberof StepperFormComponent
     */
    public submitForm(): void {
        if (this.emailForwardingForm.valid) {
            this.isLoading = true;
            const formData = this.emailForwardingForm.value;
            formData['forwardedMail'] = formData['forwardedMail'] + this.forwardedMailDomain;
            const { uniqueName, ...model } = formData;
            this.bankStatementStore.updateEmailForwarding({model, uniqueName});
            // setTimeout(() => {
            //     this.isLoading = false;
            //     this.router.navigate(['pages/bank-statement/list']);
            // }, 2000);
        } else {
            // Mark all forms as touched to show validation errors
            this.markFormGroupTouched(this.emailForwardingForm);
        }
    }

    /**
     * Cancels form and navigates back to list
     * 
     * @memberof StepperFormComponent
     */
    public cancelForm(): void {
        this.router.navigate(['pages/bank-statement/list']);
    }

    /**
     * Toggles email editing mode
     * 
     * @memberof StepperFormComponent
     */
    public toggleEmailEdit(isCancel: boolean): void {
        if (!this.isEditingEmail) {
            this.lastEmail = this.emailForwardingForm.get('forwardedMail')?.value;
            console.log("Save Last Email: ", this.lastEmail);
        }
        if (isCancel) {
            this.emailForwardingForm.get('forwardedMail')?.patchValue(this.lastEmail);
            this.lastEmail = "";
            console.log("Reset Last Email: ", this.lastEmail);
        }
        this.isEditingEmail = !this.isEditingEmail;
    }

    /**
     * Updates the forwardedMail query parameter while preserving all other query params and URL
     * 
     * @memberof StepperFormComponent
     */
    public replaceUrlEmail(): void {
        const completeEmail = this.getCompleteEmail();
        const currentParams = this.route.snapshot.queryParams;
        
        // Use Angular Router for proper URL handling
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { ...currentParams, forwardedMail: completeEmail },
            replaceUrl: true,
            queryParamsHandling: ''
        });
    }

    /**
     * Copies the complete email to clipboard
     * 
     * @memberof StepperFormComponent
     */
    public copyEmail(): void {
        const completeEmail = this.emailForwardingForm.get('forwardedMail')?.value + this.forwardedMailDomain;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(completeEmail).then(() => {
                console.log('Email copied to clipboard:', completeEmail);
                this.toaster.showSnackBar("success", "Email copied to clipboard ");
            }).catch(err => {
                console.error('Failed to copy email:', err);
                this.toaster.showSnackBar("error", "Failed to copy email");
            });
        }
    }

    /**
     * Handles verify and next action - opens confirm link in new tab and navigates to step 3
     * 
     * @memberof StepperFormComponent
     */
    public handleVerifyAndNext(): void {
        if (this.emailForwardingResponse?.confirmationData?.[0]?.confirmLink) {
            // Open verification link in new tab
            window.open(this.emailForwardingResponse.confirmationData[0].confirmLink, '_blank');
            
            // Navigate to step 3
            setTimeout(() => {
                this.router.navigate([], {
                    relativeTo: this.route,
                    queryParams: { 
                        ...this.route.snapshot.queryParams, 
                        step: 3 
                    },
                    replaceUrl: true
                });
                
                // Navigate stepper to step 3 (index 2)
                this.navigateToStep(2);
            }, 500);
            
            console.log('Opened verification link and navigating to step 3');
        } else {
            this.toaster.showSnackBar("error", "Verification link not available");
        }
    }

    /**
     * Handles cancel action - opens cancel link in new tab and redirects to onboarding
     * 
     * @memberof StepperFormComponent
     */
    public handleCancel(): void {
        if (this.emailForwardingResponse?.confirmationData?.[0]?.cancelLink) {
            // Open cancel link in new tab
            window.open(this.emailForwardingResponse.confirmationData[0].cancelLink, '_blank');
            
            // Redirect to onboarding page
            setTimeout(() => {
                this.router.navigate(['/pages/bank-statement/onboarding']);
            }, 500);
            
            console.log('Opened cancel link and redirecting to onboarding');
        } else {
            // If no cancel link, just redirect to onboarding
            this.router.navigate(['/pages/bank-statement/onboarding']);
        }
    }

    /**
     * Gets the complete email (prefix + domain)
     * 
     * @returns {string} Complete email address
     * @memberof StepperFormComponent
     */
    public getCompleteEmail(): string {
        const emailPrefix = this.emailForwardingForm.get('forwardedMail')?.value || '';
        return emailPrefix + this.forwardedMailDomain;
    }

    /**
     * Check if existing data is present and redirect to list page if found
     * 
     * @private
     * @memberof StepperFormComponent
     */
    private checkExistingDataAndRedirect(): void {
        // Call get all API to check if any data exists
        this.bankStatementStore.getAllEmailForwarding({ page: 1, count: 1 });
        
        // Subscribe to the result
        this.bankStatementStore.emailForwardingList$.pipe(
            takeUntil(this.destroyed$)
        ).subscribe((emailForwardingList) => {
            if (emailForwardingList && emailForwardingList.length > 0) {
                // Data exists, redirect to list page
                this.router.navigate(['pages', 'bank-statement', 'list']);
            }
        });
    }

    /**
     * Sets up subscription for account search results
     * 
     * @private
     * @memberof StepperFormComponent
     */
    private setupAccountSearchSubscription(): void {
        this.bankStatementStore.accountSearch$.pipe(
            debounceTime(200), 
            takeUntil(this.destroyed$)
        ).subscribe(accountSearchResponse => {
            if (accountSearchResponse && accountSearchResponse.results) {
                const formattedResults: any[] = [];
                accountSearchResponse.results.forEach(result => {
                    if (result?.uniqueName) {
                        formattedResults.push({
                            value: result.uniqueName,
                            label: result.name,
                            additional: result
                        });
                    }
                });
                
                // Set all results at once (no pagination)
                this.accountSearchResponseSubject.next(formattedResults);
                this.accountSearchRequest.isLoading = false;
            }
        });
    }

    /**
     * Gets error message for form control
     * 
     * @param {FormGroup} form - Form group
     * @param {string} controlName - Control name
     * @returns {string} Error message
     * @memberof StepperFormComponent
     */
    public getErrorMessage(form: FormGroup, controlName: string): string {
        const control = form.get(controlName);
        
        if (control?.hasError('required')) {
            return `${controlName} is required`;
        }
        
        if (control?.hasError('email')) {
            return 'Please enter a valid email address';
        }
        
        if (control?.hasError('pattern')) {
            return 'Please enter a valid format';
        }
        
        if (control?.hasError('minlength')) {
            return `Minimum length is ${control.errors?.['minlength']?.requiredLength}`;
        }
        
        if (control?.hasError('min')) {
            return `Minimum value is ${control.errors?.['min']?.min}`;
        }
        
        return '';
    }


    /**
     * Searches for accounts based on the query and updates the account search results.
     *
     * @memberof StepperFormComponent
     */
    private searchAccount(): void {
        this.accountSearchRequest.q = "";
        this.accountSearchRequest.isLoading = true;

        let requestObject = cloneDeep(this.accountSearchRequest);
        delete requestObject.isLoading;
        
        // Call the account search API through the store
        this.bankStatementStore.searchAccount(requestObject);
    }
}
