import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BsModalRef, BsModalService } from 'ngx-bootstrap'
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
import { VAT_SUPPORTED_COUNTRIES } from '../../app.constant';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';

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

    public modelRef: BsModalRef;
    public isInvalidfield: boolean = true;
    public modalRef: BsModalRef;
    public isMulticurrencyAccount: true;
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

    constructor(private store: Store<AppState>, private modalService: BsModalService, private generalService: GeneralService, private breakPointObservar: BreakpointObserver, private salesAction: SalesActions, private salesService: SalesService, private warehouseActions: WarehouseActions, private settingsUtilityService: SettingsUtilityService, private settingsProfileActions: SettingsProfileActions, private toaster: ToasterService, private commonActions: CommonActions) {
        this.flattenAccountListStream$ = this.store.pipe(select(state => state.general.flattenAccounts), takeUntil(this.destroyed$));
        this.selectedAccountDetails$ = this.store.pipe(select(state => state.sales.acDtl), takeUntil(this.destroyed$));
        this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
        this.store.dispatch(this.warehouseActions.fetchAllWarehouses({ page: 1, count: 0 }));

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
            this.companyCountryName = profile.country;

            if (profile && profile.countryV2) {
                this.companyCountryCode = profile.countryV2.alpha2CountryCode;
                this.getUpdatedStateCodes(profile.countryV2.alpha2CountryCode, true);
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

        this.updatedAccountDetails$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            console.log(response);
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
                });
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
}