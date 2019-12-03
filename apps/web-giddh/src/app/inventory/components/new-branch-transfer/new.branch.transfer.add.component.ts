import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppState } from '../../../store';
import { Store, select } from '@ngrx/store';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { IEwayBillfilter } from "../../../models/api-models/Invoice";
import { InvoiceActions } from "../../../actions/invoice/invoice.actions";
import { transporterModes } from "../../../shared/helpers/transporterModes";
import { InventoryService } from "../../../services/inventory.service";
import { GIDDH_DATE_FORMAT } from "../../../shared/helpers/defaultDateFormat";

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

export class NewBranchTransferAddComponent implements OnInit, OnDestroy {
    @Input() public branchTransferMode: string;
    @ViewChild('productSkuCode') productSkuCode;
    @ViewChild('productHsnNumber') productHsnNumber;

    public hsnPopupShow: boolean = false;
    public skuNumberPopupShow: boolean = false;
    public asideMenuState: string = 'out';
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public branchTransfer: NewBranchTransferRequest;
    public transferType: string = 'products';
    public branches: any;
    public branches$: Observable<CompanyResponse[]>;
    public warehouses: IOption[] = [];
    public formFields: any[] = [];
    public stockList: IOption[] = [];
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    public activeRow: number = -1;
    public activeCompany: any = {};
    public inputMaskFormat: any = '';
    public transporterFilterRequest: IEwayBillfilter = new IEwayBillfilter();
    public transporterDropdown$: Observable<IOption[]>;
    public transporterMode: IOption[] = [];
    public stockCodeName: any[] = [];
    public overallTotal: number = 0;
    public isValidSourceTaxNumber: boolean = true;
    public isValidDestinationTaxNumber: boolean = true;
    public tempDateParams: any = { dateOfSupply: '', dispatchedDate: '' };
    public isLoading: boolean = false;
    public hsnNumber: any = '';
    public skuNumber: any = '';

    constructor(private _router: Router, private store: Store<AppState>, private settingsBranchActions: SettingsBranchActions, private _generalService: GeneralService, private _inventoryAction: InventoryAction, private commonActions: CommonActions, private inventoryAction: InventoryAction, private _toasty: ToasterService, private _companyService: CompanyService, private invoiceActions: InvoiceActions, private inventoryService: InventoryService) {
        this.initFormFields();
        this.getTransportersList();

        this.store.dispatch(this.inventoryAction.GetStock());

        this.store.pipe(select(p => p.inventory.stocksList), takeUntil(this.destroyed$)).subscribe((o) => {
            if (o && !_.isEmpty(o)) {
                this.stockList = [];
                let stockList = _.cloneDeep(o);

                stockList.results.forEach(key => {
                    this.stockCodeName[key.stockUnit.code] = [];
                    this.stockCodeName[key.stockUnit.code] = key.stockUnit.name;
                    this.stockList.push({ label: key.name, value: key.uniqueName, additional: key });
                });
            }
        });

        this.store.pipe(select(p => p.settings.profile), takeUntil(this.destroyed$)).subscribe((o) => {
            if (o && !_.isEmpty(o)) {
                let companyInfo = _.cloneDeep(o);
                this.activeCompany = companyInfo;
                this.inputMaskFormat = this.activeCompany.balanceDisplayFormat ? this.activeCompany.balanceDisplayFormat.toLowerCase() : '';
                this.getOnboardingForm(companyInfo.countryV2.alpha2CountryCode);
            }
        });

        this.getBranches();
    }

