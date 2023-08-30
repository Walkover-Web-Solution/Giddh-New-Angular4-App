import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormGroup, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { CommonActions } from 'apps/web-giddh/src/app/actions/common.actions';
import { InventoryAction } from 'apps/web-giddh/src/app/actions/inventory/inventory.actions';
import { InvoiceActions } from 'apps/web-giddh/src/app/actions/invoice/invoice.actions';
import { cloneDeep, isEmpty } from 'apps/web-giddh/src/app/lodash-optimized';
import { ILinkedStocksResult, LinkedStocksResponse, LinkedStocksVM } from 'apps/web-giddh/src/app/models/api-models/BranchTransfer';
import { OnboardingFormRequest } from 'apps/web-giddh/src/app/models/api-models/Common';
import { CompanyResponse } from 'apps/web-giddh/src/app/models/api-models/Company';
import { IAllTransporterDetails, IEwayBillTransporter, IEwayBillfilter } from 'apps/web-giddh/src/app/models/api-models/Invoice';
import { OrganizationType } from 'apps/web-giddh/src/app/models/user-login-state';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { InventoryService } from 'apps/web-giddh/src/app/services/inventory.service';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { GIDDH_DATE_FORMAT } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import { transporterModes } from 'apps/web-giddh/src/app/shared/helpers/transporterModes';
import { AppState } from 'apps/web-giddh/src/app/store';
import { IOption } from 'apps/web-giddh/src/app/theme/ng-virtual-select/sh-options.interface';
import * as dayjs from 'dayjs';
import { Observable, ReplaySubject, of as observableOf } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'branch-transfer-create',
    templateUrl: './branch-transfer-create.component.html',
    styleUrls: ['./branch-transfer-create.component.scss']
})

export class BranchTransferCreateComponent implements OnInit, OnDestroy {
    /** Form Group for group form */
    public branchTransferCreateEditForm: FormGroup;
    /** Close the  HSN/SAC Opened Menu*/
    @ViewChild('hsnSacMenuTrigger') hsnSacMenuTrigger: MatMenuTrigger;
    /** Close the  HSN/SAC Opened Menu*/
    @ViewChild('skuMenuTrigger') skuMenuTrigger: MatMenuTrigger;
    /** For HSN/SAC Code Inside Table*/
    public showCodeType: 'HSN' | 'SAC' = 'HSN';
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /** True if translations loaded */
    public translationLoaded: boolean = false;
    /* this will store image path*/
    public imgPath: string = "";
    /* this will hold branch transfer mode */
    public branchTransferMode: string = "";
    /* this will hold overall total amount */
    public overallTotal: number = 0;
    /** Product Name Filter dropdown items*/
    public product: any = [];
    /** Holds if Multiple Products/Senders selected */
    public transferType: string = 'products';
    /** For Table Receipt Toggle Input Fields */
    public activeRow: boolean = false;
    public hsnNumber: number;
    public sacNumber: number;
    public skuNumber: string;
    /** On Sender */
    public senderHsnSacStatus: 'HSN' | 'SAC';
    public productSenderDescription: string = 'Product Description';
    public editBranchTransferUniqueName: string = '';
    public tempDateParams: any = { dateOfSupply: new Date(), dispatchedDate: '' };
    public stockList: IOption[] = [];
    public transporterPopupStatus: boolean = false;
    public currenTransporterId: string;
    public transporterList$: Observable<IEwayBillTransporter[]>;
    public transporterListDetails$: Observable<IAllTransporterDetails>;
    public transporterListDetails: IAllTransporterDetails;
    public activeCompany: any = {};
    public inputMaskFormat: any = '';
    public branches: any;
    public branches$: Observable<CompanyResponse[]>;
    /** Decimal places from company settings */
    public giddhBalanceDecimalPlaces: number = 2;
    public allowAutoFocusInField: boolean = false;
    /** True if it's default load */
    private isDefaultLoad: boolean = false;
    /** True if current organization is branch */
    public isBranch: boolean;
    /** True if current organization is company with single branch */
    public isCompanyWithSingleBranch: boolean;
    public transportEditMode: boolean = false;
    public transporterFilterRequest: IEwayBillfilter = new IEwayBillfilter();
    public transporterDropdown: IOption[] = [];
    public isGenarateTransporterInProcess$: Observable<boolean>;
    public isGenarateTransporterSuccessfully$: Observable<boolean>;
    public updateTransporterInProcess$: Observable<boolean>;
    public updateTransporterSuccess$: Observable<boolean>;
    public generateNewTransporter: IEwayBillTransporter = {
        transporterId: null,
        transporterName: null
    };
    public myCurrentCompany: string = '';
    public allWarehouses: any[] = [];
    public senderWarehouses: IOption[] = [];
    public destinationWarehouses: IOption[] = [];
    public isUpdateMode: boolean = false;
    public formFields: any[] = [];
    /** Information message to be shown to the user for branch transfer */
    public branchTransferInfoText: string = '';
    public transporterMode: IOption[] = [];
    public isLoading: boolean = false;
    public isValidSourceTaxNumber: boolean = true;
    /** True if gstin number valid */
    public isGstinValid: boolean = false;

