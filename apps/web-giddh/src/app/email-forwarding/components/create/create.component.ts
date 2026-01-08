import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatStepper } from '@angular/material/stepper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ReplaySubject, interval, Subject, BehaviorSubject, Observable } from 'rxjs';
import { filter, takeUntil, switchMap, debounceTime } from 'rxjs/operators';
import { EmailForwardingResponse, YOU_ARE_NOT_ALLOWED } from '../../models/email-forwarding.model';
import { API_BULK_FETCH_LIMIT, ASIDE_PANE_CONFIG, BANK_STATEMENT_HELP_DOC_URL, EMAIL_VALIDATION_REGEX } from '../../../app.constant';
import { EmailForwardingComponentStore } from '../../store/email-forwarding.store';
import { GeneralService } from '../../../services/general.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddAccountRequest } from '../../../models/api-models/Account';
import { AppState } from '../../../store';
import { Store } from '@ngrx/store';
import { SalesActions } from '../../../actions/sales/sales.action';

@Component({
    selector: 'create',
    templateUrl: './create.component.html',
    styles: [``],
    providers: [EmailForwardingComponentStore]
})
export class CreateComponent implements OnInit, OnDestroy, AfterViewInit {
    /** Template Reference for Generic aside menu account */
    @ViewChild("accountAsideMenu") public accountAsideMenu: TemplateRef<any>;
    /** ViewChild reference to the stepper */
    @ViewChild('stepper', { static: false }) stepper!: MatStepper;
    /** Subject to handle component destruction */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Form groups for each step */
    public emailForwardingForm: FormGroup;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Loading state for the component */
    public isLoading: boolean = false;
    /** Edit mode flag */
    public isEditMode: boolean = false;
    /** Forwarded mail domain */
    public forwardedMailDomain: string = '';
    /** Flag to show/hide email input field */
    public isEditingEmail: boolean = false;
    /** Last email value */
    public lastEmail: string = '';
    /** Email forwarding response data for template usage */
    public emailForwardingResponse: EmailForwardingResponse | null = null;
    /** Subject to stop polling when data is received */
    private stopPolling$ = new Subject<void>();
    /** Current step from query params */
    public currentStep: number = 1;
    /** Minimum allowed step (prevents going back) */
    public minAllowedStep: number = 0;
    /** Target step to navigate to after view init */
    private targetStepIndex: number | null = null;
    /** Stores the search results for accounts */
    private accountSearchResponseSubject = new BehaviorSubject<any[]>([]);
    /** Observable for account search results */
    public accountSearchResponse$: Observable<any[]> = this.accountSearchResponseSubject.asObservable();
    /** Default result count for account searches */
    public defaultCount = API_BULK_FETCH_LIMIT;
    /** Request parameters for account searches */
    public accountSearchRequest: {isLoading: boolean, group: string} = {
        isLoading: false,
        group: 'bankaccounts'
    };
    /** Flag to prevent multiple account search calls */
    private accountSearchCalled: boolean = false;
    /** Flag to show/hide copy text */
    public isCopied: boolean = false;
    /** Bank statement help doc url */
    public bankStatementHelpDocUrl = BANK_STATEMENT_HELP_DOC_URL;
    /** Form submitted flag */
    public isFormSubmitted: boolean = false;
    /** Company unique name */  
    private companyUniqueName: string = '';
    /** Branch unique name */  
    private branchUniqueName: string = '';
    /** Holds images folder path */
    public imgPath: string = "";
    /** Holds true if setup email first time */
    public firstTimeCreate: boolean = false;
    /** Tracks whether confirmation polling has been started */
    private confirmationPollingStarted: boolean = false;
    /** Hold account aside menu reference  */
    public accountAsideMenuRef: MatDialogRef<any>;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private changeDetection: ChangeDetectorRef,
        private bankStatementStore: EmailForwardingComponentStore,
        private generalService: GeneralService,
        private dialog: MatDialog,
        private store: Store<AppState>,
        private salesAction: SalesActions
    ) {
        this.initializeForms();
    }

    /**
     * Component initialization
     * 
     * @memberof CreateComponent
     */
    public ngOnInit(): void {       
        this.companyUniqueName = this.generalService.companyUniqueName;
        this.branchUniqueName = this.generalService.currentBranchUniqueName;
        this.setupAccountSearchSubscription();
        this.getEmailFromQueryParams();
        this.imgPath = isElectron ? "assets/images/" : AppUrl + APP_FOLDER + "assets/images/";

        this.bankStatementStore.createUpdateEmailForwardingIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((response: unknown) => {
            if (response && response['uniqueName']) {
                this.isLoading = false;
                if (this.currentStep === 3) {
                    this.router.navigate(['pages/email-forwarding/list'], { queryParams: { companyUniqueName: this.companyUniqueName, branchUniqueName: this.branchUniqueName } });
                } else if (this.currentStep === 1) {
                    this.router.navigate(['pages/email-forwarding/create'], { 
                        queryParams: { 
                            companyUniqueName: this.companyUniqueName,
                            branchUniqueName: this.branchUniqueName,
                            forwardedMail: this.emailForwardingForm.value.forwardedMail + this.forwardedMailDomain,
                            uniqueName: response['uniqueName'],
                            step: 2
                        }
                    });
                }
            } else if (response === null || response === false) {
                this.isLoading = false;
            }
        });

        this.store.select(state => state.sales.createdAccountDetails).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                this.createUpdateAccountCallback(response);
            }
        });
    }

    /**
     * After view initialization - navigate to target step if set
     * 
     * @memberof CreateComponent
     */
    public ngAfterViewInit(): void {
        if (this.targetStepIndex !== null) {
            setTimeout(() => {
                this.navigateToStep(this.targetStepIndex!);
                this.targetStepIndex = null;
            }, 100);
        }
        this.getStepperIcon();
    }

       /**
     * This will use for get stepper icon
     *
     * @memberof CreateComponent
     */
    public getStepperIcon(): void {
         setTimeout(() => {
            if (this.stepper) {
                this.stepper._getIndicatorType = () => 'number';
                // Force change detection to update the stepper
                this.changeDetection.detectChanges();
            }
        }, 0);
    }

    /**
     * Initializes all form groups
     * 
     * @private
     * @memberof CreateComponent
     */
    private initializeForms(): void {
        this.emailForwardingForm = this.formBuilder.group({
            forwardedMail: ['', [Validators.required]],
            originalEmail: ['', Validators.pattern(EMAIL_VALIDATION_REGEX)],
            password: [''],
            accountUniqueName: [''],
            uniqueName: ['']
        });
    }

    /**
     * Checks if component is in edit mode and loads data
     * 
     * @private
     * @memberof CreateComponent
     */
    private checkEditMode(): void {
        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            if (params['uniqueName']) {
                this.isEditMode = true;
                this.handleUniqueName(params['uniqueName']);
                this.bankStatementStore.getEmailForwardingDetails(params['uniqueName']);

                // Load account search results first before setting up form patching
                this.searchAccount();

                this.bankStatementStore.emailForwardingDetails$.pipe(filter(Boolean), takeUntil(this.destroyed$)).subscribe((emailDetails) => {
                    this.emailForwardingForm.patchValue({
                        forwardedMail: emailDetails.forwardedMail,
                        originalEmail: emailDetails.originalEmail,
                        accountUniqueName: emailDetails.account.uniqueName,
                        uniqueName: emailDetails.uniqueName,
                        password: emailDetails.isPasswordSet ? YOU_ARE_NOT_ALLOWED : ""
                    });
                });
                
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
     * @memberof CreateComponent
     */
    private getEmailFromQueryParams(): void {
        this.route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe(queryParams => {
            // Handle step navigation from query params
            if (queryParams['step']) {
                const stepNumber = parseInt(queryParams['step'], 10);
                if (!isNaN(stepNumber) && stepNumber >= 1) {
                    this.currentStep = stepNumber;
                    this.minAllowedStep = stepNumber === 3 ? 1 : stepNumber - 1; // Allow navigation between steps 2 and 3 when on step 3
                    
                    // Convert 1-based to 0-based index
                    const targetStepIndex = stepNumber - 1;
                    this.checkEditMode();

                    if (this.currentStep === 3) {
                        this.searchAccount();
                    }
                    
                    // Navigate immediately if stepper is available, otherwise store for later
                    if (this.stepper) {
                        setTimeout(() => {
                            this.navigateToStep(targetStepIndex);
                        }, 100);
                    } else {
                        this.targetStepIndex = targetStepIndex;
                    }
                }
            }
            
            if (queryParams['forwardedMail']) {
                const [emailWithoutDomain, domain] = queryParams['forwardedMail'].split('@');
                this.forwardedMailDomain = `@${domain}`;
                this.emailForwardingForm.patchValue({
                    forwardedMail: emailWithoutDomain
                });
            } else {
                // Redirect to list page
                this.router.navigate(['/pages/email-forwarding/list'], { queryParams: { companyUniqueName: this.companyUniqueName, branchUniqueName: this.branchUniqueName } });
            }
            if (queryParams['uniqueName']) {
                this.handleUniqueName(queryParams['uniqueName']);
            }

            if (queryParams['initial']) {
                this.firstTimeCreate = true;
            }
        });
    }

    /**
     * Handles unique name for email forwarding
     * 
     * @param {string} uniqueName - Unique name of the email forwarding
     * @memberof CreateComponent
     */
    private handleUniqueName(uniqueName: string): void {
        this.emailForwardingForm.patchValue({
            uniqueName: uniqueName
        });
                
        if (this.currentStep === 2) {
            this.startConfirmationPolling(uniqueName);
        }
    }

    /**
     * Validates and proceeds to next step
     * 
     * @param {MatStepper} stepper - Material stepper reference
     * @param {FormGroup} currentForm - Current step form
     * @param {number} stepNumber - Current step number
     * @memberof CreateComponent
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
     * Navigates to a specific step
     * 
     * @param {number} stepIndex - Step index to navigate to (0-based)
     * @memberof CreateComponent
     */
    public navigateToStep(stepIndex: number): void {
        if (this.stepper && stepIndex >= 0 && stepIndex < this.stepper.steps.length) {
            // For linear steppers, mark all previous steps as completed
            for (let i = 0; i < stepIndex; i++) {
                const step = this.stepper.steps.get(i);
                if (step) {
                    step.completed = true;
                    step.editable = i >= this.minAllowedStep;
                }
            }
            
            // Navigate to the target step
            this.stepper.selectedIndex = stepIndex;
        }
    }

    /**
     * Starts polling for email forwarding confirmation data on step 2
     *
     * @private
     * @param {string} uniqueName - Unique name of the email forwarding
     * @returns {void}
     * @memberof CreateComponent
     */
    private startConfirmationPolling(uniqueName: string): void {
        if (!uniqueName || this.confirmationPollingStarted || this.emailForwardingResponse || this.stopPolling$.closed) {
            return;
        }

        this.confirmationPollingStarted = true;

        interval(5000).pipe(
            switchMap(() => {
                this.bankStatementStore.getEmailForwardingDetails(uniqueName);
                return this.bankStatementStore.emailForwardingDetails$;
            }),
            filter(Boolean),
            takeUntil(this.destroyed$),
            takeUntil(this.stopPolling$)
        ).subscribe((response: EmailForwardingResponse) => {
            if (Array.isArray(response?.confirmationData) && response.confirmationData.length > 0) {
                this.emailForwardingResponse = response;
                this.stopPolling$.next();
                this.stopPolling$.complete();
            }
        });
    }

    /**
     * Handles manual step selection changes from the stepper header
     *
     * @public
     * @param {StepperSelectionEvent} event - Stepper selection change event
     * @returns {void}
     * @memberof CreateComponent
     */
    public onStepSelectionChange(event: StepperSelectionEvent): void {
        if (!this.stepper) {
            return;
        }

        if (event.selectedIndex < this.minAllowedStep) {
            this.stepper.selectedIndex = Math.max(this.minAllowedStep, event.previouslySelectedIndex);
            return;
        }

        this.currentStep = event.selectedIndex + 1;

        if (this.currentStep === 2) {
            this.replaceUrlEmail();
            const uniqueName = this.emailForwardingForm.get('uniqueName')?.value;
            if (uniqueName) {
                this.startConfirmationPolling(uniqueName);
            }
        }
    }

    /**
     * Marks all form controls as touched to show validation errors
     * 
     * @private
     * @param {FormGroup} formGroup - Form group to mark as touched
     * @memberof CreateComponent
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
     * @memberof CreateComponent
     */
    public submitForm(): void {
        this.isFormSubmitted = true;
        if (this.emailForwardingForm.valid) {
            this.isLoading = true;
            const formData = { ...this.emailForwardingForm.value };
            if (this.isEditMode) {
                const passwordControl = this.emailForwardingForm.get('password');
                if (!passwordControl?.dirty || formData.password === YOU_ARE_NOT_ALLOWED || !formData.password) {
                    delete formData.password;
                }
            }
            if (!this.isEditMode) {
                formData['forwardedMail'] = formData['forwardedMail'] + this.forwardedMailDomain;
            }
            const { uniqueName, ...model } = formData;
            this.bankStatementStore.updateEmailForwarding({model, uniqueName});
        } else {
            // Mark all forms as touched to show validation errors
            this.markFormGroupTouched(this.emailForwardingForm);
        }
    }


    /**
     * Toggles email editing mode
     * 
     * @memberof CreateComponent
     */
    public toggleEmailEdit(isCancel: boolean): void {
        if (!this.isEditingEmail) {
            this.lastEmail = this.emailForwardingForm.get('forwardedMail')?.value;
        }
        if (isCancel) {
            this.emailForwardingForm.get('forwardedMail')?.patchValue(this.lastEmail);
            this.lastEmail = "";
        }
        this.isEditingEmail = !this.isEditingEmail;
    }

    /**
     * Updates the forwardedMail query parameter while preserving all other query params and URL
     * 
     * @memberof CreateComponent
     */
    public replaceUrlEmail(): void {
        const completeEmail = this.getCompleteEmail();
        
        // Use Angular Router for proper URL handling
        this.generalService.updateActivatedRouteQueryParams({
            companyUniqueName: this.companyUniqueName,
            branchUniqueName: this.branchUniqueName,
            ...this.route.snapshot.queryParams,
            step: this.currentStep,
            forwardedMail: completeEmail
        }, '');
    }

    /**
     * Copies the complete email to clipboard
     * 
     * @memberof CreateComponent
     */
    public copyEmail(): void {
        this.isCopied = true;
        setTimeout(() => {
            this.isCopied = false;
        }, 3000);
    }

    /**
     * Handles verify and next action - opens confirm link in new tab and navigates to step 3
     * 
     * @memberof CreateComponent
     */
    public handleVerifyAndNext(): void {
        if (this.emailForwardingResponse?.confirmationData?.[0]?.confirmLink) {
            // Open verification link in new tab
            window.open(this.emailForwardingResponse.confirmationData[0].confirmLink, '_blank');
            
            // Navigate to step 3
            setTimeout(() => {
                this.generalService.updateActivatedRouteQueryParams({
                    companyUniqueName: this.companyUniqueName,
                    branchUniqueName: this.branchUniqueName,
                    ...this.route.snapshot.queryParams,
                    step: 3
                });
                
                // Navigate stepper to step 3 (index 2)
                this.navigateToStep(2);
            }, 500);
            
        }
    }

    /**
     * Handles cancel action - opens cancel link in new tab and redirects to onboarding
     * 
     * @memberof CreateComponent
     */
    public handleCancel(): void {
        if (this.emailForwardingResponse?.confirmationData?.[0]?.cancelLink) {
            // Open cancel link in new tab
            window.open(this.emailForwardingResponse.confirmationData[0].cancelLink, '_blank');
            
            // Redirect to onboarding page
            setTimeout(() => {
                this.router.navigate(['/pages/email-forwarding/onboarding'], { queryParams: { companyUniqueName: this.companyUniqueName, branchUniqueName: this.branchUniqueName } });
            }, 500);
        } else {
            // If no cancel link, just redirect to onboarding
            this.router.navigate(['/pages/email-forwarding/onboarding'], { queryParams: { companyUniqueName: this.companyUniqueName, branchUniqueName: this.branchUniqueName } });
        }
    }

    /**
     * Gets the complete email (prefix + domain)
     * 
     * @returns {string} Complete email address
     * @memberof CreateComponent
     */
    public getCompleteEmail(): string {
        const emailPrefix = this.emailForwardingForm.get('forwardedMail')?.value || '';
        return this.isEditMode ? emailPrefix : emailPrefix + this.forwardedMailDomain;
    }

    /**
     * Sets up subscription for account search results
     * 
     * @private
     * @memberof CreateComponent
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
     * Searches for accounts
     *
     * @memberof CreateComponent
     */
    private searchAccount(): void {
        if (this.accountSearchCalled) {
            return; // Prevent multiple calls
        }
        this.accountSearchCalled = true;
        this.accountSearchRequest.isLoading = true;        
        this.bankStatementStore.searchAccount(this.accountSearchRequest.group);
    }

    /**
     * Navigates back to the list page
     * 
     * @memberof CreateComponent
     */
    public navigateBack(): void {
        this.router.navigate(['/pages/email-forwarding/list'], { queryParams: { companyUniqueName: this.companyUniqueName, branchUniqueName: this.branchUniqueName } });
    }
    
    /**
     * Component cleanup
     * 
     * @memberof CreateComponent
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
     * Toggle's account create/update dialog
     *
     * @memberof CreateComponent
     */
    public toggleAccountAsidePane(): void {
        this.accountAsideMenuRef = this.dialog.open(this.accountAsideMenu, ASIDE_PANE_CONFIG);
    }

    /**
     * Callback for add new account
     *
     * @param {AddAccountRequest} item
     * @memberof CreateComponent
     */
    public addNewAccount(item: AddAccountRequest): void {
        this.store.dispatch(this.salesAction.addAccountDetailsForSales(item));
    }

     /**
     * Callback after create/update account
     *
     * @private
     * @param {*} response
     * @memberof CreateComponent
     */
    private createUpdateAccountCallback(response: any): void {
        this.accountAsideMenuRef?.close();
        this.accountSearchCalled = false;
        this.searchAccount();
        this.emailForwardingForm.get('accountUniqueName')?.patchValue(response?.uniqueName);
    }
}
