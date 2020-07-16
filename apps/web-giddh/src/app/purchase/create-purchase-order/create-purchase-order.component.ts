import { Component, OnInit, ViewChild, ElementRef, TemplateRef, ViewChildren, QueryList } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BsModalRef, BsModalService, BsDatepickerDirective, PopoverDirective } from 'ngx-bootstrap'
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { Observable, ReplaySubject, of as observableOf } from 'rxjs';
import { IOption } from '../../theme/ng-select/ng-select';
import { IFlattenAccountsResultItem } from '../../models/interfaces/flattenAccountsResultItem.interface';
import { takeUntil, filter, take } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
import { ShSelectComponent } from '../../theme/ng-virtual-select/sh-select.component';
import { SalesActions } from '../../actions/sales/sales.action';
import { AccountResponseV2, AddAccountRequest, UpdateAccountRequest } from '../../models/api-models/Account';
import { PurchaseOrder, StateCode } from '../../models/api-models/Purchase';
import { SalesService } from '../../services/sales.service';
import { WarehouseActions } from '../../settings/warehouse/action/warehouse.action';
import { WarehouseDetails } from '../../ledger/ledger.vm';
import { SettingsUtilityService } from '../../settings/services/settings-utility.service';
import { SettingsProfileActions } from '../../actions/settings/profile/settings.profile.action';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SalesShSelectComponent } from '../../theme/sales-ng-virtual-select/sh-select.component';
import { ToasterService } from '../../services/toaster.service';
import { OnboardingFormRequest } from '../../models/api-models/Common';
import { CommonActions } from '../../actions/common.actions';
import { VAT_SUPPORTED_COUNTRIES, RATE_FIELD_PRECISION } from '../../app.constant';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';
import { IForceClear, SalesTransactionItemClass, SalesEntryClass, IStockUnit, SalesOtherTaxesModal, SalesOtherTaxesCalculationMethodEnum } from '../../models/api-models/Sales';
import { InvoiceSetting } from '../../models/interfaces/invoice.setting.interface';
import { TaxResponse } from '../../models/api-models/Company';
import { IContentCommon } from '../../models/api-models/Invoice';
import { giddhRoundOff } from '../../shared/helpers/helperFunctions';
import { cloneDeep } from '../../lodash-optimized';
import { InvoiceActions } from '../../actions/invoice/invoice.actions';
import * as moment from 'moment/moment';
import { DiscountListComponent } from '../../sales/discount-list/discountList.component';
import { TaxControlComponent } from '../../theme/tax-control/tax-control.component';
import { SettingsDiscountActions } from '../../actions/settings/discount/settings.discount.action';
import { CompanyActions } from '../../actions/company.actions';
import { ConfirmationModalConfiguration, CONFIRMATION_ACTIONS } from '../../common/confirmation-modal/confirmation-modal.interface';
import { NgForm } from '@angular/forms';

const THEAD_ARR_READONLY = [
    {
        display: true,
        label: '#'
    },
    {
        display: true,
        label: 'Product/Service  Description '
    },
    {
        display: true,
        label: 'Qty/Unit'
    },
    {
        display: true,
        label: 'Rate'
    },
    {
        display: true,
        label: 'Amount'
    },
    {
        display: true,
        label: 'Discount'
    },
    {
        display: true,
        label: 'Tax'
    },
    {
        display: true,
        label: 'Total'
    },
    {
        display: true,
        label: ''
    }
];

@Component({
    selector: 'create-purchase-order',
    templateUrl: './create-purchase-order.component.html',
    styleUrls: ['./create-purchase-order.component.scss'],
    animations: [
        trigger('slideInOut', [
            state('in', style({
                transform: 'translate3d(0, 0, 0)'
            })),
            state('out', style({
                transform: 'translate3d(100%, 0, 0)'
            })),
            transition('in => out', animate('400ms ease-in-out')),
            transition('out => in', animate('400ms ease-in-out'))
        ]),
    ]
})

export class CreatePurchaseOrderComponent implements OnInit {
    @ViewChild('customerNameDropDown') public customerNameDropDown: ShSelectComponent;
    /** Billing state instance */
    @ViewChild('vendorBillingState') vendorBillingState: ElementRef;
    /** Shipping state instance */
    @ViewChild('vendorShippingState') vendorShippingState: ElementRef;
    /** Billing state instance */
    @ViewChild('companyBillingState') companyBillingState: ElementRef;
    /** Shipping state instance */
    @ViewChild('companyShippingState') companyShippingState: ElementRef;
    /** RCM popup instance */
    @ViewChild('rcmPopup') public rcmPopup: PopoverDirective;
    @ViewChild('invoiceForm', { read: NgForm }) public invoiceForm: NgForm;

    @ViewChildren(BsDatepickerDirective) public datePickers: QueryList<BsDatepickerDirective>;
    @ViewChildren('selectAccount') public selectAccount: QueryList<ShSelectComponent>;
    @ViewChildren('description') public description: QueryList<ElementRef>;
    @ViewChild('discountComponent') public discountComponent: DiscountListComponent;
    @ViewChild(TaxControlComponent) public taxControlComponent: TaxControlComponent;

    public modelRef: BsModalRef;
    public isInvalidfield: boolean = true;
    public modalRef: BsModalRef;
    public isMulticurrencyAccount: boolean = false;
    public isMobileScreen: boolean = true;
    public flattenAccountListStream$: Observable<IFlattenAccountsResultItem[]>;
    public customerAcList$: Observable<IOption[]>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public purchaseOrder: PurchaseOrder = new PurchaseOrder();
    public isUpdateMode: boolean = false;
    private selectedAccountDetails$: Observable<AccountResponseV2>;
    public vendorCountry: any = '';
    public autoFillVendorShipping: boolean = true;
    public autoFillCompanyShipping: boolean = true;
    public statesSource: IOption[] = [];
    public companyStatesSource: IOption[] = [];
    public showLoader: boolean = true;
    /** Stores warehouses for a company */
    public warehouses: Array<any>;
    /** True, if warehouse drop down should be displayed */
    public shouldShowWarehouse: boolean;
    /* This will hold the company country name */
    public companyCountryName: string = '';
    public companyCountryCode: string = '';
    public vendorNotFoundText: string = 'Add Vendor';
    public accountAsideMenuState: string = 'out';
    public asideMenuStateForProductService: string = 'out';
    public asideMenuStateForRecurringEntry: string = 'out';
    public asideMenuStateForOtherTaxes: string = 'out';
    // variable for checking do we really need to show loader, issue ref :- when we open aside pan loader is displayed unnecessary
    private shouldShowLoader: boolean = true;
    public selectedGroupUniqueNameForAddEditAccountModal: string = 'sundrycreditors';
    public selectedVendorForDetails: string = '';
    public isVendorSelected = false;
    private createAccountIsSuccess$: Observable<boolean>;
    private updateAccountSuccess$: Observable<boolean>;
    private createdAccountDetails$: Observable<AccountResponseV2>;
    private updatedAccountDetails$: Observable<AccountResponseV2>;
    public formFields: any[] = [];
    /** True, if the Giddh supports the taxation of the country (not supported now: UK, US, Nepal, Australia) */
    public shouldShowTrnGstField: boolean = false;
    public selectedCompany: any;
    public showGSTINNo: boolean;
    public showTRNNo: boolean;
    public isValidGstinNumber: boolean = false;
    public vatSupportedCountries = VAT_SUPPORTED_COUNTRIES;
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    public salesAccounts$: Observable<IOption[]> = observableOf(null);
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    public hsnDropdownShow: boolean = false;
    /** Inventory Settings */
    public inventorySettings: any;
    /* This will hold the currently editing hsn/sac code */
    public editingHsnSac: any = "";
    public companyTaxesList: TaxResponse[] = [];
    public theadArrReadOnly: IContentCommon[] = THEAD_ARR_READONLY;
    public allowedSelectionOfAType: any = { type: [], count: 1 };
    public activeIndx: number;
    /** Rate should have precision up to 4 digits for better calculation */
    public ratePrecision = RATE_FIELD_PRECISION;
    public applyRoundOff: boolean = true;
    /* This will hold if we need to hide total tax and have to exclude tax amount from total invoice amount */
    public excludeTax: boolean = false;
    public calculatedRoundOff: number = 0;
    public exchangeRate = 1;
    public grandTotalMulDum;
    private entriesListBeforeTax: SalesEntryClass[];
    /** True, if the entry contains RCM applicable taxes */
    public isRcmEntry: boolean = false;
    public universalDate: any;
    public moment = moment;
    public isPurchaseInvoice: boolean = false;
    public baseCurrencySymbol: string = '';
    public customerAccount: any = { email: '' };
    public companyCurrency: string;
    /** RCM modal configuration */
    public rcmConfiguration: ConfirmationModalConfiguration;
    public selectedSuffixForCurrency: string = '';

