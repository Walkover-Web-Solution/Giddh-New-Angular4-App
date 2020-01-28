import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IOption } from '../../theme/ng-select/option.interface';
import { CompanyResponse, StatesRequest, TaxResponse } from '../../models/api-models/Company';
import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { AppState } from '../../store';
import { select, Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import * as _ from '../../lodash-optimized';
import * as moment from 'moment/moment';
import { SettingsTaxesActions } from '../../actions/settings/taxes/settings.taxes.action';
import { ToasterService } from '../../services/toaster.service';
import { uniqueNameInvalidStringReplace } from '../helpers/helperFunctions';
import { createSelector } from "reselect";
import { IForceClear } from "../../models/api-models/Sales";

@Component({
    selector: 'aside-menu-create-tax-component',
    templateUrl: './aside-menu-create-tax.component.html',
    styleUrls: [`./aside-menu-create-tax.component.scss`]
})

export class AsideMenuCreateTaxComponent implements OnInit, OnChanges {
    @Output() public closeEvent: EventEmitter<boolean> = new EventEmitter();
    @Input() public tax: TaxResponse;
    @Input() public asidePaneState: string;
    public taxList: IOption[] = [];
    public duration: IOption[] = [
        { label: 'Monthly', value: 'MONTHLY' },
        { label: 'Quarterly', value: 'QUARTERLY' },
        { label: 'Half-Yearly', value: 'HALFYEARLY' },
        { label: 'Yearly', value: 'YEARLY' }
    ];
    public tdsTcsTaxSubTypes: IOption[] = [
        { label: 'Receivable', value: 'rc' },
        { label: 'Payable', value: 'pay' }
    ];
    public allTaxes: IOption[] = [];

    public days: IOption[] = [];
    public newTaxObj: TaxResponse = new TaxResponse();
    public flattenAccountsOptions: IOption[] = [];
    public isTaxCreateInProcess: boolean = false;
    public isUpdateTaxInProcess: boolean = false;
    public taxListSource$: Observable<IOption[]> = observableOf([]);
    public taxNameTypesMapping: any[] = [];
    public selectedCompany: Observable<CompanyResponse>;
    public selectedTax: string = '';
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>, private _settingsTaxesActions: SettingsTaxesActions, private _toaster: ToasterService) {
        for (let i = 1; i <= 31; i++) {
            this.days.push({ label: i.toString(), value: i.toString() });
        }
        this.newTaxObj.date = moment().toDate();
    }

    ngOnInit() {
        // tslint:disable-next-line:no-shadowed-variable
        this.selectedCompany = this.store.select(createSelector([(state: AppState) => state.session.companies, (state: AppState) => state.session.companyUniqueName], (companies, uniqueName) => {
            if (!companies) {
                return;
            }
            let selectedCmp = companies.find(cmp => {
                if (cmp && cmp.uniqueName) {
                    return cmp.uniqueName === uniqueName;
                } else {
                    return false;
                }
            });
            if (!selectedCmp) {
                return;
            }
            return selectedCmp;
        })).pipe(takeUntil(this.destroyed$));

        this.selectedCompany.subscribe((res: any) => {
            if (res) {
                this.getTaxList(res.countryV2.alpha2CountryCode);
            }
        });

        this.store.pipe(select(p => p.general.flattenAccounts), takeUntil(this.destroyed$)).subscribe(res => {
            let arr: IOption[] = [];
            if (res) {
                let accountObject =   res.filter(accountObj => (accountObj.parentGroups[0].uniqueName === "currentassets" && (accountObj.parentGroups[1].uniqueName !=="cash" && accountObj.parentGroups[1].uniqueName !=="bankaccounts" && accountObj.parentGroups[1].uniqueName!=="sundrydebtors")) || (accountObj.parentGroups[0].uniqueName === "currentliabilities" && (accountObj.parentGroups[1].uniqueName !=="sundrycreditors")));
           console.log(accountObject);
            accountObject.forEach(accountObj=> {
                        arr.push({ label: `${accountObj.name} - (${accountObj.uniqueName})`, value: accountObj.uniqueName });
                    });
            } else {
                arr = [];
            }
            this.flattenAccountsOptions = arr;
        });

        this.store
            .pipe(select(p => p.company.taxes), takeUntil(this.destroyed$))
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
            .pipe(select(p => p.company.isTaxCreationInProcess), takeUntil(this.destroyed$))
            .subscribe(result => this.isTaxCreateInProcess = result);
        this.store
            .pipe(select(p => p.company.isTaxUpdatingInProcess), takeUntil(this.destroyed$))
            .subscribe(result => this.isUpdateTaxInProcess = result);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if ('tax' in changes && changes.tax.currentValue && (changes.tax.currentValue !== changes.tax.previousValue)) {
            let chkIfTDSOrTcs = this.tax.taxType.includes('tcs') || this.tax.taxType.includes('tds');
            let subTyp;
            if (chkIfTDSOrTcs) {
                subTyp = this.tax.taxType.includes('rc') ? 'rc' : 'pay';
            }
            this.newTaxObj = {
                ...this.tax,
                taxValue: this.tax.taxDetail[0].taxValue,
                date: moment(this.tax.taxDetail[0].date).toDate(),
                tdsTcsTaxSubTypes: subTyp ? subTyp : null,
                taxType: subTyp ? this.tax.taxType.replace(subTyp, '') : this.tax.taxType,
                taxFileDate: this.tax.taxFileDate.toString()
            };
        }
    }

    public customAccountFilter(term: string, item: IOption) {
        return (item.label.toLocaleLowerCase().indexOf(term) > -1 || item.value.toLocaleLowerCase().indexOf(term) > -1);
    }

    public customDateSorting(a: IOption, b: IOption) {
        return (parseInt(a.label) - parseInt(b.label));
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
        let dataToSave = _.cloneDeep(this.newTaxObj);

        if (dataToSave.taxType === 'tcs' || dataToSave.taxType === 'tds') {
            dataToSave.taxType = dataToSave.tdsTcsTaxSubTypes;
        }

        dataToSave.taxDetail = [{
            taxValue: dataToSave.taxValue,
            date: dataToSave.date
        }];

        if (dataToSave.taxType === 'others') {
            if (!dataToSave.accounts) {
                dataToSave.accounts = [];
            }
            this.flattenAccountsOptions.forEach((obj) => {
                if (obj.value === dataToSave.account) {
                    let accountObj = obj.label.split(' - ');
                    dataToSave.accounts.push({ name: accountObj[0], uniqueName: obj.value });
                }
            });
        }

        dataToSave.date = moment(dataToSave.date).format('DD-MM-YYYY');
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
                    if (res.taxes[key].types.length > 0) {
                        this.taxNameTypesMapping[res.taxes[key].value] = [];
                        this.taxNameTypesMapping[res.taxes[key].value] = res.taxes[key].types;
                    }

                    if (res.taxes[key].value === this.newTaxObj.taxType) {
                        this.selectedTax = res.taxes[key].label;
                    }

                    this.taxList.push({ label: res.taxes[key].label, value: res.taxes[key].value });
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
}
