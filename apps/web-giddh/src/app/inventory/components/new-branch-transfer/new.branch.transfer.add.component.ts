import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AppState } from '../../../store';
import { Store, select } from '@ngrx/store';
import { Component, Input, OnDestroy, OnInit, ViewChild, OnChanges, SimpleChanges, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import {
    CompanyResponse
} from '../../../models/api-models/Company';
import * as dayjs from 'dayjs';
import { GeneralService } from '../../../services/general.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import {
    ILinkedStocksResult,
    LinkedStocksResponse, LinkedStocksVM,
    NewBranchTransferRequest
} from '../../../models/api-models/BranchTransfer';
import { InventoryAction } from "../../../actions/inventory/inventory.actions";
import { OnboardingFormRequest } from "../../../models/api-models/Common";
import { CommonActions } from "../../../actions/common.actions";
import { IOption } from "../../../theme/ng-select/option.interface";
import { ToasterService } from "../../../services/toaster.service";
import { IForceClear } from "../../../models/api-models/Sales";
import { IEwayBillfilter, IEwayBillTransporter, IAllTransporterDetails } from "../../../models/api-models/Invoice";
import { InvoiceActions } from "../../../actions/invoice/invoice.actions";
import { transporterModes } from "../../../shared/helpers/transporterModes";
import { InventoryService } from "../../../services/inventory.service";
import { GIDDH_DATE_FORMAT } from "../../../shared/helpers/defaultDateFormat";
import { NgForm } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { SettingsWarehouseService } from '../../../services/settings.warehouse.service';
import { ShSelectComponent } from '../../../theme/ng-virtual-select/sh-select.component';
import { InvoiceSetting } from '../../../models/interfaces/invoice.setting.interface';
import { OrganizationType } from '../../../models/user-login-state';
import { cloneDeep, isEmpty } from '../../../lodash-optimized';

