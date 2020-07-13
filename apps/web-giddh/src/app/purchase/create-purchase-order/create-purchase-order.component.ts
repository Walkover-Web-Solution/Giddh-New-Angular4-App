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
import { AccountResponseV2 } from '../../models/api-models/Account';
import { PurchaseOrder, StateCode } from '../../models/api-models/Purchase';
import { SalesService } from '../../services/sales.service';
import { WarehouseActions } from '../../settings/warehouse/action/warehouse.action';
import { WarehouseDetails } from '../../ledger/ledger.vm';
import { SettingsUtilityService } from '../../settings/services/settings-utility.service';
import { SettingsProfileActions } from '../../actions/settings/profile/settings.profile.action';

@Component({
    selector: 'create-purchase-order',
    templateUrl: './create-purchase-order.component.html',
    styleUrls: ['./create-purchase-order.component.scss']
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
    public showLoader: boolean = true;
    /** Stores warehouses for a company */
    public warehouses: Array<any>;
    /** True, if warehouse drop down should be displayed */
    public shouldShowWarehouse: boolean;
    /* This will hold the company country name */
    public companyCountryName: string = '';

    constructor(private store: Store<AppState>, private modalService: BsModalService, private generalService: GeneralService, private breakPointObservar: BreakpointObserver, private salesAction: SalesActions, private salesService: SalesService, private warehouseActions: WarehouseActions, private settingsUtilityService: SettingsUtilityService, private settingsProfileActions: SettingsProfileActions) {
        this.flattenAccountListStream$ = this.store.pipe(select(state => state.general.flattenAccounts), takeUntil(this.destroyed$));
        this.selectedAccountDetails$ = this.store.pipe(select(state => state.sales.acDtl), takeUntil(this.destroyed$));
        this.store.dispatch(this.settingsProfileActions.GetProfileInfo());
        this.store.dispatch(this.warehouseActions.fetchAllWarehouses({ page: 1, count: 0 }));
    }

    public ngOnInit() {
        this.breakPointObservar.observe([
            '(max-width: 768px)'
        ]).subscribe(result => {
            this.isMobileScreen = result.matches;
        });

        this.createVendorList();
        this.initializeWarehouse();

        this.selectedAccountDetails$.subscribe(async accountDetails => {
            if (accountDetails && !this.isUpdateMode) {
                console.log(accountDetails);

                this.vendorCountry = "";

                if (accountDetails.country) {
                    this.vendorCountry = accountDetails.country.countryName;
                    await this.getUpdatedStateCodes(accountDetails.country.countryCode);
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
            }
        });

        this.store.pipe(select(prof => prof.settings.profile), takeUntil(this.destroyed$)).subscribe(async (profile) => {
            this.companyCountryName = profile.country;
            console.log(profile);
        });
    }

    public createVendorList(): void {
        let sundryCreditorsAcList = [];
        this.flattenAccountListStream$.subscribe(items => {
            if (items && items.length > 0) {
                items.forEach(item => {
                    if (item.parentGroups.some(p => p.uniqueName === 'sundrycreditors')) {
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

    public addNewAccount(): void {

    }

    public getAccountDetails(accountUniqueName: string): void {
        this.store.dispatch(this.salesAction.getAccountDetailsForSales(accountUniqueName));
    }

    public fillShippingBillingDetails(event: any, isBilling: boolean, addressType: string): void {
        let stateName = event.label;
        let stateCode = event.value;

        if (isBilling) {
            if(addressType === "vendor") {
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
            if(addressType === "vendor") {
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

    public autoFillVendorShippingDetails(addressType: string): void {
        if(addressType === "vendor") {
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
     * fetched to carry outn further operations
     *
     * @private
     * @param {*} countryCode Country code for the user
     * @returns Promise to carry out further operations
     * @memberof CreatePurchaseOrderComponent
     */
    private getUpdatedStateCodes(countryCode: any): Promise<any> {
        this.startLoader(true);
        return new Promise((resolve: Function) => {
            if (countryCode) {
                this.salesService.getStateCode(countryCode).subscribe(resp => {
                    this.startLoader(false);
                    this.statesSource = this.modifyStateResp((resp.body) ? resp.body.stateList : []);
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
}