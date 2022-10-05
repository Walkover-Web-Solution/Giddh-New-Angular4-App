import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { IOption } from '../../theme/ng-select/option.interface';
import { TaxResponse } from '../../models/api-models/Company';
import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { AppState } from '../../store';
import { select, Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import * as dayjs from 'dayjs';
import { SettingsTaxesActions } from '../../actions/settings/taxes/settings.taxes.action';
import { uniqueNameInvalidStringReplace } from '../helpers/helperFunctions';
import { IForceClear } from "../../models/api-models/Sales";
import { GIDDH_DATE_FORMAT } from '../helpers/defaultDateFormat';
import { SalesService } from '../../services/sales.service';
import { cloneDeep } from '../../lodash-optimized';

@Component({
    selector: 'aside-menu-create-tax-component',
    templateUrl: './aside-menu-create-tax.component.html',
    styleUrls: [`./aside-menu-create-tax.component.scss`]
})
export class AsideMenuCreateTaxComponent implements OnInit, OnChanges, OnDestroy {
    @Output() public closeEvent: EventEmitter<boolean> = new EventEmitter();
    @Input() public tax: TaxResponse;
    @Input() public asidePaneState: string;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    public taxList: IOption[] = [];
    public duration: IOption[] = [];
    public tdsTcsTaxSubTypes: IOption[] = [];
    public allTaxes: IOption[] = [];
    public selectedTaxType: string = '';
    public checkIfTdsOrTcs: boolean = false;
    public days: IOption[] = [];
    public newTaxObj: TaxResponse = new TaxResponse();
    public linkedAccountsOption: IOption[] = [];
    public isTaxCreateInProcess: boolean = false;
    public isUpdateTaxInProcess: boolean = false;
    public taxListSource$: Observable<IOption[]> = observableOf([]);
    public taxNameTypesMapping: any[] = [];
    public selectedTax: string = '';
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This holds giddh date format */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;

    constructor(
        private store: Store<AppState>,
        private _settingsTaxesActions: SettingsTaxesActions,
        private salesService: SalesService
    ) {
        this.newTaxObj.date = dayjs().toDate();
    }

    ngOnInit() {
        for (let i = 1; i <= 31; i++) {
            this.days.push({ label: i?.toString(), value: i?.toString() });
        }
        this.duration = [
            { label: this.commonLocaleData?.app_duration?.monthly, value: 'MONTHLY' },
            { label: this.commonLocaleData?.app_duration?.quarterly, value: 'QUARTERLY' },
            { label: this.commonLocaleData?.app_duration?.half_yearly, value: 'HALFYEARLY' },
            { label: this.commonLocaleData?.app_duration?.yearly, value: 'YEARLY' }
        ];

        this.tdsTcsTaxSubTypes = [
            { label: this.commonLocaleData?.app_tax_subtypes?.receivable, value: 'rc' },
            { label: this.commonLocaleData?.app_tax_subtypes?.payable, value: 'pay' }
        ];

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany && activeCompany.countryV2) {
                this.getTaxList(activeCompany.countryV2.alpha2CountryCode);
            }
        });

        this.loadLinkedAccounts();

        this.store
            .pipe(select(p => p.company && p.company.taxes), takeUntil(this.destroyed$))
            .subscribe(taxes => {
                if (taxes && taxes.length) {
                    let arr: IOption[] = [];
                    taxes.forEach(tax => {
                        arr.push({ label: tax.name, value: tax.uniqueName });
                    });
                    this.allTaxes = arr;
                }
            });

        this.store
            .pipe(select(p => p.company && p.company.isTaxCreationInProcess), takeUntil(this.destroyed$))
            .subscribe(result => this.isTaxCreateInProcess = result);
        this.store
            .pipe(select(p => p.company && p.company.isTaxUpdatingInProcess), takeUntil(this.destroyed$))
            .subscribe(result => this.isUpdateTaxInProcess = result);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if ('tax' in changes && changes.tax.currentValue && (changes.tax.currentValue !== changes.tax.previousValue)) {
            this.checkIfTdsOrTcs = this.tax.taxType.includes('tcs') || this.tax.taxType.includes('tds');
            let subTyp;
            if (this.checkIfTdsOrTcs) {
                subTyp = this.tax.taxType.includes('rc') ? 'rc' : 'pay';
            }

            if (subTyp) {
                this.tdsTcsTaxSubTypes.forEach(key => {
                    if (key.value === subTyp) {
                        this.selectedTaxType = key.label;
                    }
                });
            }

            this.newTaxObj = {
                ...this.tax,
                taxValue: this.tax.taxDetail[0].taxValue,
                date: dayjs(this.tax.taxDetail[0].date).toDate(),
                tdsTcsTaxSubTypes: subTyp ? subTyp : null,
                taxType: subTyp ? this.tax.taxType?.replace(subTyp, '') : this.tax.taxType,
                taxFileDate: this.tax.taxFileDate?.toString()
            };
        }
    }

    public customAccountFilter(term: string, item: IOption) {
        return (item?.label?.toLocaleLowerCase()?.indexOf(term) > -1 || item?.value?.toLocaleLowerCase()?.indexOf(term) > -1);
    }

    public customDateSorting(a: IOption, b: IOption) {
        return (parseInt(a?.label) - parseInt(b?.label));
    }

    public genUniqueName() {
        let val: string = this.newTaxObj.name;
        val = uniqueNameInvalidStringReplace(val);
        if (val) {
            let isDuplicate = this.allTaxes.some(s => s.value.toLowerCase().includes(val));
            if (isDuplicate) {
                this.newTaxObj.taxNumber = val + 1;
            } else {
                this.newTaxObj.taxNumber = val;
            }
        } else {
            this.newTaxObj.taxNumber = '';
        }
    }

    public onSubmit() {
        let dataToSave = cloneDeep(this.newTaxObj);

        if (dataToSave.taxType === 'tcs' || dataToSave.taxType === 'tds') {
            if (this.tax && this.tax.uniqueName) {
                dataToSave.taxType = dataToSave.taxType + dataToSave.tdsTcsTaxSubTypes;
            } else {
                dataToSave.taxType = dataToSave.tdsTcsTaxSubTypes;
            }
        }

        dataToSave.taxDetail = [{
            taxValue: dataToSave.taxValue,
            date: dataToSave.date
        }];

        if (dataToSave.taxType === 'others') {
            if (!dataToSave.accounts) {
                dataToSave.accounts = [];
            }
            this.linkedAccountsOption.forEach((obj) => {
                if (obj.value === dataToSave.account) {
                    let accountObj = obj.label.split(' - ');
                    dataToSave.accounts.push({ name: accountObj[0], uniqueName: obj.value });
                }
            });
        }

        dataToSave.date = dayjs(dataToSave.date).format(GIDDH_DATE_FORMAT);
        dataToSave.accounts = dataToSave.accounts ? dataToSave.accounts : [];
        dataToSave.taxDetail = [{ date: dataToSave.date, taxValue: dataToSave.taxValue }];

        if (this.tax && this.tax.uniqueName) {
            this.store.dispatch(this._settingsTaxesActions.UpdateTax(dataToSave));
        } else {
            this.store.dispatch(this._settingsTaxesActions.CreateTax(dataToSave));
        }
    }

    public getTaxList(countryCode) {
        this.store.dispatch(this._settingsTaxesActions.resetTaxList());
        this.store.pipe(select(s => s.settings.taxes), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                Object.keys(res.taxes).forEach(key => {
                    // CREATED TAX VALUE AND TAX TYPES LIST MAPPING TO SHOW SELECT TYPE DROPDOWN VALUES BASED ON SELECTED TAX
                    if (res.taxes[key]?.types?.length > 0) {
                        this.taxNameTypesMapping[res.taxes[key].value] = [];
                        this.taxNameTypesMapping[res.taxes[key].value] = res.taxes[key].types;
                    }

                    if (res.taxes[key].value === this.newTaxObj.taxType) {
                        this.selectedTax = res.taxes[key]?.label;
                    }

                    this.taxList.push({ label: res.taxes[key]?.label, value: res.taxes[key].value });
                });
                this.taxListSource$ = observableOf(this.taxList);
            } else {
                this.store.dispatch(this._settingsTaxesActions.GetTaxList(countryCode));
            }
        });
    }

    public selectTax(event) {
        this.newTaxObj.tdsTcsTaxSubTypes = "";
        this.forceClear$ = observableOf({ status: true });
    }

    /**
     * Loads the linked accounts
     *
     * @private
     * @memberof AsideMenuCreateTaxComponent
     */
    private loadLinkedAccounts(): void {
        const params = {
            group: encodeURIComponent('currentassets, currentliabilities'),
            exceptGroups: encodeURIComponent('cash, bankaccounts, sundrydebtors, sundrycreditors, reversecharge, taxonadvance'),
            count: 0
        };
        let accounts = [];
        this.salesService.getAccountsWithCurrency(params).subscribe(response => {
            if (response?.body?.results) {
                accounts = response.body.results.map(account => {
                    return { label: `${account.name} - (${account.uniqueName})`, value: account.uniqueName };
                });
                this.linkedAccountsOption = accounts;
            } else {
                this.linkedAccountsOption = accounts;
            }
        });
    }

    /**
     * Unsubscribe from all listeners
     *
     * @memberof AsideMenuCreateTaxComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
