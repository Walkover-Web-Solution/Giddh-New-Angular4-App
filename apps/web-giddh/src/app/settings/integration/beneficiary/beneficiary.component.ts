import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable, of as observableOf, ReplaySubject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { SettingsIntegrationService } from "../../../services/settings.integraion.service";
import { ToasterService } from "../../../services/toaster.service";

@Component({
    selector: 'beneficiary',
    templateUrl: './beneficiary.component.html',
    styleUrls: ['./beneficiary.component.scss']
})
export class BeneficiaryComponent implements OnInit, OnDestroy {
    /** This will hold urn of bank */
    @Input() public urn: any;
    /* Emitting the close popup event */
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);

    /** True if beneficiary registration form is visible */
    public isBeneficiaryFormVisible: boolean = false;
    /** True if beneficiary registration is in progress */
    public isBeneficiaryRegistrationInProgress$: Observable<boolean> = observableOf(false);
    /** This will hold added beneficiaries */
    public accountBeneficiaries: any[] = [];
    /** Add Beneficiary Form Group */
    public addBeneficiaryForm: FormGroup;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True if get all api call in progress */
    public isLoading: boolean = true;

    constructor(
        private fb: FormBuilder,
        private toaster: ToasterService,
        private settingsIntegrationService: SettingsIntegrationService
    ) {

    }

    /**
     * Initializes the component
     *
     * @memberof BeneficiaryComponent
     */
    public ngOnInit(): void {
        this.getBeneficiaries();

        this.addBeneficiaryForm = this.fb.group({
            bnfName: ['', Validators.required],
            bnfNickName: ['', Validators.required],
            bnfAccNo: ['', Validators.compose([Validators.required, Validators.minLength(9), Validators.maxLength(18)])],
            ifsc: ['', Validators.required]
        });
    }

    /**
     * Toggle's the beneficiary registration form
     *
     * @memberof BeneficiaryComponent
     */
    public toggleBeneficiaryForm(): void {
        this.isBeneficiaryFormVisible = !this.isBeneficiaryFormVisible;
    }

    /**
     * This will get beneficiaries
     *
     * @memberof BeneficiaryComponent
     */
    public getBeneficiaries(): void {
        this.isLoading = true;
        this.settingsIntegrationService.getBeneficiaries(this.urn).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response?.body?.length > 0) {
                this.accountBeneficiaries = response.body;
            }
            this.isLoading = false;
        });
    }

    /**
     * This will save beneficiary
     *
     * @memberof BeneficiaryComponent
     */
    public saveBeneficiary(): void {
        if (!this.addBeneficiaryForm.invalid) {
            this.isBeneficiaryRegistrationInProgress$ = observableOf(true);

            let beneficiaryDetails = {
                BnfName: this.addBeneficiaryForm.get('bnfName').value,
                BnfNickName: this.addBeneficiaryForm.get('bnfNickName').value,
                BnfAccNo: this.addBeneficiaryForm.get('bnfAccNo').value,
                IFSC: this.addBeneficiaryForm.get('ifsc').value
            };

            this.settingsIntegrationService.beneficiaryRegistration(beneficiaryDetails, this.urn).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                this.isBeneficiaryRegistrationInProgress$ = observableOf(false);
                this.toaster.clearAllToaster();

                if (response?.status === "success") {
                    this.toaster.successToast(response?.body?.Message);
                    this.addBeneficiaryForm.reset();
                    this.getBeneficiaries();
                } else {
                    this.toaster.errorToast(response?.message);
                }
            });
        }
    }

    /**
     * This will validate beneficiary
     *
     * @param {*} bnfAccNo
     * @memberof BeneficiaryComponent
     */
    public validateBeneficiary(bnfAccNo: any): void {
        let model = {
            bnfAccNo: bnfAccNo,
            urn: this.urn
        };

        this.settingsIntegrationService.beneficiaryValidation(model).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.toaster.clearAllToaster();

            if (response?.status === "success" && response?.body?.Response === "SUCCESS") {
                this.toaster.successToast("Beneficiary has been validated successfully.");
            } else {
                this.toaster.errorToast("There is some issue in beneficiary validation. Please try again.");
            }
        });
    }

    /**
     * This will send the event to close the aside pan
     *
     * @memberof BeneficiaryComponent
     */
    public closeAsidePane(): void {
        this.closeAsideEvent.emit(true);
    }

    /**
     * This will validate account number
     *
     * @memberof BeneficiaryComponent
     */
    public validateAccountNo(element: any): void {
        if (element && element.value && element.value.length < 9) {
            this.toaster.errorToast("Account number must contain 9 to 18 characters");
            element.classList.add('error-box');
        } else {
            element.classList.remove('error-box');
        }
    }

    /**
     * Releases the memory
     *
     * @memberof BeneficiaryComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