    constructor(private store: Store<AppState>, private breakPointObservar: BreakpointObserver, private salesAction: SalesActions, private salesService: SalesService, private warehouseActions: WarehouseActions, private settingsUtilityService: SettingsUtilityService, private settingsProfileActions: SettingsProfileActions, private toaster: ToasterService, private commonActions: CommonActions, private invoiceActions: InvoiceActions, private settingsDiscountAction: SettingsDiscountActions, private companyActions: CompanyActions, private generalService: GeneralService) {
        this.getInventorySettings();
        this.store.dispatch(this.invoiceActions.getInvoiceSetting());
        this.flattenAccountListStream$ = this.store.pipe(select(state => state.general.flattenAccounts), takeUntil(this.destroyed$));
        this.selectedAccountDetails$ = this.store.pipe(select(state => state.sales.acDtl), takeUntil(this.destroyed$));
        this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
        this.store.dispatch(this.warehouseActions.fetchAllWarehouses({ page: 1, count: 0 }));
        this.store.dispatch(this.settingsDiscountAction.GetDiscount());
        this.store.dispatch(this.companyActions.getTax());

        this.createAccountIsSuccess$ = this.store.pipe(select(state => state.sales.createAccountSuccess), takeUntil(this.destroyed$));
        this.createdAccountDetails$ = this.store.pipe(select(state => state.sales.createdAccountDetails), takeUntil(this.destroyed$));
        this.updatedAccountDetails$ = this.store.pipe(select(state => state.sales.updatedAccountDetails), takeUntil(this.destroyed$));
        this.updateAccountSuccess$ = this.store.pipe(select(state => state.sales.updateAccountSuccess), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.breakPointObservar.observe([
            '(max-width: 768px)'
        ]).subscribe(result => {
            this.isMobileScreen = result.matches;
        });

        this.store.pipe(select(state => {
            if (!state.session.companies) {
                return;
            }
            state.session.companies.forEach(cmp => {
                if (cmp.uniqueName === state.session.companyUniqueName) {
                    this.selectedCompany = cmp;
                }
            });
        })).subscribe();

        this.createVendorList();
        this.initializeWarehouse();

        this.selectedAccountDetails$.subscribe(async accountDetails => {
            if (accountDetails && !this.isUpdateMode) {
                if (accountDetails.country) {
                    await this.getUpdatedStateCodes(accountDetails.country.countryCode, false);
                }

                this.updateVendorDetails(accountDetails);
            }
        });

        this.store.pipe(select(prof => prof.settings.profile), takeUntil(this.destroyed$)).subscribe(async (profile) => {
            if (profile) {
                this.companyCountryName = profile.country;
                this.baseCurrencySymbol = profile.baseCurrencySymbol;
                this.companyCurrency = profile.baseCurrency || 'INR';

                if (profile.addresses && profile.addresses.length > 0) {
                    let companyAddresses = profile.addresses;

                    companyAddresses.forEach(address => {
                        if(address.isDefault === true) {
                            this.purchaseOrder.company.billingDetails.address = address.address;
                            this.purchaseOrder.company.billingDetails.state.code = address.stateCode;
                            this.purchaseOrder.company.billingDetails.gstNumber = address.taxNumber;
                            this.purchaseOrder.company.shippingDetails.gstNumber = address.taxNumber;
                        }
                    });
                }

                if (profile.countryV2) {
                    this.companyCountryCode = profile.countryV2.alpha2CountryCode;
                    this.getUpdatedStateCodes(profile.countryV2.alpha2CountryCode, true);
                }
            }
        });

        // create account success then hide aside pane
        this.createAccountIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response && this.accountAsideMenuState === 'in') {
                this.toggleAccountAsidePane();
            }
        });

        this.createdAccountDetails$.pipe(takeUntil(this.destroyed$)).subscribe(async accountDetails => {
            if (accountDetails) {
                if (accountDetails.country) {
                    await this.getUpdatedStateCodes(accountDetails.country.countryCode, false);
                }
                this.updateVendorDetails(accountDetails);
            }
        });

        this.updatedAccountDetails$.pipe(takeUntil(this.destroyed$)).subscribe(accountDetails => {
            if (accountDetails) {
                this.updateVendorDetails(accountDetails);
            }
        });

        this.updateAccountSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            console.log(response);
            if (response && this.accountAsideMenuState === 'in') {
                this.toggleAccountAsidePane();
            }
        });

        this.store.pipe(select(state => state.common.onboardingform), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                if (res.fields) {
                    this.formFields = [];
                    Object.keys(res.fields).forEach(key => {
                        if (res.fields[key]) {
                            this.formFields[res.fields[key].name] = [];
                            this.formFields[res.fields[key].name] = res.fields[key];
                        }
                    });
                }
                if (this.formFields && this.formFields['taxName']) {
                    this.shouldShowTrnGstField = true;
                } else {
                    this.shouldShowTrnGstField = false;
                }
            }
        });

        // get tax list and assign values to local vars
        this.store.pipe(select(state => state.company.isGetTaxesSuccess), takeUntil(this.destroyed$)).subscribe(isGetTaxes => {
            if (isGetTaxes) {
                this.store.pipe(select(state => state.company.taxes), takeUntil(this.destroyed$)).subscribe((tax: TaxResponse[]) => {
                    if (tax) {
                        this.companyTaxesList = tax;
                        this.theadArrReadOnly.forEach((item: IContentCommon) => {
                            // show tax label
                            if (item.label === 'Tax') {
                                item.display = true;
                            }
                            return item;
                        });
                        this.companyTaxesList.forEach((tax) => {
                            if (!this.allowedSelectionOfAType.type.includes(tax.taxType)) {
                                this.allowedSelectionOfAType.type.push(tax.taxType);
                            }
                        });
                    } else {
                        this.companyTaxesList = [];
                        this.allowedSelectionOfAType.type = [];
                    }
                });
            }
        });

        // listen for universal date
        this.store.pipe(select((state: AppState) => state.session.applicationDate)).subscribe((dateObj: Date[]) => {
            if (dateObj) {
                try {
                    this.universalDate = moment(dateObj[1]).toDate();
                    this.assignDates();
                } catch (e) {
                    this.universalDate = new Date();
                }
            }
        });

        console.log(this.purchaseOrder);
    }

    public assignDates() {
        let date = _.cloneDeep(this.universalDate);
        this.purchaseOrder.voucherDetails.voucherDate = date;

        this.purchaseOrder.entries.forEach((entry: SalesEntryClass) => {
            entry.transactions.forEach((txn: SalesTransactionItemClass) => {
                if (!txn.accountUniqueName) {
                    entry.entryDate = date;
                }
            });
        });
    }

    public updateVendorDetails(accountDetails: any): void {
        console.log(accountDetails);
        if (accountDetails) {
            this.purchaseOrder.account.uniqueName = accountDetails.uniqueName;
            this.purchaseOrder.account.customerName = accountDetails.name;
            this.purchaseOrder.account.name = accountDetails.name;
            this.purchaseOrder.account.email = accountDetails.email;
            this.purchaseOrder.account.mobileNumber = accountDetails.mobileNo;
            this.purchaseOrder.account.currency.code = accountDetails.currency;
            this.purchaseOrder.accountDetails.currencySymbol = accountDetails.currencySymbol || '';
            this.purchaseOrder.accountDetails.uniqueName = accountDetails.uniqueName;

            this.isMulticurrencyAccount = accountDetails.currencySymbol !== this.baseCurrencySymbol;

            this.vendorCountry = "";

            if (accountDetails.country) {
                this.showGstAndTrnUsingCountry(accountDetails.country.countryCode, accountDetails.country.countryName);
                this.vendorCountry = accountDetails.country.countryName;
            } else {
                this.showGstAndTrnUsingCountry('', '');
            }

            if (accountDetails.addresses && accountDetails.addresses.length > 0) {
                this.purchaseOrder.account.billingDetails.address = [];
                this.purchaseOrder.account.billingDetails.address.push(accountDetails.addresses[0].address);
                this.purchaseOrder.account.billingDetails.gstNumber = accountDetails.addresses[0].gstNumber;
                this.purchaseOrder.account.billingDetails.state.name = accountDetails.addresses[0].state.name;
                this.purchaseOrder.account.billingDetails.state.code = (accountDetails.addresses[0].state) ? (accountDetails.addresses[0].state.code) ? accountDetails.addresses[0].state.code : accountDetails.addresses[0].state.stateGstCode : accountDetails.addresses[0].stateCode;
                this.purchaseOrder.account.billingDetails.stateCode = this.purchaseOrder.account.billingDetails.state.code;
                this.purchaseOrder.account.billingDetails.stateName = accountDetails.addresses[0].state.name;
                this.purchaseOrder.account.billingDetails.panNumber = "";

                this.purchaseOrder.account.shippingDetails.address = [];
                this.purchaseOrder.account.shippingDetails.address.push(accountDetails.addresses[0].address);
                this.purchaseOrder.account.shippingDetails.gstNumber = accountDetails.addresses[0].gstNumber;
                this.purchaseOrder.account.shippingDetails.state.name = accountDetails.addresses[0].state.name;
                this.purchaseOrder.account.shippingDetails.state.code = (accountDetails.addresses[0].state) ? (accountDetails.addresses[0].state.code) ? accountDetails.addresses[0].state.code : accountDetails.addresses[0].state.stateGstCode : accountDetails.addresses[0].stateCode;
                this.purchaseOrder.account.shippingDetails.stateCode = this.purchaseOrder.account.shippingDetails.state.code;
                this.purchaseOrder.account.shippingDetails.stateName = accountDetails.addresses[0].state.name;
                this.purchaseOrder.account.shippingDetails.panNumber = "";
            }

            console.log(this.purchaseOrder);
        }
    }

    public createVendorList(): void {
        let sundryCreditorsAcList = [];
        let stockAccountsList = [];
        this.flattenAccountListStream$.subscribe(items => {
            if (items && items.length > 0) {
                let existingAccounts = [];
                items.forEach(item => {
                    if (item.parentGroups.some(group => group.uniqueName === 'sundrycreditors') && existingAccounts.indexOf(item.uniqueName) === -1) {
                        existingAccounts.push(item.uniqueName);

                        sundryCreditorsAcList.push({
                            label: item.name,
                            value: item.uniqueName,
                            additional: item
                        });
                    }

                    if (item.parentGroups.some(group => group.uniqueName === 'operatingcost' || group.uniqueName === 'indirectexpenses')) {
                        if (item.stocks) {
                            // normal entry
                            stockAccountsList.push({
                                value: item.uniqueName,
                                label: item.name,
                                additional: item
                            });

                            // stock entry
                            item.stocks.map(as => {
                                stockAccountsList.push({
                                    value: `${item.uniqueName}#${as.uniqueName}`,
                                    label: `${item.name} (${as.name})`,
                                    additional: Object.assign({}, item, { stock: as })
                                });
                            });
                        } else {
                            stockAccountsList.push({
                                value: item.uniqueName,
                                label: item.name,
                                additional: item
                            });
                        }
                    }
                });
                this.salesAccounts$ = observableOf(_.orderBy(stockAccountsList, 'label'));
                this.customerAcList$ = observableOf(_.orderBy(sundryCreditorsAcList, 'label'));
            }
        });
    }

    public customMoveGroupFilter(term: string, item: IOption): boolean {
        let newItem = { ...item };
        if (!newItem.additional) {
            newItem.additional = { email: '', mobileNo: '' };
        } else {
            newItem.additional.email = newItem.additional.email || '';
            newItem.additional.mobileNo = newItem.additional.mobileNo || '';
        }
        return (item.label.toLocaleLowerCase().indexOf(term) > -1 || item.value.toLocaleLowerCase().indexOf(term) > -1 || item.additional.email.toLocaleLowerCase().indexOf(term) > -1 || item.additional.mobileNo.toLocaleLowerCase().indexOf(term) > -1);
    }

    public onSelectVendor(item: IOption): void {
        if (item.value) {
            this.purchaseOrder.voucherDetails.customerName = item.label;
            this.purchaseOrder.accountDetails.name = '';

            if (item.additional) {
                this.customerAccount.email = item.additional.email;
                // If currency of item is null or undefined then treat it to be equivalent of company currency
                item.additional['currency'] = item.additional.currency || this.companyCurrency;
                this.isMulticurrencyAccount = item.additional.currency !== this.companyCurrency;
            }

            this.getAccountDetails(item.value);
        }
    }

    public resetVendor(event: any): void {

    }

    public getAccountDetails(accountUniqueName: string): void {
        this.store.dispatch(this.salesAction.getAccountDetailsForSales(accountUniqueName));
    }

    public fillShippingBillingDetails(event: any, isBilling: boolean, addressType: string): void {
        let stateName = event.label;
        let stateCode = event.value;

        if (isBilling) {
            if (addressType === "vendor") {
                // update account details address if it's billing details
                if (this.vendorBillingState && this.vendorBillingState.nativeElement) {
                    this.vendorBillingState.nativeElement.classList.remove('error-box');
                }
                this.purchaseOrder.account.billingDetails.state.name = stateName;
                this.purchaseOrder.account.billingDetails.stateName = stateName;
                this.purchaseOrder.account.billingDetails.stateCode = stateCode;
            } else {
                // update account details address if it's billing details
                if (this.companyBillingState && this.companyBillingState.nativeElement) {
                    this.companyBillingState.nativeElement.classList.remove('error-box');
                }
                this.purchaseOrder.company.billingDetails.state.name = stateName;
                this.purchaseOrder.company.billingDetails.stateName = stateName;
                this.purchaseOrder.company.billingDetails.stateCode = stateCode;
            }
        } else {
            if (addressType === "vendor") {
                if (this.vendorShippingState && this.vendorShippingState.nativeElement) {
                    this.vendorShippingState.nativeElement.classList.remove('error-box');
                }
                // if it's not billing address then only update shipping details
                // check if it's not auto fill shipping address from billing address then and then only update shipping details
                if (!this.autoFillVendorShipping) {
                    this.purchaseOrder.account.shippingDetails.stateName = stateName;
                    this.purchaseOrder.account.shippingDetails.stateCode = stateCode;
                    this.purchaseOrder.account.shippingDetails.state.name = stateName;
                }
            } else {
                if (this.companyBillingState && this.companyBillingState.nativeElement) {
                    this.companyBillingState.nativeElement.classList.remove('error-box');
                }
                // if it's not billing address then only update shipping details
                // check if it's not auto fill shipping address from billing address then and then only update shipping details
                if (!this.autoFillCompanyShipping) {
                    this.purchaseOrder.company.shippingDetails.stateName = stateName;
                    this.purchaseOrder.company.shippingDetails.stateCode = stateCode;
                    this.purchaseOrder.company.shippingDetails.state.name = stateName;
                }
            }
        }
    }

    public autoFillShippingDetails(addressType: string): void {
        if (addressType === "vendor") {
            // auto fill shipping address
            if (this.autoFillVendorShipping) {
                this.purchaseOrder.account.shippingDetails = _.cloneDeep(this.purchaseOrder.account.billingDetails);
                if (this.vendorShippingState && this.vendorShippingState.nativeElement) {
                    this.vendorShippingState.nativeElement.classList.remove('error-box');
                }
            }
        } else {
            // auto fill shipping address
            if (this.autoFillCompanyShipping) {
                this.purchaseOrder.company.shippingDetails = _.cloneDeep(this.purchaseOrder.company.billingDetails);
                if (this.companyShippingState && this.companyShippingState.nativeElement) {
                    this.companyShippingState.nativeElement.classList.remove('error-box');
                }
            }
        }
    }

    /**
     * Returns the promise once the state list is successfully
     * fetched to carry out further operations
     *
     * @private
     * @param {*} countryCode Country code for the user
     * @returns Promise to carry out further operations
     * @memberof CreatePurchaseOrderComponent
     */
    private getUpdatedStateCodes(countryCode: any, isCompanyStates: boolean): Promise<any> {
        this.startLoader(true);
        return new Promise((resolve: Function) => {
            if (countryCode) {
                this.salesService.getStateCode(countryCode).subscribe(resp => {
                    this.startLoader(false);
                    if (!isCompanyStates) {
                        this.statesSource = this.modifyStateResp((resp.body) ? resp.body.stateList : []);
                    } else {
                        this.companyStatesSource = this.modifyStateResp((resp.body) ? resp.body.stateList : []);
                    }
                    resolve();
                }, () => {
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }

    /**
     * Shows or hides the loader
     *
     * @param {boolean} shouldStartLoader True, if loader is to be shown
     * @memberof CreatePurchaseOrderComponent
     */
    public startLoader(shouldStartLoader: boolean): void {
        this.showLoader = shouldStartLoader;
    }

    private modifyStateResp(stateList: StateCode[]): IOption[] {
        let stateListRet: IOption[] = [];
        stateList.forEach(stateR => {
            stateListRet.push({ label: stateR.name, value: stateR.code ? stateR.code : stateR.stateGstCode, stateGstCode: stateR.stateGstCode ? stateR.stateGstCode : stateR.code });
        });
        return stateListRet;
    }

    /**
     * Intializes the warehouse
     *
     * @private
     * @param {WarehouseDetails} [warehouse] Warehouse to show pre-filled in drop down
     * @memberof CreatePurchaseOrderComponent
     */
    private initializeWarehouse(warehouse?: WarehouseDetails): void {
        this.store.pipe(select(appState => appState.warehouse.warehouses), filter((warehouses) => !!warehouses), take(1)).subscribe((warehouses: any) => {
            if (warehouses) {
                const warehouseData = this.settingsUtilityService.getFormattedWarehouseData(warehouses.results);
                this.warehouses = warehouseData.formattedWarehouses;
                let defaultWarehouseUniqueName = (warehouseData.defaultWarehouse) ? warehouseData.defaultWarehouse.uniqueName : '';
                let defaultWarehouseName = (warehouseData.defaultWarehouse) ? warehouseData.defaultWarehouse.name : '';
                
                if(warehouseData.defaultWarehouse) {
                    this.autoFillWarehouseAddress(warehouseData.defaultWarehouse);
                }

                if (warehouse) {
                    // Update flow is carried out and we have received warehouse details
                    this.purchaseOrder.warehouse.uniqueName = warehouse.uniqueName;
                    this.purchaseOrder.warehouse.name = warehouse.name;
                    this.shouldShowWarehouse = true;
                } else {
                    if (this.isUpdateMode) {
                        // Update flow is carried out
                        // Hide the warehouse drop down as the API has not returned warehouse
                        // details in response which means user has updated the item to non-stock
                        this.shouldShowWarehouse = false;
                    } else {
                        // Create flow is carried out
                        this.purchaseOrder.warehouse.uniqueName = String(defaultWarehouseUniqueName);
                        this.purchaseOrder.warehouse.name = String(defaultWarehouseName);
                        this.shouldShowWarehouse = true;
                    }
                }
            }
        });
    }

    public onSelectWarehouse(warehouse: any): void {
        this.autoFillWarehouseAddress(warehouse);
    }

    public autoFillWarehouseAddress(warehouse: any): void {
        if(warehouse) {
            this.purchaseOrder.company.shippingDetails.address = [];
            this.purchaseOrder.company.shippingDetails.address.push(warehouse.address);
            this.purchaseOrder.company.shippingDetails.state.code = warehouse.stateCode;
        } else {
            this.purchaseOrder.company.shippingDetails.address = [];
            this.purchaseOrder.company.shippingDetails.state.code = "";
        }
    }

    public addNewAccount(): void {
        this.selectedVendorForDetails = null;
        this.isVendorSelected = false;
        this.toggleAccountAsidePane();
    }

    public toggleAccountAsidePane(event?): void {
        if (event) {
            event.preventDefault();
        }
        this.accountAsideMenuState = this.accountAsideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    public toggleBodyClass(): void {
        if (this.asideMenuStateForProductService === 'in' || this.accountAsideMenuState === 'in' || this.asideMenuStateForRecurringEntry === 'in' || this.asideMenuStateForOtherTaxes === 'in') {
            // don't show loader when aside menu is opened
            this.shouldShowLoader = false;

            /* add fixed class only in crete mode not in update mode
                - because fixed class is already added in update mode due to double scrolling issue
             */
            if (!this.isUpdateMode) {
                document.querySelector('body').classList.add('fixed');
            }
        } else {
            // reset show loader variable because no aside pane is open
            this.shouldShowLoader = true;

            /* remove fixed class only in crete mode not in update mode
                - because fixed class is needed in update mode due to double scrolling issue
            */

            if (!this.isUpdateMode) {
                document.querySelector('body').classList.remove('fixed');
            }
        }
    }

    public addNewSidebarAccount(item: AddAccountRequest): void {
        this.store.dispatch(this.salesAction.addAccountDetailsForSales(item));
    }

    public updateSidebarAccount(item: UpdateAccountRequest): void {
        this.store.dispatch(this.salesAction.updateAccountDetailsForSales(item));
    }

    /**
     * get state code using Tax number to prefill state
     *
     * @param {string} type billingDetails || shipping
     * @param {SalesShSelectComponent} statesEle state input box
     * @memberof CreatePurchaseOrderComponent
     */
    public getStateCode(type: string, statesEle: SalesShSelectComponent) {
        let gstVal = _.cloneDeep(this.purchaseOrder.account[type].gstNumber).toString();
        if (gstVal && gstVal.length >= 2) {
            const selectedState = this.statesSource.find(item => item.stateGstCode === gstVal.substring(0, 2));
            if (selectedState) {
                this.purchaseOrder.account[type].stateCode = selectedState.value;
                this.purchaseOrder.account[type].state.code = selectedState.value;

            } else {
                this.purchaseOrder.account[type].stateCode = null;
                this.purchaseOrder.account[type].state.code = null;
                this.toaster.clearAllToaster();
            }
            statesEle.disabled = true;
        } else {
            statesEle.disabled = false;
            this.purchaseOrder.account[type].stateCode = null;
            this.purchaseOrder.account[type].state.code = null;
        }
        this.checkGstNumValidation(gstVal);
    }

    /**
     * To check Tax number validation using regex get by API
     *
     * @param {*} value Value to be validated
     * @param {string} fieldName Field name for which the value is validated
     * @memberof CreatePurchaseOrderComponent
     */
    public checkGstNumValidation(value, fieldName: string = '') {
        this.isValidGstinNumber = false;
        if (value) {
            if (this.formFields['taxName']['regex'] && this.formFields['taxName']['regex'].length > 0) {
                for (let key = 0; key < this.formFields['taxName']['regex'].length; key++) {
                    let regex = new RegExp(this.formFields['taxName']['regex'][key]);
                    if (regex.test(value)) {
                        this.isValidGstinNumber = true;
                    }
                }
            } else {
                this.isValidGstinNumber = true;
            }
            if (!this.isValidGstinNumber) {
                this.startLoader(false);
                if (fieldName) {
                    this.toaster.errorToast(`Invalid ${this.formFields['taxName'].label} in ${fieldName}! Please fix and try again`);
                } else {
                    this.toaster.errorToast(`Invalid ${this.formFields['taxName'].label}! Please fix and try again`);
                }
            }
        }
    }

    private showGstAndTrnUsingCountry(code: string, name: string): void {
        if (this.selectedCompany.country === name) {
            if (name === 'India') {
                this.showGSTINNo = true;
                this.showTRNNo = false;
                this.getOnboardingForm('IN')
            } else if (this.vatSupportedCountries.includes(code)) {
                this.showGSTINNo = false;
                this.showTRNNo = true;
                this.getOnboardingForm(code);
            }
        } else {
            this.showGSTINNo = false;
            this.showTRNNo = false;
        }
    }

    /**
     *
     * To fetch regex call for onboarding countries (gulf)
     * @param {*} countryCode
     * @memberof CreatePurchaseOrderComponent
     */
    public getOnboardingForm(countryCode) {
        let onboardingFormRequest = new OnboardingFormRequest();
        onboardingFormRequest.formName = 'onboarding';
        onboardingFormRequest.country = countryCode;
        this.store.dispatch(this.commonActions.GetOnboardingForm(onboardingFormRequest));
    }

    public onSelectSalesAccount(selectedAcc: any, txn: SalesTransactionItemClass, entry: SalesEntryClass): any {
        if (selectedAcc.value && selectedAcc.additional.uniqueName) {

            let o = _.cloneDeep(selectedAcc.additional);

            // check if we have quantity in additional object. it's for only bulk add mode
            txn.quantity = o.quantity ? o.quantity : (o.stock) ? 1 : null;
            txn.applicableTaxes = [];
            txn.sku_and_customfields = null;

            // description with sku and custom fields
            if ((o.stock)) {
                let description = [];
                let skuCodeHeading = o.stock.skuCodeHeading ? o.stock.skuCodeHeading : 'SKU Code';
                if (o.stock.skuCode) {
                    description.push(skuCodeHeading + ':' + o.stock.skuCode);
                }

                let customField1Heading = o.stock.customField1Heading ? o.stock.customField1Heading : 'Custom field 1';
                if (o.stock.customField1Value) {
                    description.push(customField1Heading + ':' + o.stock.customField1Value);
                }

                let customField2Heading = o.stock.customField2Heading ? o.stock.customField2Heading : 'Custom field 2';
                if (o.stock.customField2Value) {
                    description.push(customField2Heading + ':' + o.stock.customField2Value);
                }

                txn.sku_and_customfields = description.join(', ');
            }
            //------------------------

            // assign taxes and create fluctuation
            if (o.stock && o.stock.stockTaxes && o.stock.stockTaxes.length) {
                o.stock.stockTaxes.forEach(t => {
                    let tax = this.companyTaxesList.find(f => f.uniqueName === t);
                    if (tax) {
                        switch (tax.taxType) {
                            case 'tcsrc':
                            case 'tcspay':
                            case 'tdsrc':
                            case 'tdspay':
                                entry.otherTaxModal.appliedOtherTax = { name: tax.name, uniqueName: tax.uniqueName };
                                entry.isOtherTaxApplicable = true;
                                break;
                            default:
                                txn.applicableTaxes.push(t);
                                break;
                        }
                    }
                });
            } else {
                // assign taxes for non stock accounts
                txn.applicableTaxes = o.applicableTaxes;
            }

            txn.accountName = o.name;
            txn.accountUniqueName = o.uniqueName;

            if (o.stocks && o.stock) {
                // set rate auto
                txn.rate = null;
                let obj: IStockUnit = {
                    id: o.stock.stockUnit.code,
                    text: o.stock.stockUnit.name
                };
                txn.stockList = [];
                if (o.stock && o.stock.accountStockDetails.unitRates.length) {
                    txn.stockList = this.prepareUnitArr(o.stock.accountStockDetails.unitRates);
                    txn.stockUnit = txn.stockList[0].id;
                    txn.rate = txn.stockList[0].rate;
                } else {
                    txn.stockList.push(obj);
                    txn.stockUnit = o.stock.stockUnit.code;
                }
                txn.stockDetails = _.omit(o.stock, ['accountStockDetails', 'stockUnit']);
                txn.isStockTxn = true;
            } else {
                txn.isStockTxn = false;
                txn.stockUnit = null;
                txn.stockDetails = null;
                txn.stockList = [];
                // reset fields
                txn.rate = null;
                txn.quantity = null;
                txn.amount = 0;
                txn.taxableValue = 0;
                this.handleWarehouseVisibility();
            }
            txn.sacNumber = null;
            txn.sacNumberExists = false;
            txn.hsnNumber = null;

            if (txn.stockDetails && txn.stockDetails.hsnNumber && this.inventorySettings && (this.inventorySettings.manageInventory === true || !txn.stockDetails.sacNumber)) {
                txn.hsnNumber = txn.stockDetails.hsnNumber;
                txn.hsnOrSac = 'hsn';
            }
            if (txn.stockDetails && txn.stockDetails.sacNumber && this.inventorySettings && this.inventorySettings.manageInventory === false) {
                txn.sacNumber = txn.stockDetails.sacNumber;
                txn.sacNumberExists = true;
                txn.hsnOrSac = 'sac';
            }

            if (!o.stock && o.hsnNumber && this.inventorySettings && (this.inventorySettings.manageInventory === true || !o.sacNumber)) {
                txn.hsnNumber = o.hsnNumber;
                txn.hsnOrSac = 'hsn';
            }
            if (!o.stock && o.sacNumber && this.inventorySettings && !this.inventorySettings.manageInventory && this.inventorySettings.manageInventory === false) {
                txn.sacNumber = o.sacNumber;
                txn.sacNumberExists = true;
                txn.hsnOrSac = 'sac';
            }

            setTimeout(() => {
                let description = this.description.toArray();
                if (description && description[this.activeIndx]) {
                    description[this.activeIndx].nativeElement.focus();
                }
            }, 200);
            this.calculateStockEntryAmount(txn);
            this.calculateWhenTrxAltered(entry, txn);
            return txn;
        } else {
            txn.isStockTxn = false;
            txn.amount = 0;
            txn.accountName = null;
            txn.accountUniqueName = null;
            txn.hsnOrSac = 'sac';
            txn.total = null;
            txn.rate = null;
            txn.sacNumber = null;
            txn.sacNumberExists = false;
            txn.taxableValue = 0;
            txn.applicableTaxes = [];

            setTimeout(() => {
                let description = this.description.toArray();
                if (description && description[this.activeIndx]) {
                    description[this.activeIndx].nativeElement.focus();
                }
            }, 200);
            return txn;
        }
    }

    public onNoResultsClicked(index: any): void {

    }

    public onClearSalesAccount(transaction: any): void {

    }

    /**
     * This function is used to get inventory settings from store
     *
     * @memberof CreatePurchaseOrderComponent
     */
    public getInventorySettings(): void {
        this.store.pipe(select((s: AppState) => s.invoice.settings), takeUntil(this.destroyed$)).subscribe((settings: InvoiceSetting) => {
            if (settings && settings.companyInventorySettings) {
                this.inventorySettings = settings.companyInventorySettings;
            }
        });
    }

    /**
     * toggle hsn/sac dropdown
     * and hide all open date-pickers because it's overlapping
     * hsn/sac dropdown
     */
    public toggleHsnSacDropDown(transaction: any): void {
        if (this.datePickers && this.datePickers.length) {
            this.datePickers.forEach(datePicker => {
                if (datePicker.isOpen) {
                    datePicker.hide();
                }
            });
        }

        if (this.inventorySettings && (this.inventorySettings.manageInventory || !transaction.sacNumberExists)) {
            this.editingHsnSac = transaction.hsnNumber;
        }

        if (this.inventorySettings && !(this.inventorySettings.manageInventory || !transaction.sacNumberExists)) {
            this.editingHsnSac = transaction.sacNumber;
        }

        console.log(this.inventorySettings);

        this.hsnDropdownShow = !this.hsnDropdownShow;
    }

    /**
     * This will hide the edit hsn/sac popup
     *
     * @param {*} transaction
     * @memberof CreatePurchaseOrderComponent
     */
    public hideHsnSacEditPopup(transaction: any): void {
        if (this.inventorySettings && (this.inventorySettings.manageInventory || !transaction.sacNumberExists)) {
            transaction.hsnNumber = this.editingHsnSac;
        }

        if (this.inventorySettings && !(this.inventorySettings.manageInventory || !transaction.sacNumberExists)) {
            transaction.sacNumber = this.editingHsnSac;
        }

        console.log(this.editingHsnSac);

        this.hsnDropdownShow = !this.hsnDropdownShow;
    }

    /**
     * Returns true, if any of the single item is stock
     *
     * @private
     * @returns {boolean} True, if item entries contains stock item
     * @memberof ProformaInvoiceComponent
     */
    private isStockItemPresent(): boolean {
        const entries = this.purchaseOrder.entries;
        for (let entry = 0; entry < entries.length; entry++) {
            const transactions = entries[entry].transactions;
            for (let transaction = 0; transaction < transactions.length; transaction++) {
                const item = transactions[transaction];
                if (item.isStockTxn) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Handles the warehouse visibility when items in the list
     * changes from stock to non-stock or vice-versa
     *
     * @private
     * @memberof CreatePurchaseOrderComponent
     */
    private handleWarehouseVisibility(): void {
        // Non stock item got selected, search if there is any stock item along with non-stock item
        const isStockItemPresent = this.isStockItemPresent();
        if (!isStockItemPresent) {
            // None of the item were stock item, hide the warehouse section which is applicable only for stocks
            this.shouldShowWarehouse = false;
        }
    }

    public prepareUnitArr(unitArr) {
        let unitArray = [];
        _.forEach(unitArr, (item) => {
            unitArray.push({ id: item.stockUnitCode, text: item.stockUnitCode, rate: item.rate });
        });
        return unitArray;
    }

    public calculateStockEntryAmount(trx: SalesTransactionItemClass) {
        trx.amount = Number(trx.quantity) * Number(trx.rate);
    }

    public calculateWhenTrxAltered(entry: SalesEntryClass, trx: SalesTransactionItemClass) {
        trx.amount = Number(trx.amount);
        if (trx.isStockTxn) {
            trx.rate = giddhRoundOff((trx.amount / trx.quantity), this.ratePrecision);
        }

        if (this.isUpdateMode) {
            this.applyRoundOff = true;
        }

        this.calculateTotalDiscountOfEntry(entry, trx, false);
        this.calculateEntryTaxSum(entry, trx, false);
        this.calculateEntryTotal(entry, trx);
        this.calculateOtherTaxes(entry.otherTaxModal, entry);
        this.calculateTcsTdsTotal();
    }

    public calculateTotalDiscountOfEntry(entry: SalesEntryClass, trx: SalesTransactionItemClass, calculateEntryTotal: boolean = true) {
        let percentageListTotal = entry.discounts.filter(f => f.isActive)
            .filter(s => s.discountType === 'PERCENTAGE')
            .reduce((pv, cv) => {
                return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
            }, 0) || 0;

        let fixedListTotal = entry.discounts.filter(f => f.isActive)
            .filter(s => s.discountType === 'FIX_AMOUNT')
            .reduce((pv, cv) => {
                return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
            }, 0) || 0;

        let perFromAmount = ((percentageListTotal * trx.amount) / 100);
        entry.discountSum = perFromAmount + fixedListTotal;
        if (isNaN(entry.discountSum)) {
            entry.discountSum = 0;
        }

        if (calculateEntryTotal) {
            this.calculateEntryTotal(entry, trx);
        }
        trx.taxableValue = Number(trx.amount) - entry.discountSum;
        if (isNaN(trx.taxableValue)) {
            trx.taxableValue = 0;
        }
    }

    public calculateEntryTaxSum(entry: SalesEntryClass, trx: SalesTransactionItemClass, calculateEntryTotal: boolean = true) {
        let taxPercentage: number = 0;
        let cessPercentage: number = 0;
        entry.taxes.filter(f => f.isChecked).forEach(tax => {
            if (tax.type === 'gstcess') {
                cessPercentage += tax.amount;
            } else {
                taxPercentage += tax.amount;
            }
        });

        entry.taxSum = giddhRoundOff(((taxPercentage * (trx.amount - entry.discountSum)) / 100), 2);
        entry.cessSum = giddhRoundOff(((cessPercentage * (trx.amount - entry.discountSum)) / 100), 2);

        if (isNaN(entry.taxSum)) {
            entry.taxSum = 0;
        }

        if (isNaN(entry.cessSum)) {
            entry.cessSum = 0;
        }

        if (calculateEntryTotal) {
            this.calculateEntryTotal(entry, trx);
        }
    }

    public calculateEntryTotal(entry: SalesEntryClass, trx: SalesTransactionItemClass) {
        if (this.excludeTax) {
            trx.total = giddhRoundOff((trx.amount - entry.discountSum), 2);
        } else {
            trx.total = giddhRoundOff((trx.amount - entry.discountSum) + (entry.taxSum + entry.cessSum), 2);
        }

        this.calculateSubTotal();
        this.calculateTotalDiscount();
        this.calculateTotalTaxSum();
        this.calculateGrandTotal();
    }

    /**
     * Calculate the complete transaction values inclusively
     *
     * @param {SalesEntryClass} entry Entry value
     * @param {SalesTransactionItemClass} transaction Current transaction
     * @memberof ProformaInvoiceComponent
     */
    public calculateTransactionValueInclusively(entry: SalesEntryClass, transaction: SalesTransactionItemClass): void {
        // Calculate discount
        let percentageDiscountTotal = entry.discounts.filter(discount => discount.isActive)
            .filter(activeDiscount => activeDiscount.discountType === 'PERCENTAGE')
            .reduce((pv, cv) => {
                return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
            }, 0) || 0;

        let fixedDiscountTotal = entry.discounts.filter(discount => discount.isActive)
            .filter(activeDiscount => activeDiscount.discountType === 'FIX_AMOUNT')
            .reduce((pv, cv) => {
                return Number(cv.discountValue) ? Number(pv) + Number(cv.discountValue) : Number(pv);
            }, 0) || 0;

        // Calculate tax
        let taxPercentage: number = 0;
        let cessPercentage: number = 0;
        let taxTotal: number = 0;
        entry.taxes.filter(tax => tax.isChecked).forEach(selectedTax => {
            if (selectedTax.type === 'gstcess') {
                cessPercentage += selectedTax.amount;
            } else {
                taxPercentage += selectedTax.amount;
            }
            taxTotal += selectedTax.amount;
        });

        // Calculate amount with inclusive tax
        transaction.amount = giddhRoundOff(((Number(transaction.total) + fixedDiscountTotal + 0.01 * fixedDiscountTotal * Number(taxTotal)) /
            (1 - 0.01 * percentageDiscountTotal + 0.01 * Number(taxTotal) - 0.0001 * percentageDiscountTotal * Number(taxTotal))), 2);
        let perFromAmount = giddhRoundOff(((percentageDiscountTotal * transaction.amount) / 100), 2);
        entry.discountSum = giddhRoundOff(perFromAmount + fixedDiscountTotal, 2);
        if (isNaN(entry.discountSum)) {
            entry.discountSum = 0;
        }
        transaction.taxableValue = Number(transaction.amount) - entry.discountSum;
        if (isNaN(transaction.taxableValue)) {
            transaction.taxableValue = 0;
        }
        entry.taxSum = giddhRoundOff(((taxPercentage * (transaction.amount - entry.discountSum)) / 100), 2);
        entry.cessSum = giddhRoundOff(((cessPercentage * (transaction.amount - entry.discountSum)) / 100), 2);
        if (isNaN(entry.taxSum)) {
            entry.taxSum = 0;
        }

        if (isNaN(entry.cessSum)) {
            entry.cessSum = 0;
        }
        // Calculate stock unit rate with amount
        if (transaction.isStockTxn) {
            transaction.rate = giddhRoundOff((transaction.amount / transaction.quantity), this.ratePrecision);
        }
        this.calculateSubTotal();
        this.calculateTotalDiscount();
        this.calculateTotalTaxSum();
        this.calculateGrandTotal();
        this.calculateOtherTaxes(entry.otherTaxModal, entry);
        this.calculateTcsTdsTotal();
    }

    public calculateTotalDiscount() {
        let discount = 0;
        this.purchaseOrder.entries.forEach(f => {
            discount += f.discountSum;
        });
        this.purchaseOrder.voucherDetails.totalDiscount = discount;
    }

    public calculateTotalTaxSum() {
        let taxes = 0;
        let cess = 0;

        this.purchaseOrder.entries.forEach(f => {
            taxes += f.taxSum;
        });

        this.purchaseOrder.entries.forEach(f => {
            cess += f.cessSum;
        });

        this.purchaseOrder.voucherDetails.gstTaxesTotal = taxes;
        this.purchaseOrder.voucherDetails.cessTotal = cess;
        this.purchaseOrder.voucherDetails.totalTaxableValue = this.purchaseOrder.voucherDetails.subTotal - this.purchaseOrder.voucherDetails.totalDiscount;
    }

    public calculateTcsTdsTotal() {
        let tcsSum: number = 0;
        let tdsSum: number = 0;

        this.purchaseOrder.entries.forEach(entry => {
            tcsSum += entry.otherTaxType === 'tcs' ? entry.otherTaxSum : 0;
            tdsSum += entry.otherTaxType === 'tds' ? entry.otherTaxSum : 0;
        });

        this.purchaseOrder.voucherDetails.tcsTotal = tcsSum;
        this.purchaseOrder.voucherDetails.tdsTotal = tdsSum;
    }

    public calculateSubTotal() {
        let count: number = 0;
        this.purchaseOrder.entries.forEach(f => {
            count += f.transactions.reduce((pv, cv) => {
                return pv + Number(cv.amount);
            }, 0);
        });

        if (isNaN(count)) {
            count = 0;
        }
        this.purchaseOrder.voucherDetails.subTotal = count;
    }

    public calculateGrandTotal() {

        let calculatedGrandTotal = 0;
        calculatedGrandTotal = this.purchaseOrder.voucherDetails.grandTotal = this.purchaseOrder.entries.reduce((pv, cv) => {
            return pv + cv.transactions.reduce((pvt, cvt) => pvt + cvt.total, 0);
        }, 0);

        if (isNaN(calculatedGrandTotal)) {
            calculatedGrandTotal = 0;
        }

        //Save the Grand Total for Edit
        if (calculatedGrandTotal > 0) {
            if (this.applyRoundOff) {
                this.calculatedRoundOff = Number((Math.round(calculatedGrandTotal) - calculatedGrandTotal).toFixed(2));
            } else {
                this.calculatedRoundOff = Number((calculatedGrandTotal - calculatedGrandTotal).toFixed(2));
            }

            calculatedGrandTotal = Number((calculatedGrandTotal + this.calculatedRoundOff).toFixed(2));
        } else if (calculatedGrandTotal === 0) {
            this.calculatedRoundOff = 0;
        }
        this.purchaseOrder.voucherDetails.grandTotal = calculatedGrandTotal;
        this.grandTotalMulDum = calculatedGrandTotal * this.exchangeRate;
    }

    public calculateOtherTaxes(modal: SalesOtherTaxesModal, entryObj?: SalesEntryClass) {
        let entry: SalesEntryClass;
        entry = entryObj ? entryObj : this.purchaseOrder.entries[this.activeIndx];

        let taxableValue = 0;
        let totalTaxes = 0;

        if (!entry) {
            return;
        }
        if (modal && modal.appliedOtherTax && modal.appliedOtherTax.uniqueName) {
            let tax = this.companyTaxesList.find(ct => ct.uniqueName === modal.appliedOtherTax.uniqueName);
            if (!modal.appliedOtherTax.name) {
                entry.otherTaxModal.appliedOtherTax.name = tax.name;
            }
            if (['tcsrc', 'tcspay'].includes(tax.taxType)) {

                if (modal.tcsCalculationMethod === SalesOtherTaxesCalculationMethodEnum.OnTaxableAmount) {
                    taxableValue = Number(entry.transactions[0].amount) - entry.discountSum;
                } else if (modal.tcsCalculationMethod === SalesOtherTaxesCalculationMethodEnum.OnTotalAmount) {
                    let rawAmount = Number(entry.transactions[0].amount) - entry.discountSum;
                    taxableValue = (rawAmount + ((rawAmount * entry.taxSum) / 100));
                }
                entry.otherTaxType = 'tcs';
            } else {
                taxableValue = Number(entry.transactions[0].amount) - entry.discountSum;
                entry.otherTaxType = 'tds';
            }

            totalTaxes += tax.taxDetail[0].taxValue;

            entry.otherTaxSum = giddhRoundOff(((taxableValue * totalTaxes) / 100), 2);
            entry.otherTaxModal = modal;
        } else {
            entry.otherTaxSum = 0;
            entry.isOtherTaxApplicable = false;
            entry.otherTaxModal = new SalesOtherTaxesModal();
            entry.tcsTaxList = [];
            entry.tdsTaxList = [];
        }
        if (this.activeIndx !== undefined && this.activeIndx !== null && !entryObj) {
            this.purchaseOrder.entries = cloneDeep(this.entriesListBeforeTax);
            this.purchaseOrder.entries[this.activeIndx] = entry;
        }
    }

    /**
     * Outside click handler for transaction row
     *
     * @memberof CreatePurchaseOrderComponent
     */
    public handleOutsideClick(): void {
        this.activeIndx = null;
    }

    public setActiveIndx(index: number): void {
        this.activeIndx = index;
        try {
            if (this.isRcmEntry) {
                this.purchaseOrder.entries[index].transactions[0]['requiredTax'] = false;
            }
        } catch (error) {

        }
    }

    public transactionAmountClicked(transaction: SalesTransactionItemClass): void {
        if (Number(transaction.amount) === 0) {
            transaction.amount = undefined;
        }
    }

    public addBlankRow(txn: SalesTransactionItemClass): void {
        if (!txn) {
            let entry: SalesEntryClass = new SalesEntryClass();
            if (this.isUpdateMode) {
                entry.entryDate = this.purchaseOrder.entries[0] ? this.purchaseOrder.entries[0].entryDate : this.universalDate || new Date();
                entry.isNewEntryInUpdateMode = true;
            } else {
                entry.entryDate = this.universalDate || new Date();
            }
            this.purchaseOrder.entries.push(entry);
            setTimeout(() => {
                this.activeIndx = this.purchaseOrder.entries.length ? this.purchaseOrder.entries.length - 1 : 0;
                this.onBlurDueDate(this.activeIndx);
            }, 200);
        } else {
            // if transaction is valid then add new row else show toasty
            if (!txn.isValid()) {
                this.toaster.warningToast('Product/Service can\'t be empty');
                return;
            }
            let entry: SalesEntryClass = new SalesEntryClass();
            this.purchaseOrder.entries.push(entry);
            setTimeout(() => {
                this.activeIndx = this.purchaseOrder.entries.length ? this.purchaseOrder.entries.length - 1 : 0;
                this.onBlurDueDate(this.activeIndx);
            }, 200);
        }
    }

    public removeTransaction(entryIdx: number): void {
        if (this.activeIndx === entryIdx) {
            this.activeIndx = null;
        }
        this.purchaseOrder.entries = cloneDeep(this.purchaseOrder.entries.filter((entry, index) => entryIdx !== index));
        this.calculateAffectedThingsFromOtherTaxChanges();
        if (this.purchaseOrder.entries.length === 0) {
            this.addBlankRow(null);
        }
        this.handleWarehouseVisibility();
    }

    public onBlurDueDate(index): void {
        if (this.purchaseOrder.voucherDetails.customerUniquename || this.purchaseOrder.voucherDetails.customerName) {
            this.setActiveIndx(index);
            setTimeout(() => {
                let selectAccount = this.selectAccount.toArray();
                if (selectAccount !== undefined && selectAccount[index] !== undefined) {
                    selectAccount[index].show('');
                }
            }, 200);
        }
    }

    public calculateAffectedThingsFromOtherTaxChanges(): void {
        this.calculateTcsTdsTotal();
        this.calculateGrandTotal();
    }

    public closeDiscountPopup(): void {
        if (this.discountComponent) {
            this.discountComponent.hideDiscountMenu();
        }
    }

    public closeTaxControlPopup(): void {
        if (this.taxControlComponent) {
            this.taxControlComponent.showTaxPopup = false;
        }
    }

    public getCustomerDetails() {
        this.selectedVendorForDetails = this.purchaseOrder.accountDetails.uniqueName;
        this.toggleAccountAsidePane();
    }

    /**
     * Toggle the RCM checkbox based on user confirmation
     *
     * @param {*} event Click event
     * @memberof ProformaInvoiceComponent
     */
    public toggleRcmCheckbox(event: any): void {
        event.preventDefault();
        this.rcmConfiguration = this.generalService.getRcmConfiguration(event.target.checked);
    }

    /**
     * RCM change handler, triggerreed when the user performs any
     * action with the RCM popup
     *
     * @param {string} action Action performed by user
     * @memberof ProformaInvoiceComponent
     */
    public handleRcmChange(action: string): void {
        if (action === CONFIRMATION_ACTIONS.YES) {
            // Toggle the state of RCM as user accepted the terms of RCM modal
            this.isRcmEntry = !this.isRcmEntry;
        }
        if (this.rcmPopup) {
            this.rcmPopup.hide();
        }
    }

    public addAccountFromShortcut(): void {
        if (this.purchaseOrder && this.purchaseOrder.voucherDetails && !this.purchaseOrder.voucherDetails.customerName) {
            this.selectedVendorForDetails = null;
            this.toggleAccountAsidePane();
        }
    }
}