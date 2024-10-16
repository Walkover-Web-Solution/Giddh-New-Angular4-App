import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { OrganizationType } from '../../models/user-login-state';
import { OrganizationProfile } from '../constants/settings.constant';
import { GeneralService } from '../../services/general.service';
import { ToasterService } from '../../services/toaster.service';
import { ClipboardService } from 'ngx-clipboard';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
    selector: 'personal-information',
    templateUrl: './personal-information.component.html',
    styleUrls: ['./personal-information.component.scss']
})
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
    public voucherApiVersion: 1 | 2;
    /** This will hold isCopied */
    public isCopied: boolean = false;
    /** This will hold portal url */
    public portalUrl: any = PORTAL_URL;
    /** Holds Profile Form */
    public profileForm: FormGroup;
    /** This will hold region */
    public region: string;

    constructor(private generalService: GeneralService, private toasty: ToasterService, private clipboardService: ClipboardService, private formBuilder: FormBuilder) {
        this.initProfileForm();
    }

    /**
     * Initializes the component
     *
     * @memberof PersonalInformationComponent
     */
    public ngOnInit(): void {
        this.region = localStorage.getItem('Country-Region') === 'GB' ? 'uk' : '';
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        this.isValidDomain = this.generalService.checkDashCharacterNumberPattern(this.profileData.portalDomain);
        this.saveProfileSubject.pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res && this.profileForm.dirty) {
                this.saveProfile.emit(this.updatedData);
            }
        });
    }

    /**
     * On Change of input properties
     *
     * @memberof PersonalInformationComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes?.profileData && changes.profileData.currentValue !== changes.profileData.previousValue) {
            let allowUpdate: boolean = false;
            if (this.profileData?.alias || this.profileData?.name) {
                this.profileForm.patchValue(this.profileData);
            }

            if (this.organizationType === 'COMPANY') {
                this.profileForm?.get('name')?.valueChanges?.pipe(takeUntil(this.destroyed$), debounceTime(700)).subscribe((value) => {
                    if (value && allowUpdate) {
                        this.profileUpdated('name');
                    }
                });
                this.profileForm?.get('portalDomain')?.valueChanges?.pipe(takeUntil(this.destroyed$), debounceTime(700)).subscribe((value) => {
                    if (value && allowUpdate) {
                        this.profileUpdated('portalDomain');
                    }
                });
                this.profileForm?.get('nameAlias')?.valueChanges?.pipe(takeUntil(this.destroyed$), debounceTime(700)).subscribe((value) => {
                    if (value && allowUpdate) {
                        this.profileUpdated('nameAlias');
                    }
                });
                this.profileForm?.get('headQuarterAlias')?.valueChanges?.pipe(takeUntil(this.destroyed$), debounceTime(700)).subscribe((value) => {
                    if (value && allowUpdate) {
                        this.profileUpdated('headQuarterAlias');
                    }
                });
            } else {
                this.profileForm?.get('alias')?.valueChanges?.pipe(takeUntil(this.destroyed$), debounceTime(700)).subscribe((value) => {
                    if (value && allowUpdate) {
                        this.profileUpdated('alias');
                    }
                });
            }
            setTimeout(() => {
                allowUpdate = true;
            }, 1500);
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
        if (keyName) {
            this.isValidDomain = this.generalService.checkDashCharacterNumberPattern(keyName);
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
        const urlToCopy = `${this.portalUrl}${this.profileData.portalDomain}?region=${this.region}`;
        this.clipboardService.copyFromContent(urlToCopy);
        this.isCopied = true;
        setTimeout(() => {
            this.isCopied = false;
        }, 3000);
    }
}
