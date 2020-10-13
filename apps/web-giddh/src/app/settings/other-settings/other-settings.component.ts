import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { currencyNumberSystems, digitAfterDecimal } from 'apps/web-giddh/src/app/shared/helpers/currencyNumberSystem';
import { ReplaySubject, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { IOption } from '../../theme/ng-select/ng-select';
import { OrganizationProfile } from '../constants/settings.constant';

@Component({
    selector: 'other-settings',
    templateUrl: './other-settings.component.html',
    styleUrls: ['./other-settings.component.scss']
})
export class OtherSettingsComponent implements OnInit, OnDestroy {

    public isBranchElement: boolean = false;
    public numberSystemSource: IOption[] = [];
    public decimalDigitSource: IOption[] = [];
    /** Updated data by the user */
    public updatedData: any = {};

    /** Decides when to emit the value for UPDATE operation */
    public saveProfileSubject: Subject<any> = new Subject();

    /** Emits the saved value */
    @Output() public saveProfile: EventEmitter<any> = new EventEmitter();
    /** Stores the profile data of an organization (company or profile) */
    @Input() public profileData: OrganizationProfile = {
        name: '',
        uniqueName: '',
        logo: '',
        alias: '',
        parent: {},
        country: {
            countryName: '',
            currencyName: '',
            currencyCode: ''
        },
        businessTypes: [],
        businessType: '',
        headquarterAlias: '',
        balanceDisplayFormat: ''
    };

    /** Subject to release subscriptions */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor() { }

    ngOnInit(): void {
        currencyNumberSystems.map(c => {
            this.numberSystemSource.push({ value: c.value, label: `${c.name}`, additional: c });
        });
        digitAfterDecimal.map(d => {
            this.decimalDigitSource.push({ value: d.value, label: d.name });
        });
        this.saveProfileSubject.pipe(debounceTime(5000), takeUntil(this.destroyed$)).subscribe(() => {
            this.saveProfile.emit(this.updatedData);
        });
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    profileUpdated(keyName: string): void {
        this.updatedData[keyName] = this.profileData[keyName];
        this.saveProfileSubject.next();
    }
}
