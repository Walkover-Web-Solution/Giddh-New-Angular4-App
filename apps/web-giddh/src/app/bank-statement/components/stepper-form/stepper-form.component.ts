import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatStepper } from '@angular/material/stepper';
import { ReplaySubject, interval, Subject } from 'rxjs';
import { filter, takeUntil, switchMap, startWith, takeWhile } from 'rxjs/operators';
import { BankStatementComponentStore } from '../../store/bank-statement.store';
import { ToasterService } from '../../../services/toaster.service';
import { EmailForwardingResponse } from '../../models/email-forwarding.model';

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
    /** Subject to handle component destruction */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Form groups for each step */
    public emailForwardingForm: FormGroup;
    /** Loading state for async operations */
    public isLoading: boolean = false;
    /** Edit mode flag */
    public isEditMode: boolean = false;
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
    /** ViewChild reference to the stepper */
    @ViewChild('stepper', { static: false }) stepper!: MatStepper;
    /** Target step to navigate to after view init */
    private targetStepIndex: number | null = null;
    
    /**
     * Creates an instance of StepperFormComponent
     * 
     * @param {FormBuilder} formBuilder - Angular form builder service
     * @param {Router} router - Angular router service
     * @param {ActivatedRoute} route - Angular activated route service
     * @param {Location} location - Angular location service
     * @param {ToasterService} toaster - Toaster service
     * @param {BankStatementComponentStore} bankStatementStore - Bank statement component store
     * @memberof StepperFormComponent
     */
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        private toaster: ToasterService,
        private bankStatementStore: BankStatementComponentStore
    ) {
        this.initializeForms();
    }

    /**
     * Component initialization
     * 
     * @memberof StepperFormComponent
     */
    public ngOnInit(): void {
        this.getEmailFromQueryParams();
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
                // this.statementId = params['uniqueName'];
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
                    
                    // Store target step (convert 1-based to 0-based index)
                    this.targetStepIndex = stepNumber - 1;
                    
                    console.log(`Will navigate to step ${stepNumber} (index ${this.targetStepIndex}), minimum allowed step index: ${this.minAllowedStep}`);
                }
            }
            
            if (queryParams['forwardedMail']) {
                const [emailWithoutDomain, domain] = queryParams['forwardedMail'].split('@');
                this.forwardedMailDomain = `@${domain}`;
                this.emailForwardingForm.patchValue({
                    forwardedMail: emailWithoutDomain
                });
                console.log('Email from query params:', queryParams['forwardedMail']);
            }
            if (queryParams['uniqueName']) {
                this.emailForwardingForm.patchValue({
                    uniqueName: queryParams['uniqueName']
                });
                
                // Poll API every 5 seconds
                interval(5000).pipe(
                    startWith(0), // Start immediately
                    switchMap(() => {
                        this.bankStatementStore.getEmailForwardingDetails(queryParams['uniqueName']);
                        return this.bankStatementStore.emailForwardingDetails$;
                    }),
                    filter(Boolean),
                    takeUntil(this.destroyed$),
                    takeUntil(this.stopPolling$) // Stop polling when stopPolling$ emits
                ).subscribe((response: EmailForwardingResponse) => {
                    if (Array.isArray(response?.confirmationData) && response.confirmationData.length > 0) {
                        // Save response for template usage
                        this.emailForwardingResponse = response;
                        console.info('Email forwarding details:', response);
                        console.warn('Confirmation data received, stopping polling...');
                        // Stop the polling interval
                        this.stopPolling$.next();
                        this.stopPolling$.complete();
                    }
                });
            }
        });
    }

    /**
     * Validates and proceeds to next step
     * 
     * @param {MatStepper} stepper - Material stepper reference
     * @param {FormGroup} currentForm - Current step form
     * @memberof StepperFormComponent
     */
    public nextStep(stepper: MatStepper, currentForm: FormGroup, stepNumber: number): void {
        debugger;
        if (currentForm.valid) {
            if (stepNumber === 1) {
                this.bankStatementStore.createEmailForwarding(
                    {
                        forwardedMail: this.emailForwardingForm.value.forwardedMail + this.forwardedMailDomain
                    }
                );

                this.bankStatementStore.createUpdateEmailForwardingIsSuccess$.pipe(filter(Boolean), takeUntil(this.destroyed$)).subscribe((response: EmailForwardingResponse) => {
                    if (response?.uniqueName) {
                        this.router.navigate(['pages/bank-statement/create'], { 
                            queryParams: { 
                                forwardedMail: this.emailForwardingForm.value.forwardedMail + this.forwardedMailDomain,
                                uniqueName: response.uniqueName,
                                step: 2
                            }
                        });
                        stepper.next();
                    }
                });
            }
            // stepper.next();
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
            
            // const formData: BankStatementFormData = {
            //     ...this.bankDetailsForm.value,
            //     ...this.statementDetailsForm.value,
            //     ...this.processingOptionsForm.value
            // };

            // Mock submission - replace with actual service call
            setTimeout(() => {
                // console.log('Form submitted:', formData);
                this.isLoading = false;
                this.router.navigate(['/bank-statement/list']);
            }, 2000);
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
        this.router.navigate(['/bank-statement/list']);
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
}