    public ngOnInit() {
        transporterModes.map(c => {
            this.transporterMode.push({ label: c.label, value: c.value });
        });
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public closeBranchTransferPopup() {
        this._generalService.invokeEvent.next(["closebranchtransferpopup"]);
    }

    public toggleBodyClass() {
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

    public changeTransferType(type) {
        this.initFormFields();
        this.tempDateParams.dateOfSupply = "";
        this.tempDateParams.dispatchedDate = "";
        this.transferType = type;
    }

    public initFormFields() {
        this.branchTransfer = {
            dateOfSupply: null,
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
                        quantity: null,
                        skuCode: null
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
                        quantity: null,
                        skuCode: null
                    }
                }
            }],
            products: [{
                name: null,
                hsnNumber: null,
                uniqueName: null,
                stockDetails: {
                    stockUnit: null,
                    amount: null,
                    rate: null,
                    quantity: null,
                    skuCode: null
                },
                description: null
            }],
            transportationDetails: {
                dispatchedDate: null,
                transporterName: null,
                transporterId: null,
                transportMode: null,
                vehicleNumber: null
            },
            entity: (this.branchTransferMode) ? this.branchTransferMode : null
        };

        this.forceClear$ = observableOf({ status: true });
        this.activeRow = -1;
    }

    public setActiveRow(index) {
        this.activeRow = index;
    }

    public selectCompany(event, object) {
        if (object) {
            object.name = event.label;
            object.warehouse.name = "";
            object.warehouse.uniqueName = "";
            object.warehouse.taxNumber = "";
            object.warehouse.address = "";
        }
    }

    public getTransportersList() {
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
    }

    public addReceiver() {
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
                    quantity: null,
                    skuCode: null
                }
            }
        });
    }

    public addSender() {
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
                    quantity: null,
                    skuCode: null
                }
            }
        });
    }

    public addProduct() {
        this.branchTransfer.products.push({
            name: null,
            hsnNumber: null,
            uniqueName: null,
            stockDetails: {
                stockUnit: null,
                amount: null,
                rate: null,
                quantity: null,
                skuCode: null
            },
            description: null
        });
    }

    public removeProduct(i) {
        this.branchTransfer.products.splice(i, 1);
        this.calculateOverallTotal();
    }

    public removeSender(i) {
        this.branchTransfer.sources.splice(i, 1);
        this.calculateOverallTotal();
    }

    public removeReceiver(i) {
        this.branchTransfer.destinations.splice(i, 1);
        this.calculateOverallTotal();
    }

    public linkedStocksVM(data: ILinkedStocksResult[]): LinkedStocksVM[] {
        let branches: LinkedStocksVM[] = [];
        this.warehouses = [];
        data.forEach(d => {
            branches.push(new LinkedStocksVM(d.name, d.uniqueName));
            if (d.warehouses.length) {
                this.warehouses[d.uniqueName] = [];

                d.warehouses.forEach(key => {
                    this.warehouses[d.uniqueName].push({ label: key.name, value: key.uniqueName });
                });
            }
        });
        return branches;
    }

    public getOnboardingForm(countryCode) {
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

    public getBranches() {
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
                } else {
                    this.branches$ = observableOf(null);
                }
            }
        });
    }

    public selectProduct(event, product) {
        if (event) {
            product.name = event.additional.name;
            product.stockDetails.stockUnit = event.additional.stockUnit.code;
            product.stockDetails.rate = event.additional.rate;
            product.stockDetails.amount = event.additional.amount;
            product.stockDetails.quantity = event.additional.openingQuantity;

            if (this.transferType === 'senders') {
                this.branchTransfer.destinations[0].warehouse.stockDetails.stockUnit = event.additional.stockUnit.code;
                this.branchTransfer.sources[0].warehouse.stockDetails.stockUnit = event.additional.stockUnit.code;
            }
        }
    }

    public getWarehouseDetails(type, index) {
        if (this.branchTransfer[type][index].warehouse.uniqueName !== null) {
            this._companyService.getWarehouseDetails(this.branchTransfer[type][index].warehouse.uniqueName).subscribe((res) => {
                if (res) {
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
    }

    public checkTaxNumberValidation(ele: HTMLInputElement) {
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

    public calculateRowTotal(product) {
        if (!isNaN(parseFloat(product.stockDetails.rate)) && !isNaN(parseFloat(product.stockDetails.quantity))) {
            product.stockDetails.amount = parseFloat(product.stockDetails.rate) * parseFloat(product.stockDetails.quantity);
            if (isNaN(parseFloat(product.stockDetails.amount))) {
                product.stockDetails.amount = 0;
            } else {
                product.stockDetails.amount = parseFloat(product.stockDetails.amount).toFixed(2);
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

    public calculateOverallTotal() {
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

                this.overallTotal += overallTotal;
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

                this.overallTotal += overallTotal;
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

                this.overallTotal += overallTotal;
            });
        }
    }

    public selectDateOfSupply(date) {
        if (date && this.branchTransfer.transportationDetails.dispatchedDate && date > this.branchTransfer.transportationDetails.dispatchedDate) {
            this.branchTransfer.transportationDetails.dispatchedDate = date;
        }
    }

    public submit() {
        this.isLoading = true;
        this.branchTransfer.dateOfSupply = moment(this.tempDateParams.dateOfSupply).format(GIDDH_DATE_FORMAT);
        this.branchTransfer.transportationDetails.dispatchedDate = moment(this.tempDateParams.dispatchedDate).format(GIDDH_DATE_FORMAT);
        this.branchTransfer.entity = this.branchTransferMode;

        this.inventoryService.createNewBranchTransfer(this.branchTransfer).subscribe((res) => {
            if (res) {
                this.isLoading = false;
                this.initFormFields();
                this.tempDateParams.dateOfSupply = "";
                this.tempDateParams.dispatchedDate = "";
                this._toasty.successToast(res.message, "Success");
                this._router.navigate(['/inventory', 'report']);
            } else {
                this._toasty.errorToast(res.message, res.code);
            }
        });
    }

    public focusHsnNumber() {
        this.hideSkuNumberPopup();
        this.hsnNumber = (this.branchTransfer.products[this.activeRow].hsnNumber) ? this.branchTransfer.products[this.activeRow].hsnNumber : "";
        this.hsnPopupShow = true;
        setTimeout(() => {
            this.productHsnNumber.nativeElement.focus();
        }, 300);
    }

    public focusSkuNumber() {
        this.hideHsnNumberPopup();
        this.skuNumber = (this.branchTransfer.products[this.activeRow].stockDetails.skuCode) ? this.branchTransfer.products[this.activeRow].stockDetails.skuCode : "";
        this.skuNumberPopupShow = true;
        setTimeout(() => {
            this.productSkuCode.nativeElement.focus();
        }, 300);
    }

    public hideHsnNumberPopup() {
        this.hsnPopupShow = false;
        this.hsnNumber = "";
    }

    public hideSkuNumberPopup() {
        this.skuNumberPopupShow = false;
        this.skuNumber = "";
    }

    public hideActiveRow() {
        this.activeRow = null;
        this.hideHsnNumberPopup();
        this.hideSkuNumberPopup();
    }

    public saveHsnNumberPopup(product) {
        product.hsnNumber = this.hsnNumber;
        this.hsnPopupShow = false;
    }

    public saveSkuNumberPopup(product) {
        product.stockDetails.skuCode = this.skuNumber;
        this.skuNumberPopupShow = false;
    }
}