@Component({
    selector: 'new-branch-transfer',
    templateUrl: './new.branch.transfer.add.component.html',
    styleUrls: ['./new.branch.transfer.component.scss'],
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

export class NewBranchTransferAddComponent implements OnInit, OnChanges, OnDestroy {
    @Input() public branchTransferMode: string;
    @Input() public editBranchTransferUniqueName: string;
    @Output() public hideModal: EventEmitter<boolean> = new EventEmitter(false);
    @ViewChild('productSkuCode', { static: true }) public productSkuCode;
    @ViewChild('productHsnNumber', { static: true }) public productHsnNumber;
    @ViewChild('generateTransporterForm', { static: true }) public generateNewTransporterForm: NgForm;
    @ViewChild('selectDropdown', { static: false }) public selectDropdown: ShSelectComponent;
    @ViewChild('sourceWarehouse', { static: false }) public sourceWarehouse: ShSelectComponent;
    @ViewChild('destinationWarehouse', { static: false }) public destinationWarehouse: ShSelectComponent;
    @ViewChild('productDescription', { static: true }) public productDescription;
    @ViewChild('transMode', { static: true }) public transMode: ShSelectComponent;
    @ViewChild('vehicleNumber', { static: true }) public vehicleNumber;
    @ViewChild('transCompany', { static: true }) public transCompany: ShSelectComponent;
    @ViewChild('destinationWarehouseList', { static: false }) public destinationWarehouseList: ShSelectComponent;
    @ViewChild('sourceWarehouses', { static: false }) public sourceWarehouseList: ShSelectComponent;
    @ViewChild('sourceQuantity', { static: false }) public sourceQuantity;
    @ViewChild('defaultSource', { static: false }) public defaultSource: ShSelectComponent;
    @ViewChild('defaultProduct', { static: false }) public defaultProduct: ShSelectComponent;
    @ViewChild('destinationName', { static: false }) public destinationName: ShSelectComponent;
    @ViewChild('destinationQuantity', { static: false }) public destinationQuantity;
    @ViewChild('senderGstNumberField', { static: false }) public senderGstNumberField: HTMLInputElement;
    @ViewChild('receiverGstNumberField', { static: false }) public receiverGstNumberField: HTMLInputElement;

    public hsnPopupShow: boolean = false;
    public skuNumberPopupShow: boolean = false;
    public asideMenuState: string = 'out';
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public branchTransfer: NewBranchTransferRequest;
    public transferType: string = 'products';
    public branches: any;
    public branches$: Observable<CompanyResponse[]>;
    public allWarehouses: any[] = [];
    public senderWarehouses: IOption[] = [];
    public destinationWarehouses: IOption[] = [];
    public formFields: any[] = [];
    public stockList: IOption[] = [];
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    public activeRow: number = -1;
    public activeCompany: any = {};
    public inputMaskFormat: any = '';
    public transportEditMode: boolean = false;
    public transporterList$: Observable<IEwayBillTransporter[]>;
    public transporterListDetails$: Observable<IAllTransporterDetails>;
    public transporterListDetails: IAllTransporterDetails;
    public isGenarateTransporterInProcess$: Observable<boolean>;
    public isGenarateTransporterSuccessfully$: Observable<boolean>;
    public updateTransporterInProcess$: Observable<boolean>;
    public updateTransporterSuccess$: Observable<boolean>;
    public generateNewTransporter: IEwayBillTransporter = {
        transporterId: null,
        transporterName: null
    };
    public keydownClassAdded: boolean = false;
    public transporterPopupStatus: boolean = false;
    public currenTransporterId: string;
    public transporterFilterRequest: IEwayBillfilter = new IEwayBillfilter();
    public transporterDropdown$: Observable<IOption[]>;
    public transporterMode: IOption[] = [];
    public overallTotal: number = 0;
    public isValidSourceTaxNumber: boolean = true;
    public isValidDestinationTaxNumber: boolean = true;
    public tempDateParams: any = { dateOfSupply: new Date(), dispatchedDate: '' };
    public isLoading: boolean = false;
    public hsnNumber: any = '';
    public sacNumber: any = '';
    public skuNumber: any = '';
    public myCurrentCompany: string = '';
    public innerEntryIndex: number;
    public isUpdateMode: boolean = false;
    public allowAutoFocusInField: boolean = false;
    public inventorySettings: any;

    /** True if current organization is branch */
    public isBranch: boolean;
    /** True if current organization is company with single branch */
    public isCompanyWithSingleBranch: boolean;
    /** Stores the source branch alias */
    public sourceBranchAlias: string;
    /** Stores the destination branch alias */
    public destinationBranchAlias: string;
    /* This will clear the branch value in dropdown */
    public branchClear$: Observable<IForceClear> = observableOf({ status: false });
    /* This will clear the source branch value in dropdown */
    public sourceBranchClear$: Observable<IForceClear> = observableOf({ status: false });
    /* This will clear the destination branch value in dropdown */
    public destinationBranchClear$: Observable<IForceClear> = observableOf({ status: false });
    /* This will clear the warehouse value in dropdown */
    public warehouseClear$: Observable<IForceClear> = observableOf({ status: false });
    /* This will clear the sender warehouse value in dropdown */
    public senderWarehouseClear$: Observable<IForceClear> = observableOf({ status: false });
    /* This will clear the destination warehouse value in dropdown */
    public destinationWarehouseClear$: Observable<IForceClear> = observableOf({ status: false });
    /** Information message to be shown to the user for branch transfer */
    public branchTransferInfoText: string = '';
    /** True if it's default load */
    private isDefaultLoad: boolean = false;

    constructor(private _router: Router, private store: Store<AppState>, private _generalService: GeneralService, private _inventoryAction: InventoryAction, private commonActions: CommonActions, private inventoryAction: InventoryAction, private _toasty: ToasterService, private _warehouseService: SettingsWarehouseService, private invoiceActions: InvoiceActions, private inventoryService: InventoryService, private _cdRef: ChangeDetectorRef, public bsConfig: BsDatepickerConfig) {
        this.bsConfig.dateInputFormat = GIDDH_DATE_FORMAT;
        this.getInventorySettings();
        this.initFormFields();
    }

    public ngOnInit(): void {
        this.store.dispatch(this.invoiceActions.getInvoiceSetting());
        this.store.dispatch(this.invoiceActions.resetTransporterListResponse());

        this.getTransportersList();
        this.getStock();

        this.store.pipe(select(p => p.settings.profile), takeUntil(this.destroyed$)).subscribe((o) => {
            if (o && !isEmpty(o)) {
                let companyInfo = cloneDeep(o);
                this.activeCompany = companyInfo;
                this.inputMaskFormat = this.activeCompany.balanceDisplayFormat ? this.activeCompany.balanceDisplayFormat.toLowerCase() : '';
                this.getOnboardingForm(companyInfo.countryV2.alpha2CountryCode);
                this.assignCurrentCompany();
            }
        });

        this.getBranches();

        transporterModes.map(c => {
            this.transporterMode.push({ label: c.label, value: c.value });
        });

        if (!this.editBranchTransferUniqueName) {
            this.allowAutoFocusInField = true;
            this.focusDefaultSource();
        } else {
            this.isDefaultLoad = true;
        }
        this.isBranch = this._generalService.currentOrganizationType === OrganizationType.Branch;
        this.isCompanyWithSingleBranch = this._generalService.currentOrganizationType === OrganizationType.Company && this.branches && this.branches.length === 1;
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.branchTransferMode && changes.branchTransferMode.firstChange && this.branches && this.branches.length) {
            this.assignCurrentCompany();
        }
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public closeBranchTransferPopup(isNoteCreatedSuccessfully?: boolean): void {
        this.hideModal.emit(isNoteCreatedSuccessfully);
    }

    public toggleBodyClass(): void {
        if (this.asideMenuState === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }

    public toggleAsidePane(event?): void {
        if (event) {
            event.preventDefault();
        }
        this.asideMenuState = this.asideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    public changeTransferType(): void {
        this.allowAutoFocusInField = false;
        this.initFormFields();
        this.tempDateParams.dateOfSupply = new Date();
        this.tempDateParams.dispatchedDate = "";
        this.assignCurrentCompany();
        this.calculateOverallTotal();

        setTimeout(() => {
            this.allowAutoFocusInField = true;

            if (this.transferType === "products") {
                this.focusDefaultSource();
            } else {
                this.focusDefaultProduct();
            }
        }, 200);
    }

    public initFormFields(): void {
        this.branchTransfer = {
            dateOfSupply: null,
            challanNo: null,
            uniqueName: null,
            note: null,
            sources: [{
                name: null,
                uniqueName: null,
                warehouse: {
                    name: null,
                    uniqueName: null,
                    taxNumber: null,
                    address: null,
                    stockDetails: {
                        stockUnit: null,
                        amount: null,
                        rate: null,
                        quantity: null
                    }
                }
            }],
            destinations: [{
                name: null,
                uniqueName: null,
                warehouse: {
                    name: null,
                    uniqueName: null,
                    taxNumber: null,
                    address: null,
                    stockDetails: {
                        stockUnit: null,
                        amount: null,
                        rate: null,
                        quantity: null
                    }
                }
            }],
            products: [{
                name: null,
                hsnNumber: null,
                sacNumber: null,
                showCodeType: null,
                skuCode: null,
                uniqueName: null,
                stockDetails: {
                    stockUnit: null,
                    amount: null,
                    rate: null,
                    quantity: null
                },
                description: null
            }],
            transporterDetails: {
                dispatchedDate: null,
                transporterName: null,
                transporterId: null,
                transportMode: null,
                vehicleNumber: null
            },
            entity: (this.branchTransferMode) ? this.branchTransferMode : null,
            transferType: (this.transferType) ? this.transferType : null
        };

        this.forceClear$ = observableOf({ status: true });
        this.branchClear$ = observableOf({ status: true });
        this.sourceBranchClear$ = observableOf({ status: true });
        this.destinationBranchClear$ = observableOf({ status: true });
        this.warehouseClear$ = observableOf({ status: true });
        this.senderWarehouseClear$ = observableOf({ status: true });
        this.destinationWarehouseClear$ = observableOf({ status: true });
        this.activeRow = -1;
    }

    public setActiveRow(index): void {
        this.activeRow = index;
    }

    public selectCompany(event, type, index): void {
        if (!this.isDefaultLoad && type) {
            if (type === "sources") {
                if (this.branchTransfer.sources[index]) {
                    this.branchTransfer.sources[index].name = event.label;
                    if (this.branchTransfer.sources[index].warehouse) {
                        this.branchTransfer.sources[index].warehouse.name = "";
                        this.branchTransfer.sources[index].warehouse.uniqueName = "";
                        this.branchTransfer.sources[index].warehouse.taxNumber = "";
                        this.branchTransfer.sources[index].warehouse.address = "";
                        if (!this.branchTransfer.sources[index].warehouse.stockDetails) {
                            this.branchTransfer.sources[index].warehouse.stockDetails = {
                                stockUnit: null,
                                amount: null,
                                rate: null,
                                quantity: null
                            };
                        }
                        this.branchTransfer.sources[index].warehouse.stockDetails.quantity = (event.value) ? 1 : null;
                    }
                    this.senderWarehouseClear$ = observableOf({ status: true });
                    this.resetSourceWarehouses(index);
                }
            } else {
                if (this.branchTransfer.destinations[index]) {
                    this.branchTransfer.destinations[index].name = event.label;
                    if (this.branchTransfer.destinations[index].warehouse) {
                        this.branchTransfer.destinations[index].warehouse.name = "";
                        this.branchTransfer.destinations[index].warehouse.uniqueName = "";
                        this.branchTransfer.destinations[index].warehouse.taxNumber = "";
                        this.branchTransfer.destinations[index].warehouse.address = "";

                        if (!this.branchTransfer.destinations[index].warehouse.stockDetails) {
                            this.branchTransfer.destinations[index].warehouse.stockDetails = {
                                stockUnit: null,
                                amount: null,
                                rate: null,
                                quantity: null
                            };
                        }

                        this.branchTransfer.destinations[index].warehouse.stockDetails.quantity = (event.value) ? 1 : null;
                    }
                    this.destinationWarehouseClear$ = observableOf({ status: true });
                    this.resetDestinationWarehouses(index);
                }
            }
        }
    }

    public getTransportersList(): void {
        this.transporterListDetails$ = this.store.pipe(select(p => p.ewaybillstate.TransporterListDetails), takeUntil(this.destroyed$));
        this.transporterList$ = this.store.pipe(select(p => p.ewaybillstate.TransporterList), takeUntil(this.destroyed$));

        this.transporterListDetails$.subscribe(op => {
            this.transporterListDetails = op;
        })

        this.store.dispatch(this.invoiceActions.getALLTransporterList(this.transporterFilterRequest));

        this.store.pipe(select(s => s.ewaybillstate.TransporterList), takeUntil(this.destroyed$)).subscribe(p => {
            if (p && p.length) {
                let transporterDropdown = null;
                let transporterArr = null;
                transporterDropdown = p;
                transporterArr = transporterDropdown.map(trans => {
                    return { label: trans.transporterName, value: trans.transporterId };
                });
                this.transporterDropdown$ = observableOf(transporterArr);
            }
        });

        this.isGenarateTransporterInProcess$ = this.store.pipe(select(p => p.ewaybillstate.isAddnewTransporterInProcess), takeUntil(this.destroyed$));
        this.updateTransporterInProcess$ = this.store.pipe(select(p => p.ewaybillstate.updateTransporterInProcess), takeUntil(this.destroyed$));
        this.updateTransporterSuccess$ = this.store.pipe(select(p => p.ewaybillstate.updateTransporterSuccess), takeUntil(this.destroyed$));
        this.isGenarateTransporterSuccessfully$ = this.store.pipe(select(p => p.ewaybillstate.isAddnewTransporterInSuccess), takeUntil(this.destroyed$));

        this.updateTransporterSuccess$.subscribe(s => {
            if (s) {
                this.generateNewTransporterForm.reset();
            }
        });

        this.store.pipe(select(state => state.ewaybillstate.isAddnewTransporterInSuccess), takeUntil(this.destroyed$)).subscribe(p => {
            if (p) {
                this.clearTransportForm();
            }
        });
    }

    public addReceiver(): void {
        this.branchTransfer.destinations.push({
            name: null,
            uniqueName: null,
            warehouse: {
                name: null,
                uniqueName: null,
                taxNumber: null,
                address: null,
                stockDetails: {
                    stockUnit: (this.branchTransfer.products[0].stockDetails.stockUnit) ? this.branchTransfer.products[0].stockDetails.stockUnit : null,
                    amount: null,
                    rate: null,
                    quantity: null
                }
            }
        });

        let currentIndex = this.branchTransfer.destinations.length - 1;
        this.focusSelectDropdown(currentIndex);
    }

    public addSender(): void {
        this.branchTransfer.sources.push({
            name: null,
            uniqueName: null,
            warehouse: {
                name: null,
                uniqueName: null,
                taxNumber: null,
                address: null,
                stockDetails: {
                    stockUnit: (this.branchTransfer.products[0].stockDetails.stockUnit) ? this.branchTransfer.products[0].stockDetails.stockUnit : null,
                    amount: null,
                    rate: null,
                    quantity: null
                }
            }
        });

        let currentIndex = this.branchTransfer.sources.length - 1;
        this.focusSelectDropdown(currentIndex);
    }

    public addProduct(): void {
        this.branchTransfer.products.push({
            name: null,
            hsnNumber: null,
            sacNumber: null,
            showCodeType: null,
            skuCode: null,
            uniqueName: null,
            stockDetails: {
                stockUnit: null,
                amount: null,
                rate: null,
                quantity: null
            },
            description: null
        });

        let currentIndex = this.branchTransfer.products.length - 1;
        this.focusSelectDropdown(currentIndex);
    }

    public removeProduct(i): void {
        this.branchTransfer.products.splice(i, 1);
        this.calculateOverallTotal();
    }

    public removeSender(i): void {
        this.branchTransfer.sources.splice(i, 1);
        this.calculateOverallTotal();
    }

    public removeReceiver(i): void {
        this.branchTransfer.destinations.splice(i, 1);
        this.calculateOverallTotal();
    }

    public linkedStocksVM(data: ILinkedStocksResult[]): LinkedStocksVM[] {
        let branches: LinkedStocksVM[] = [];
        this.senderWarehouses = [];
        this.destinationWarehouses = [];
        this.allWarehouses = [];

        if (data && data.length > 0) {
            data.forEach(d => {
                if (d && !d.isCompany) {
                    d.warehouses?.forEach(warehouse => {
                        warehouse.taxNumber = warehouse.taxNumber || '';
                    });
                    if (this.editBranchTransferUniqueName || !d.isArchived) {
                        branches.push(new LinkedStocksVM(d.name, d?.uniqueName, false, d.alias, d.warehouses, d.isArchived));
                    }
                    if (d.warehouses?.length) {
                        this.senderWarehouses[d?.uniqueName] = [];
                        this.destinationWarehouses[d?.uniqueName] = [];
                        this.allWarehouses[d?.uniqueName] = [];

                        d.warehouses?.forEach(key => {
                            if (this.editBranchTransferUniqueName || !key.isArchived) {
                                this.allWarehouses[d?.uniqueName].push(key);

                                this.senderWarehouses[d?.uniqueName].push({ label: key.name, value: key?.uniqueName });
                                this.destinationWarehouses[d?.uniqueName].push({ label: key.name, value: key?.uniqueName });
                            }
                        });
                    }
                }
            });
        }
        return branches;
    }

    public getOnboardingForm(countryCode): void {
        this.store.dispatch(this.commonActions.resetOnboardingForm());

        this.store.pipe(select(s => s.common.onboardingform), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                if (res.fields) {
                    Object.keys(res.fields).forEach(key => {
                        if (res.fields[key]) {
                            this.formFields[res.fields[key].name] = [];
                            this.formFields[res.fields[key].name] = res.fields[key];
                        }
                    });
                    this.branchTransferInfoText = `Branch Transfer is allowed only if the Sender and Receiver warehouses have the same ${this.formFields['taxName']?.label || 'tax'}  or doesn't have any ${this.formFields['taxName']?.label || 'tax'}`;
                }
            } else {
                let onboardingFormRequest = new OnboardingFormRequest();
                onboardingFormRequest.formName = '';
                onboardingFormRequest.country = countryCode;
                this.store.dispatch(this.commonActions.GetOnboardingForm(onboardingFormRequest));
            }
        });
    }

    public getBranches(): void {
        this.store.dispatch(this._inventoryAction.GetAllLinkedStocks());

        this.store.pipe(select(s => s.inventoryBranchTransfer.linkedStocks), takeUntil(this.destroyed$)).subscribe((branches: LinkedStocksResponse) => {
            if (branches) {
                if (branches.results?.length) {
                    this.branches = this.linkedStocksVM(branches.results).map(b => ({
                        label: `${b.alias}`,
                        value: b?.uniqueName,
                        additional: b
                    }));
                    this.branches$ = observableOf(this.branches);
                    this.isCompanyWithSingleBranch = this._generalService.currentOrganizationType === OrganizationType.Company && this.branches && this.branches.length === 1;
                    if (this.editBranchTransferUniqueName) {
                        this.getBranchTransfer();
                    }
                } else {
                    this.branches = [];
                    this.branches$ = observableOf(null);
                    this.isCompanyWithSingleBranch = this._generalService.currentOrganizationType === OrganizationType.Company && this.branches && this.branches.length === 1;
                    if (this.editBranchTransferUniqueName) {
                        this.getBranchTransfer();
                    }
                }
                setTimeout(() => {
                    this.assignCurrentCompany();
                }, 500);
            }
        });
    }

    public selectProduct(event, product): void {
        if (event && event.additional) {
            product.name = event.additional.name;
            product.stockDetails.stockUnit = event.additional.stockUnit.code;
            product.stockDetails.rate = 0;

            this.inventoryService.GetStockDetails(event.additional.stockGroup?.uniqueName, event.value).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
                if (response.status === 'success') {
                    product.stockDetails.rate = response.body.purchaseAccountDetails?.unitRates[0]?.rate;
                    if (!response.body.purchaseAccountDetails) {
                        product.stockDetails.stockUnit = response.body.stockUnit.code;
                    } else {
                        product.stockDetails.stockUnit = response.body.purchaseAccountDetails?.unitRates[0]?.stockUnitCode;
                    }
                    this.calculateRowTotal(product);
                }
            });

            product.stockDetails.quantity = product.stockDetails.quantity || 1;
            product.skuCode = event.additional.skuCode;

            if (event.additional?.hsnNumber && event.additional?.sacNumber) {
                if (this.inventorySettings?.manageInventory) {
                    product.hsnNumber = event.additional.hsnNumber;
                    product.showCodeType = "hsn";
                } else {
                    product.sacNumber = event.additional.sacNumber;
                    product.showCodeType = "sac";
                }
            } else if (event.additional?.hsnNumber && !event.additional?.sacNumber) {
                product.hsnNumber = event.additional.hsnNumber;
                product.showCodeType = "hsn";
            } else if (!event.additional?.hsnNumber && event.additional?.sacNumber) {
                product.sacNumber = event.additional.sacNumber;
                product.showCodeType = "sac";
            } else if (!event.additional?.hsnNumber && !event.additional?.sacNumber) {
                if (this.inventorySettings?.manageInventory) {
                    product.hsnNumber = "";
                    product.showCodeType = "hsn";
                } else {
                    product.sacNumber = "";
                    product.showCodeType = "sac";
                }
            }

            if (this.transferType === 'senders') {
                this.branchTransfer.destinations[0].warehouse.stockDetails.stockUnit = event.additional.stockUnit.code;
                this.branchTransfer.sources[0].warehouse.stockDetails.stockUnit = event.additional.stockUnit.code;

                this.focusDefaultSource();
            }

            setTimeout(() => {
                if (this.productDescription && this.productDescription.nativeElement) {
                    this.productDescription.nativeElement.focus();
                }
            }, 200);
        }
    }

    /**
     * Resets the warehouse when user clears the warehouse from the dropdown
     *
     * @param {string} type Type of warehouse selected ('source', 'destination')
     * @param {number} index Index of warehouse
     * @memberof NewBranchTransferAddComponent
     */
    public resetWarehouse(type: string, index: number): void {
        if (type === "sources") {
            if (this.branchTransfer.sources[index] && this.branchTransfer.sources[index].warehouse) {
                this.branchTransfer.sources[index].warehouse.name = null;
                this.branchTransfer.sources[index].warehouse.uniqueName = null;
                this.branchTransfer.sources[index].warehouse.taxNumber = null;
                this.branchTransfer.sources[index].warehouse.address = null;
                if (this.branchTransfer.sources[index].warehouse.stockDetails) {
                    this.branchTransfer.sources[index].warehouse.stockDetails.quantity = null;
                }
            }
            this.resetSourceWarehouses(index, true);
            if (this.branchTransfer.destinations[index] && this.branchTransfer.destinations[index].warehouse &&
                this.branchTransfer.destinations[index].warehouse?.uniqueName === null) {
                // Source and destination warehouses are cleared, reset both warehouses
                this.resetDestinationWarehouses(index, true);
                this.branches$ = observableOf(this.branches);
            }
        } else {
            if (this.branchTransfer.destinations[index] && this.branchTransfer.destinations[index].warehouse) {
                this.branchTransfer.destinations[index].warehouse.name = null;
                this.branchTransfer.destinations[index].warehouse.uniqueName = null;
                this.branchTransfer.destinations[index].warehouse.taxNumber = null;
                this.branchTransfer.destinations[index].warehouse.address = null;
                if (this.branchTransfer.destinations[index].warehouse.stockDetails) {
                    this.branchTransfer.destinations[index].warehouse.stockDetails.quantity = null;
                }
            }
            this.resetDestinationWarehouses(index, true);
            if (this.branchTransfer.sources[index] && this.branchTransfer.sources[index].warehouse &&
                this.branchTransfer.sources[index].warehouse.uniqueName === null) {
                // Source and destination warehouses are cleared, reset both warehouses
                this.resetSourceWarehouses(index, true);
                this.branches$ = observableOf(this.branches);
            }
        }
    }

    public getWarehouseDetails(type, index): void {
        if (this.branchTransfer[type][index].warehouse && this.branchTransfer[type][index].warehouse?.uniqueName !== null) {
            this._warehouseService.getWarehouseDetails(this.branchTransfer[type][index].warehouse?.uniqueName).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                if (res && res.body) {
                    this.branchTransfer[type][index].warehouse.name = res.body.name;
                    if (res.body.addresses && res.body.addresses.length) {
                        const defaultAddress = res.body.addresses.find(address => address.isDefault);
                        this.branchTransfer[type][index].warehouse.address = defaultAddress ? `${defaultAddress.address}${defaultAddress?.pincode ? '\n' + 'PIN: ' + defaultAddress?.pincode : ''}` : '';
                        this.branchTransfer[type][index].warehouse.taxNumber = defaultAddress ? defaultAddress.taxNumber : '';
                    } else {
                        this.branchTransfer[type][index].warehouse.address = '';
                        this.branchTransfer[type][index].warehouse.taxNumber = '';
                    }
                    let branchesWithSameTax = [];
                    if (!this.editBranchTransferUniqueName) {
                        /*  Find the branches which have the same tax number as the selected warehouse
                            because the branch transfer can take place between same tax number branches for GST and VAT, for other
                            countries taxation is not supported as of now. This will allow users to transfer between same
                            tax warehouses. If it is delivery challan then sender's warehouse will be taken for reference and in
                            receipt note destination's warehouse. If the sender's warehouse is changed in delivery challan then we
                            need to show branches in receiver's name that have the warehouse with tax number equal to sender's warehouse
                            else no branch will be displayed. Same case for receipt note, if receiver's warehouse is changed then
                            branches that will be displayed in sender's name are those with same tax number as sender's warehouse
                         */
                        branchesWithSameTax = this.branches?.filter(branch => {
                            if (branch.additional && branch.additional.warehouses && branch.additional.warehouses.length) {
                                return branch.additional.warehouses.some(warehouse => warehouse.taxNumber === this.branchTransfer[type][index].warehouse.taxNumber);
                            }
                            return false;
                        });
                        this.branches$ = observableOf(branchesWithSameTax);
                    }
                    if (type === "sources") {
                        // Clear the destination branch if it is not present in branches with same tax array, as only branches with same tax should be displayed
                        if (branchesWithSameTax && !this.editBranchTransferUniqueName && this.branchTransfer['destinations'][index] && !branchesWithSameTax.some(branch => branch.value === this.branchTransfer['destinations'][index]?.uniqueName)) {
                            if (this.branchTransferMode === 'deliverynote') {
                                this.destinationBranchClear$ = observableOf({ status: true });
                            }
                        }
                        this.resetDestinationWarehouses(index);
                    } else {
                        // Clear the source branch if it is not present in branches with same tax array, as only branches with same tax should be displayed
                        if (branchesWithSameTax && !this.editBranchTransferUniqueName && this.branchTransfer['sources'][index] && !branchesWithSameTax.some(branch => branch.value === this.branchTransfer['sources'][index]?.uniqueName)) {
                            if (this.branchTransferMode === 'receiptnote') {
                                this.sourceBranchClear$ = observableOf({ status: true });
                            }
                        }
                        this.resetSourceWarehouses(index);
                    }
                    this.detectChanges();
                }
            });
        } else {
            this.branchTransfer[type][index].warehouse.name = "";
            this.branchTransfer[type][index].warehouse.taxNumber = "";
            this.branchTransfer[type][index].warehouse.address = "";
        }
    }

    /**
     * Resets the source warehouse in sender and destination dropdowns
     *
     * @param {number} index Index of the warehouse
     * @param {boolean} [reInitializeWarehouses] True, if the warehouse dropdown needs to be reset (is true only when either sender/receiver
     * warehouses are reset and the left sender/receiver warehouse needs to be reset)
     * @memberof NewBranchTransferAddComponent
     */
    public resetSourceWarehouses(index: number, reInitializeWarehouses?: boolean) {
        if (this.branchTransfer.destinations && this.branchTransfer.destinations[index] && this.branchTransfer.destinations[index].warehouse && this.branchTransfer.destinations[index].warehouse?.uniqueName !== null) {
            this.senderWarehouses[this.branchTransfer.destinations[index]?.uniqueName] = [];
            let allowWarehouse = true;

            if (this.allWarehouses[this.branchTransfer.destinations[index]?.uniqueName] && this.allWarehouses[this.branchTransfer.destinations[index]?.uniqueName].length > 0) {
                this.allWarehouses[this.branchTransfer.destinations[index]?.uniqueName].forEach(key => {
                    allowWarehouse = true;

                    if (key?.uniqueName === this.branchTransfer.destinations[index].warehouse?.uniqueName ||
                        key.taxNumber !== (this.branchTransfer.destinations[index].warehouse.taxNumber || '')) {
                        allowWarehouse = false;
                    }

                    if (allowWarehouse) {
                        this.senderWarehouses[this.branchTransfer.destinations[index]?.uniqueName].push({ label: key.name, value: key?.uniqueName });
                    }
                });
            }
            if (this.branchTransfer.sources[index] && this.branchTransfer.sources[index]?.uniqueName) {
                // Update source warehouses
                this.senderWarehouses[this.branchTransfer.sources[index]?.uniqueName] = [];
                if (this.allWarehouses[this.branchTransfer.sources[index]?.uniqueName] && this.allWarehouses[this.branchTransfer.sources[index]?.uniqueName].length > 0) {
                    this.allWarehouses[this.branchTransfer.sources[index]?.uniqueName].forEach(key => {
                        if (this.branchTransfer.destinations[index] && this.branchTransfer.destinations[index].warehouse && key?.uniqueName !== this.branchTransfer.destinations[index].warehouse?.uniqueName &&
                            key.taxNumber === (this.branchTransfer.destinations[index].warehouse.taxNumber || '')) {
                            this.senderWarehouses[this.branchTransfer.sources[index]?.uniqueName].push({ label: key.name, value: key?.uniqueName });
                        }
                    });
                    if (this.branchTransfer.sources[index].warehouse && this.branchTransfer.sources[index].warehouse?.uniqueName) {
                        setTimeout(() => {
                            if (this.sourceWarehouse) {
                                this.sourceWarehouse.writeValue(this.branchTransfer.sources[index].warehouse?.uniqueName);
                            }
                        }, 100);
                    }
                }
            }
        } else {
            if (this.allWarehouses && this.allWarehouses[this.branchTransfer.destinations[0]?.uniqueName]) {
                this.senderWarehouses[this.branchTransfer.destinations[0]?.uniqueName] = [];
                let allowWarehouse = true;

                this.allWarehouses[this.branchTransfer.destinations[0]?.uniqueName].forEach(key => {
                    allowWarehouse = true;

                    if (key?.uniqueName === this.branchTransfer.destinations[0].warehouse?.uniqueName ||
                        (!reInitializeWarehouses && key.taxNumber !== (this.branchTransfer.destinations[0].warehouse.taxNumber || ''))) {
                        allowWarehouse = false;
                    }

                    if (allowWarehouse) {
                        this.senderWarehouses[this.branchTransfer.destinations[0]?.uniqueName].push({ label: key.name, value: key?.uniqueName });
                    }
                });
            }
            // If multiple senders case for receipt note
            const sourceIndex = this.transferType !== 'products' ? index : 0;
            const destinationIndex = this.transferType !== 'products' ? 0 : index;
            if (this.branchTransfer.sources[sourceIndex] && this.branchTransfer.sources[sourceIndex]?.uniqueName) {
                // Update source warehouses
                this.senderWarehouses[this.branchTransfer.sources[sourceIndex]?.uniqueName] = [];
                if (this.allWarehouses[this.branchTransfer.sources[sourceIndex]?.uniqueName] && this.allWarehouses[this.branchTransfer.sources[sourceIndex]?.uniqueName].length > 0) {
                    this.allWarehouses[this.branchTransfer.sources[sourceIndex]?.uniqueName].forEach(key => {
                        if (this.branchTransfer.destinations[destinationIndex] && this.branchTransfer.destinations[destinationIndex].warehouse && key?.uniqueName !== this.branchTransfer.destinations[destinationIndex].warehouse?.uniqueName &&
                            (reInitializeWarehouses || key.taxNumber === (this.branchTransfer.destinations[destinationIndex].warehouse.taxNumber || ''))) {
                            this.senderWarehouses[this.branchTransfer.sources[sourceIndex]?.uniqueName].push({ label: key.name, value: key?.uniqueName });
                        }
                    });
                    if (this.branchTransfer.sources[index].warehouse && this.branchTransfer.sources[index].warehouse?.uniqueName) {
                        setTimeout(() => {
                            if (this.sourceWarehouse) {
                                this.sourceWarehouse.writeValue(this.branchTransfer.sources[index].warehouse?.uniqueName);
                            }
                        }, 100);
                    }
                }
            }
        }
        this.detectChanges();
    }

    /**
     * Resets the destination warehouse in sender and destination dropdowns
     *
     * @param {*} index Index of the warehouse
     * @param {boolean} [reInitializeWarehouses] True, if the warehouse dropdown needs to be reset (is true only when either sender/receiver
     * warehouses are reset and the left sender/receiver warehouse needs to be reset)
     * @memberof NewBranchTransferAddComponent
     */
    public resetDestinationWarehouses(index, reInitializeWarehouses?: boolean) {
        if (this.branchTransfer.sources && this.branchTransfer.sources[index] && this.branchTransfer.sources[index].warehouse?.uniqueName !== null) {
            this.destinationWarehouses[this.branchTransfer.sources[index]?.uniqueName] = [];
            let allowWarehouse = true;

            if (this.allWarehouses[this.branchTransfer.sources[index]?.uniqueName] && this.allWarehouses[this.branchTransfer.sources[index]?.uniqueName].length > 0) {
                this.allWarehouses[this.branchTransfer.sources[index]?.uniqueName].forEach(key => {
                    allowWarehouse = true;

                    if (key?.uniqueName === this.branchTransfer.sources[index].warehouse?.uniqueName ||
                        key.taxNumber !== (this.branchTransfer.sources[index].warehouse.taxNumber || '')) {
                        allowWarehouse = false;
                    }

                    if (allowWarehouse) {
                        this.destinationWarehouses[this.branchTransfer.sources[index]?.uniqueName].push({ label: key.name, value: key?.uniqueName });
                    }
                });
            }
            if (this.branchTransfer.destinations[index] && this.branchTransfer.destinations[index]?.uniqueName) {
                // Update Destination warehouses
                this.destinationWarehouses[this.branchTransfer.destinations[index]?.uniqueName] = [];
                if (this.allWarehouses[this.branchTransfer.destinations[index]?.uniqueName] && this.allWarehouses[this.branchTransfer.destinations[index]?.uniqueName].length > 0) {
                    this.allWarehouses[this.branchTransfer.destinations[index]?.uniqueName].forEach(key => {
                        if (key?.uniqueName !== this.branchTransfer.sources[index].warehouse?.uniqueName &&
                            key.taxNumber === (this.branchTransfer.sources[index].warehouse.taxNumber || '')) {
                            this.destinationWarehouses[this.branchTransfer.destinations[index]?.uniqueName].push({ label: key.name, value: key?.uniqueName });
                        }
                    });
                }
                if (this.branchTransfer.destinations[index].warehouse && this.branchTransfer.destinations[index].warehouse?.uniqueName) {
                    setTimeout(() => {
                        if (this.destinationWarehouse) {
                            this.destinationWarehouse.writeValue(this.branchTransfer.destinations[index].warehouse?.uniqueName);
                        }
                    }, 100);
                }
            }
        } else {
            if (this.allWarehouses && this.branchTransfer.sources[0] && this.allWarehouses[this.branchTransfer.sources[0]?.uniqueName]) {
                this.destinationWarehouses[this.branchTransfer.sources[0]?.uniqueName] = [];
                let allowWarehouse = true;

                if (this.allWarehouses[this.branchTransfer.sources[0]?.uniqueName] && this.allWarehouses[this.branchTransfer.sources[0]?.uniqueName].length > 0) {
                    this.allWarehouses[this.branchTransfer.sources[0]?.uniqueName].forEach(key => {
                        allowWarehouse = true;

                        if (key?.uniqueName === this.branchTransfer.sources[0].warehouse?.uniqueName ||
                            (!reInitializeWarehouses && key.taxNumber !== (this.branchTransfer.sources[0].warehouse.taxNumber || ''))) {
                            allowWarehouse = false;
                        }

                        if (allowWarehouse) {
                            this.destinationWarehouses[this.branchTransfer.sources[0]?.uniqueName].push({ label: key.name, value: key?.uniqueName });
                        }
                    });
                }
            }
            // If multiple destinations case for delivery challan
            const destinationIndex = this.transferType !== 'products' ? index : 0;
            const sourceIndex = this.transferType !== 'products' ? 0 : index;
            if (this.branchTransfer.destinations[destinationIndex] && this.branchTransfer.destinations[destinationIndex]?.uniqueName) {
                // Update Destination warehouses
                this.destinationWarehouses[this.branchTransfer.destinations[destinationIndex]?.uniqueName] = [];
                if (this.allWarehouses[this.branchTransfer.destinations[destinationIndex]?.uniqueName] && this.allWarehouses[this.branchTransfer.destinations[destinationIndex]?.uniqueName].length > 0) {
                    this.allWarehouses[this.branchTransfer.destinations[destinationIndex]?.uniqueName].forEach(key => {
                        if (this.branchTransfer.sources[sourceIndex] && this.branchTransfer.sources[sourceIndex].warehouse && key?.uniqueName !== this.branchTransfer.sources[sourceIndex].warehouse?.uniqueName &&
                            (reInitializeWarehouses || key.taxNumber === (this.branchTransfer.sources[sourceIndex].warehouse.taxNumber || ''))) {
                            this.destinationWarehouses[this.branchTransfer.destinations[destinationIndex]?.uniqueName].push({ label: key.name, value: key?.uniqueName });
                        }
                    });
                }
                if (this.branchTransfer.destinations[index].warehouse && this.branchTransfer.destinations[index].warehouse?.uniqueName) {
                    setTimeout(() => {
                        if (this.destinationWarehouse) {
                            this.destinationWarehouse.writeValue(this.branchTransfer.destinations[index].warehouse?.uniqueName);
                        }
                    }, 100);
                }
            }
        }
        this.detectChanges();
    }

    public checkTaxNumberValidation(ele: HTMLInputElement): void {
        let isValid: boolean = false;

        if (ele.value) {
            if (this.formFields['taxName']['regex'] !== "" && this.formFields['taxName']['regex'].length > 0) {
                for (let key = 0; key < this.formFields['taxName']['regex'].length; key++) {
                    let regex = new RegExp(this.formFields['taxName']['regex'][key]);
                    if (regex.test(ele.value)) {
                        isValid = true;
                    }
                }
            } else {
                isValid = true;
            }

            if (!isValid) {
                this._toasty.errorToast('Invalid ' + this.formFields['taxName'].label);
                ele.classList.add('error-box');
                if (ele.name === "sourceTaxNumber") {
                    this.isValidSourceTaxNumber = false;
                } else {
                    this.isValidDestinationTaxNumber = false;
                }
            } else {
                ele.classList.remove('error-box');
                if (ele.name === "sourceTaxNumber") {
                    this.isValidSourceTaxNumber = true;
                } else {
                    this.isValidDestinationTaxNumber = true;
                }
            }
        } else {
            ele.classList.remove('error-box');
            if (ele.name === "sourceTaxNumber") {
                this.isValidSourceTaxNumber = true;
            } else {
                this.isValidDestinationTaxNumber = true;
            }
        }
    }

    public calculateRowTotal(product): void {
        if (!isNaN(parseFloat(product.stockDetails.rate)) && !isNaN(parseFloat(product.stockDetails.quantity))) {
            product.stockDetails.amount = parseFloat(product.stockDetails.rate) * parseFloat(product.stockDetails.quantity);
            if (isNaN(parseFloat(product.stockDetails.amount))) {
                product.stockDetails.amount = 0;
            } else {
                product.stockDetails.amount = Number(this._generalService.convertExponentialToNumber(parseFloat(product.stockDetails.amount).toFixed(2)));
            }
        } else {
            if (isNaN(parseFloat(product.stockDetails.rate))) {
                product.stockDetails.rate = 0;
            }
            if (isNaN(parseFloat(product.stockDetails.quantity))) {
                product.stockDetails.quantity = 0;
            }
            product.stockDetails.amount = 0;
        }

        this.calculateOverallTotal();
    }

    public calculateOverallTotal(): void {
        this.overallTotal = 0;

        if (this.transferType === 'products') {
            this.branchTransfer.products.forEach(product => {
                let overallTotal = 0;
                if (!isNaN(parseFloat(product.stockDetails.rate)) && !isNaN(parseFloat(product.stockDetails.quantity))) {
                    overallTotal = parseFloat(product.stockDetails.rate) * parseFloat(product.stockDetails.quantity);
                    if (isNaN(overallTotal)) {
                        overallTotal = 0;
                    }
                } else {
                    overallTotal = 0;
                }

                this.overallTotal += Number(this._generalService.convertExponentialToNumber((overallTotal)));
            });
        } else if (this.transferType !== 'products' && this.branchTransferMode === 'deliverynote') {
            this.branchTransfer.destinations.forEach(product => {
                let overallTotal = 0;
                if (!isNaN(parseFloat(product.warehouse.stockDetails.rate)) && !isNaN(parseFloat(product.warehouse.stockDetails.quantity))) {
                    overallTotal = parseFloat(product.warehouse.stockDetails.rate) * parseFloat(product.warehouse.stockDetails.quantity);
                    if (isNaN(overallTotal)) {
                        overallTotal = 0;
                    }
                } else {
                    overallTotal = 0;
                }

                this.overallTotal += Number(this._generalService.convertExponentialToNumber(overallTotal));
            });
        } else if (this.transferType !== 'products' && this.branchTransferMode === 'receiptnote') {
            this.branchTransfer.sources.forEach(product => {
                let overallTotal = 0;
                if (!isNaN(parseFloat(product.warehouse.stockDetails.rate)) && !isNaN(parseFloat(product.warehouse.stockDetails.quantity))) {
                    overallTotal = parseFloat(product.warehouse.stockDetails.rate) * parseFloat(product.warehouse.stockDetails.quantity);
                    if (isNaN(overallTotal)) {
                        overallTotal = 0;
                    }
                } else {
                    overallTotal = 0;
                }

                this.overallTotal += Number(this._generalService.convertExponentialToNumber(overallTotal));
            });
        }
    }

    public selectDateOfSupply(date): void {
        if (date && this.tempDateParams.dispatchedDate && date > this.tempDateParams.dispatchedDate) {
            this.tempDateParams.dispatchedDate = date;
        }
    }

    public submit(): void {
        this.isLoading = true;
        this.branchTransfer.dateOfSupply = dayjs(this.tempDateParams.dateOfSupply).format(GIDDH_DATE_FORMAT);

        if (this.tempDateParams.dispatchedDate) {
            this.branchTransfer.transporterDetails.dispatchedDate = dayjs(this.tempDateParams.dispatchedDate).format(GIDDH_DATE_FORMAT);
        }

        this.branchTransfer.sources.forEach(source => {
            if (source?.warehouse) {
                const [address, pin] = source.warehouse.address.split('\nPIN: ');
                source.warehouse.address = address;
                source.warehouse.pincode = pin;
            }
        });
        this.branchTransfer.destinations.forEach(destination => {
            if (destination?.warehouse) {
                const [address, pin] = destination.warehouse.address.split('\nPIN: ');
                destination.warehouse.address = address;
                destination.warehouse.pincode = pin;
            }
        });
        this.branchTransfer.entity = this.branchTransferMode;
        this.branchTransfer.transferType = this.transferType;

        this.branchTransfer.products.forEach(product => {
            if (product.showCodeType === "hsn") {
                product.sacNumber = "";
            } else {
                product.hsnNumber = "";
            }
            delete product.variant;
        });

        if (this.editBranchTransferUniqueName) {
            this.inventoryService.updateNewBranchTransfer(this.branchTransfer).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                this.isLoading = false;

                if (res) {
                    if (res.status === 'success') {
                        if (this.branchTransferMode === 'receiptnote') {
                            this._toasty.successToast("Receipt Note has been updated successfully.", "Success");
                        } else {
                            this._toasty.successToast("Delivery Challan has been updated successfully.", "Success");
                        }
                        this.closeBranchTransferPopup(true);
                        this._router.navigate(['/pages', 'inventory', 'report']);
                    } else {
                        this._toasty.errorToast(res.message, res.code);
                    }
                } else {
                    this._toasty.errorToast(res?.message, res?.code);
                }
            });
        } else {
            this.inventoryService.createNewBranchTransfer(this.branchTransfer).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                this.isLoading = false;
                if (res) {
                    if (res.status === 'success') {
                        this.tempDateParams.dateOfSupply = new Date();
                        this.tempDateParams.dispatchedDate = "";

                        if (this.branchTransferMode === 'receiptnote') {
                            this._toasty.successToast("Receipt Note has been saved successfully.", "Success");
                        } else {
                            this._toasty.successToast("Delivery Challan has been saved successfully.", "Success");
                        }
                        this.closeBranchTransferPopup(true);
                        this._router.navigate(['/pages', 'inventory', 'report']);
                    } else {
                        this._toasty.errorToast(res.message, res.code);
                    }
                } else {
                    this._toasty.errorToast(res?.message, res?.code);
                }
            });
        }
    }

    public focusHsnNumber(): void {
        this.hideSkuNumberPopup();
        this.hsnNumber = this.branchTransfer.products[this.activeRow].showCodeType === "hsn" ? this.branchTransfer.products[this.activeRow].hsnNumber : this.branchTransfer.products[this.activeRow].sacNumber;
        this.hsnPopupShow = true;
        setTimeout(() => {
            if (this.productHsnNumber && this.productHsnNumber.nativeElement) {
                this.productHsnNumber.nativeElement.focus();
            }
        }, 300);
    }

    public focusSkuNumber(): void {
        this.hideHsnNumberPopup();
        this.skuNumber = (this.branchTransfer.products[this.activeRow].skuCode) ? this.branchTransfer.products[this.activeRow].skuCode : "";
        this.skuNumberPopupShow = true;
        setTimeout(() => {
            if (this.productSkuCode && this.productSkuCode.nativeElement) {
                this.productSkuCode.nativeElement.focus();
            }
        }, 300);
    }

    public hideHsnNumberPopup(): void {
        this.hsnPopupShow = false;
        this.hsnNumber = "";
    }

    public hideSkuNumberPopup(): void {
        this.skuNumberPopupShow = false;
        this.skuNumber = "";
    }

    public hideActiveRow(): void {
        this.activeRow = null;
        this.hideHsnNumberPopup();
        this.hideSkuNumberPopup();
    }

    public saveHsnNumberPopup(product): void {
        if (product.showCodeType === "hsn") {
            product.hsnNumber = this.hsnNumber;
            product.sacNumber = "";
        } else {
            product.sacNumber = this.hsnNumber;
            product.hsnNumber = "";
        }
        this.hsnPopupShow = false;
    }

    public saveSkuNumberPopup(product): void {
        product.skuCode = this.skuNumber;
        this.skuNumberPopupShow = false;
    }

    public getBranchTransfer(): void {
        this.isUpdateMode = true;
        this.inventoryService.getNewBranchTransfer(this.editBranchTransferUniqueName).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response.status === "success") {
                this.branchTransfer.dateOfSupply = response.body.dateOfSupply;
                this.branchTransfer.challanNo = response.body.challanNo;
                this.branchTransfer.note = response.body.note;
                this.branchTransfer.uniqueName = response.body.uniqueName;
                this.branchTransfer.sources = response.body.sources;
                this.branchTransfer.destinations = response.body.destinations;
                this.branchTransfer.products = response.body.products;

                let allWarehouses = [];
                if (Object.keys(this.allWarehouses)?.length > 0) {
                    const usedWarehouses = [];
                    this.branchTransfer.sources?.forEach(branch => {
                        usedWarehouses.push(branch?.warehouse?.uniqueName);
                    });
                    this.branchTransfer.destinations?.forEach(branch => {
                        usedWarehouses.push(branch?.warehouse?.uniqueName);
                    });

                    Object.keys(this.allWarehouses)?.forEach(branch => {
                        allWarehouses[branch] = [];
                        this.allWarehouses[branch]?.forEach(warehouse => {
                            if (!warehouse?.isArchived || usedWarehouses?.includes(warehouse?.uniqueName)) {
                                allWarehouses[branch].push(warehouse);
                            }
                        });
                    });

                    this.allWarehouses = allWarehouses;
                }

                this.branchTransfer.sources.forEach(source => {
                    if (source?.warehouse?.address) {
                        const pin = source.warehouse.pincode;
                        if (pin) {
                            source.warehouse.address = `${source.warehouse.address}${'\n' + 'PIN: ' + pin}`;
                        }
                    }
                });
                this.branchTransfer.destinations.forEach(destination => {
                    if (destination?.warehouse?.address) {
                        const pin = destination.warehouse.pincode;
                        if (pin) {
                            destination.warehouse.address = `${destination.warehouse.address}${'\n' + 'PIN: ' + pin}`;
                        }
                    }
                });
                if (this.branchTransfer.products?.length > 0) {
                    this.branchTransfer.products.forEach(product => {
                        if (product.hsnNumber) {
                            product.showCodeType = "hsn";
                        } else {
                            product.showCodeType = "sac";
                        }
                    });
                }

                let tempBranches = [];
                this.branches?.forEach(branch => {
                    if (!branch?.additional?.isArchived || (branch?.additional?.isArchived && (this.branchExists(branch?.value, this.branchTransfer.destinations) || this.branchExists(branch?.value, this.branchTransfer.sources)))) {
                        tempBranches.push(branch);
                    }
                });

                this.branches = cloneDeep(tempBranches);
                this.branches$ = observableOf(this.branches);

                this.branchTransfer.entity = response.body.entity;
                this.branchTransfer.transferType = "products"; // MULTIPLE PRODUCTS VIEW SHOULD SHOW IN CASE OF EDIT
                this.branchTransfer.transporterDetails = response.body.transporterDetails;
                if (this.branches) {
                    const destinationBranch = this.branches.find(branch => branch.value === this.branchTransfer.destinations[0]?.uniqueName);
                    this.destinationBranchAlias = destinationBranch && destinationBranch.additional ? destinationBranch.additional.alias : '';
                    const sourceBranch = this.branches.find(branch => branch.value === this.branchTransfer.sources[0]?.uniqueName);
                    this.sourceBranchAlias = sourceBranch && sourceBranch.additional ? sourceBranch.additional.alias : '';
                }
                if (!this.branchTransfer.transporterDetails) {
                    this.branchTransfer.transporterDetails = {
                        dispatchedDate: null,
                        transporterName: null,
                        transporterId: null,
                        transportMode: null,
                        vehicleNumber: null
                    };
                }

                if (response.body.dateOfSupply) {
                    this.tempDateParams.dateOfSupply = new Date(response.body.dateOfSupply.split("-").reverse().join("-"));
                }
                if (response.body.transporterDetails && response.body.transporterDetails.dispatchedDate) {
                    this.tempDateParams.dispatchedDate = new Date(response.body.transporterDetails.dispatchedDate.split("-").reverse().join("-"));
                }

                this.calculateOverallTotal();

                this.resetDestinationWarehouses(0);
                this.resetSourceWarehouses(0);

                setTimeout(() => {
                    this.allowAutoFocusInField = true;
                }, 200);

                setTimeout(() => {
                    this.isDefaultLoad = false;
                }, 1000);
            } else {
                this.closeBranchTransferPopup();
                this._toasty.errorToast(response.message);
            }
        });
    }

    public assignCurrentCompany(): void {
        let branches;
        let branchName;
        let selectedBranch;
        let hoBranch;
        this.store.pipe(select(appStore => appStore.settings.branches), take(1)).subscribe(response => {
            branches = response;
        });
        if (this.isBranch) {
            // Find the current branch details
            selectedBranch = (branches) ? branches.find(branch => branch?.uniqueName === this._generalService.currentBranchUniqueName) : null;
            branchName = selectedBranch ? selectedBranch.alias : '';
        } else {
            // Company session find the HO branch
            hoBranch = (branches) ? branches.find(branch => !branch.parentBranch) : null;
            branchName = hoBranch ? hoBranch.alias : '';
        }
        if (!this.editBranchTransferUniqueName) {
            this.myCurrentCompany = this.isBranch ? branchName : hoBranch?.alias;
            if (this.branchTransferMode === "deliverynote") {
                this.branchTransfer.sources[0].uniqueName = selectedBranch ? selectedBranch.uniqueName : hoBranch?.uniqueName;
                this.branchTransfer.sources[0].name = selectedBranch ? selectedBranch.name : hoBranch?.name;
            } else if (this.branchTransferMode === "receiptnote") {
                this.branchTransfer.destinations[0].uniqueName = selectedBranch ? selectedBranch.uniqueName : hoBranch?.uniqueName;
                this.branchTransfer.destinations[0].name = selectedBranch ? selectedBranch.name : hoBranch?.name;
            }
        }
    }

    public onProductNoResultsClicked(idx?: number): void {
        this.innerEntryIndex = idx;

        this.asideMenuState = this.asideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();

        if (!idx) {
            this.getStock();
        }
    }

    public clearTransportForm(): void {
        this.generateNewTransporter.transporterId = this.generateNewTransporter.transporterName = null;
    }

    public keydownPressed(e): void {
        if (e.code === 'ArrowDown') {
            this.keydownClassAdded = true;
        } else if (e.code === 'Enter' && this.keydownClassAdded) {
            this.keydownClassAdded = true;
            this.toggleTransporterModel();
        } else {
            this.keydownClassAdded = false;
        }
    }

    public toggleTransporterModel(): void {
        this.transporterPopupStatus = !this.transporterPopupStatus;
        this.generateNewTransporterForm?.reset();
        this.transportEditMode = false;
    }

    public generateTransporter(generateTransporterForm: NgForm): void {
        this.store.dispatch(this.invoiceActions.addEwayBillTransporter(generateTransporterForm.value));
        this.store.dispatch(this.invoiceActions.getALLTransporterList(this.transporterFilterRequest));
        this.detectChanges();
    }

    public updateTransporter(generateTransporterForm: NgForm): void {
        this.store.dispatch(this.invoiceActions.updateEwayBillTransporter(this.currenTransporterId, generateTransporterForm.value));
        this.store.dispatch(this.invoiceActions.getALLTransporterList(this.transporterFilterRequest));
        this.transportEditMode = false;
        this.detectChanges();
    }

    public editTransporter(transporter: any): void {
        this.setTransporterDetail(transporter);
        this.transportEditMode = true;
    }

    public setTransporterDetail(transporter): void {
        if (transporter !== undefined && transporter) {
            this.generateNewTransporter.transporterId = transporter.transporterId;
            this.generateNewTransporter.transporterName = transporter.transporterName;
            this.currenTransporterId = transporter.transporterId;
        }
        this.detectChanges();
    }

    public deleteTransporter(transporter: IEwayBillTransporter): void {
        this.store.dispatch(this.invoiceActions.deleteTransporter(transporter.transporterId));
        this.store.dispatch(this.invoiceActions.getALLTransporterList(this.transporterFilterRequest));
        this.toggleTransporterModel();
        this.detectChanges();
    }

    public detectChanges(): void {
        if (!this._cdRef['destroyed']) {
            this._cdRef.detectChanges();
        }
    }

    public pageChanged(event: any): void {
        this.transporterFilterRequest.page = event.page;
        this.store.dispatch(this.invoiceActions.getALLTransporterList(this.transporterFilterRequest));
        this.detectChanges();
    }

    public sortButtonClicked(type: 'asc' | 'desc', columnName: string): void {
        this.transporterFilterRequest.sort = type;
        this.transporterFilterRequest.sortBy = columnName;
        this.store.dispatch(this.invoiceActions.getALLTransporterList(this.transporterFilterRequest));
    }

    public getStock(): void {
        this.store.dispatch(this.inventoryAction.GetStock());

        this.store.pipe(select(p => p.inventory.stocksList), takeUntil(this.destroyed$)).subscribe((o) => {
            if (o && !isEmpty(o)) {
                this.stockList = [];
                let stockList = cloneDeep(o);

                if (stockList && stockList.results) {
                    stockList.results.forEach(key => {
                        this.stockList.push({ label: key.name, value: key?.uniqueName, additional: key });
                    });
                }
            }
        });
    }

    public focusSelectDropdown(index: number, event?: any): void {
        if (this.allowAutoFocusInField && (!event || event.value)) {
            setTimeout(() => {
                this.setActiveRow(index);
                setTimeout(() => {
                    this.selectDropdown?.show('');
                }, 100);
            }, 100);
        }
    }

    /**
     * Puts focus on source warehouse
     *
     * @param {*} event Event of selection, used to avoid focus when event.value is null
     * @memberof NewBranchTransferAddComponent
     */
    public focusSourceWarehouse(event: any): void {
        if (this.allowAutoFocusInField && event && event.value) {
            setTimeout(() => {
                this.sourceWarehouse?.show('');
            }, 100);
        }
    }

    /**
     * Puts focus on destination warehouse
     *
     * @param {*} event Event of selection, used to avoid focus when event.value is null
     * @memberof NewBranchTransferAddComponent
     */
    public focusDestinationWarehouse(event: any): void {
        if (this.allowAutoFocusInField && event && event.value) {
            setTimeout(() => {
                this.destinationWarehouse?.show('');
            }, 100);
        }
    }

    public focusTransporterMode(): void {
        if (this.allowAutoFocusInField) {
            setTimeout(() => {
                this.transMode?.show('');
            }, 100);
        }
    }

    public focusVehicleNumber(): void {
        if (this.allowAutoFocusInField) {
            setTimeout(() => {
                if (this.vehicleNumber && this.vehicleNumber.nativeElement) {
                    this.vehicleNumber.nativeElement.focus();
                }
            }, 100);
        }
    }

    public focusTransportCompany(): void {
        if (this.allowAutoFocusInField) {
            setTimeout(() => {
                if (this.tempDateParams.dispatchedDate) {
                    this.transCompany?.show('');
                }
            }, 100);
        }
    }

    public focusDestinationWarehouses(): void {
        if (this.allowAutoFocusInField) {
            setTimeout(() => {
                this.destinationWarehouseList?.show('');
            }, 100);
        }
    }

    public focusSourceWarehouses(): void {
        if (this.allowAutoFocusInField) {
            setTimeout(() => {
                this.sourceWarehouseList?.show('');
            }, 100);
        }
    }

    public focusSourceQuantity(): void {
        if (this.allowAutoFocusInField) {
            setTimeout(() => {
                if (this.sourceQuantity && this.sourceQuantity.nativeElement) {
                    this.sourceQuantity.nativeElement.focus();
                }
            }, 100);
        }
    }

    public focusDefaultSource(): void {
        if (this.allowAutoFocusInField) {
            setTimeout(() => {
                if (this.defaultSource) {
                    this.defaultSource.show('');
                } else if (this.sourceWarehouse) {
                    // Delivery challan, focus on source warehouse instead
                    this.sourceWarehouse.show('');
                }
            }, 100);
        }
    }

    public focusDefaultProduct(): void {
        if (this.allowAutoFocusInField) {
            setTimeout(() => {
                if (this.defaultProduct) {
                    this.defaultProduct.show('');
                }
            }, 100);
        }
    }

    public focusDestinationName(): void {
        if (this.allowAutoFocusInField) {
            setTimeout(() => {
                if (this.destinationName) {
                    this.destinationName.show('');
                } else {
                    this.focusSelectDropdown(0);
                }
            }, 100);
        }
    }

    public focusDestinationQuantity(): void {
        if (this.allowAutoFocusInField) {
            setTimeout(() => {
                if (this.destinationQuantity && this.destinationQuantity.nativeElement) {
                    this.destinationQuantity.nativeElement.focus();
                }
            }, 100);
        }
    }

    /**
     * This function is used to get inventory settings from store
     *
     * @memberof ProformaInvoiceComponent
     */
    public getInventorySettings(): void {
        this.store.pipe(select((s: AppState) => s.invoice.settings), takeUntil(this.destroyed$)).subscribe((settings: InvoiceSetting) => {
            if (settings && settings.companyInventorySettings) {
                this.inventorySettings = settings.companyInventorySettings;
            }
        });
    }

    /**
     * Checks if branch exists
     *
     * @private
     * @param {string} branchUniqueName
     * @param {*} branches
     * @returns {boolean}
     * @memberof NewBranchTransferAddComponent
     */
    private branchExists(branchUniqueName: string, branches: any): boolean {
        const branchExists = branches?.filter(branch => branch?.uniqueName === branchUniqueName);
        return (branchExists?.length);
    }
}