    public isValidDestinationTaxNumber: boolean = true;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private changeDetection: ChangeDetectorRef,
        private formBuilder: UntypedFormBuilder,
        private store: Store<AppState>,
        private inventoryAction: InventoryAction,
        private invoiceActions: InvoiceActions,
        private generalService: GeneralService,
        private commonActions: CommonActions,
        private inventoryService: InventoryService,
        private toasty: ToasterService
    ) {

    }

    public ngOnInit(): void {
        /* added image path */
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
        this.initBranchTransferForm();
        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            if (params?.type) {
                this.branchTransferMode = params.type;
                this.changeDetection.detectChanges();
            }
        });
        this.store.dispatch(this.invoiceActions.getInvoiceSetting());
        this.store.dispatch(this.invoiceActions.resetTransporterListResponse());
        this.getTransportersList();
        this.getStocks();

        this.store.pipe(select(p => p.settings.profile), takeUntil(this.destroyed$)).subscribe((o) => {
            if (o && !isEmpty(o)) {
                let companyInfo = cloneDeep(o);
                this.activeCompany = companyInfo;
                this.inputMaskFormat = this.activeCompany.balanceDisplayFormat ? this.activeCompany.balanceDisplayFormat.toLowerCase() : '';
                this.getOnboardingForm(companyInfo?.countryV2?.alpha2CountryCode);
                this.giddhBalanceDecimalPlaces = o.balanceDecimalPlaces;
            }
        });
        let dataOfSupply = dayjs(this.tempDateParams.dateOfSupply).format(GIDDH_DATE_FORMAT)
        this.branchTransferCreateEditForm.get('dateOfSupply').setValue(dataOfSupply);
        // Subscribe to the dateOfSupply value changes
        // this.branchTransferCreateEditForm.get('dateOfSupply').valueChanges.subscribe(newDate => {
        //     // Get the transporterDetails FormGroup
        //     const transporterDetailsGroup = this.branchTransferCreateEditForm.get('transporterDetails') as FormGroup;

        //     // Set the newDate value to dispatchedDate control
        //     transporterDetailsGroup.get('dispatchedDate').setValue(newDate);
        // });
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
        this.isBranch = this.generalService.currentOrganizationType === OrganizationType.Branch;
        this.isCompanyWithSingleBranch = this.generalService.currentOrganizationType === OrganizationType.Company && this.branches && this.branches.length === 1;
    }
    private initBranchTransferForm(): void {
        this.branchTransferCreateEditForm = this.formBuilder.group({
            dateOfSupply: ['', Validators.required],
            challanNo: [null],
            uniqueName: [null],
            note: [''],
            sources: this.formBuilder.array([
                this.createSourceFormGroup()
            ]),
            destinations: this.formBuilder.array([
                this.createDestinationFormGroup()
            ]),
            products: this.formBuilder.array([
                this.initProductFormGroup()
            ]),
            transporterDetails: this.formBuilder.group({
                dispatchedDate: [''],
                transporterName: [null],
                transporterId: [''],
                transportMode: [''],
                vehicleNumber: ['']
            }),
            entity: (this.branchTransferMode) ? this.branchTransferMode : null,
            transferType: (this.transferType) ? this.transferType : null
        });
    }

    public createSourceFormGroup(): UntypedFormGroup {
        return this.formBuilder.group({
            name: [''],
            uniqueName: [''],
            warehouse: this.formBuilder.group({
                name: [''],
                uniqueName: [''],
                taxNumber: [''],
                address: [''],
                stockDetails: this.formBuilder.group({
                    stockUnitUniqueName: [null],
                    stockUnit: [null],
                    amount: [null],
                    rate: [null],
                    quantity: [null]
                })
            })
        });
    }
    public createDestinationFormGroup(): UntypedFormGroup {
        return this.formBuilder.group({
            name: [''],
            uniqueName: [''],
            warehouse: this.formBuilder.group({
                name: [''],
                uniqueName: [''],
                taxNumber: [''],
                address: [''],
                stockDetails: this.formBuilder.group({
                    stockUnitUniqueName: [null],
                    stockUnit: [null],
                    amount: [null],
                    rate: [null],
                    quantity: [null]
                })
            })
        });
    }
    public initProductFormGroup(): UntypedFormGroup {
        return this.formBuilder.group({
            name: [''],
            uniqueName: [''],
            warehouse: this.formBuilder.group({
                name: [''],
                uniqueName: [''],
                taxNumber: [''],
                address: [''],
                stockDetails: this.formBuilder.group({
                    stockUnitUniqueName: [null],
                    stockUnit: [null],
                    amount: [null],
                    rate: [null],
                    quantity: [null]
                })
            })
        });
    }

    public setActiveRow(): void {
        this.activeRow = true;
    }

    public selectDate(date: any, dateField: any): void {
        this.tempDateParams.dateOfSupply = date;
        if (date) {
            let formatDate = dayjs(date).format(GIDDH_DATE_FORMAT);
            if (dateField === 'dateOfSupply') {
                this.branchTransferCreateEditForm.get('dateOfSupply').setValue(formatDate);
            }
            if (dateField === 'dispatchedDate') {
                this.branchTransferCreateEditForm.get('transporterDetails.dispatchedDate').setValue(formatDate);
            }
        }
    }

    public hideActiveRow(): void {
        this.activeRow = false;
    }
    /** Close the  HSN/SAC Opened Menu*/
    public closeShowCodeMenu(): void {
        this.hsnSacMenuTrigger.closeMenu();
        this.skuMenuTrigger.closeMenu();
    }
    public submit(): void {
        this.isLoading = true;
        console.log(this.branchTransferCreateEditForm);
        const sourcesArray = this.branchTransferCreateEditForm.get('sources') as FormArray;
        sourcesArray[0]?.forEach(source => {
            if (source?.warehouse) {
                const [address, pin] = source.warehouse.address.split('\nPIN: ');
                source.warehouse.address = address;
                source.warehouse.pincode = pin;
            }
        });
        const destinationsArray = this.branchTransferCreateEditForm.get('destinations') as FormArray;
        destinationsArray[0]?.forEach(destination => {
            if (destination?.warehouse) {
                const [address, pin] = destination.warehouse.address.split('\nPIN: ');
                destination.warehouse.address = address;
                destination.warehouse.pincode = pin;
            }
        });
        const productsArray = this.branchTransferCreateEditForm.get('products') as FormArray;
        productsArray[0]?.forEach(product => {
            if (product.showCodeType === "hsn") {
                product.sacNumber = "";
            } else {
                product.hsnNumber = "";
            }
            delete product.variant;
        });

        // if (this.editBranchTransferUniqueName) {
        //     this.inventoryService.updateNewBranchTransfer(this.branchTransfer).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
        //         this.isLoading = false;

        //         if (res) {
        //             if (res.status === 'success') {
        //                 if (this.branchTransferMode === 'receiptnote') {
        //                     this.toasty.successToast("Receipt Note has been updated successfully.", "Success");
        //                 } else {
        //                     this.toasty.successToast("Delivery Challan has been updated successfully.", "Success");
        //                 }
        //                 this.router.navigate(['/pages', 'inventory', 'report']);
        //             } else {
        //                 this.toasty.errorToast(res.message, res.code);
        //             }
        //         } else {
        //             this.toasty.errorToast(res?.message, res?.code);
        //         }
        //     });
        // } else {
        //     this.inventoryService.createNewBranchTransfer(this.branchTransfer).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
        //         this.isLoading = false;
        //         if (res) {
        //             if (res.status === 'success') {
        //                 this.tempDateParams.dateOfSupply = new Date();
        //                 this.tempDateParams.dispatchedDate = "";

        //                 if (this.branchTransferMode === 'receiptnote') {
        //                     this.toasty.successToast("Receipt Note has been saved successfully.", "Success");
        //                 } else {
        //                     this.toasty.successToast("Delivery Challan has been saved successfully.", "Success");
        //                 }
        //                 this.router.navigate(['/pages', 'inventory', 'report']);
        //             } else {
        //                 this.toasty.errorToast(res.message, res.code);
        //             }
        //         } else {
        //             this.toasty.errorToast(res?.message, res?.code);
        //         }
        //     });
        // }
    }
    public getEnterTaxText(): string {
        let text = 'Enter Tax';
        text = text?.replace("[TAX_NAME]", this.formFields['taxName']?.label);
        return text;
    }
    public checkTaxNumberValidation(): void {
        let isValid: boolean = false;
        const sourcesArray = this.branchTransferCreateEditForm.get('sources') as FormArray;
        const warehouseFormGroup = sourcesArray.at(0).get('warehouse') as FormGroup;
        const taxNumberValue = warehouseFormGroup.get('taxNumber').value;
        if (taxNumberValue) {
            if (this.formFields['taxName']['regex'] !== "" && this.formFields['taxName']['regex']?.length > 0) {
                for (let key = 0; key < this.formFields['taxName']['regex']?.length; key++) {
                    let regex = new RegExp(this.formFields['taxName']['regex'][key]);
                    if (regex.test(taxNumberValue)) {
                        isValid = true;
                    }
                }
            } else {
                isValid = true;
            }

            if (!isValid) {
                let text = 'Invalid Tax Number';
                text = text?.replace("[TAX_NAME]", this.formFields['taxName'].label);
                this.toasty.showSnackBar("error", text);

                this.isGstinValid = false;
            } else {
                this.isGstinValid = true;
            }
        }
    }

    public removeProductDetailsForm(i: number) {
        const products = this.branchTransferCreateEditForm.get('products') as UntypedFormArray;
        products.removeAt(i);
    }

    public addBlankProductsForm() {
        const products = this.branchTransferCreateEditForm.get('products') as UntypedFormArray;
        if (products?.value?.length === 0) {
            products.push(this.initProductFormGroup());
        }
    }

    public getStocks(): void {
        this.store.dispatch(this.inventoryAction.GetStock());

        this.store.pipe(select(data => data.inventory.stocksList), takeUntil(this.destroyed$)).subscribe((response) => {
            if (response && !isEmpty(response)) {
                this.stockList = [];
                let stockList = cloneDeep(response);

                if (stockList && stockList.results) {
                    stockList.results.forEach(key => {
                        this.stockList.push({ label: key.name, value: key?.uniqueName, additional: key });
                    });
                }
            }
        });
    }

    public calculateOverallTotal(): void {
        this.overallTotal = 0;

        if (this.transferType === 'products') {
            const productsArray = this.branchTransferCreateEditForm.get('products') as FormArray;
            productsArray[0]?.forEach(product => {
                let overallTotal = 0;
                if (!isNaN(parseFloat(product.stockDetails.rate)) && !isNaN(parseFloat(product.stockDetails.quantity))) {
                    overallTotal = parseFloat(product.stockDetails.rate) * parseFloat(product.stockDetails.quantity);
                    if (isNaN(overallTotal)) {
                        overallTotal = 0;
                    }
                } else {
                    overallTotal = 0;
                }

                this.overallTotal += Number(this.generalService.convertExponentialToNumber((overallTotal)));
            });
        } else if (this.transferType !== 'products' && this.branchTransferMode === 'deliverynote') {
            const destinationsArray = this.branchTransferCreateEditForm.get('destinations') as FormArray;
            destinationsArray[0]?.forEach(product => {
                let overallTotal = 0;
                if (!isNaN(parseFloat(product.warehouse.stockDetails.rate)) && !isNaN(parseFloat(product.warehouse.stockDetails.quantity))) {
                    overallTotal = parseFloat(product.warehouse.stockDetails.rate) * parseFloat(product.warehouse.stockDetails.quantity);
                    if (isNaN(overallTotal)) {
                        overallTotal = 0;
                    }
                } else {
                    overallTotal = 0;
                }

                this.overallTotal += Number(this.generalService.convertExponentialToNumber(overallTotal));
            });
        } else if (this.transferType !== 'products' && this.branchTransferMode === 'receiptnote') {
            const sourcesArray = this.branchTransferCreateEditForm.get('sources') as FormArray;
            sourcesArray[0]?.forEach(product => {
                let overallTotal = 0;
                if (!isNaN(parseFloat(product.warehouse.stockDetails.rate)) && !isNaN(parseFloat(product.warehouse.stockDetails.quantity))) {
                    overallTotal = parseFloat(product.warehouse.stockDetails.rate) * parseFloat(product.warehouse.stockDetails.quantity);
                    if (isNaN(overallTotal)) {
                        overallTotal = 0;
                    }
                } else {
                    overallTotal = 0;
                }

                this.overallTotal += Number(this.generalService.convertExponentialToNumber(overallTotal));
            });
        }
    }

    public generateTransporter(generateTransporterForm: any): void {
        this.store.dispatch(this.invoiceActions.addEwayBillTransporter(generateTransporterForm.value));
        this.store.dispatch(this.invoiceActions.getALLTransporterList(this.transporterFilterRequest));
        this.detectChanges();
    }

    public updateTransporter(generateTransporterForm: any): void {
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

    public toggleTransporterModel(): void {
        this.transporterPopupStatus = !this.transporterPopupStatus;
        // this.generateNewTransporterForm?.reset();
        this.transportEditMode = false;
    }

    public deleteTransporter(transporter: IEwayBillTransporter): void {
        this.store.dispatch(this.invoiceActions.deleteTransporter(transporter.transporterId));
        this.store.dispatch(this.invoiceActions.getALLTransporterList(this.transporterFilterRequest));
        this.toggleTransporterModel();
        this.detectChanges();
    }

    public detectChanges(): void {
        if (!this.changeDetection['destroyed']) {
            this.changeDetection.detectChanges();
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
                this.transporterDropdown = transporterArr;
            }
        });

        this.isGenarateTransporterInProcess$ = this.store.pipe(select(p => p.ewaybillstate.isAddnewTransporterInProcess), takeUntil(this.destroyed$));
        this.updateTransporterInProcess$ = this.store.pipe(select(p => p.ewaybillstate.updateTransporterInProcess), takeUntil(this.destroyed$));
        this.updateTransporterSuccess$ = this.store.pipe(select(p => p.ewaybillstate.updateTransporterSuccess), takeUntil(this.destroyed$));
        this.isGenarateTransporterSuccessfully$ = this.store.pipe(select(p => p.ewaybillstate.isAddnewTransporterInSuccess), takeUntil(this.destroyed$));

        this.updateTransporterSuccess$.subscribe(s => {
            if (s) {
                this.branchTransferCreateEditForm.reset();
            }
        });

        this.store.pipe(select(state => state.ewaybillstate.isAddnewTransporterInSuccess), takeUntil(this.destroyed$)).subscribe(p => {
            if (p) {
                this.clearTransportForm();
            }
        });
        this.detectChanges();
    }

    public clearTransportForm(): void {
        this.generateNewTransporter.transporterId = this.generateNewTransporter.transporterName = null;
    }

    public onClearTransportNameId(event: any): void {
        if (event) {
            if (!event?.value) {
                this.branchTransferCreateEditForm.get('transporterDetails.transporterName').setValue(null);
                this.branchTransferCreateEditForm.get('transporterDetails.transporterId').setValue(null);
            }

        }
    }
    public onSelectTransportCompany(event: any): void {
        this.branchTransferCreateEditForm.get('transporterDetails.transporterName').setValue(event?.value);
        this.branchTransferCreateEditForm.get('transporterDetails.transporterId').setValue(event?.value);
    }

    public onSelectTransportMode(event: any): void {
        this.branchTransferCreateEditForm.get('transporterDetails.transportMode').setValue(event?.value);
    }


    public getBranches(): void {
        this.store.dispatch(this.inventoryAction.GetAllLinkedStocks());

        this.store.pipe(select(s => s.inventoryBranchTransfer.linkedStocks), takeUntil(this.destroyed$)).subscribe((branches: LinkedStocksResponse) => {
            if (branches) {
                if (branches.results?.length) {
                    this.branches = this.linkedStocksVM(branches.results).map(b => ({
                        label: `${b.alias}`,
                        value: b?.uniqueName,
                        additional: b
                    }));
                    this.branches$ = observableOf(this.branches);
                    this.isCompanyWithSingleBranch = this.generalService.currentOrganizationType === OrganizationType.Company && this.branches && this.branches.length === 1;
                    if (this.editBranchTransferUniqueName) {
                        this.getBranchTransfer();
                    }
                } else {
                    this.branches = [];
                    this.branches$ = observableOf(null);
                    this.isCompanyWithSingleBranch = this.generalService.currentOrganizationType === OrganizationType.Company && this.branches && this.branches.length === 1;
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
            selectedBranch = (branches) ? branches.find(branch => branch?.uniqueName === this.generalService.currentBranchUniqueName) : null;
            branchName = selectedBranch ? selectedBranch.alias : '';
        } else {
            // Company session find the HO branch
            hoBranch = (branches) ? branches.find(branch => !branch.parentBranch) : null;
            branchName = hoBranch ? hoBranch.alias : '';
        }
        if (!this.editBranchTransferUniqueName) {
            this.myCurrentCompany = this.isBranch ? branchName : hoBranch.alias;
            if (this.branchTransferMode === "deliverynote") {
                // this.branchTransfer.sources[0].uniqueName = selectedBranch ? selectedBranch.uniqueName : hoBranch?.uniqueName;
                // this.branchTransfer.sources[0].name = selectedBranch ? selectedBranch.name : hoBranch?.name;
            } else if (this.branchTransferMode === "receiptnote") {
                // this.branchTransfer.destinations[0].uniqueName = selectedBranch ? selectedBranch.uniqueName : hoBranch?.uniqueName;
                // this.branchTransfer.destinations[0].name = selectedBranch ? selectedBranch.name : hoBranch?.name;
            }
        }
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

    public focusDefaultSource(): void {
        if (this.allowAutoFocusInField) {
            setTimeout(() => {
                // if (this.defaultSource) {
                //     this.defaultSource.show('');
                // } else if (this.sourceWarehouse) {
                //     // Delivery challan, focus on source warehouse instead
                //     this.sourceWarehouse.show('');
                // }
            }, 100);
        }
    }

    public selectCompany(event, type, index): void {
        if (!this.isDefaultLoad && type) {
            if (type === "sources") {
                const sourcesArray = this.branchTransferCreateEditForm.get('sources') as FormArray;
                const sourceGroup = sourcesArray.at(index) as FormGroup;
                const warehouseArray = sourceGroup.get['warehouse'] as FormArray;
                const warehouseGroup = warehouseArray.at(index) as FormGroup;
                const stockDetailsFormGroup = sourcesArray.at(index).get('warehouse.stockDetails') as FormGroup;
                if (sourcesArray) {
                    sourceGroup.patchValue({
                        name: event?.label
                    });
                    if (warehouseArray) {
                        warehouseGroup.patchValue({
                            name: "",
                            uniqueName: "",
                            taxNumber: "",
                            address: ""
                        });
                        if (!stockDetailsFormGroup) {
                            stockDetailsFormGroup.patchValue({
                                stockUnitUniqueName: null,
                                stockUnit: null,
                                amount: null,
                                rate: null,
                                quantity: null
                            });
                        }
                        stockDetailsFormGroup.patchValue({
                            quantity: (event.value) ? 1 : null
                        });
                    }
                    this.resetWarehouse('sources', 0);
                    // this.resetSourceWarehouses(index);
                }
            } else {
                const destinationsArray = this.branchTransferCreateEditForm.get('destinations') as FormArray;
                const destinationsGroup = destinationsArray.at(index) as FormGroup;
                const warehouseArray = destinationsGroup.get['warehouse'] as FormArray;
                const warehouseGroup = warehouseArray.at(index) as FormGroup;
                const stockDetailsFormGroup = destinationsArray.at(index).get('warehouse.stockDetails') as FormGroup;
                if (destinationsArray) {
                    destinationsGroup.patchValue({
                        name: event?.label
                    });
                    if (warehouseArray) {
                        warehouseGroup.patchValue({
                            name: "",
                            uniqueName: "",
                            taxNumber: "",
                            address: ""
                        });
                        if (!stockDetailsFormGroup) {
                            stockDetailsFormGroup.patchValue({
                                stockUnitUniqueName: null,
                                stockUnit: null,
                                amount: null,
                                rate: null,
                                quantity: null
                            });
                        }
                        stockDetailsFormGroup.patchValue({
                            quantity: (event.value) ? 1 : null
                        });
                    }
                    this.resetWarehouse('destinations',0);
                    // this.resetSourceWarehouses(index);
                }
            }
        }
    }
    public resetWarehouse(type: string, index: number): void {
        const sourcesArray = this.branchTransferCreateEditForm.get('sources') as FormArray;
        const sourcesGroup = sourcesArray.at(index) as FormGroup;
        const sourcesWarehouseArray = sourcesGroup.get['warehouse'] as FormArray;
        const sourcesWarehouseGroup = sourcesWarehouseArray.at(index) as FormGroup;
        const sourcesStockDetailsFormGroup = sourcesArray.at(index).get('warehouse.stockDetails') as FormGroup;

        const destinationsArray = this.branchTransferCreateEditForm.get('destinations') as FormArray;
        const destinationsGroup = destinationsArray.at(index) as FormGroup;
        const destinationsWarehouseArray = destinationsGroup.get['warehouse'] as FormArray;
        const destinationsWarehouseGroup = destinationsWarehouseArray.at(index) as FormGroup;
        const destinationsStockDetailsFormGroup = destinationsArray.at(index).get('warehouse.stockDetails') as FormGroup;

        if (type === "sources") {
            if (sourcesArray && sourcesGroup.get['warehouse']) {
                sourcesWarehouseGroup.patchValue({
                    name: null,
                    uniqueName: null,
                    taxNumber: null,
                    address: null
                });
                if (sourcesArray.at(index).get('warehouse.stockDetails')) {
                    sourcesStockDetailsFormGroup.patchValue({
                        quantity:  null
                    });
                }
            }
            // this.resetSourceWarehouses(index, true);
            if (destinationsGroup && destinationsWarehouseArray &&
                destinationsWarehouseGroup.get('warehouse.uniqueName').value === null) {
                // Source and destination warehouses are cleared, reset both warehouses
                this.resetDestinationWarehouses(index, true);
                this.branches$ = observableOf(this.branches);
            }
        } else {
            if (destinationsArray && destinationsWarehouseArray) {
                destinationsWarehouseGroup.patchValue({
                    name: null,
                    uniqueName: null,
                    taxNumber: null,
                    address: null
                });
                if (destinationsArray.at(index).get('warehouse.stockDetails')) {
                    destinationsStockDetailsFormGroup.patchValue({
                        quantity: null
                    });
                }
            }
            this.resetDestinationWarehouses(index, true);
            if (sourcesGroup && sourcesWarehouseArray &&
                sourcesWarehouseGroup.get('warehouse.uniqueName').value === null) {
                // Source and destination warehouses are cleared, reset both warehouses
                this.resetDestinationWarehouses(index, true);
                this.branches$ = observableOf(this.branches);
            }
        }
    }

    // public resetSourceWarehouses(index: number, reInitializeWarehouses?: boolean) {
    //     const destinationsArray = this.branchTransferCreateEditForm.get('destinations') as FormArray;
    //     const sourcesArray = this.branchTransferCreateEditForm.get('sources') as FormArray;

    //     const destinationGroup = destinationsArray.at(index) as FormGroup;
    //     const sourceGroup = sourcesArray.at(index) as FormGroup;

    //     this.updateSenderWarehouses(destinationGroup, true, reInitializeWarehouses);

    //     if (sourceGroup && sourceGroup.get('uniqueName').value) {
    //         this.updateSenderWarehouses(sourceGroup, false, reInitializeWarehouses);
    //     }

    //     if (!destinationGroup.get('uniqueName').value) {
    //         // Handle case where uniqueName is null in destinations
    //         // ...
    //     }

    //     // Handle case for multiple senders
    //     // ...

    //     this.detectChanges();
    // }
    // public updateSenderWarehouses(warehouseGroup: FormGroup, isDestination: boolean, reInitializeWarehouses?: boolean) {
    //     const uniqueName = warehouseGroup.get('uniqueName').value;
    //     const taxNumber = warehouseGroup.get('warehouse.taxNumber').value;

    //     if (uniqueName && uniqueName !== null) {
    //         this.senderWarehouses[uniqueName] = []; // Initialize as an empty array

    //         if (this.allWarehouses[uniqueName] && this.allWarehouses[uniqueName].length > 0) {
    //             this.allWarehouses[uniqueName].forEach(key => {
    //                 let allowWarehouse = true;

    //                 if (isDestination && (key.uniqueName === warehouseGroup.get('warehouse.uniqueName').value ||
    //                     key.taxNumber !== taxNumber)) {
    //                     allowWarehouse = false;
    //                 }

    //                 if (allowWarehouse) {
    //                     this.senderWarehouses[uniqueName].push({ value: key.uniqueName, label: key.name }); // Populate with options
    //                 }
    //             });
    //         }

    //         if (isDestination && warehouseGroup.get('warehouse.uniqueName').value) {
    //             setTimeout(() => {
    //                 if (this.sourceWarehouse) {
    //                     this.sourceWarehouse.writeValue(warehouseGroup.get('warehouse.uniqueName').value);
    //                 }
    //             }, 100);
    //         }
    //     }
    // }
    public resetSourceWarehousess(index: number, reInitializeWarehouses?: boolean) {
        // const sourcesArray = this.branchTransferCreateEditForm.get('sources') as FormArray;
        // const sourcesGroup = sourcesArray.at(index) as FormGroup;
        // const sourcesWarehouseArray = sourcesGroup.get['warehouse'] as FormArray;
        // const sourcesWarehouseGroup = sourcesWarehouseArray.at(index) as FormGroup;
        // const sourcesStockDetailsFormGroup = sourcesArray.at(index).get('warehouse.stockDetails') as FormGroup;

        // const destinationsArray = this.branchTransferCreateEditForm.get('destinations') as FormArray;
        // const destinationsGroup = destinationsArray.at(index) as FormGroup;
        // const destinationsWarehouseArray = destinationsGroup.get['warehouse'] as FormArray;
        // const destinationsWarehouseGroup = destinationsWarehouseArray.at(index) as FormGroup;
        // const destinationsStockDetailsFormGroup = destinationsArray.at(index).get('warehouse.stockDetails') as FormGroup;
        // if (destinationsArray && destinationsGroup && sourcesWarehouseArray && destinationsWarehouseGroup.get('warehouse.uniqueName').value !== null) {
        //     this.senderWarehouses[destinationsGroup.get('warehouse.uniqueName')?.value] = [];
        //     let allowWarehouse = true;

        //     if (this.allWarehouses[this.branchTransfer.destinations[index]?.uniqueName] && this.allWarehouses[this.branchTransfer.destinations[index]?.uniqueName].length > 0) {
        //         this.allWarehouses[this.branchTransfer.destinations[index]?.uniqueName].forEach(key => {
        //             allowWarehouse = true;

        //             if (key?.uniqueName === this.branchTransfer.destinations[index].warehouse?.uniqueName ||
        //                 key.taxNumber !== (this.branchTransfer.destinations[index].warehouse.taxNumber || '')) {
        //                 allowWarehouse = false;
        //             }

        //             if (allowWarehouse) {
        //                 this.senderWarehouses[this.branchTransfer.destinations[index]?.uniqueName].push({ label: key.name, value: key?.uniqueName });
        //             }
        //         });
        //     }
        //     if (this.branchTransfer.sources[index] && this.branchTransfer.sources[index]?.uniqueName) {
        //         // Update source warehouses
        //         this.senderWarehouses[this.branchTransfer.sources[index]?.uniqueName] = [];
        //         if (this.allWarehouses[this.branchTransfer.sources[index]?.uniqueName] && this.allWarehouses[this.branchTransfer.sources[index]?.uniqueName].length > 0) {
        //             this.allWarehouses[this.branchTransfer.sources[index]?.uniqueName].forEach(key => {
        //                 if (this.branchTransfer.destinations[index] && this.branchTransfer.destinations[index].warehouse && key?.uniqueName !== this.branchTransfer.destinations[index].warehouse?.uniqueName &&
        //                     key.taxNumber === (this.branchTransfer.destinations[index].warehouse.taxNumber || '')) {
        //                     this.senderWarehouses[this.branchTransfer.sources[index]?.uniqueName].push({ label: key.name, value: key?.uniqueName });
        //                 }
        //             });
        //             if (this.branchTransfer.sources[index].warehouse && this.branchTransfer.sources[index].warehouse?.uniqueName) {
        //                 setTimeout(() => {
        //                     if (this.sourceWarehouse) {
        //                         this.sourceWarehouse.writeValue(this.branchTransfer.sources[index].warehouse?.uniqueName);
        //                     }
        //                 }, 100);
        //             }
        //         }
        //     }
        // } else {
        //     if (this.allWarehouses && this.allWarehouses[this.branchTransfer.destinations[0]?.uniqueName]) {
        //         this.senderWarehouses[this.branchTransfer.destinations[0]?.uniqueName] = [];
        //         let allowWarehouse = true;

        //         this.allWarehouses[this.branchTransfer.destinations[0]?.uniqueName].forEach(key => {
        //             allowWarehouse = true;

        //             if (key?.uniqueName === this.branchTransfer.destinations[0].warehouse?.uniqueName ||
        //                 (!reInitializeWarehouses && key.taxNumber !== (this.branchTransfer.destinations[0].warehouse.taxNumber || ''))) {
        //                 allowWarehouse = false;
        //             }

        //             if (allowWarehouse) {
        //                 this.senderWarehouses[this.branchTransfer.destinations[0]?.uniqueName].push({ label: key.name, value: key?.uniqueName });
        //             }
        //         });
        //     }
        //     // If multiple senders case for receipt note
        //     const sourceIndex = this.transferType !== 'products' ? index : 0;
        //     const destinationIndex = this.transferType !== 'products' ? 0 : index;
        //     if (this.branchTransfer.sources[sourceIndex] && this.branchTransfer.sources[sourceIndex]?.uniqueName) {
        //         // Update source warehouses
        //         this.senderWarehouses[this.branchTransfer.sources[sourceIndex]?.uniqueName] = [];
        //         if (this.allWarehouses[this.branchTransfer.sources[sourceIndex]?.uniqueName] && this.allWarehouses[this.branchTransfer.sources[sourceIndex]?.uniqueName].length > 0) {
        //             this.allWarehouses[this.branchTransfer.sources[sourceIndex]?.uniqueName].forEach(key => {
        //                 if (this.branchTransfer.destinations[destinationIndex] && this.branchTransfer.destinations[destinationIndex].warehouse && key?.uniqueName !== this.branchTransfer.destinations[destinationIndex].warehouse?.uniqueName &&
        //                     (reInitializeWarehouses || key.taxNumber === (this.branchTransfer.destinations[destinationIndex].warehouse.taxNumber || ''))) {
        //                     this.senderWarehouses[this.branchTransfer.sources[sourceIndex]?.uniqueName].push({ label: key.name, value: key?.uniqueName });
        //                 }
        //             });
        //             if (this.branchTransfer.sources[index].warehouse && this.branchTransfer.sources[index].warehouse?.uniqueName) {
        //                 setTimeout(() => {
        //                     if (this.sourceWarehouse) {
        //                         this.sourceWarehouse.writeValue(this.branchTransfer.sources[index].warehouse?.uniqueName);
        //                     }
        //                 }, 100);
        //             }
        //         }
        //     }
        // }
        this.detectChanges();
    }
    public resetDestinationWarehouses(index, reInitializeWarehouses?: boolean) {
        // if (this.branchTransfer.sources && this.branchTransfer.sources[index] && this.branchTransfer.sources[index].warehouse?.uniqueName !== null) {
        //     this.destinationWarehouses[this.branchTransfer.sources[index]?.uniqueName] = [];
        //     let allowWarehouse = true;

        //     if (this.allWarehouses[this.branchTransfer.sources[index]?.uniqueName] && this.allWarehouses[this.branchTransfer.sources[index]?.uniqueName].length > 0) {
        //         this.allWarehouses[this.branchTransfer.sources[index]?.uniqueName].forEach(key => {
        //             allowWarehouse = true;

        //             if (key?.uniqueName === this.branchTransfer.sources[index].warehouse?.uniqueName ||
        //                 key.taxNumber !== (this.branchTransfer.sources[index].warehouse.taxNumber || '')) {
        //                 allowWarehouse = false;
        //             }

        //             if (allowWarehouse) {
        //                 this.destinationWarehouses[this.branchTransfer.sources[index]?.uniqueName].push({ label: key.name, value: key?.uniqueName });
        //             }
        //         });
        //     }
        //     if (this.branchTransfer.destinations[index] && this.branchTransfer.destinations[index]?.uniqueName) {
        //         // Update Destination warehouses
        //         this.destinationWarehouses[this.branchTransfer.destinations[index]?.uniqueName] = [];
        //         if (this.allWarehouses[this.branchTransfer.destinations[index]?.uniqueName] && this.allWarehouses[this.branchTransfer.destinations[index]?.uniqueName].length > 0) {
        //             this.allWarehouses[this.branchTransfer.destinations[index]?.uniqueName].forEach(key => {
        //                 if (key?.uniqueName !== this.branchTransfer.sources[index].warehouse?.uniqueName &&
        //                     key.taxNumber === (this.branchTransfer.sources[index].warehouse.taxNumber || '')) {
        //                     this.destinationWarehouses[this.branchTransfer.destinations[index]?.uniqueName].push({ label: key.name, value: key?.uniqueName });
        //                 }
        //             });
        //         }
        //         if (this.branchTransfer.destinations[index].warehouse && this.branchTransfer.destinations[index].warehouse?.uniqueName) {
        //             setTimeout(() => {
        //                 if (this.destinationWarehouse) {
        //                     this.destinationWarehouse.writeValue(this.branchTransfer.destinations[index].warehouse?.uniqueName);
        //                 }
        //             }, 100);
        //         }
        //     }
        // } else {
        //     if (this.allWarehouses && this.branchTransfer.sources[0] && this.allWarehouses[this.branchTransfer.sources[0]?.uniqueName]) {
        //         this.destinationWarehouses[this.branchTransfer.sources[0]?.uniqueName] = [];
        //         let allowWarehouse = true;

        //         if (this.allWarehouses[this.branchTransfer.sources[0]?.uniqueName] && this.allWarehouses[this.branchTransfer.sources[0]?.uniqueName].length > 0) {
        //             this.allWarehouses[this.branchTransfer.sources[0]?.uniqueName].forEach(key => {
        //                 allowWarehouse = true;

        //                 if (key?.uniqueName === this.branchTransfer.sources[0].warehouse?.uniqueName ||
        //                     (!reInitializeWarehouses && key.taxNumber !== (this.branchTransfer.sources[0].warehouse.taxNumber || ''))) {
        //                     allowWarehouse = false;
        //                 }

        //                 if (allowWarehouse) {
        //                     this.destinationWarehouses[this.branchTransfer.sources[0]?.uniqueName].push({ label: key.name, value: key?.uniqueName });
        //                 }
        //             });
        //         }
        //     }
        //     // If multiple destinations case for delivery challan
        //     const destinationIndex = this.transferType !== 'products' ? index : 0;
        //     const sourceIndex = this.transferType !== 'products' ? 0 : index;
        //     if (this.branchTransfer.destinations[destinationIndex] && this.branchTransfer.destinations[destinationIndex]?.uniqueName) {
        //         // Update Destination warehouses
        //         this.destinationWarehouses[this.branchTransfer.destinations[destinationIndex]?.uniqueName] = [];
        //         if (this.allWarehouses[this.branchTransfer.destinations[destinationIndex]?.uniqueName] && this.allWarehouses[this.branchTransfer.destinations[destinationIndex]?.uniqueName].length > 0) {
        //             this.allWarehouses[this.branchTransfer.destinations[destinationIndex]?.uniqueName].forEach(key => {
        //                 if (this.branchTransfer.sources[sourceIndex] && this.branchTransfer.sources[sourceIndex].warehouse && key?.uniqueName !== this.branchTransfer.sources[sourceIndex].warehouse?.uniqueName &&
        //                     (reInitializeWarehouses || key.taxNumber === (this.branchTransfer.sources[sourceIndex].warehouse.taxNumber || ''))) {
        //                     this.destinationWarehouses[this.branchTransfer.destinations[destinationIndex]?.uniqueName].push({ label: key.name, value: key?.uniqueName });
        //                 }
        //             });
        //         }
        //         if (this.branchTransfer.destinations[index].warehouse && this.branchTransfer.destinations[index].warehouse?.uniqueName) {
        //             setTimeout(() => {
        //                 if (this.destinationWarehouse) {
        //                     this.destinationWarehouse.writeValue(this.branchTransfer.destinations[index].warehouse?.uniqueName);
        //                 }
        //             }, 100);
        //         }
        //     }
        // }
        // this.detectChanges();
    }
    public getBranchTransfer(): void {
        this.isUpdateMode = true;
        this.inventoryService.getNewBranchTransfer(this.editBranchTransferUniqueName).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response?.status === "success") {
                //     this.branchTransfer.dateOfSupply = response.body?.dateOfSupply;
                //     this.branchTransfer.challanNo = response.body?.challanNo;
                //     this.branchTransfer.note = response.body?.note;
                //     this.branchTransfer.uniqueName = response?.body?.uniqueName;
                //     this.branchTransfer.sources = response.body?.sources;
                //     this.branchTransfer.destinations = response.body?.destinations;
                //     this.branchTransfer.products = response.body?.products;

                //     let allWarehouses = [];
                //     if (Object.keys(this.allWarehouses)?.length > 0) {
                //         const usedWarehouses = [];
                //         this.branchTransfer.sources?.forEach(branch => {
                //             usedWarehouses.push(branch?.warehouse?.uniqueName);
                //         });
                //         this.branchTransfer.destinations?.forEach(branch => {
                //             usedWarehouses.push(branch?.warehouse?.uniqueName);
                //         });

                //         Object.keys(this.allWarehouses)?.forEach(branch => {
                //             allWarehouses[branch] = [];
                //             this.allWarehouses[branch]?.forEach(warehouse => {
                //                 if (!warehouse?.isArchived || usedWarehouses?.includes(warehouse?.uniqueName)) {
                //                     allWarehouses[branch].push(warehouse);
                //                 }
                //             });
                //         });

                //         this.allWarehouses = allWarehouses;
                //     }

                //     this.branchTransfer.sources.forEach(source => {
                //         if (source?.warehouse?.address) {
                //             const pin = source.warehouse.pincode;
                //             if (pin) {
                //                 source.warehouse.address = `${source.warehouse.address}${'\n' + 'PIN: ' + pin}`;
                //             }
                //         }
                //     });
                //     this.branchTransfer.destinations.forEach(destination => {
                //         if (destination?.warehouse?.address) {
                //             const pin = destination.warehouse.pincode;
                //             if (pin) {
                //                 destination.warehouse.address = `${destination.warehouse.address}${'\n' + 'PIN: ' + pin}`;
                //             }
                //         }
                //     });
                //     if (this.branchTransfer.products?.length > 0) {
                //         this.branchTransfer.products.forEach(product => {
                //             if (product.hsnNumber) {
                //                 product.showCodeType = "hsn";
                //             } else {
                //                 product.showCodeType = "sac";
                //             }
                //         });
                //     }

                //     let tempBranches = [];
                //     this.branches?.forEach(branch => {
                //         if (!branch?.additional?.isArchived || (branch?.additional?.isArchived && (this.branchExists(branch?.value, this.branchTransfer.destinations) || this.branchExists(branch?.value, this.branchTransfer.sources)))) {
                //             tempBranches.push(branch);
                //         }
                //     });

                //     this.branches = cloneDeep(tempBranches);
                //     this.branches$ = observableOf(this.branches);

                //     this.branchTransfer.entity = response.body?.entity;
                //     this.branchTransfer.transferType = "products"; // MULTIPLE PRODUCTS VIEW SHOULD SHOW IN CASE OF EDIT
                //     this.branchTransfer.transporterDetails = response.body?.transporterDetails;
                //     if (this.branches) {
                //         const destinationBranch = this.branches.find(branch => branch.value === this.branchTransfer.destinations[0]?.uniqueName);
                //         this.destinationBranchAlias = destinationBranch && destinationBranch.additional ? destinationBranch.additional.alias : '';
                //         const sourceBranch = this.branches.find(branch => branch.value === this.branchTransfer.sources[0]?.uniqueName);
                //         this.sourceBranchAlias = sourceBranch && sourceBranch.additional ? sourceBranch.additional.alias : '';
                //     }
                //     if (!this.branchTransfer.transporterDetails) {
                //         this.branchTransfer.transporterDetails = {
                //             dispatchedDate: null,
                //             transporterName: null,
                //             transporterId: null,
                //             transportMode: null,
                //             vehicleNumber: null
                //         };
                //     }

                //     if (response.body?.dateOfSupply) {
                //         this.tempDateParams.dateOfSupply = new Date(response.body?.dateOfSupply?.split("-")?.reverse()?.join("-"));
                //     }
                //     if (response.body?.transporterDetails && response.body?.transporterDetails.dispatchedDate) {
                //         this.tempDateParams.dispatchedDate = new Date(response.body?.transporterDetails.dispatchedDate.split("-").reverse().join("-"));
                //     }

                //     this.calculateOverallTotal();

                //     this.resetDestinationWarehouses(0);
                //     this.resetSourceWarehouses(0);

                //     setTimeout(() => {
                //         this.allowAutoFocusInField = true;
                //     }, 200);

                //     setTimeout(() => {
                //         this.isDefaultLoad = false;
                //     }, 1000);
            } else {
                this.toasty.errorToast(response?.message);
            }
        });
    }

    /**
     * This will use for select product name
     *
     * @param {*} event
     * @memberof BranchTransferCreateComponent
     */
    public selectSenderProduct(event: any): void {
        const sourcesArray = this.branchTransferCreateEditForm.get('sources') as FormArray;
        const sourceGroup = sourcesArray.at(0) as FormGroup;
        sourceGroup.patchValue({
            name: event?.value
        });
    }

    public selectSenderWarehouse(event: any): void {
        const sourcesArray = this.branchTransferCreateEditForm.get('sources') as FormArray;
        const sourceGroup = sourcesArray.at(0) as FormGroup;
        const warehouseArray = sourceGroup.get['warehouse'] as FormArray;
        const warehouseGroup = warehouseArray.at(0) as FormGroup;
        warehouseGroup.patchValue({
            name: event?.value
        });
    }

    public selectReceiverWarehouse(event: any): void {
        // const sourcesArray = this.branchTransferCreateEditForm.get('sources').get('warehouse') as FormArray;
        // const sourceWarehouseGroup = sourcesArray.at(0) as FormGroup;
        // sourceWarehouseGroup.patchValue({
        //     name: event?.value
        // });
    }


    /**
     * Lifecycle hook for destroy
     *
     * @memberof BranchTransferCreateComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}


