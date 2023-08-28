import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { OrganizationType } from '../../models/user-login-state';
import { OrganizationProfile } from '../constants/settings.constant';

@Component({
    selector: 'personal-information',
    templateUrl: './personal-information.component.html',
    styleUrls: ['./personal-information.component.scss']
})
export class PersonalInformationComponent implements OnInit, OnDestroy {

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
        taxType: ''
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

    constructor() { }

    /**
     * Initializes the component
     *
     * @memberof PersonalInformationComponent
     */
    public ngOnInit(): void {
        this.saveProfileSubject.pipe(debounceTime(5000), takeUntil(this.destroyed$)).subscribe(() => {
            this.saveProfile.emit(this.updatedData);
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
        this.updatedData[keyName] = this.profileData[keyName];
        this.saveProfileSubject.next(true);
    }

}
