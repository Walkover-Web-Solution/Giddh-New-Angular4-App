import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { currencyNumberSystems, digitAfterDecimal } from 'apps/web-giddh/src/app/shared/helpers/currencyNumberSystem';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonActions } from '../../actions/common.actions';
import { OrganizationType } from '../../models/user-login-state';
import { GeneralService } from '../../services/general.service';
import { ToasterService } from '../../services/toaster.service';
import { UiSettingsService } from '../../services/ui-settings.service';
import { AppState } from '../../store';
import { IOption } from '../../app.constant';
import { CurrencyDisplayFormat, OrganizationProfile } from '../constants/settings.constant';
import { LedgerViewEnum } from '../../models/api-models/Ledger';

@Component({
    selector: 'other-settings',
    templateUrl: './other-settings.component.html',
    styleUrls: ['./other-settings.component.scss'],
    standalone: false
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
    /** Stores the voucher API version of current company */
    public voucherApiVersion: number;

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
        manageInventory: false,
        withPay: false,
        ledgerView: LedgerViewEnum.TView,
        showAccountUniqueName: false,
        autoGenerateNote: false,
        currencyDisplayFormat: CurrencyDisplayFormat.Code,
        batchTrackingEnabled: false
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
    /** List of available ledger view */
    public availableLedgerView: IOption[] = [];
    /** Stores the company decimal system */
    public inventoryType: IOption[] = [];
    /** This holds the active theme */
    public activeTheme: string = "";
    /** Holds Current Theme Label */
    public currentThemeLabel: string;
    /** True if consolidated branch */
    public isConsolidatedBranch: boolean;
    /** Holds ledger view enum */
    public ledgerViewEnum: typeof LedgerViewEnum = LedgerViewEnum;
    /** Holds currency display format enum (exposed for template) */
    public currencyDisplayFormatEnum: typeof CurrencyDisplayFormat = CurrencyDisplayFormat;
    /** Tracks showAccountUniqueNameInParticularDropdown UI setting */
    public showAccountUniqueName: boolean = false;

    constructor(
        private commonActions: CommonActions,
        private generalService: GeneralService,
        private store: Store<AppState>,
        private toasterService: ToasterService,
        private uiSettingsService: UiSettingsService
    ) { }

    /**
     * Initializes the component
     *
     * @memberof OtherSettingsComponent
     */
    public ngOnInit(): void {
        this.showAccountUniqueName = this.uiSettingsService.getShowAccountUniqueName();
        
        if (this.profileData) {
            this.profileData.showAccountUniqueName = this.showAccountUniqueName;
        }
        
        /** If this is true, it means we are in branch consolidated mode.  */
        this.store.pipe(select(select => select.branchConsolidated), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isConsolidatedBranch = response.isBranchConsolidated;
            }
        });
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
        this.availableLedgerView = this.generalService.getAvailableLedgerView();

        this.voucherApiVersion = this.generalService.voucherApiVersion;

        this.store.pipe(select(state => state.session.currentLocale), takeUntil(this.destroyed$)).subscribe(response => {
            this.activeLocale = response?.value;
        });

        this.store.pipe(select(state => state.session.activeTheme), takeUntil(this.destroyed$)).subscribe(response => {
            if(response) {
                this.activeTheme = response?.value;
                this.currentThemeLabel = this.availableThemes.find(theme => theme.value === this.activeTheme)?.label;
            }
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
     * Get Dropdown field label by value
     *
     * @returns {string}
     * @memberof OtherSettingsComponent
     */
    public getDropdownLabel(options: IOption[], currentValue: string | number): string {
        const listItem = options.find(item => item.value === currentValue);
        return listItem ? listItem.label : '';
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
        this.saveProfileSubject.next(true);
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

    /**
     * Builds the PDF currency format tooltip by substituting
     * [SYMBOL] / [CODE] placeholders with the company's currency values.
     *
     * @returns {string}
     * @memberof OtherSettingsComponent
     */
    public get pdfCurrencyFormatTooltip(): string {
        const tooltip: string = this.localeData?.pdf_currency_format_tooltip ?? '';
        return tooltip
            .replace('[SYMBOL]', this.profileData?.baseCurrencySymbol ?? '')
            .replace('[CODE]', this.profileData?.baseCurrency ?? '');
    }

    /**
     * Toggles showAccountUniqueName setting
     *
     * @public
     * @param {boolean} value - New toggle value
     * @memberof OtherSettingsComponent
     */
    public toggleShowAccountUniqueName(value: boolean): void {
        this.showAccountUniqueName = value;
        if (this.profileData) {
            this.profileData.showAccountUniqueName = value;
        }
        const success = this.uiSettingsService.setShowAccountUniqueName(value);
        if (!success) {
            this.toasterService.errorToast(this.commonLocaleData?.app_something_went_wrong);
        }
    }
}
