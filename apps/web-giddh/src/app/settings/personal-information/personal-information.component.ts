import { Component, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { debounceTime, takeUntil, pairwise, filter } from 'rxjs/operators';
import { OrganizationType } from '../../models/user-login-state';
import { OrganizationProfile } from '../constants/settings.constant';
import { GeneralService } from '../../services/general.service';
import { ToasterService } from '../../services/toaster.service';
import { ClipboardService } from 'ngx-clipboard';
import { FormBuilder, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
import { ServiceConfig } from '../../services/service.config';
/**
 * Handles Component functionality
 */
@Component({
    selector: 'personal-information',
    templateUrl: './personal-information.component.html',
    styleUrls: ['./personal-information.component.scss'],
    standalone: false
})
/**
 * PersonalInformationComponent component
 * Handles personalinformation functionality and user interactions
 */
export class PersonalInformationComponent implements OnInit, OnChanges, OnDestroy {

    /** Decides when to emit the value for UPDATE operation */
    public saveProfileSubject: Subject<any> = new Subject();
    /** Updated data by the user */
    public updatedData: any = {};
    /** Stores the profile data of an organization (company or profile) */
    @Input() public profileData: OrganizationProfile = {
        name: '',
        uniqueName: '',
        companyName: '',
        logo: '',
        alias: '',
        parent: {},
        country: {
            countryName: '',
            countryCode: '',
            currencyName: '',
            currencyCode: ''
        },
        baseCurrencySymbol: '',
        baseCurrency: '',
        businessTypes: [],
        businessType: '',
        nameAlias: '',
        headQuarterAlias: '',
        taxType: '',
        portalDomain: ''
    };
    /** Stores the type of the organization (company or profile)  */
    @Input() public organizationType: OrganizationType;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** Emits the saved value */
    @Output() public saveProfile: EventEmitter<any> = new EventEmitter();
    /** Subject to release subscriptions */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Portal Domain name validation with regex pattern */
    public isValidDomain: boolean;
    /** Stores the voucher API version of company */
    public voucherApiVersion: number;
    /** This will hold isCopied */
    public isCopied: boolean = false;
    /** This will hold portal url */
    public portalUrl: string = '';
    /** Holds Profile Form */
    public profileForm: FormGroup;
    /** This will hold region */
    public region: string;
    /** Holds Portal Login Url */
    public portalLoginUrl: string = "";
    /** True if consolidated branch */
    public isConsolidatedBranch: boolean;

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(@Inject(ServiceConfig) private serviceConfig,  private generalService: GeneralService, private toasty: ToasterService, private clipboardService: ClipboardService, private formBuilder: FormBuilder, private store: Store<AppState>) {
        this.initProfileForm();
        this.portalUrl = (this.serviceConfig.PORTAL_URL || PORTAL_URL);
    }

    /**
     * Initializes the component
     *
     * @memberof PersonalInformationComponent
     */
    public ngOnInit(): void {
        this.store.pipe(select(select => select.branchConsolidated), takeUntil(this.destroyed$)).subscribe(response => {
            /**
             * Handles if functionality
             */
            if (response) {
                this.isConsolidatedBranch = response.isBranchConsolidated;
            }
        });
        this.region = localStorage.getItem('Country-Region') === 'GB' ? 'uk' : 'in';
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        this.isValidDomain = this.generalService.checkDashCharacterNumberPattern(this.profileData.portalDomain);
        this.saveProfileSubject.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            /**
             * Handles if functionality
             */
            if (res && this.profileForm.dirty) {
                this.saveProfile.emit(this.updatedData);
            }
        });
    }

    /**
     * Handles profile update operation
     *
     * @param {any} event
     * @memberof PersonalInformationComponent
     */
    public updateOtherSettings(event): void {
        this.saveProfile.emit(event);
    }

    /**
     * On Change of input properties
     *
     * @memberof PersonalInformationComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        /**
         * Handles if functionality
         */
        if (changes?.profileData && changes.profileData.currentValue !== changes.profileData.previousValue) {
            /**
             * Handles if functionality
             */
            if (this.profileData?.alias || this.profileData?.name) {
                this.profileForm.patchValue(this.profileData);
                this.portalLoginUrl = `${this.portalUrl}${this.profileData.portalDomain}/${this.region}/login`;
            }

            /**
             * Handles if functionality
             */
            if (this.organizationType === 'COMPANY') {
                this.profileForm?.get('name')?.valueChanges?.pipe(
                    /**
                     * Handles takeUntil functionality
                     */
                    takeUntil(this.destroyed$),
                    /**
                     * Handles debounceTime functionality
                     */
                    debounceTime(700),
                    /**
                     * Handles pairwise functionality
                     */
                    pairwise(), // Emits [previousValue, currentValue]
                    /**
                     * Handles filter functionality
                     */
                    filter(([prev, curr]) => prev !== curr) // Only proceed if values are different
                ).subscribe(([prev, curr]) => {
                    this.profileUpdated('name');
                });

                this.profileForm?.get('portalDomain')?.valueChanges?.pipe(
                    /**
                     * Handles takeUntil functionality
                     */
                    takeUntil(this.destroyed$),
                    /**
                     * Handles debounceTime functionality
                     */
                    debounceTime(700),
                    /**
                     * Handles pairwise functionality
                     */
                    pairwise(),
                    /**
                     * Handles filter functionality
                     */
                    filter(([prev, curr]) => prev !== curr)
                ).subscribe(([prev, curr]) => {
                    this.profileUpdated('portalDomain');
                });

                this.profileForm?.get('nameAlias')?.valueChanges?.pipe(
                    /**
                     * Handles takeUntil functionality
                     */
                    takeUntil(this.destroyed$),
                    /**
                     * Handles debounceTime functionality
                     */
                    debounceTime(700),
                    /**
                     * Handles pairwise functionality
                     */
                    pairwise(),
                    /**
                     * Handles filter functionality
                     */
                    filter(([prev, curr]) => prev !== curr)
                ).subscribe(([prev, curr]) => {
                    this.profileUpdated('nameAlias');
                });

                this.profileForm?.get('headQuarterAlias')?.valueChanges?.pipe(
                    /**
                     * Handles takeUntil functionality
                     */
                    takeUntil(this.destroyed$),
                    /**
                     * Handles debounceTime functionality
                     */
                    debounceTime(700),
                    /**
                     * Handles pairwise functionality
                     */
                    pairwise(),
                    /**
                     * Handles filter functionality
                     */
                    filter(([prev, curr]) => prev !== curr)
                ).subscribe(([prev, curr]) => {
                    this.profileUpdated('headQuarterAlias');
                });
            } else {
                this.profileForm?.get('alias')?.valueChanges?.pipe(
                    /**
                     * Handles takeUntil functionality
                     */
                    takeUntil(this.destroyed$),
                    /**
                     * Handles debounceTime functionality
                     */
                    debounceTime(700),
                    /**
                     * Handles pairwise functionality
                     */
                    pairwise(),
                    /**
                     * Handles filter functionality
                     */
                    filter(([prev, curr]) => prev !== curr)
                ).subscribe(([prev, curr]) => {
                    this.profileUpdated('alias');
                });
            }

        }
    }

    /**
     * Initialise Form
     *
     * @private
     * @memberof PersonalInformationComponent
     */
    private initProfileForm(profileData?: any): void {
        this.profileForm = this.formBuilder.group({
            name: [profileData?.name ?? ''],
            uniqueName: [profileData?.uniqueName ?? ''],
            companyName: [profileData?.companyName ?? ''],
            logo: [profileData?.logo ?? ''],
            alias: [profileData?.alias ?? ''],
            parent: [profileData?.parent ?? {}],
            country: this.formBuilder.group({
                countryName: [profileData?.country?.countryName ?? ''],
                countryCode: [profileData?.country?.countryCode ?? ''],
                currencyName: [profileData?.country?.currencyName ?? ''],
                currencyCode: [profileData?.country?.currencyCode ?? '']
            }),
            baseCurrencySymbol: [profileData?.baseCurrencySymbol ?? ''],
            baseCurrency: [profileData?.baseCurrency ?? ''],
            businessTypes: [profileData?.businessTypes ?? []],
            businessType: [profileData?.businessType ?? ''],
            nameAlias: [profileData?.nameAlias ?? ''],
            headQuarterAlias: [profileData?.headQuarterAlias ?? ''],
            taxType: [profileData?.taxType ?? ''],
            portalDomain: [profileData?.portalDomain ?? '']
        });
    }

    /**
     * Unsubscribes from listeners
     *
     * @memberof PersonalInformationComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Handles profile update operation
     *
     * @param {string} keyName Key to be updated
     * @memberof PersonalInformationComponent
     */
    public profileUpdated(keyName: string): void {
        const value = this.profileForm?.get(keyName).value;
        /**
         * Handles if functionality
         */
        if (this.updatedData[keyName] !== value) {
            this.updatedData[keyName] = value;
            this.saveProfileSubject.next(true);
        }
    }

    /**
     * This will be use for check portal domain validation
     *
     * @param {*} keyName
     * @return {*}  {void}
     * @memberof PersonalInformationComponent
     */
    public checkPortalDomain(keyName: any): void {
        /**
         * Handles if functionality
         */
        if (keyName) {
            this.isValidDomain = this.generalService.checkDashCharacterNumberPattern(keyName);
            /**
             * Handles if functionality
             */
            if (this.isValidDomain) {
                this.profileUpdated('portalDomain');
            } else {
                this.toasty.errorToast(this.localeData.domain_error_message);
            }
        }
    }

    /**
     *This will use for copy api url link and display copied
     *
     * @memberof PersonalInformationComponent
     */
    public copyUrl(): void {
        const urlToCopy = this.portalLoginUrl;
        this.clipboardService.copyFromContent(urlToCopy);
        this.isCopied = true;
        /**
         * Sets timeout value
         */
        setTimeout(() => {
            this.isCopied = false;
        }, 3000);
    }
}
