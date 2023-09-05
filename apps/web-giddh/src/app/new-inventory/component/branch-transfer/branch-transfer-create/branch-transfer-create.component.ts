import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormArray, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { CommonActions } from 'apps/web-giddh/src/app/actions/common.actions';
import { InventoryAction } from 'apps/web-giddh/src/app/actions/inventory/inventory.actions';
import { InvoiceActions } from 'apps/web-giddh/src/app/actions/invoice/invoice.actions';
import { cloneDeep, isEmpty } from 'apps/web-giddh/src/app/lodash-optimized';
import { ILinkedStocksResult, LinkedStocksResponse, LinkedStocksVM } from 'apps/web-giddh/src/app/models/api-models/BranchTransfer';
import { OnboardingFormRequest } from 'apps/web-giddh/src/app/models/api-models/Common';
import { IAllTransporterDetails, IEwayBillTransporter, IEwayBillfilter } from 'apps/web-giddh/src/app/models/api-models/Invoice';
import { InvoiceSetting } from 'apps/web-giddh/src/app/models/interfaces/invoice.setting.interface';
import { OrganizationType } from 'apps/web-giddh/src/app/models/user-login-state';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { InventoryService } from 'apps/web-giddh/src/app/services/inventory.service';
import { SettingsWarehouseService } from 'apps/web-giddh/src/app/services/settings.warehouse.service';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { GIDDH_DATE_FORMAT } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import { transporterModes } from 'apps/web-giddh/src/app/shared/helpers/transporterModes';
import { AppState } from 'apps/web-giddh/src/app/store';
import { SelectFieldComponent } from 'apps/web-giddh/src/app/theme/form-fields/select-field/select-field.component';
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
    /** Close the  HSN/SAC Opened Menu*/
    @ViewChild('hsnSacMenuTrigger') hsnSacMenuTrigger: MatMenuTrigger;
    /** Close the  HSN/SAC Opened Menu*/
    @ViewChild('skuMenuTrigger') skuMenuTrigger: MatMenuTrigger;
    /** Instance for aside menu for product service and account*/
    @ViewChild("asideMenuProductService") public asideMenuProductService: TemplateRef<any>;
    /** Instance for aside menu for Manage Transport*/
    @ViewChild("asideManageTransport") public asideManageTransport: TemplateRef<any>;
    /** Form Group for group form */
    public branchTransferCreateEditForm: UntypedFormGroup;
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /* This will hold local JSON data */
    public localeData: any = {};
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True if translations loaded */
    public translationLoaded: boolean = false;
    /* this will store image path*/
    public imgPath: string = "";
    /* this will hold branch transfer mode */
    public branchTransferMode: string = "";
    /* this will hold overall total amount */
    public overallTotal: number = 0;
    /** Holds if Multiple Products/Senders selected */
    public transferType: string = 'products';
    /** For Active row index */
    public activeIndx: number;
    /** Hold hsc/sac status */
    public senderHsnSacStatus: 'HSN' | 'SAC';
    /** For HSN/SAC Code Inside Table*/
    public showCodeType: 'HSN' | 'SAC' = 'HSN';
    /** Hold  edit branch transfer uniqueName*/
    public editBranchTransferUniqueName: string = '';
    /** Hold  temp data query params*/
    public tempDateParams: any = { dateOfSupply: new Date(), dispatchedDate: '' };
    /** Hold  stock list data */
    public stockList: IOption[] = [];
    /** Hold  transporter data details */
    public transporterPopupStatus: boolean = false;
    /** Hold  transporter id*/
    public currenTransporterId: string;
    /** Observable to get transporter list*/
    public transporterList$: Observable<IEwayBillTransporter[]>;
    /** Observable to get transporter details*/
    public transporterListDetails$: Observable<IAllTransporterDetails>;
    /** Hold get transporter details*/
    public transporterListDetails: IAllTransporterDetails;
    /**True if transport edit mode*/
    public transportEditMode: boolean = false;
    /** Emit transport filter request*/
    public transporterFilterRequest: IEwayBillfilter = new IEwayBillfilter();
    /** Hold transported dropdown*/
    public transporterDropdown: IOption[] = [];
    /** Observable to get transporter in process*/
    public isGenarateTransporterInProcess$: Observable<boolean>;
    /** Observable to get transporter successfully*/
    public isGenarateTransporterSuccessfully$: Observable<boolean>;
    /** Observable to update transporter process*/
    public updateTransporterInProcess$: Observable<boolean>;
    /** Observable to update transporter success*/
    public updateTransporterSuccess$: Observable<boolean>;
    /** Hold object for generate new transporter*/
    public generateNewTransporter: IEwayBillTransporter = {
        transporterId: null,
        transporterName: null
    }; '';
    /** Hold transported mode list */
    public transporterMode: IOption[] = [];
    /** Hold  active company details */
    public activeCompany: any = {};
    /** Hold  input mask format  */
    public inputMaskFormat: any = '';
    /** Hold  branch list data */
    public branches: any[] = [];
    /** Decimal places from company settings */
    public giddhBalanceDecimalPlaces: number = 2;
    /** True if auto focus fields active */
    public allowAutoFocusInField: boolean = false;
    /** True if it's default load */
    private isDefaultLoad: boolean = false;
    /** True if current organization is branch */
    public isBranch: boolean;
    /** True if current organization is company with single branch */
    public isCompanyWithSingleBranch: boolean;
    /** Hold  all branches list data */
    public allWarehouses: any[] = [];
    /** Hold  sender warehouse list data */
    public senderWarehouses: { [key: string]: IOption[] } = {};
    /** Hold  destination warehouse list data */
    public destinationWarehouses: { [key: string]: IOption[] } = {};
    /** True if it is update mode */
    public isUpdateMode: boolean = false;
    /** Hold  form fields data */
    public formFields: any[] = [];
    /** Information message to be shown to the user for branch transfer */
    public branchTransferInfoText: string = '';
    /** True if  loading */
    public isLoading: boolean = false;
    /** True if is valid source tax number */
    public isValidSourceTaxNumber: boolean = true;
    /** True if gstin number valid */
    public isGstinValid: boolean = false;
    /** Hold inventory settings  */
    public inventorySettings: any;
    /** True if destination tax number valid */
    public isValidDestinationTaxNumber: boolean = true;
    /** Hold inner entry index number */
    public innerEntryIndex: number;
    /** Hold aside menu state for product service  */
    public asideMenuStateForProductService: any;
    /** Stores the destination branch alias */
    public destinationBranchAlias: string;
    /** Stores the source branch alias */
    public sourceBranchAlias: string;

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
        private toasty: ToasterService,
        private warehouseService: SettingsWarehouseService,
        public dialog: MatDialog
    ) {
        this.getInventorySettings();
        this.initBranchTransferForm();
    }

    public ngOnInit(): void {
        /* added image path */
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
        this.store.dispatch(this.invoiceActions.getInvoiceSetting());
        this.store.dispatch(this.invoiceActions.resetTransporterListResponse());
        this.getTransportersList();
        this.getStocks();

        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            if (params?.type) {
                this.branchTransferMode = params.type;
                this.changeDetection.detectChanges();
            }
        });

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

    public getInventorySettings(): void {
        this.store.pipe(select((s: AppState) => s.invoice.settings), takeUntil(this.destroyed$)).subscribe((settings: InvoiceSetting) => {
            if (settings && settings.companyInventorySettings) {
                this.inventorySettings = settings.companyInventorySettings;
            }
        });
    }
    private initBranchTransferForm(): void {
        this.branchTransferCreateEditForm = this.formBuilder.group({
            dateOfSupply: ['', Validators.required],
            challanNo: [null],
            uniqueName: [null],
            note: [''],
            sources: this.formBuilder.array([
                this.initSourceFormGroup()
            ]),
            destinations: this.formBuilder.array([
                this.initDestinationFormGroup()
            ]),
            products: this.formBuilder.array([
                this.initProductFormGroup()
            ]),
            transporterDetails: this.formBuilder.group({
                dispatchedDate: [''],
                transporterName: [null],
                transporterId: [null],
                transportMode: [null],
                vehicleNumber: [null]
            }),
            entity: (this.branchTransferMode) ? this.branchTransferMode : null,
            transferType: (this.transferType) ? this.transferType : null,
            myCurrentCompany: ['']
        });
    }

    public initSourceFormGroup(): UntypedFormGroup {
        return this.formBuilder.group({
            name: [''],
            uniqueName: [''],
            warehouse: this.formBuilder.group({
                name: [null],
                uniqueName: [null],
                taxNumber: [null],
                address: [null],
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
    public initDestinationFormGroup(): UntypedFormGroup {
        return this.formBuilder.group({
            name: [''],
            uniqueName: [''],
            warehouse: this.formBuilder.group({
                name: [null],
                uniqueName: [null],
                taxNumber: [null],
                address: [null],
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
            hsnNumber: [''],
            sacNumber: [''],
            showCodeType: [''],
            skuCode: [''],
            uniqueName: [''],
            description: [''],
            stockDetails: this.formBuilder.group({
                stockUnitUniqueName: [''],
                stockUnit: [''],
                amount: [''],
                rate: [''],
                quantity: ['']
            }),
        });
    }

    public setActiveRow(index: number): void {
        this.activeIndx = index;
    }

    public saveSkuNumberPopup(product): void {
        // product.skuCode = this.skuNumber;
        // this.skuNumberPopupShow = false;
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
        this.activeIndx = null;
    }

    /** Close the  HSN/SAC Opened Menu*/
    public closeShowCodeMenu(): void {
        this.hsnSacMenuTrigger.closeMenu();
        this.skuMenuTrigger.closeMenu();
    }
    public submit(): void {

        this.isLoading = true;
        const sourcesArray = this.branchTransferCreateEditForm.get('sources') as UntypedFormArray;
        for (let i = 0; i < sourcesArray.length; i++) {
            const sourcesFormGroup = sourcesArray.at(i) as UntypedFormGroup;
            const sourcesStockDetails = sourcesFormGroup.get('warehouse') as UntypedFormGroup;
            if (sourcesStockDetails) {
                const [address, pin] = sourcesStockDetails.get('address').value?.split('\nPIN: ');
                sourcesStockDetails.get('address')?.setValue(address);
                sourcesStockDetails.get('pincode')?.setValue(pin);
            }
        }

        const destinationsArray = this.branchTransferCreateEditForm.get('destinations') as UntypedFormArray;
        for (let i = 0; i < destinationsArray.length; i++) {
            const destinationsFormGroup = destinationsArray.at(i) as UntypedFormGroup;
            const destinationsStockDetails = destinationsFormGroup.get('warehouse') as UntypedFormGroup;
            if (destinationsStockDetails) {
                const [address, pin] = destinationsStockDetails.get('address').value?.split('\nPIN: ');
                destinationsStockDetails.get('address')?.setValue(address);
                destinationsStockDetails.get('pincode')?.setValue(pin);
            }
        }
        const productsArray = this.branchTransferCreateEditForm.get('products') as UntypedFormArray;
        for (let i = 0; i < productsArray.length; i++) {
            const productFormGroup = productsArray.at(i) as UntypedFormGroup;
            if (productFormGroup.get('showCodeType').value === "hsn") {
                productFormGroup.get('sacNumber').setValue("");
            } else {
                productFormGroup.get('hsnNumber').setValue("");
            }
            // delete product.variant;
        }
        console.log(this.branchTransferCreateEditForm);

        // if (this.editBranchTransferUniqueName) {
        //     this.inventoryService.updateNewBranchTransfer(this.branchTransfer).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
        //         this.isLoading = false;

        //         if (res) {
        //             if (res.status === 'success') {
        //                 if (this.branchTransferMode === 'receipt-note') {
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

        //                 if (this.branchTransferMode === 'receipt-note') {
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
        const sourcesArray = this.branchTransferCreateEditForm.get('sources') as UntypedFormArray;
        const warehouseFormGroup = sourcesArray.at(0).get('warehouse') as UntypedFormGroup;
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

    public addSender() {
        const sources = this.branchTransferCreateEditForm.get('sources') as UntypedFormArray;
        sources.push(this.initSourceFormGroup());
    }

    public removeSenderDetailsForm(i: number) {
        const sources = this.branchTransferCreateEditForm.get('sources') as UntypedFormArray;
        sources.removeAt(i);
    }

    public addReceiver() {
        const destinations = this.branchTransferCreateEditForm.get('destinations') as UntypedFormArray;
        destinations.push(this.initDestinationFormGroup());
    }

    public removeReceiverDetailsForm(i: number) {
        const destinations = this.branchTransferCreateEditForm.get('destinations') as UntypedFormArray;
        destinations.removeAt(i);
    }

    public addBlankProductsForm() {
        const products = this.branchTransferCreateEditForm.get('products') as UntypedFormArray;
        products.push(this.initProductFormGroup());
    }

    public removeProductDetailsForm(i: number) {
        const products = this.branchTransferCreateEditForm.get('products') as UntypedFormArray;
        products.removeAt(i);
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

    public changeTransferType(): void {
        this.allowAutoFocusInField = false;
        this.branchTransferCreateEditForm.reset();
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
                    this.isCompanyWithSingleBranch = this.generalService.currentOrganizationType === OrganizationType.Company && this.branches && this.branches.length === 1;
                    if (this.editBranchTransferUniqueName) {
                        this.getBranchTransfer();
                    }
                } else {
                    this.branches = [];
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

    public getBranchTransfer(): void {
        this.isUpdateMode = true;
        const sourcesArray = this.branchTransferCreateEditForm.get('sources') as UntypedFormArray;
        const destinationsArray = this.branchTransferCreateEditForm.get('destinations') as UntypedFormArray;
        const productsArray = this.branchTransferCreateEditForm.get('products') as UntypedFormArray;
        const destinationsFormGroup = destinationsArray?.at(0) as UntypedFormGroup;
        const sourcesFormGroup = destinationsArray?.at(0) as UntypedFormGroup;

        this.inventoryService.getNewBranchTransfer(this.editBranchTransferUniqueName).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response?.status === "success") {
                this.branchTransferCreateEditForm.get('dateOfSupply').setValue(response.body?.dateOfSupply);
                this.branchTransferCreateEditForm.get('challanNo').setValue(response.body?.challanNo);
                this.branchTransferCreateEditForm.get('note').setValue(response.body?.note);
                this.branchTransferCreateEditForm.get('uniqueName').setValue(response.body?.uniqueName);
                this.branchTransferCreateEditForm.get('sources').setValue(response.body?.sources);
                this.branchTransferCreateEditForm.get('destinations').setValue(response.body?.destinations);
                this.branchTransferCreateEditForm.get('products').setValue(response.body?.products);

                let allWarehouses = [];
                if (Object.keys(this.allWarehouses)?.length > 0) {
                    const usedWarehouses = [];

                    sourcesArray[0]?.forEach(branch => {
                        usedWarehouses.push(branch?.warehouse?.uniqueName);
                    });
                    destinationsArray[0]?.forEach(branch => {
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

                sourcesArray[0].forEach(source => {
                    if (source?.warehouse?.address) {
                        const pin = source.warehouse.pincode;
                        if (pin) {
                            source.warehouse.address = `${source.warehouse.address}${'\n' + 'PIN: ' + pin}`;
                        }
                    }
                });
                destinationsArray[0].forEach(destination => {
                    if (destination?.warehouse?.address) {
                        const pin = destination.warehouse.pincode;
                        if (pin) {
                            destination.warehouse.address = `${destination.warehouse.address}${'\n' + 'PIN: ' + pin}`;
                        }
                    }
                });
                if (productsArray?.length > 0) {
                    productsArray[0].forEach(product => {
                        if (product.hsnNumber) {
                            product.showCodeType = "hsn";
                        } else {
                            product.showCodeType = "sac";
                        }
                    });
                }

                let tempBranches = [];
                this.branches?.forEach(branch => {
                    if (!branch?.additional?.isArchived || (branch?.additional?.isArchived && (this.branchExists(branch?.value, destinationsArray[0]) || this.branchExists(branch?.value, sourcesArray[0])))) {
                        tempBranches.push(branch);
                    }
                });

                this.branches = cloneDeep(tempBranches);
                this.branchTransferCreateEditForm.get('entity').setValue(response.body?.entity);
                this.branchTransferCreateEditForm.get('transferType').setValue('products');// MULTIPLE PRODUCTS VIEW SHOULD SHOW IN CASE OF EDIT
                this.branchTransferCreateEditForm.get('transporterDetails').setValue(response.body?.transporterDetails);
                if (this.branches) {
                    const destinationBranch = this.branches.find(branch => branch.value === destinationsFormGroup.get('uniqueName').value);
                    this.destinationBranchAlias = destinationBranch && destinationBranch.additional ? destinationBranch.additional.alias : '';
                    const sourceBranch = this.branches.find(branch => branch.value === sourcesFormGroup.get('uniqueName').value);
                    this.sourceBranchAlias = sourceBranch && sourceBranch.additional ? sourceBranch.additional.alias : '';
                }
                const transporterDetailsFormGroup = this.branchTransferCreateEditForm.get('transporterDetails') as UntypedFormGroup;
                if (!this.branchTransferCreateEditForm.get('transporterDetails')) {
                    transporterDetailsFormGroup.patchValue({
                        dispatchedDate: null,
                        transporterName: null,
                        transporterId: null,
                        transportMode: null,
                        vehicleNumber: null
                    });
                }

                if (response.body?.dateOfSupply) {
                    this.tempDateParams.dateOfSupply = new Date(response.body?.dateOfSupply?.split("-")?.reverse()?.join("-"));
                    let dataOfSupply = dayjs(this.tempDateParams.dateOfSupply).format(GIDDH_DATE_FORMAT)
                    this.branchTransferCreateEditForm.get('dateOfSupply').setValue(dataOfSupply);
                }
                if (response.body?.transporterDetails && response.body?.transporterDetails.dispatchedDate) {
                    this.tempDateParams.dispatchedDate = new Date(response.body?.transporterDetails.dispatchedDate.split("-").reverse().join("-"));
                    let dispatchedDate = dayjs(this.tempDateParams.dispatchedDate).format(GIDDH_DATE_FORMAT)
                    this.branchTransferCreateEditForm.get('transporterDetails.dispatchedDate').setValue(dispatchedDate);
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
                this.toasty.errorToast(response?.message);
            }
        });
    }

    public getWarehouseDetails(type, index): void {
        const sourcesArray = this.branchTransferCreateEditForm.get('sources') as UntypedFormArray;
        const sourceFormGroup = sourcesArray.at(index) as UntypedFormGroup;
        const sourcesWarehouseFormGroup = sourceFormGroup.get('warehouse') as UntypedFormGroup;
        const destinationsArray = this.branchTransferCreateEditForm.get('destinations') as UntypedFormArray;
        const destinationsFormGroup = destinationsArray.at(index) as UntypedFormGroup;
        const destinationsWarehouseFormGroup = destinationsFormGroup.get('warehouse') as UntypedFormGroup;
        if (type === 'sources') {
            if (sourcesWarehouseFormGroup && sourcesWarehouseFormGroup.get('uniqueName').value !== null) {

                this.warehouseService.getWarehouseDetails(sourcesWarehouseFormGroup.get('uniqueName').value).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                    if (res && res.body) {
                        sourcesWarehouseFormGroup.get('name')?.setValue(res.body.name);
                        if (res.body.addresses && res.body.addresses.length) {
                            const defaultAddress = res.body.addresses.find(address => address.isDefault);
                            sourcesWarehouseFormGroup.get('address')?.setValue(defaultAddress ? `${defaultAddress.address}${defaultAddress?.pincode ? '\n' + 'PIN: ' + defaultAddress?.pincode : ''}` : '');
                            sourcesWarehouseFormGroup.get('taxNumber')?.setValue(defaultAddress ? defaultAddress.taxNumber : '');
                        } else {
                            sourcesWarehouseFormGroup.get('taxNumber')?.setValue('');
                            sourcesWarehouseFormGroup.get('address')?.setValue(null);
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
                                    return branch.additional.warehouses.some(warehouse => warehouse.taxNumber === sourcesWarehouseFormGroup.get('taxNumber').value);
                                }
                                return false;
                            });
                            this.branches = branchesWithSameTax;
                        }
                        // Clear the destination branch if it is not present in branches with same tax array, as only branches with same tax should be displayed
                        if (branchesWithSameTax && !this.editBranchTransferUniqueName && destinationsFormGroup && !branchesWithSameTax.some(branch => branch.value === destinationsWarehouseFormGroup.get('uniqueName').value)) {
                            if (this.branchTransferMode === 'delivery-challan') {
                            }
                        }
                        this.resetDestinationWarehouses(index);
                        this.detectChanges();
                    }
                });
            } else {
                sourcesWarehouseFormGroup.get('name')?.setValue('');
                sourcesWarehouseFormGroup.get('taxNumber')?.setValue('');
                sourcesWarehouseFormGroup.get('address')?.setValue('');
            }
        }
        if (type === 'destinations') {
            if (destinationsWarehouseFormGroup && destinationsWarehouseFormGroup.get('uniqueName').value !== null) {
                this.warehouseService.getWarehouseDetails(destinationsWarehouseFormGroup.get('uniqueName').value).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                    if (res && res.body) {
                        destinationsWarehouseFormGroup.get('name')?.setValue(res.body.name);
                        if (res.body.addresses && res.body.addresses.length) {
                            const defaultAddress = res.body.addresses.find(address => address.isDefault);
                            destinationsWarehouseFormGroup.get('address')?.setValue(defaultAddress ? `${defaultAddress.address}${defaultAddress?.pincode ? '\n' + 'PIN: ' + defaultAddress?.pincode : ''}` : '');
                            destinationsWarehouseFormGroup.get('taxNumber')?.setValue(defaultAddress ? defaultAddress.taxNumber : '');
                        } else {
                            destinationsWarehouseFormGroup.get('taxNumber')?.setValue('');
                            destinationsWarehouseFormGroup.get('address')?.setValue(null);
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
                                    return branch.additional.warehouses.some(warehouse => warehouse.taxNumber === destinationsWarehouseFormGroup.get('taxNumber').value);
                                }
                                return false;
                            });
                            this.branches = branchesWithSameTax;
                        }
                        // Clear the source branch if it is not present in branches with same tax array, as only branches with same tax should be displayed
                        if (branchesWithSameTax && !this.editBranchTransferUniqueName && sourcesWarehouseFormGroup && !branchesWithSameTax.some(branch => branch.value === sourcesWarehouseFormGroup.get('uniqueName').value)) {
                            if (this.branchTransferMode === 'receipt-note') {
                                // this.sourceBranchClear$ = observableOf({ status: true });
                            }
                        }
                        this.resetSourceWarehouses(index);
                        this.detectChanges();
                    }
                });
            } else {
                destinationsWarehouseFormGroup.get('name')?.setValue('');
                destinationsWarehouseFormGroup.get('taxNumber')?.setValue('');
                destinationsWarehouseFormGroup.get('address')?.setValue('');
            }
        }
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
            let updateBranch = this.isBranch ? branchName : hoBranch?.alias;
            this.branchTransferCreateEditForm.get('myCurrentCompany').setValue(updateBranch);
            const sourcesArray = this.branchTransferCreateEditForm.get('sources') as UntypedFormArray;
            const sourceFormGroup = sourcesArray.at(0) as UntypedFormGroup;
            const destinationsArray = this.branchTransferCreateEditForm.get('destinations') as UntypedFormArray;
            const destinationsFormGroup = destinationsArray.at(0) as UntypedFormGroup;

            if (this.branchTransferMode === "delivery-challan") {
                sourceFormGroup.get('uniqueName')?.setValue(selectedBranch ? selectedBranch.uniqueName : hoBranch?.uniqueName);
                sourceFormGroup.get('name')?.setValue(selectedBranch ? selectedBranch.name : hoBranch?.name);
            } else if (this.branchTransferMode === "receipt-note") {
                destinationsFormGroup.get('uniqueName')?.setValue(selectedBranch ? selectedBranch.uniqueName : hoBranch?.uniqueName);
                destinationsFormGroup.get('name')?.setValue(selectedBranch ? selectedBranch.name : hoBranch?.name);
            }
        }
        this.detectChanges();
    }

    public linkedStocksVM(data: ILinkedStocksResult[]): LinkedStocksVM[] {

        let branches: LinkedStocksVM[] = [];
        this.senderWarehouses = {};
        this.destinationWarehouses = {};
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
        this.detectChanges();
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

    public focusDefaultProduct(): void {
        // if (this.allowAutoFocusInField) {
        //     setTimeout(() => {
        //         if (this.defaultProduct) {
        //             this.defaultProduct.show('');
        //         }
        //     }, 100);
        // }
    }
    public focusDestinationWarehouse(event: any): void {
        // if (this.allowAutoFocusInField && event && event.value) {
        //     setTimeout(() => {
        //         this.destinationWarehouse?.show('');
        //     }, 100);
        // }
    }

    public focusSourceWarehouse(event: any): void {
        // if (this.allowAutoFocusInField && event && event.value) {
        //     setTimeout(() => {
        //         this.sourceWarehouse?.show('');
        //     }, 100);
        // }
    }
    public onProductNoResultsClicked(idx?: number): void {
        this.innerEntryIndex = idx;

        document.querySelector("body").classList.add("new-branch-transfer-page");

        this.asideMenuStateForProductService = this.dialog.open(this.asideMenuProductService, {
            position: {
                right: '0',
                top: '0'
            },
            width: '760px',
            height: '100vh !important',
            disableClose: true
        });

        this.asideMenuStateForProductService.afterClosed().pipe(take(1)).subscribe(response => {
            document.querySelector("body").classList.remove("new-branch-transfer-page");
        });

        if (!idx) {
            this.getStocks();
        }
    }

    /**
     * This Function is used to close Aside Menu Sidebar
     *
     * @memberof BranchTransferCreateComponent
     */
         public closeAsideMenuProductServiceModal(): void {
            this.asideMenuStateForProductService?.close();
        }

    public focusDestinationName(): void {
        // if (this.allowAutoFocusInField) {
        //     setTimeout(() => {
        //         if (this.destinationName) {
        //             this.destinationName.show('');
        //         } else {
        //             this.focusSelectDropdown(0);
        //         }
        //     }, 100);
        // }
    }
    public focusSelectDropdown(index: number, event?: any): void {
        if (this.allowAutoFocusInField && (!event || event.value)) {
            // setTimeout(() => {
            //     this.setactiveIndx(index);
            //     setTimeout(() => {
            //         this.selectDropdown?.show('');
            //     }, 100);
            // }, 100);
        }
    }
    public selectSenderName(event: any, index: number): void {
        if (event?.value) {
            const sourcesArray = this.branchTransferCreateEditForm.get('sources') as UntypedFormArray;
            const sourceGroup = sourcesArray.at(0) as UntypedFormGroup;
            sourceGroup.patchValue({
                name: event?.label,
                uniqueName: event?.value
            });
            if (this.branchTransferMode === 'receipt-note') {
                this.selectCompany(event, 'sources', index);
            }
        }
    }

    public selectRecieverName(event: any): void {
        if (event?.value) {
            const destinationsArray = this.branchTransferCreateEditForm.get('destinations') as UntypedFormArray;
            const destinationGroup = destinationsArray.at(0) as UntypedFormGroup;
            destinationGroup.patchValue({
                name: event?.label,
                uniqueName: event?.value
            });
            if (this.branchTransferMode === 'delivery-challan') {
                this.selectCompany(event, 'destinations', 0);
            }
            this.focusDestinationWarehouse(event);
        }
    }

    public selectReceiverWarehouse(event: any): void {
        if (event?.value) {
            const destinationsArray = this.branchTransferCreateEditForm.get('destinations') as UntypedFormArray;
            const destinationGroup = destinationsArray.at(0) as UntypedFormGroup;
            const destinationsWarehouseFormGroup = destinationGroup.get('warehouse') as UntypedFormGroup;
            destinationsWarehouseFormGroup.patchValue({
                name: event?.label,
                uniqueName: event?.value
            });
            this.getWarehouseDetails('destinations', 0);
            this.focusSelectDropdown(0, event);
        }
    }

    public selectSenderWarehouse(event: any, index: number): void {
        if (event?.value) {
            const sourcesArray = this.branchTransferCreateEditForm.get('sources') as UntypedFormArray;
            const sourceGroup = sourcesArray.at(0) as UntypedFormGroup;
            const sourcesWarehouseFormGroup = sourceGroup.get('warehouse') as UntypedFormGroup;
            sourcesWarehouseFormGroup.patchValue({
                name: event?.label,
                uniqueName: event?.value
            });
            if (this.branchTransferMode === 'delivery-challan') {
                this.focusDestinationName();
            }
            if (this.branchTransferMode === 'receipt-note') {
                this.focusDestinationWarehouse(event);
            }
            this.getWarehouseDetails('sources', index);
        }
    }

    public onSelectTransportCompany(event: any): void {
        this.branchTransferCreateEditForm.get('transporterDetails.transporterName').setValue(event?.value);
        this.branchTransferCreateEditForm.get('transporterDetails.transporterId').setValue(event?.value);
    }

    public onSelectTransportMode(event: any): void {
        this.branchTransferCreateEditForm.get('transporterDetails.transportMode').setValue(event?.value);
    }
    public selectCompany(event, type, index): void {
        if (!this.isDefaultLoad && type) {
            if (type === "sources") {
                const sourcesArray = this.branchTransferCreateEditForm.get('sources') as UntypedFormArray;
                const sourceGroup = sourcesArray?.at(index) as UntypedFormGroup;
                const sourceWarehouseArray = sourceGroup.get['warehouse'] as UntypedFormArray;
                const warehouseGroup = sourceWarehouseArray?.at(index) as UntypedFormGroup;
                const stockDetailsFormGroup = sourcesArray?.at(index).get('warehouse.stockDetails') as UntypedFormGroup;
                if (sourcesArray) {
                    sourceGroup.patchValue({
                        name: event?.label
                    });
                    if (sourceWarehouseArray) {
                        warehouseGroup.patchValue({
                            name: null,
                            uniqueName: null,
                            taxNumber: null,
                            address: null
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
                    this.resetSourceWarehouses(index);
                }
            } else {
                const destinationsArray = this.branchTransferCreateEditForm.get('destinations') as UntypedFormArray;
                const destinationsFormGroup = destinationsArray.at(index) as UntypedFormGroup;
                const destinationsWarehouseArray = destinationsFormGroup.get['warehouse'] as UntypedFormArray;
                const warehouseGroup = destinationsWarehouseArray?.at(index) as UntypedFormGroup;
                const stockDetailsFormGroup = destinationsArray.at(index).get('warehouse.stockDetails') as UntypedFormGroup;

                if (destinationsArray) {
                    destinationsFormGroup.patchValue({
                        name: event?.label
                    });
                    if (destinationsWarehouseArray) {
                        warehouseGroup.patchValue({
                            name: null,
                            uniqueName: null,
                            taxNumber: null,
                            address: null
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
                    this.resetDestinationWarehouses(index);
                }
            }
        }
    }

    public resetWarehouse(type: string, index: number): void {
        const sourcesArray = this.branchTransferCreateEditForm.get('sources') as UntypedFormArray;
        const sourceFormGroup = sourcesArray.at(index) as UntypedFormGroup;
        const sourcesWarehouseFormGroup = sourceFormGroup.get('warehouse') as UntypedFormGroup;
        const sourcesStockDetailsFormGroup = sourcesArray.at(index).get('warehouse.stockDetails') as UntypedFormGroup;

        const destinationsArray = this.branchTransferCreateEditForm.get('destinations') as UntypedFormArray;
        const destinationsFormGroup = destinationsArray.at(index) as UntypedFormGroup;
        const destinationsWarehouseFormGroup = destinationsFormGroup.get('warehouse') as UntypedFormGroup;
        const destinationsStockDetailsFormGroup = destinationsArray.at(index).get('warehouse.stockDetails') as UntypedFormGroup;

        if (type === "sources") {
            if (sourcesArray && sourcesWarehouseFormGroup) {
                sourcesWarehouseFormGroup.get('name')?.setValue(null);
                sourcesWarehouseFormGroup.get('uniqueName')?.setValue(null);
                sourcesWarehouseFormGroup.get('taxNumber')?.setValue(null);
                sourcesWarehouseFormGroup.get('address')?.setValue(null);
                if (sourcesStockDetailsFormGroup) {
                    sourcesStockDetailsFormGroup.get('quantity')?.setValue(null);
                }
            }
            this.resetSourceWarehouses(index, true);
            if (destinationsFormGroup && destinationsWarehouseFormGroup &&
                destinationsWarehouseFormGroup.get('uniqueName')?.value === null) {
                // Source and destination warehouses are cleared, reset both warehouses
                this.resetDestinationWarehouses(index, true);
            }
        } else {
            if (destinationsArray && destinationsWarehouseFormGroup) {
                destinationsWarehouseFormGroup.get('name')?.setValue(null);
                destinationsWarehouseFormGroup.get('uniqueName')?.setValue(null);
                destinationsWarehouseFormGroup.get('taxNumber')?.setValue(null);
                destinationsWarehouseFormGroup.get('address')?.setValue(null);
                if (destinationsStockDetailsFormGroup) {
                    destinationsStockDetailsFormGroup.get('quantity')?.setValue(null);
                }
            }
            this.resetDestinationWarehouses(index, true);
            if (sourceFormGroup && sourcesWarehouseFormGroup &&
                sourcesStockDetailsFormGroup.get('uniqueName')?.value === null) {
                this.resetSourceWarehouses(index, true);
            }
        }
    }

    public resetSourceWarehouses(index: number, reInitializeWarehouses?: boolean) {
        const sourcesArray = this.branchTransferCreateEditForm.get('sources') as UntypedFormArray;
        const sourceFormGroup = sourcesArray?.at(index) as UntypedFormGroup;
        const sourcesWarehouseFormGroup = sourceFormGroup.get('warehouse') as UntypedFormGroup;

        const destinationsArray = this.branchTransferCreateEditForm.get('destinations') as UntypedFormArray;
        const destinationsFormGroup = destinationsArray?.at(index) as UntypedFormGroup;
        const destinationsWarehouseFormGroup = destinationsFormGroup.get('warehouse') as UntypedFormGroup;



        if (destinationsArray && destinationsFormGroup && destinationsWarehouseFormGroup && destinationsWarehouseFormGroup.get('uniqueName')?.value !== null) {
            this.senderWarehouses[destinationsFormGroup.get('uniqueName').value] = [];
            let allowWarehouse = true;

            if (this.allWarehouses[destinationsFormGroup.get('uniqueName')?.value] && this.allWarehouses[destinationsFormGroup.get('uniqueName').value].length > 0) {
                this.allWarehouses[destinationsFormGroup.get('uniqueName').value].forEach(key => {
                    allowWarehouse = true;

                    if (key?.uniqueName === destinationsWarehouseFormGroup.get('uniqueName')?.value ||
                        key.taxNumber !== (destinationsWarehouseFormGroup.get('taxNumber')?.value || '')) {
                        allowWarehouse = false;
                    }

                    if (allowWarehouse) {
                        this.senderWarehouses[sourceFormGroup.get('uniqueName').value].push({ label: key.name, value: key?.uniqueName });
                    }
                });
            }

            if (sourcesArray && sourceFormGroup.get('uniqueName')?.value) {
                // Update source warehouses
                this.senderWarehouses[sourceFormGroup.get('uniqueName').value] = [];
                if (this.allWarehouses[sourceFormGroup.get('uniqueName').value] && this.allWarehouses[sourceFormGroup.get('uniqueName').value].length > 0) {
                    this.allWarehouses[sourceFormGroup.get('uniqueName').value].forEach(key => {
                        if (destinationsArray && destinationsWarehouseFormGroup && key?.uniqueName !== destinationsWarehouseFormGroup.get('uniqueName')?.value &&
                            key.taxNumber === (destinationsWarehouseFormGroup.get('taxNumber')?.value || '')) {
                            this.senderWarehouses[sourceFormGroup.get('uniqueName').value].push({ label: key.name, value: key?.uniqueName });
                        }
                    });
                    if (destinationsWarehouseFormGroup && sourcesWarehouseFormGroup.get('uniqueName')?.value) {
                        setTimeout(() => {
                            this.branchTransferCreateEditForm.get('sources.0.warehouse.uniqueName').setValue(sourcesWarehouseFormGroup.get('uniqueName')?.value)
                        }, 100);
                    }
                }
            }
        }
        else {
            if (this.allWarehouses && this.allWarehouses[destinationsFormGroup.get('uniqueName')?.value]) {
                this.senderWarehouses[destinationsFormGroup.get('uniqueName').value] = [];
                let allowWarehouse = true;

                this.allWarehouses[destinationsFormGroup.get('uniqueName')?.value].forEach(key => {
                    allowWarehouse = true;

                    if (key?.uniqueName === destinationsWarehouseFormGroup.get('uniqueName')?.value ||
                        (!reInitializeWarehouses && key.taxNumber !== (destinationsWarehouseFormGroup.get('taxNumber')?.value || ''))) {
                        allowWarehouse = false;
                    }

                    if (allowWarehouse) {
                        this.senderWarehouses[destinationsFormGroup.get('uniqueName').value].push({ label: key.name, value: key?.uniqueName });
                    }
                });
            }

            // If multiple senders case for receipt note
            if (sourceFormGroup && sourceFormGroup.get('uniqueName').value) {
                // Update source warehouses
                this.senderWarehouses[sourceFormGroup.get('uniqueName').value] = [];
                if (this.allWarehouses[sourceFormGroup.get('uniqueName').value] && this.allWarehouses[sourceFormGroup.get('uniqueName').value].length > 0) {
                    this.allWarehouses[sourceFormGroup.get('uniqueName').value].forEach(key => {
                        if (destinationsArray && destinationsWarehouseFormGroup && key?.uniqueName !== destinationsWarehouseFormGroup.get('uniqueName')?.value &&
                            (reInitializeWarehouses || key.taxNumber === (destinationsWarehouseFormGroup.get('taxNumber')?.value || ''))) {

                            this.senderWarehouses[sourceFormGroup.get('uniqueName')?.value].push({ label: key.name, value: key?.uniqueName });

                        }
                    });

                }
            }
        }
        this.detectChanges();
    }
    public resetDestinationWarehouses(index, reInitializeWarehouses?: boolean) {

        const sourcesArray = this.branchTransferCreateEditForm.get('sources') as UntypedFormArray;
        const sourceFormGroup = sourcesArray?.at(index) as UntypedFormGroup;
        const sourcesWarehouseFormGroup = sourceFormGroup.get('warehouse') as UntypedFormGroup;

        const destinationsArray = this.branchTransferCreateEditForm.get('destinations') as UntypedFormArray;
        const destinationsFormGroup = destinationsArray?.at(index) as UntypedFormGroup;
        const destinationsWarehouseFormGroup = destinationsFormGroup.get('warehouse') as UntypedFormGroup;
        if (sourcesArray && sourceFormGroup && sourcesWarehouseFormGroup.get('uniqueName')?.value !== null) {
            this.destinationWarehouses[sourceFormGroup.controls.uniqueName.value] = [];
            let allowWarehouse = true;

            if (this.allWarehouses[sourceFormGroup.get('uniqueName').value] && this.allWarehouses[sourceFormGroup.get('uniqueName').value].length > 0) {
                this.allWarehouses[sourceFormGroup.get('uniqueName').value].forEach(key => {
                    allowWarehouse = true;

                    if (key?.uniqueName === sourcesWarehouseFormGroup.get('uniqueName')?.value ||
                        key.taxNumber !== (sourcesWarehouseFormGroup.get('taxNumber')?.value || '')) {
                        allowWarehouse = false;
                    }

                    if (allowWarehouse) {
                        this.destinationWarehouses[sourceFormGroup.get('uniqueName').value].push({ label: key.name, value: key?.uniqueName });
                    }
                });
            }
            if (destinationsFormGroup && destinationsFormGroup.get('uniqueName').value) {
                // Update Destination warehouses
                this.destinationWarehouses[destinationsFormGroup.get('uniqueName').value] = [];
                if (this.allWarehouses[destinationsFormGroup.get('uniqueName').value] && this.allWarehouses[destinationsFormGroup.get('uniqueName').value].length > 0) {
                    this.allWarehouses[destinationsFormGroup.get('uniqueName').value].forEach(key => {
                        if (key?.uniqueName !== sourcesWarehouseFormGroup.get('uniqueName') &&
                            key.taxNumber === (sourcesWarehouseFormGroup.get('taxNumber')?.value || '')) {
                            this.destinationWarehouses[destinationsFormGroup.get('uniqueName').value].push({ label: key.name, value: key?.uniqueName });
                        }
                    });
                }
                if (destinationsWarehouseFormGroup && destinationsWarehouseFormGroup.get('uniqueName')?.value) {
                    setTimeout(() => {
                        this.branchTransferCreateEditForm.get('destinations.0.warehouse.uniqueName').setValue(destinationsWarehouseFormGroup.get('uniqueName')?.value)
                    }, 100);
                }
            }
        } else {
            if (this.allWarehouses && sourcesArray && this.allWarehouses[sourceFormGroup.get('uniqueName')?.value]) {
                this.destinationWarehouses[sourceFormGroup.get('uniqueName')?.value] = [];
                let allowWarehouse = true;

                if (this.allWarehouses[sourceFormGroup.get('uniqueName')?.value] && this.allWarehouses[sourceFormGroup.get('uniqueName')?.value].length > 0) {
                    this.allWarehouses[sourceFormGroup.get('uniqueName')?.value].forEach(key => {
                        allowWarehouse = true;

                        if (key?.uniqueName === sourcesWarehouseFormGroup.get('uniqueName')?.value ||
                            (!reInitializeWarehouses && key.taxNumber !== (sourcesWarehouseFormGroup.get('taxNumber')?.value || ''))) {
                            allowWarehouse = false;
                        }

                        if (allowWarehouse) {
                            this.destinationWarehouses[sourceFormGroup.get('uniqueName')?.value].push({ label: key.name, value: key?.uniqueName });
                        }
                    });
                }
            }
            // If multiple destinations case for delivery challan
            if (destinationsFormGroup && destinationsFormGroup.get('uniqueName').value) {
                // Update Destination warehouses
                this.destinationWarehouses[destinationsFormGroup.get('uniqueName').value] = [];
                if (this.allWarehouses[destinationsFormGroup.get('uniqueName').value] && this.allWarehouses[destinationsFormGroup.get('uniqueName').value].length > 0) {
                    this.allWarehouses[destinationsFormGroup.get('uniqueName').value].forEach(key => {
                        if (sourcesArray && sourcesWarehouseFormGroup && key?.uniqueName !== sourcesWarehouseFormGroup.get('uniqueName')?.value &&
                            (reInitializeWarehouses || key.taxNumber === sourcesWarehouseFormGroup.get('taxNumber')?.value || '')) {
                            this.destinationWarehouses[destinationsFormGroup.get('uniqueName')?.value].push({ label: key.name, value: key?.uniqueName });
                        }
                    });
                }
                if (destinationsWarehouseFormGroup && destinationsWarehouseFormGroup.get('uniqueName')?.value) {
                    setTimeout(() => {
                        this.branchTransferCreateEditForm.get('destinations.0.warehouse.uniqueName').setValue(destinationsWarehouseFormGroup.get('uniqueName')?.value)
                    }, 100);
                }
            }
        }
        this.detectChanges();
    }

    private branchExists(branchUniqueName: string, branches: any): boolean {
        const branchExists = branches?.filter(branch => branch?.uniqueName === branchUniqueName);
        return (branchExists?.length);
    }

    public onClearProductName(event: any): void {
        if (event) {
            if (!event?.value) {
                // this.branchTransferCreateEditForm.get('transporterDetails.transporterName').setValue(null);
                // this.branchTransferCreateEditForm.get('transporterDetails.transporterId').setValue(null);
            }

        }
    }

    public selectProduct(event: any, product: any, index?: number): void {
        if (event && event.additional) {
            const productArray = this.branchTransferCreateEditForm.get('products') as UntypedFormArray;
            const productFormGroup = productArray?.at(index) as UntypedFormGroup;
            const productStockDetailsFormGroup = productFormGroup.get('stockDetails') as UntypedFormGroup;
            productFormGroup.get('name')?.setValue(event.additional.name);
            productFormGroup.get('uniqueName')?.setValue(event.additional.uniqueName);
            productStockDetailsFormGroup.get('stockUnit')?.setValue(event.additional.stockUnit);
            productStockDetailsFormGroup.get('stockUnitUniqueName')?.setValue(event.additional.stockUnit.uniqueName);
            productStockDetailsFormGroup.get('rate')?.setValue(0);
            this.inventoryService.GetStockDetails(event.additional.stockGroup?.uniqueName, event.value).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
                if (response?.status === 'success') {
                    productStockDetailsFormGroup.get('rate')?.setValue(response?.body?.purchaseAccountDetails?.unitRates[0]?.rate);
                    if (!response?.body?.purchaseAccountDetails) {
                        productStockDetailsFormGroup.get('stockUnitUniqueName')?.setValue(response?.body?.stockUnit?.uniqueName);
                        productStockDetailsFormGroup.get('stockUnit')?.setValue(response?.body?.stockUnit?.code);
                    } else {
                        productStockDetailsFormGroup.get('stockUnitUniqueName')?.setValue(response?.body?.purchaseAccountDetails?.unitRates[0]?.stockUnitUniqueName);
                        productStockDetailsFormGroup.get('stockUnit')?.setValue(response?.body?.purchaseAccountDetails?.unitRates[0]?.stockUnitCode);
                    }
                    this.calculateRowTotal(product, index);
                }
            });
            productStockDetailsFormGroup.get('quantity')?.setValue(productStockDetailsFormGroup.get('quantity')?.value || 1);
            productStockDetailsFormGroup.get('skuCode')?.setValue(event.additional.skuCode);

            if (event.additional?.hsnNumber && event.additional?.sacNumber) {
                if (this.inventorySettings?.manageInventory) {
                    productStockDetailsFormGroup.get('hsnNumber')?.setValue(event.additional.hsnNumber);
                    productStockDetailsFormGroup.get('showCodeType')?.setValue("hsn");
                } else {
                    productStockDetailsFormGroup.get('sacNumber')?.setValue(event.additional.sacNumber);
                    productStockDetailsFormGroup.get('showCodeType')?.setValue("sac");
                }
            } else if (event.additional?.hsnNumber && !event.additional?.sacNumber) {
                productStockDetailsFormGroup.get('hsnNumber')?.setValue(event.additional.hsnNumber);
                productStockDetailsFormGroup.get('showCodeType')?.setValue("hsn");
            } else if (!event.additional?.hsnNumber && event.additional?.sacNumber) {
                productStockDetailsFormGroup.get('sacNumber')?.setValue(event.additional.sacNumber);
                productStockDetailsFormGroup.get('showCodeType')?.setValue("sac");
            } else if (!event.additional?.hsnNumber && !event.additional?.sacNumber) {
                if (this.inventorySettings?.manageInventory) {
                    productStockDetailsFormGroup.get('hsnNumber')?.setValue("");
                    productStockDetailsFormGroup.get('showCodeType')?.setValue("hsn");
                } else {
                    productStockDetailsFormGroup.get('sacNumber')?.setValue("");
                    productStockDetailsFormGroup.get('showCodeType')?.setValue("sac");
                }
            }

            if (this.transferType === 'senders') {
                const sourcesArray = this.branchTransferCreateEditForm.get('sources') as UntypedFormArray;
                const sourceFormGroup = sourcesArray?.at(index) as UntypedFormGroup;
                const sourcesWarehouseFormGroup = sourceFormGroup.get('warehouse') as UntypedFormGroup;
                const destinationsArray = this.branchTransferCreateEditForm.get('destinations') as UntypedFormArray;
                const destinationsFormGroup = destinationsArray?.at(index) as UntypedFormGroup;
                const destinationsWarehouseFormGroup = destinationsFormGroup.get('warehouse') as UntypedFormGroup;
                destinationsWarehouseFormGroup.get('stockDetails.stockUnit')?.setValue(event.additional.stockUnit.code);
                destinationsWarehouseFormGroup.get('stockDetails.stockUnitUniqueName')?.setValue(event.additional.stockUnit.uniqueName);
                sourcesWarehouseFormGroup.get('stockDetails.stockUnit')?.setValue(event.additional.stockUnit.code);
                sourcesWarehouseFormGroup.get('stockDetails.stockUnitUniqueName')?.setValue(event.additional.stockUnit.uniqueName);
                this.focusDefaultSource();
            }

            setTimeout(() => {
                // if (this.productDescription && this.productDescription.nativeElement) {
                //     this.productDescription.nativeElement.focus();
                // }
            }, 200);
        }
    }

    public calculateRowTotal(product: any, index?: number): void {
        const productArray = this.branchTransferCreateEditForm.get('products') as UntypedFormArray;
        const productsFormGroup = productArray?.at(index) as UntypedFormGroup;
        const productStockDetailsFormGroup = productsFormGroup.get('stockDetails') as UntypedFormGroup;
        if (product) {
            if (!isNaN(parseFloat(productStockDetailsFormGroup.get('rate')?.value)) && !isNaN(parseFloat(productStockDetailsFormGroup.get('quantity')?.value))) {
                productStockDetailsFormGroup.get('amount')?.setValue(parseFloat(productStockDetailsFormGroup.get('rate')?.value) * parseFloat(productStockDetailsFormGroup.get('quantity')?.value));
                if (isNaN(parseFloat(productStockDetailsFormGroup.get('amount')?.value))) {
                    productStockDetailsFormGroup.get('amount')?.setValue(0);
                } else {
                    productStockDetailsFormGroup.get('amount')?.setValue(Number(this.generalService.convertExponentialToNumber(parseFloat(productStockDetailsFormGroup.get('amount')?.value).toFixed(this.giddhBalanceDecimalPlaces))));
                }
            } else {
                if (isNaN(parseFloat(productStockDetailsFormGroup.get('rate')?.value))) {
                    productStockDetailsFormGroup.get('rate')?.setValue(0);
                }
                if (isNaN(parseFloat(productStockDetailsFormGroup.get('quantity')?.value))) {
                    productStockDetailsFormGroup.get('quantity')?.setValue(0);
                }
                productStockDetailsFormGroup.get('amount')?.setValue(0);
            }
        }
        this.calculateOverallTotal();
    }

    public calculateOverallTotal(): void {
        this.overallTotal = 0;
        if (this.transferType === 'products') {
            const productArray = this.branchTransferCreateEditForm.get('products') as UntypedFormArray;
            for (let i = 0; i < productArray.length; i++) {
                const productFormGroup = productArray.at(i) as UntypedFormGroup;
                const productStockDetailsFormGroup = productFormGroup.get('stockDetails') as UntypedFormGroup;
                let overallTotal = 0;
                if (!isNaN(parseFloat(productStockDetailsFormGroup.get('rate')?.value)) && !isNaN(parseFloat(productStockDetailsFormGroup.get('quantity')?.value))) {
                    overallTotal = parseFloat(productStockDetailsFormGroup.get('rate')?.value) * parseFloat(productStockDetailsFormGroup.get('quantity')?.value);
                    if (isNaN(overallTotal)) {
                        overallTotal = 0;
                    }
                } else {
                    overallTotal = 0;
                }
                this.overallTotal += Number(this.generalService.convertExponentialToNumber((overallTotal)));
            }
        } else if (this.transferType !== 'products' && this.branchTransferMode === 'delivery-challan') {
            const destinationsArray = this.branchTransferCreateEditForm.get('destinations') as UntypedFormArray;
            for (let i = 0; i < destinationsArray.length; i++) {
                const destinationsFormGroup = destinationsArray?.at(i) as UntypedFormGroup;
                const destinationsStockDetailsFormGroup = destinationsFormGroup.get('warehouse.stockDetails') as UntypedFormGroup;
                let overallTotal = 0;
                if (!isNaN(parseFloat(destinationsStockDetailsFormGroup.get('rate')?.value)) && !isNaN(parseFloat(destinationsStockDetailsFormGroup.get('quantity')?.value))) {
                    overallTotal = parseFloat(destinationsStockDetailsFormGroup.get('rate')?.value) * parseFloat(destinationsStockDetailsFormGroup.get('quantity')?.value);
                    if (isNaN(overallTotal)) {
                        overallTotal = 0;
                    }
                } else {
                    overallTotal = 0;
                }
                this.overallTotal += Number(this.generalService.convertExponentialToNumber((overallTotal)));
            }
        } else if (this.transferType !== 'products' && this.branchTransferMode === 'receipt-note') {
            const sourcesArray = this.branchTransferCreateEditForm.get('sources') as UntypedFormArray;
            for (let i = 0; i < sourcesArray.length; i++) {
                const sourcesFormGroup = sourcesArray?.at(i) as UntypedFormGroup;
                const sourcesStockDetailsFormGroup = sourcesFormGroup.get('warehouse.stockDetails') as UntypedFormGroup;
                let overallTotal = 0;
                if (!isNaN(parseFloat(sourcesStockDetailsFormGroup.get('rate')?.value)) && !isNaN(parseFloat(sourcesStockDetailsFormGroup.get('quantity')?.value))) {
                    overallTotal = parseFloat(sourcesStockDetailsFormGroup.get('rate')?.value) * parseFloat(sourcesStockDetailsFormGroup.get('quantity')?.value);
                    if (isNaN(overallTotal)) {
                        overallTotal = 0;
                    }
                } else {
                    overallTotal = 0;
                }
                this.overallTotal += Number(this.generalService.convertExponentialToNumber((overallTotal)));
            }
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

        this.dialog.open(this.asideManageTransport, {
            position: {
                right: '0',
                top: '0'
            },
            width: '760px',
            height: '100vh !important'
        });
    }

    public deleteTransporter(transporter: IEwayBillTransporter): void {
        this.store.dispatch(this.invoiceActions.deleteTransporter(transporter.transporterId));
        this.store.dispatch(this.invoiceActions.getALLTransporterList(this.transporterFilterRequest));
        this.toggleTransporterModel();
        this.detectChanges();
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

    public detectChanges(): void {
        if (!this.changeDetection['destroyed']) {
            this.changeDetection.detectChanges();
        }
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

