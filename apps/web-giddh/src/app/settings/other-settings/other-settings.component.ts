import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { currencyNumberSystems, digitAfterDecimal } from 'apps/web-giddh/src/app/shared/helpers/currencyNumberSystem';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonActions } from '../../actions/common.actions';
import { OrganizationType } from '../../models/user-login-state';
import { GeneralService } from '../../services/general.service';
import { ToasterService } from '../../services/toaster.service';
import { AppState } from '../../store';
import { IOption } from '../../theme/ng-select/ng-select';
import { OrganizationProfile } from '../constants/settings.constant';

@Component({
    selector: 'other-settings',
    templateUrl: './other-settings.component.html',
    styleUrls: ['./other-settings.component.scss']
})
export class OtherSettingsComponent implements OnInit, OnChanges, OnDestroy {

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
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /** Subject to release subscriptions */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** List of supported locale */
    public translationLocales: IOption[] = [];
    /** This holds the active locale */
    public activeLocale: string = "";
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if need to show message */
    public showLanguageChangeMessage: boolean = false;
    /** List of available themes */
    public availableThemes: IOption[] = [];
    /** This holds the active theme */
    public activeTheme: string = "";

    constructor(private commonActions: CommonActions, private generalService: GeneralService, private store: Store<AppState>, private toasterService: ToasterService) { }

    /**
     * Initializes the component
     *
     * @memberof OtherSettingsComponent
     */
    public ngOnInit(): void {
        currencyNumberSystems.map(currency => {
            this.numberSystemSource.push({ value: currency?.value, label: `${currency.name}`, additional: currency });
        });
        digitAfterDecimal.map(d => {
            this.decimalDigitSource.push({ value: d?.value, label: d.name });
        });
        this.saveProfileSubject.pipe(takeUntil(this.destroyed$)).subscribe(() => {
            this.saveProfile.emit(this.updatedData);
        });
        const currencySystem = currencyNumberSystems.find(numberSystem => numberSystem?.value === this.profileData.balanceDisplayFormat);
        if (currencySystem) {
            this.numberSystem = currencySystem.name;
        }

        this.translationLocales = this.generalService.getSupportedLocales();
        this.availableThemes = this.generalService.getAvailableThemes();

        this.store.pipe(select(state => state.session.currentLocale), takeUntil(this.destroyed$)).subscribe(response => {
            this.activeLocale = response?.value;
        });

        this.store.pipe(select(state => state.session.activeTheme), takeUntil(this.destroyed$)).subscribe(response => {
            this.activeTheme = response?.value;
        });

        this.store.pipe(select(state => state.session.commonLocaleData), takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                this.commonLocaleData = response;

                if (this.showLanguageChangeMessage) {
                    this.toasterService.clearAllToaster();
                    this.toasterService.successToast(this.commonLocaleData?.app_language_selected);
                    this.showLanguageChangeMessage = false;
                }
            }
        });
    }

    /**
     * Lifecycle hook to get the value of input variables on change
     *
     * @param {SimpleChanges} changes
     * @memberof OtherSettingsComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        const currencySystem = currencyNumberSystems.find(numberSystem => numberSystem?.value === changes?.profileData?.currentValue?.balanceDisplayFormat);
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
        delete this.updatedData['manageInventory'];
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

    /**
     * This will set active locale
     *
     * @param {*} [event]
     * @memberof OtherSettingsComponent
     */
    public selectLocale(event?: any): void {
        if (event?.value) {
            this.store.dispatch(this.commonActions.setActiveLocale({ label: event?.label, value: event?.value }));
            this.showLanguageChangeMessage = true;
        } else {
            event = this.translationLocales[0];
            this.store.dispatch(this.commonActions.setActiveLocale({ label: event?.label, value: event?.value }));
        }
    }

    /**
     * Returns the information save text
     *
     * @param {*} companyName
     * @returns {string}
     * @memberof OtherSettingsComponent
     */
    public getInformationSaveText(companyName: any): string {
        let text = this.localeData?.all_information_save;
        text = text?.replace("[COMPANY_NAME]", companyName);
        return text;
    }

    /**
     * This will set active theme
     *
     * @param {*} [event]
     * @memberof OtherSettingsComponent
     */
    public setActiveTheme(event?: any): void {
        this.store.dispatch(this.commonActions.setActiveTheme({ label: event?.label, value: event?.value }));
    }
}
