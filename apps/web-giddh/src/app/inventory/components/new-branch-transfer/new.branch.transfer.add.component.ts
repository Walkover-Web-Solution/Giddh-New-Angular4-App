import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppState } from '../../../store';
import { Store, select } from '@ngrx/store';
import { Component, Input, OnDestroy, OnInit, ViewChild, OnChanges, SimpleChange, SimpleChanges, ChangeDetectorRef, Output, EventEmitter, QueryList, ViewChildren, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import {
    CompanyResponse
} from '../../../models/api-models/Company';
import * as moment from 'moment/moment';
import { GeneralService } from '../../../services/general.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SettingsBranchActions } from '../../../actions/settings/branch/settings.branch.action';
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
import { CompanyService } from "../../../services/companyService.service";
import { IEwayBillfilter, IEwayBillTransporter, IAllTransporterDetails } from "../../../models/api-models/Invoice";
import { InvoiceActions } from "../../../actions/invoice/invoice.actions";
import { transporterModes } from "../../../shared/helpers/transporterModes";
import { InventoryService } from "../../../services/inventory.service";
import { GIDDH_DATE_FORMAT } from "../../../shared/helpers/defaultDateFormat";
import { NgForm } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { SettingsWarehouseService } from '../../../services/settings.warehouse.service';
import { ShSelectComponent } from '../../../theme/ng-virtual-select/sh-select.component';

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
    @Output() public hideModal: EventEmitter<boolean> = new EventEmitter(true);
    @ViewChild('productSkuCode') public productSkuCode;
    @ViewChild('productHsnNumber') public productHsnNumber;
    @ViewChild('generateTransporterForm') public generateNewTransporterForm: NgForm;
    @ViewChild('selectDropdown') public selectDropdown: ShSelectComponent;
    @ViewChild('sourceWarehouse') public sourceWarehouse: ShSelectComponent;
    @ViewChild('destinationWarehouse') public destinationWarehouse: ShSelectComponent;
    @ViewChild('productDescription') public productDescription;
    @ViewChild('transMode') public transMode: ShSelectComponent;
    @ViewChild('vehicleNumber') public vehicleNumber;
    @ViewChild('transCompany') public transCompany: ShSelectComponent;
    @ViewChild('destinationWarehouseList') public destinationWarehouseList: ShSelectComponent;
    @ViewChild('sourceWarehouses') public sourceWarehouseList: ShSelectComponent;
    @ViewChild('sourceQuantity') public sourceQuantity;
    @ViewChild('defaultSource') public defaultSource: ShSelectComponent;
    @ViewChild('defaultProduct') public defaultProduct: ShSelectComponent;
    @ViewChild('destinationName') public destinationName: ShSelectComponent;
    @ViewChild('destinationQuantity') public destinationQuantity;
    @ViewChild('senderGstNumberField') public senderGstNumberField: HTMLInputElement;
    @ViewChild('receiverGstNumberField') public receiverGstNumberField: HTMLInputElement;

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
    public skuNumber: any = '';
    public myCurrentCompany: string = '';
    public innerEntryIndex: number;
    public isUpdateMode: boolean = false;
    public allowAutoFocusInField: boolean = false;

    constructor(private _router: Router, private store: Store<AppState>, private settingsBranchActions: SettingsBranchActions, private _generalService: GeneralService, private _inventoryAction: InventoryAction, private commonActions: CommonActions, private inventoryAction: InventoryAction, private _toasty: ToasterService, private _warehouseService: SettingsWarehouseService, private invoiceActions: InvoiceActions, private inventoryService: InventoryService, private _cdRef: ChangeDetectorRef, public bsConfig: BsDatepickerConfig) {
        this.bsConfig.dateInputFormat = GIDDH_DATE_FORMAT;

        this.store.dispatch(this.invoiceActions.resetTransporterListResponse());

        this.initFormFields();
        this.getTransportersList();
        this.getStock();

        this.store.pipe(select(p => p.settings.profile), takeUntil(this.destroyed$)).subscribe((o) => {
            if (o && !_.isEmpty(o)) {
                let companyInfo = _.cloneDeep(o);
                this.activeCompany = companyInfo;
                this.inputMaskFormat = this.activeCompany.balanceDisplayFormat ? this.activeCompany.balanceDisplayFormat.toLowerCase() : '';
                this.getOnboardingForm(companyInfo.countryV2.alpha2CountryCode);
                this.assignCurrentCompany();
            }
        });

        this.getBranches();
    }

    public ngOnInit(): void {
        transporterModes.map(c => {
            this.transporterMode.push({ label: c.label, value: c.value });
        });

        if (!this.editBranchTransferUniqueName) {
            this.allowAutoFocusInField = true;
            this.focusDefaultSource();
        }
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.branchTransferMode && changes.branchTransferMode.firstChange) {
            this.assignCurrentCompany();
        }
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public closeBranchTransferPopup(): void {
        this.hideModal.emit();
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
        this.activeRow = -1;
    }

    public setActiveRow(index): void {
        this.activeRow = index;
    }

    public selectCompany(event, type, index): void {
        if (type) {
            if (type === "sources") {
                this.branchTransfer.sources[index].name = event.label;
                this.branchTransfer.sources[index].warehouse.name = "";
                this.branchTransfer.sources[index].warehouse.uniqueName = "";
                this.branchTransfer.sources[index].warehouse.taxNumber = "";
                this.branchTransfer.sources[index].warehouse.address = "";

                this.resetSourceWarehouses(index);
            } else {
                this.branchTransfer.destinations[index].name = event.label;
                this.branchTransfer.destinations[index].warehouse.name = "";
                this.branchTransfer.destinations[index].warehouse.uniqueName = "";
                this.branchTransfer.destinations[index].warehouse.taxNumber = "";
                this.branchTransfer.destinations[index].warehouse.address = "";

                this.resetDestinationWarehouses(index);
            }
        }
    }

    public getTransportersList(): void {
        this.transporterListDetails$ = this.store.select(p => p.ewaybillstate.TransporterListDetails).pipe(takeUntil(this.destroyed$));
        this.transporterList$ = this.store.select(p => p.ewaybillstate.TransporterList).pipe(takeUntil(this.destroyed$));

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

        this.isGenarateTransporterInProcess$ = this.store.select(p => p.ewaybillstate.isAddnewTransporterInProcess).pipe(takeUntil(this.destroyed$));
        this.updateTransporterInProcess$ = this.store.select(p => p.ewaybillstate.updateTransporterInProcess).pipe(takeUntil(this.destroyed$));
        this.updateTransporterSuccess$ = this.store.select(p => p.ewaybillstate.updateTransporterSuccess).pipe(takeUntil(this.destroyed$));
        this.isGenarateTransporterSuccessfully$ = this.store.select(p => p.ewaybillstate.isAddnewTransporterInSuccess).pipe(takeUntil(this.destroyed$));

        this.updateTransporterSuccess$.subscribe(s => {
            if (s) {
                this.generateNewTransporterForm.reset();
            }
        });

        this.store.select(state => state.ewaybillstate.isAddnewTransporterInSuccess).pipe(takeUntil(this.destroyed$)).subscribe(p => {
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

        data.forEach(d => {
            branches.push(new LinkedStocksVM(d.name, d.uniqueName));
            if (d.warehouses.length) {
                this.senderWarehouses[d.uniqueName] = [];
                this.destinationWarehouses[d.uniqueName] = [];
                this.allWarehouses[d.uniqueName] = [];

                d.warehouses.forEach(key => {
                    this.allWarehouses[d.uniqueName].push(key);

                    this.senderWarehouses[d.uniqueName].push({ label: key.name, value: key.uniqueName });
                    this.destinationWarehouses[d.uniqueName].push({ label: key.name, value: key.uniqueName });
                });
            }
        });
        return branches;
    }

    public getOnboardingForm(countryCode): void {
        this.store.dispatch(this.commonActions.resetOnboardingForm());

        this.store.pipe(select(s => s.common.onboardingform), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                Object.keys(res.fields).forEach(key => {
                    this.formFields[res.fields[key].name] = [];
                    this.formFields[res.fields[key].name] = res.fields[key];
                });
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
                if (branches.results.length) {
                    this.branches = this.linkedStocksVM(branches.results).map(b => ({
                        label: b.name,
                        value: b.uniqueName,
                        additional: b
                    }));
                    this.branches$ = observableOf(this.branches);

                    if (this.editBranchTransferUniqueName) {
                        this.getBranchTransfer();
                    }
                } else {
                    this.branches$ = observableOf(null);

                    if (this.editBranchTransferUniqueName) {
                        this.getBranchTransfer();
                    }
                }
            }
        });
    }

    public selectProduct(event, product): void {
        if (event && event.additional) {
            product.name = event.additional.name;
            product.stockDetails.stockUnit = event.additional.stockUnit.code;
            product.stockDetails.rate = event.additional.rate;
            product.skuCode = event.additional.skuCode;
            product.hsnNumber = event.additional.hsnNumber;

            if (this.transferType === 'senders') {
                this.branchTransfer.destinations[0].warehouse.stockDetails.stockUnit = event.additional.stockUnit.code;
                this.branchTransfer.sources[0].warehouse.stockDetails.stockUnit = event.additional.stockUnit.code;

                this.focusDefaultSource();
            }

            this.calculateOverallTotal();

            setTimeout(() => {
                if (this.productDescription) {
                    this.productDescription.nativeElement.focus();
                }
            }, 200);
        }
    }

    public getWarehouseDetails(type, index): void {
        if (this.branchTransfer[type][index].warehouse.uniqueName !== null) {
            this._warehouseService.getWarehouseDetails(this.branchTransfer[type][index].uniqueName, this.branchTransfer[type][index].warehouse.uniqueName).subscribe((res) => {
                if (res && res.body) {
                    this.branchTransfer[type][index].warehouse.name = res.body.name;
                    this.branchTransfer[type][index].warehouse.taxNumber = res.body.taxNumber;
                    this.branchTransfer[type][index].warehouse.address = res.body.address;
                }
            });
        } else {
            this.branchTransfer[type][index].warehouse.name = "";
            this.branchTransfer[type][index].warehouse.taxNumber = "";
            this.branchTransfer[type][index].warehouse.address = "";
        }

        if (type === "sources") {
            this.resetDestinationWarehouses(index);
        } else {
            this.resetSourceWarehouses(index);
        }
    }

    public resetSourceWarehouses(index) {
        if (this.branchTransfer.destinations && this.branchTransfer.destinations[index] && this.branchTransfer.destinations[index].warehouse.uniqueName !== null) {
            this.senderWarehouses[this.branchTransfer.destinations[index].uniqueName] = [];
            let allowWarehouse = true;

            this.allWarehouses[this.branchTransfer.destinations[index].uniqueName].forEach(key => {
                allowWarehouse = true;

                if (key.uniqueName === this.branchTransfer.destinations[index].warehouse.uniqueName) {
                    allowWarehouse = false;
                }

                if (allowWarehouse) {
                    this.senderWarehouses[this.branchTransfer.destinations[index].uniqueName].push({ label: key.name, value: key.uniqueName });
                }
            });
        } else {
            if (this.allWarehouses && this.allWarehouses[this.branchTransfer.destinations[0].uniqueName]) {
                this.senderWarehouses[this.branchTransfer.destinations[0].uniqueName] = [];
                let allowWarehouse = true;

                this.allWarehouses[this.branchTransfer.destinations[0].uniqueName].forEach(key => {
                    allowWarehouse = true;

                    if (key.uniqueName === this.branchTransfer.destinations[0].warehouse.uniqueName) {
                        allowWarehouse = false;
                    }

                    if (allowWarehouse) {
                        this.senderWarehouses[this.branchTransfer.destinations[0].uniqueName].push({ label: key.name, value: key.uniqueName });
                    }
                });
            }
        }
    }

    public resetDestinationWarehouses(index) {
        if (this.branchTransfer.sources && this.branchTransfer.sources[index] && this.branchTransfer.sources[index].warehouse.uniqueName !== null) {
            this.destinationWarehouses[this.branchTransfer.sources[index].uniqueName] = [];
            let allowWarehouse = true;

            this.allWarehouses[this.branchTransfer.sources[index].uniqueName].forEach(key => {
                allowWarehouse = true;

                if (key.uniqueName === this.branchTransfer.sources[index].warehouse.uniqueName) {
                    allowWarehouse = false;
                }

                if (allowWarehouse) {
                    this.destinationWarehouses[this.branchTransfer.sources[index].uniqueName].push({ label: key.name, value: key.uniqueName });
                }
            });
        } else {
            if (this.allWarehouses && this.allWarehouses[this.branchTransfer.sources[0].uniqueName]) {
                this.destinationWarehouses[this.branchTransfer.sources[0].uniqueName] = [];
                let allowWarehouse = true;

                this.allWarehouses[this.branchTransfer.sources[0].uniqueName].forEach(key => {
                    allowWarehouse = true;

                    if (key.uniqueName === this.branchTransfer.sources[0].warehouse.uniqueName) {
                        allowWarehouse = false;
                    }

                    if (allowWarehouse) {
                        this.destinationWarehouses[this.branchTransfer.sources[0].uniqueName].push({ label: key.name, value: key.uniqueName });
                    }
                });
            }
        }
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
                product.stockDetails.amount = this._generalService.convertExponentialToNumber(parseFloat(product.stockDetails.amount).toFixed(2));
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

                this.overallTotal += this._generalService.convertExponentialToNumber(overallTotal);
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

                this.overallTotal += this._generalService.convertExponentialToNumber(overallTotal);
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

                this.overallTotal += this._generalService.convertExponentialToNumber(overallTotal);
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
        this.branchTransfer.dateOfSupply = moment(this.tempDateParams.dateOfSupply).format(GIDDH_DATE_FORMAT);

        if (this.tempDateParams.dispatchedDate) {
            this.branchTransfer.transporterDetails.dispatchedDate = moment(this.tempDateParams.dispatchedDate).format(GIDDH_DATE_FORMAT);
        }

        this.branchTransfer.entity = this.branchTransferMode;
        this.branchTransfer.transferType = this.transferType;

        if (this.editBranchTransferUniqueName) {
            this.inventoryService.updateNewBranchTransfer(this.branchTransfer).subscribe((res) => {
                this.isLoading = false;

                if (res) {
                    if (res.status === 'success') {
                        if (this.branchTransferMode === 'receiptnote') {
                            this._toasty.successToast("Receipt Note has been updated successfully.", "Success");
                        } else {
                            this._toasty.successToast("Delivery Challan has been updated successfully.", "Success");
                        }
                        this.closeBranchTransferPopup();
                        this._router.navigate(['/pages', 'inventory', 'report']);
                    } else {
                        this._toasty.errorToast(res.message, res.code);
                    }
                } else {
                    this._toasty.errorToast(res.message, res.code);
                }
            });
        } else {
            this.inventoryService.createNewBranchTransfer(this.branchTransfer).subscribe((res) => {
                this.isLoading = false;
                if (res) {
                    if (res.status === 'success') {
                        this.initFormFields();
                        this.tempDateParams.dateOfSupply = new Date();
                        this.tempDateParams.dispatchedDate = "";

                        if (this.branchTransferMode === 'receiptnote') {
                            this._toasty.successToast("Receipt Note has been saved successfully.", "Success");
                        } else {
                            this._toasty.successToast("Delivery Challan has been saved successfully.", "Success");
                        }
                        this.closeBranchTransferPopup();
                        this._router.navigate(['/pages', 'inventory', 'report']);
                    } else {
                        this._toasty.errorToast(res.message, res.code);
                    }
                } else {
                    this._toasty.errorToast(res.message, res.code);
                }
            });
        }
    }

    public focusHsnNumber(): void {
        this.hideSkuNumberPopup();
        this.hsnNumber = (this.branchTransfer.products[this.activeRow].hsnNumber) ? this.branchTransfer.products[this.activeRow].hsnNumber : "";
        this.hsnPopupShow = true;
        setTimeout(() => {
            this.productHsnNumber.nativeElement.focus();
        }, 300);
    }

    public focusSkuNumber(): void {
        this.hideHsnNumberPopup();
        this.skuNumber = (this.branchTransfer.products[this.activeRow].skuCode) ? this.branchTransfer.products[this.activeRow].skuCode : "";
        this.skuNumberPopupShow = true;
        setTimeout(() => {
            this.productSkuCode.nativeElement.focus();
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
        product.hsnNumber = this.hsnNumber;
        this.hsnPopupShow = false;
    }

    public saveSkuNumberPopup(product): void {
        product.skuCode = this.skuNumber;
        this.skuNumberPopupShow = false;
    }

    public getBranchTransfer(): void {
        this.isUpdateMode = true;
        this.inventoryService.getNewBranchTransfer(this.editBranchTransferUniqueName).subscribe((response) => {
            if (response.status === "success") {
                this.branchTransfer.dateOfSupply = response.body.dateOfSupply;
                this.branchTransfer.challanNo = response.body.challanNo;
                this.branchTransfer.note = response.body.note;
                this.branchTransfer.uniqueName = response.body.uniqueName;
                this.branchTransfer.sources = response.body.sources;
                this.branchTransfer.destinations = response.body.destinations;
                this.branchTransfer.products = response.body.products;
                this.branchTransfer.entity = response.body.entity;
                this.branchTransfer.transferType = "products"; // MULTIPLE PRODUCTS VIEW SHOULD SHOW IN CASE OF EDIT
                this.branchTransfer.transporterDetails = response.body.transporterDetails;

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
            } else {
                this.closeBranchTransferPopup();
                this._toasty.errorToast(response.message);
            }
        });
    }

    public assignCurrentCompany(): void {
        if (!this.editBranchTransferUniqueName) {
            this.myCurrentCompany = this.activeCompany.name;
            if (this.branchTransferMode === "deliverynote") {
                this.branchTransfer.sources[0].uniqueName = this.activeCompany.uniqueName;
                this.branchTransfer.sources[0].name = this.activeCompany.name;
            } else if (this.branchTransferMode === "receiptnote") {
                this.branchTransfer.destinations[0].uniqueName = this.activeCompany.uniqueName;
                this.branchTransfer.destinations[0].name = this.activeCompany.name;
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
        this.generateNewTransporterForm.reset();
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
            if (o && !_.isEmpty(o)) {
                this.stockList = [];
                let stockList = _.cloneDeep(o);

                stockList.results.forEach(key => {
                    this.stockList.push({ label: key.name, value: key.uniqueName, additional: key });
                });
            }
        });
    }

    public focusSelectDropdown(index: number): void {
        if (this.allowAutoFocusInField) {
            setTimeout(() => {
                this.setActiveRow(index);
                setTimeout(() => {
                    this.selectDropdown.show('');
                }, 100);
            }, 100);
        }
    }

    public focusSourceWarehouse(): void {
        if (this.allowAutoFocusInField) {
            setTimeout(() => {
                this.sourceWarehouse.show('');
            }, 100);
        }
    }

    public focusDestinationWarehouse(): void {
        if (this.allowAutoFocusInField) {
            setTimeout(() => {
                this.destinationWarehouse.show('');
            }, 100);
        }
    }

    public focusTransporterMode(): void {
        if (this.allowAutoFocusInField) {
            setTimeout(() => {
                this.transMode.show('');
            }, 100);
        }
    }

    public focusVehicleNumber(): void {
        if (this.allowAutoFocusInField) {
            setTimeout(() => {
                this.vehicleNumber.nativeElement.focus();
            }, 100);
        }
    }

    public focusTransportCompany(): void {
        if (this.allowAutoFocusInField) {
            setTimeout(() => {
                if (this.tempDateParams.dispatchedDate) {
                    this.transCompany.show('');
                }
            }, 100);
        }
    }

    public focusDestinationWarehouses(): void {
        if (this.allowAutoFocusInField) {
            setTimeout(() => {
                this.destinationWarehouseList.show('');
            }, 100);
        }
    }

    public focusSourceWarehouses(): void {
        if (this.allowAutoFocusInField) {
            setTimeout(() => {
                this.sourceWarehouseList.show('');
            }, 100);
        }
    }

    public focusSourceQuantity(): void {
        if (this.allowAutoFocusInField) {
            setTimeout(() => {
                this.sourceQuantity.nativeElement.focus();
            }, 100);
        }
    }

    public focusDefaultSource(): void {
        if (this.allowAutoFocusInField) {
            setTimeout(() => {
                if (this.defaultSource) {
                    this.defaultSource.show('');
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
                this.destinationQuantity.nativeElement.focus();
            }, 100);
        }
    }
}
