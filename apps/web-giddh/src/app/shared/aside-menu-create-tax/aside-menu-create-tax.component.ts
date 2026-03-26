import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { TaxResponse } from '../../models/api-models/Company';
import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { AppState } from '../../store';
import { select, Store } from '@ngrx/store';
import { skip, take, takeUntil } from 'rxjs/operators';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import { SettingsTaxesActions } from '../../actions/settings/taxes/settings.taxes.action';
import { uniqueNameInvalidStringReplace } from '../helpers/helperFunctions';
import { GIDDH_DATE_FORMAT } from '../helpers/defaultDateFormat';
import { SalesService } from '../../services/sales.service';
import { cloneDeep } from '../../lodash-optimized';
import { GeneralService } from '../../services/general.service';
import { TaxAuthorityComponentStore } from '../../theme/tax-authority/utility/tax-authority.store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IOption } from '../../app.constant';
import { ReactiveDropdownFieldComponent } from '../../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component';

@Component({
    selector: 'aside-menu-create-tax-component',
    templateUrl: './aside-menu-create-tax.component.html',
    styleUrls: [`./aside-menu-create-tax.component.scss`],
    providers: [TaxAuthorityComponentStore],
    standalone: false
})
export class AsideMenuCreateTaxComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    /** Reference to the reactive dropdown field component for tax authority selection */
    @ViewChild('dropdownRef') public dropdownRef: ReactiveDropdownFieldComponent;
    @Output() public closeEvent: EventEmitter<boolean> = new EventEmitter();
    @Input() public tax: TaxResponse;
    @Input() public asidePaneState: string;
    /** This holds dialog open from other tax or create voucher */
    @Input() public otherTax: boolean;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    public taxList: IOption[] = [];
    public duration: IOption[] = [];
    public tdsTcsTaxSubTypes: IOption[] = [];
    public allTaxes: IOption[] = [];
    public selectedTaxType: string = '';
    /** Holds Default value for Tax Authority Dropdown value */
    public selectedTaxAuthority: string = '';
    /** Holds default value for tax duration dropdown value */
    public selectedDuration: string = '';
    /** Holds Default value for Tax File Date Dropdown value */
    public selectedTaxFileDate: string | number = '';
    public checkIfTdsOrTcs: boolean = false;
    public days: IOption[] = [];
    public linkedAccountsOption: IOption[] = [];
    public isTaxCreateInProcess: boolean = false;
    public isUpdateTaxInProcess: boolean = false;
    public taxListSource$: Observable<IOption[]> = observableOf([]);
    public taxNameTypesMapping: any[] = [];
    public selectedTax: string = '';
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This holds giddh date format */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** Observable for tax created successfully */
    public isTaxCreatedSuccessfully: boolean = false;
    /** Holds true if active company country is US */
    public isUSCompany: boolean = false;
    /** Holds tax authority list */
    public taxAuthorityList: IOption[] = [];
    /** Holds true if tax authority list is inprogress */
    public isTaxAuthoritiesLoading$: Observable<any> = this.componentStore.isLoading$;
    /** Holds tax form */
    public taxForm: FormGroup;
    /** Holds if UntypedFormArray is valid or not */
    public isValidForm: boolean = true;
    /** Holds TDS TCS tax sub type */
    private subType: string = '';

    constructor(
        private store: Store<AppState>,
        private settingsTaxesActions: SettingsTaxesActions,
        private salesService: SalesService,
        private generalService: GeneralService,
        private componentStore: TaxAuthorityComponentStore,
        private formBuilder: FormBuilder,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        this.initForm();
        this.store.dispatch(this.settingsTaxesActions.CreateTaxResponse(null));
    }

    /**
     * Initializes the component
     *
     * @memberof AsideMenuCreateTaxComponent
     */
    public ngOnInit(): void {
        for (let i = 1; i <= 31; i++) {
            this.days.push({ label: i?.toString(), value: i?.toString() });
        }

        this.translateDropdownValues();

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany && activeCompany.countryV2) {
                this.getTaxList(activeCompany.countryV2.alpha2CountryCode);
                this.isUSCompany = activeCompany.countryV2.alpha2CountryCode === 'US';
                if (this.isUSCompany) {
                    this.getTaxAuthorityList();
                    (this.taxForm.get('taxAuthorityRequest') as FormGroup).get('uniqueName').setValidators([Validators.required]);
                }
            }
        });

        this.loadLinkedAccounts();

        this.store
            .pipe(select(p => p.company && p.company.taxes), takeUntil(this.destroyed$))
            .subscribe(taxes => {
                if (taxes && taxes.length) {
                    let arr: IOption[] = [];
                    (Array.isArray(taxes) ? taxes : []).forEach(tax => {
                        arr.push({ label: tax.name, value: tax?.uniqueName });
                    });
                    this.allTaxes = arr;
                }
            });

        this.store
            .pipe(select(p => p.company && p.company.isTaxCreationInProcess), takeUntil(this.destroyed$))
            .subscribe(result => {
                this.isTaxCreateInProcess = result;
            });

        this.store
            .pipe(select(p => p.company && p.company.isTaxCreatedSuccessfully), takeUntil(this.destroyed$))
            .subscribe(result => {
                if (result && this.otherTax) {
                    this.closeEvent.emit();
                }
            });
        this.store
            .pipe(select(p => p.company && p.company.isTaxUpdatingInProcess), takeUntil(this.destroyed$))
            .subscribe(result => this.isUpdateTaxInProcess = result);
    }

    /**
     * Listens to the input change event of warehouse search filter
     *
     * @memberof AsideMenuCreateTaxComponent
     */
    public ngAfterViewInit(): void {
        if (!this.tax?.uniqueName){
            setTimeout(() => {
                this.dropdownRef?.openDropdownPanel();
            }, 200);
        }
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if ('tax' in changes && changes.tax.currentValue && (changes.tax.currentValue !== changes.tax.previousValue)) {
            this.checkIfTdsOrTcs = this.tax.taxType.includes('tcs') || this.tax.taxType.includes('tds');
            if (this.checkIfTdsOrTcs) {
                this.subType = this.tax.taxType.includes('rc') ? 'rc' : 'pay';
            }
            this.taxForm.get('name').setValue(this.tax?.name ?? '');
            this.taxForm.get('duration').setValue(this.tax?.duration ?? '');
            this.taxForm.get('uniqueName').setValue(this.tax?.uniqueName ?? '');
            this.taxForm.get('taxNumber').setValue(this.tax?.taxNumber ?? '');
            this.taxForm.get('accounts').setValue(this.tax?.accounts ?? []);
            this.taxForm.get('taxDetail').setValue(this.tax?.taxDetail ?? '');
            this.taxForm.get('taxAuthority').setValue(this.tax?.taxAuthority ?? '');
            (this.taxForm.get('taxAuthorityRequest') as FormGroup).get('uniqueName').setValue(this.tax.taxAuthority?.uniqueName ?? '');
            this.taxForm.get('taxValue').setValue(this.tax.taxDetail[0].taxValue ?? '');
            const rawDate = this.tax.taxDetail[0].date;
            const parsedDate = dayjs(rawDate, GIDDH_DATE_FORMAT).isValid() ? dayjs(rawDate, GIDDH_DATE_FORMAT).toDate() : (dayjs(rawDate).isValid() ? dayjs(rawDate).toDate() : dayjs().toDate());
            this.taxForm.get('date').setValue(parsedDate);
            this.taxForm.get('tdsTcsTaxSubTypes').setValue(this.subType ?? '');
            this.taxForm.get('taxType').setValue(this.subType ? this.tax.taxType?.replace(this.subType, '') : this.tax.taxType);
            this.taxForm.get('taxFileDate').setValue(this.tax.taxFileDate?.toString() ?? '');

            this.selectedTaxAuthority = this.tax?.taxAuthority ? this.tax.taxAuthority?.name : '';
            this.selectedDuration = this.tax?.duration ? this.tax?.duration : '';
            this.selectedTaxFileDate = this.tax?.taxFileDate ? this.tax.taxFileDate : '';
        }
    }

    /**
     * Get tax authority list
     *
     * @private
     * @memberof AsideMenuCreateTaxComponent
     */
    private getTaxAuthorityList(): void {
        this.componentStore.taxAuthorityList$.pipe(skip(1),take(1)).subscribe(taxAuthorities => {
            if (taxAuthorities?.length) {
                let arr: IOption[] = [];
                (Array.isArray(taxAuthorities) ? taxAuthorities : []).forEach(tax => {
                    arr.push({ label: tax.name, value: tax?.uniqueName });
                });
                this.taxAuthorityList = arr;
            }
        });
        this.componentStore.getTaxAuthorityList();
    }

    /**
     * Initializes the form
     *
     * @private
     * @memberof AsideMenuCreateTaxComponent
     */
    private initForm(): void {
        this.taxForm = this.formBuilder.group({
            name: ['', [Validators.required]],
            duration: ['', [Validators.required]],
            uniqueName: [''],
            taxFileDate: ['', [Validators.required]],
            taxNumber: [''],
            account: [{}],
            accounts: [[]],
            taxType: ['', [Validators.required]],
            taxDetail: [{}, [Validators.required]],
            taxAuthority: [''],
            taxValue: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
            date: [dayjs().toDate(), [Validators.required]],
            tdsTcsTaxSubTypes: [null],
            taxAuthorityRequest: this.formBuilder.group({
                uniqueName: ['']
            })
        });

        this.taxForm.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(value => {
            if (value) {
                if (this.taxForm?.get('taxType')?.value === 'tds' || this.taxForm?.get('taxType')?.value === 'tcs') {
                    this.taxForm.get('tdsTcsTaxSubTypes').setValidators([Validators.required]);
                } else {
                    this.taxForm.get('tdsTcsTaxSubTypes').removeValidators([Validators.required]);
                }

                if (this.taxForm?.get('taxType')?.value === 'others') {
                    this.taxForm.get('account').setValidators([Validators.required]);
                } else {
                    this.taxForm.get('account').removeValidators([Validators.required]);
                }
            }
        })
    }

    /**
     * Generate uniqueName
     *
     * @memberof AsideMenuCreateTaxComponent
     */
    public generateUniqueName(): void {
        let val: string = this.taxForm.get('name').value;
        val = uniqueNameInvalidStringReplace(val);
        if (val) {
            let isDuplicate = this.allTaxes.some(s => s?.value?.toLowerCase().includes(val));
            if (isDuplicate) {
                this.taxForm.get('taxNumber').patchValue(val + 1);
            } else {
                this.taxForm.get('taxNumber').patchValue(val);
            }
        } else {
            this.taxForm.get('taxNumber').patchValue('');
        }
    }

    /**
     * Handle form submit
     * 
     * @memberof AsideMenuCreateTaxComponent
     */
    public onSubmit(): void {
        this.isValidForm = this.taxForm.valid;

        if (!this.isValidForm) {
            return;
        }
        let dataToSave = cloneDeep(this.taxForm.value);

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
            (Array.isArray(this.linkedAccountsOption) ? this.linkedAccountsOption : []).forEach((obj) => {
                if (obj?.value === dataToSave.account) {
                    let accountObj = obj.label.split(' - ');
                    dataToSave.accounts.push({ name: accountObj[0], uniqueName: obj?.value });
                }
            });
        }

        dataToSave.date = typeof (dataToSave.date) === "object" ? dayjs(dataToSave.date).format(GIDDH_DATE_FORMAT) : dataToSave.date;
        dataToSave.accounts = dataToSave.accounts ? dataToSave.accounts : [];
        dataToSave.taxDetail = [{ date: dataToSave.date, taxValue: dataToSave.taxValue }];

        if (!this.isUSCompany) {
            delete dataToSave.taxAuthorityRequest;
        }
        dataToSave?.taxAuthority && delete dataToSave.taxAuthority;

        if (this.tax && this.tax.uniqueName) {
            this.store.dispatch(this.settingsTaxesActions.UpdateTax(dataToSave));
        } else {
            this.store.dispatch(this.settingsTaxesActions.CreateTax(dataToSave));
        }
    }

    public getTaxList(countryCode) {
        this.store.dispatch(this.settingsTaxesActions.resetTaxList());
        this.store.pipe(select(s => s.settings.taxes), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                Object.keys(res.taxes).forEach(key => {
                    // CREATED TAX VALUE AND TAX TYPES LIST MAPPING TO SHOW SELECT TYPE DROPDOWN VALUES BASED ON SELECTED TAX
                    if (res.taxes[key]?.types?.length > 0) {
                        this.taxNameTypesMapping[res.taxes[key].value] = [];
                        this.taxNameTypesMapping[res.taxes[key].value] = res.taxes[key].types;
                    }

                    if (res.taxes[key].value === this.taxForm.get('taxType').value) {
                        this.selectedTax = res.taxes[key]?.label;
                    }

                    this.taxList.push({ label: res.taxes[key]?.label, value: res.taxes[key]?.value });
                    this.changeDetectorRef.detectChanges();
                });
                this.taxListSource$ = observableOf(this.taxList);
            } else {
                this.store.dispatch(this.settingsTaxesActions.getTaxList(countryCode));
            }
        });
    }

    /**
     * Handle Tax select 
     *
     * @memberof AsideMenuCreateTaxComponent
     */
    public selectTax(event: any): void {
        if (event) {
            this.taxForm.get('tdsTcsTaxSubTypes').patchValue('');
        }
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
            exceptGroups: (this.generalService.voucherApiVersion === 2) ? encodeURIComponent('cash, bankaccounts, loanandoverdraft, sundrydebtors, sundrycreditors, reversecharge, taxonadvance') : encodeURIComponent('cash, bankaccounts, sundrydebtors, sundrycreditors, reversecharge, taxonadvance'),
            count: 0
        };
        let accounts = [];
        this.salesService.getAccountsWithCurrency(params).subscribe(response => {
            if (response?.body?.results) {
                accounts = response.body.results?.map(account => {
                    return { label: `${account.name} - (${account?.uniqueName})`, value: account?.uniqueName };
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

    public translationComplete(event: any): void {
        if (event) {
            this.translateDropdownValues();
        }
    }

    private translateDropdownValues(): void {
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
        if (this.subType) {
            (Array.isArray(this.tdsTcsTaxSubTypes) ? this.tdsTcsTaxSubTypes : []).forEach(key => {
                if (key?.value === this.subType) {
                    this.selectedTaxType = key.label;
                }
            });
        }
    }

    /**
     * This will be use for select date
     *
     * @param {*} date
     * @memberof AsideMenuCreateTaxComponent
     */
    public selectDate(date: any): void {
        if (date) {
            this.taxForm.get('date').patchValue(dayjs(date).format(GIDDH_DATE_FORMAT));
        }
    }
}
