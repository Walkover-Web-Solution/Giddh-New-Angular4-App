import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { currencyNumberSystems, digitAfterDecimal } from 'apps/web-giddh/src/app/shared/helpers/currencyNumberSystem';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OrganizationType } from '../../models/user-login-state';
import { IOption } from '../../theme/ng-select/ng-select';
import { OrganizationProfile } from '../constants/settings.constant';

@Component({
    selector: 'other-settings',
    templateUrl: './other-settings.component.html',
    styleUrls: ['./other-settings.component.scss']
})
export class OtherSettingsComponent implements OnInit, OnDestroy {

    /** Stores the company number system */
    public numberSystemSource: IOption[] = [];
    /** Stores the company decimal system */
    public decimalDigitSource: IOption[] = [];
    /** Updated data by the user */
    public updatedData: any = {};
    /** Company number system */
    public numberSystem: string;

    /** Decides when to emit the value for UPDATE operation */
    public saveProfileSubject: Subject<any> = new Subject();

    /** Emits the saved value */
    @Output() public saveProfile: EventEmitter<any> = new EventEmitter();
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
        balanceDisplayFormat: '',
        taxType: '',
        manageInventory: false
    };
    /** Stores the type of the organization (company or profile)  */
    @Input() public organizationType: OrganizationType;

    /** Subject to release subscriptions */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor() { }

    /**
     * Initializes the component
     *
     * @memberof OtherSettingsComponent
     */
    public ngOnInit(): void {
        currencyNumberSystems.map(currency => {
            this.numberSystemSource.push({ value: currency.value, label: `${currency.name}`, additional: currency });
        });
        digitAfterDecimal.map(d => {
            this.decimalDigitSource.push({ value: d.value, label: d.name });
        });
        this.saveProfileSubject.pipe(takeUntil(this.destroyed$)).subscribe(() => {
            this.saveProfile.emit(this.updatedData);
        });
        const currencySystem = currencyNumberSystems.find(numberSystem => numberSystem.value === this.profileData.balanceDisplayFormat)
        if (currencySystem) {
            this.numberSystem = currencySystem.name;
        }
    }

    /**
     * Unsubscribes from the listeners
     *
     * @memberof OtherSettingsComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Handles profile update operation
     *
     * @param {string} keyName Key updated
     * @memberof OtherSettingsComponent
     */
    public profileUpdated(keyName: string): void {
        this.updatedData[keyName] = this.profileData[keyName];
        this.saveProfileSubject.next();
    }

    /**
     * Inventory type update handler
     *
     * @param {boolean} value True, if Product is selected
     * @memberof OtherSettingsComponent
     */
    public inventoryTypeUpdated(value: boolean): void {
        this.profileData.manageInventory = value;
        this.profileUpdated('manageInventory');
    }
}
