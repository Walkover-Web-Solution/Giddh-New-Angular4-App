import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { UntypedFormGroup, UntypedFormArray, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { CommonActions } from 'apps/web-giddh/src/app/actions/common.actions';
import { InventoryAction } from 'apps/web-giddh/src/app/actions/inventory/inventory.actions';
import { InvoiceActions } from 'apps/web-giddh/src/app/actions/invoice/invoice.actions';
import { PAGINATION_LIMIT } from 'apps/web-giddh/src/app/app.constant';
import { cloneDeep, isEmpty } from 'apps/web-giddh/src/app/lodash-optimized';
import { ILinkedStocksResult, LinkedStocksResponse, LinkedStocksVM } from 'apps/web-giddh/src/app/models/api-models/BranchTransfer';
import { OnboardingFormRequest } from 'apps/web-giddh/src/app/models/api-models/Common';
import { IAllTransporterDetails, IEwayBillTransporter, IEwayBillfilter } from 'apps/web-giddh/src/app/models/api-models/Invoice';
import { InvoiceSetting } from 'apps/web-giddh/src/app/models/interfaces/invoice.setting.interface';
import { OrganizationType } from 'apps/web-giddh/src/app/models/user-login-state';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { InventoryService } from 'apps/web-giddh/src/app/services/inventory.service';
import { InvoiceService } from 'apps/web-giddh/src/app/services/invoice.service';
import { SettingsWarehouseService } from 'apps/web-giddh/src/app/services/settings.warehouse.service';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { GIDDH_DATE_FORMAT } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import { transporterModes } from 'apps/web-giddh/src/app/shared/helpers/transporterModes';
import { AppState } from 'apps/web-giddh/src/app/store';
import { IOption } from 'apps/web-giddh/src/app/theme/ng-virtual-select/sh-options.interface';
import * as dayjs from 'dayjs';
import { Observable, ReplaySubject, of as observableOf } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-create-branch-transfer',
    templateUrl: './create-branch-transfer.component.html',
    styleUrls: ['./create-branch-transfer.component.scss']
})
export class CreateBranchTransferComponent implements OnInit, OnDestroy {
    /** Close the  HSN/SAC Opened Menu*/
    @ViewChild('hsnSacMenuTrigger') hsnSacMenuTrigger: MatMenuTrigger;
    /** Close the  HSN/SAC Opened Menu*/
    @ViewChild('skuMenuTrigger') skuMenuTrigger: MatMenuTrigger;
    /** Instance for aside menu for product service and account*/
    @ViewChild("asideMenuProductService") public asideMenuProductService: TemplateRef<any>;
    /** Instance for aside menu for Manage Transport*/
    @ViewChild("asideManageTransport") public asideManageTransport: TemplateRef<any>;
    /** Service dropdown instance */
    @ViewChildren('selectAccount') public selectAccount: QueryList<ElementRef>;
    /** UntypedFormArray Group for group UntypedFormArray */
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
    public branchTransferMode: string = 'receipt-note';
    /* this will hold overall total amount */
    public overallTotal: number = 0;
    /** Holds if Multiple Products/Senders selected */
    public transferType: string = 'products';
    /** For Active row index */
    public activeIndx: number;
    /** Hold  edit branch transfer uniqueName*/
    public editBranchTransferUniqueName: string = '';
    /** Hold  temp data query params*/
    public tempDateParams: any = { dateOfSupply: new Date(), dispatchedDate: '' };
    /** Hold  stock list data */
    public stockList: IOption[] = [];
    /** Hold  stock list data */
    public stockVariants: any[] = [];
    /** Hold  stock unitsdata */
    public stockUnits: any[] = [];
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
    /** Emit transport filter request*/
    public transporterFilterRequest: IEwayBillfilter = new IEwayBillfilter();
    /** Hold transported dropdown*/
    public transporterDropdown: IOption[] = [];
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
    /** This will use for transporter logs object */
    public transporterObj = {
        count: PAGINATION_LIMIT,
        page: 1,
        totalPages: 0,
        totalItems: 0
    }
    /** Stores the default search results pagination details */
    public defaultStockPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** True, if API call should be prevented on default scroll caused by scroll in list */
    public preventDefaultScrollApiCall: boolean = false;
    /** Default search suggestion list to be shown for search */
    public defaultStockSuggestions: Array<IOption> = [];
    /** Stores the search results pagination details */
    public stocksSearchResultsPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Holds if UntypedFormArray is valid or not */
    public isValidForm: boolean = true;
    /** This will hold dropdown is active */
    public openCustomerDropdown: boolean = false;
    /** This will hold dropdown is active */
    public showContent: boolean = false;
    /** Stock Units list */
    public stockUnitResults: any[] = [];
    /** This will store universalDate */
    public universalDate: any;
    /** This will hold today selected */
    public todaySelected: boolean = false;
    /** Universal date observer */
    public universalDate$: Observable<any>;
    /** Today date observer */
    public todaySelected$: Observable<boolean> = observableOf(false);
    /** This will hold universal  from */
    public universalFrom: any;
    /** This will hold universal date  */
    public universalTo: any;

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
        public dialog: MatDialog,
        private invoiceServices: InvoiceService
    ) {
        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));
        this.todaySelected$ = this.store.pipe(select(p => p.session.todaySelected), takeUntil(this.destroyed$));
    }

    /**
     * This will use for component initialization
     *
     * @memberof CreateBranchTransferComponent
     */
    public ngOnInit(): void {
        /* added image path */
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            if (params?.type) {
                this.showContent = false;
                this.initBranchTransferForm();
                this.store.dispatch(this.invoiceActions.getInvoiceSetting());
                this.store.dispatch(this.invoiceActions.resetTransporterListResponse());
                this.getTransportersList();
                this.loadDefaultStocksSuggestions();
                this.getInventorySettings();
                this.editBranchTransferUniqueName = params.uniqueName;
                this.branchTransferMode = params.type;
                this.transferType = 'products';
                /** Universal date observer */
                this.universalDate$.pipe(takeUntil(this.destroyed$)).subscribe(dateObj => {
                    if (dateObj) {
                        let universalDate = _.cloneDeep(dateObj);
                        setTimeout(() => {
                            this.store.pipe(select(state => state.session.todaySelected), take(1)).subscribe(response => {
                                this.todaySelected = response;
                                this.universalFrom = dayjs(universalDate[0]);
                                this.universalTo = dayjs(universalDate[1]);
                                if (universalDate && !this.todaySelected) {
                                    this.selectDate(this.universalTo, 'dateOfSupply')
                                    this.detectChanges();
                                } else {
                                    this.selectDate(this.universalTo, 'dateOfSupply')
                                    this.detectChanges();
                                }
                                this.detectChanges();
                            });
                        }, 100);
                    }
                });
                this.getBranches();
                transporterModes.map(response => {
                    this.transporterMode.push({ label: response.label, value: response.value });
                });

                if (this.editBranchTransferUniqueName) {
                    this.isDefaultLoad = true;
                }
                this.isBranch = this.generalService.currentOrganizationType === OrganizationType.Branch;
                this.isCompanyWithSingleBranch = this.generalService.currentOrganizationType === OrganizationType.Company && this.branches && this.branches.length === 1;
                setTimeout(() => {
                    this.showContent = true;
                    this.detectChanges();
                }, 10);
            }
        });
        this.store.pipe(select(select => select.settings.profile), takeUntil(this.destroyed$)).subscribe((response) => {
            if (response && !isEmpty(response)) {
                let companyInfo = cloneDeep(response);
                this.activeCompany = companyInfo;
                this.inputMaskFormat = this.activeCompany.balanceDisplayFormat ? this.activeCompany.balanceDisplayFormat.toLowerCase() : '';
                this.getOnboardingForm(companyInfo?.countryV2?.alpha2CountryCode);
                this.giddhBalanceDecimalPlaces = response.balanceDecimalPlaces;
            }
        });
    }

    /**
     * This will use for get inventory settings
     *
     * @memberof CreateBranchTransferComponent
     */
    public getInventorySettings(): void {
        this.store.pipe(select((select: AppState) => select.invoice.settings), takeUntil(this.destroyed$)).subscribe((settings: InvoiceSetting) => {
            if (settings && settings.companyInventorySettings) {
                this.inventorySettings = settings.companyInventorySettings;
            }
        });
    }

    /**
     * This will use for init main formgroup
     *
     * @private
     * @memberof CreateBranchTransferComponent
     */
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

    /**
     * This will be use for init source UntypedFormArray group
     *
     * @return {*}  {UntypedFormGroup}
     * @memberof CreateBranchTransferComponent
     */
    public initSourceFormGroup(): UntypedFormGroup {
        return this.formBuilder.group({
            name: ['', Validators.required],
            uniqueName: [''],
            warehouse: this.formBuilder.group({
                name: ['', Validators.required],
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

    /**
     *This will be use for destination UntypedFormArray group
     *
     * @return {*}  {UntypedFormGroup}
     * @memberof CreateBranchTransferComponent
     */
    public initDestinationFormGroup(): UntypedFormGroup {
        return this.formBuilder.group({
            name: ['', Validators.required],
            uniqueName: [''],
            warehouse: this.formBuilder.group({
                name: ['', Validators.required],
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

    /**
     *This will be use for product UntypedFormArray group
     *
     * @return {*}  {UntypedFormGroup}
     * @memberof CreateBranchTransferComponent
     */
    public initProductFormGroup(): UntypedFormGroup {
        return this.formBuilder.group({
            name: ['', Validators.required],
            hsnNumber: [''],
            sacNumber: [''],
            showCodeType: [''],
            skuCode: [''],
            uniqueName: [''],
            description: [''],
            variant: this.formBuilder.group({
                name: [''],
                uniqueName: ['']
            }),
            stockDetails: this.formBuilder.group({
                stockUnitUniqueName: [''],
                stockUnit: [''],
                amount: [''],
                rate: [''],
                quantity: ['']
            }),
        });
    }

    /**
     *This will be use for set active product row
     *
     * @param {number} index
     * @memberof CreateBranchTransferComponent
     */
    public setActiveRow(index: number): void {
        if (this.activeIndx !== index) {
            this.loadDefaultStocksSuggestions();
        }
        this.activeIndx = index;
    }

    /**
     * This will be use for select date
     *
     * @param {*} date
     * @param {*} dateField
     * @memberof CreateBranchTransferComponent
     */
    public selectDate(date: any, dateField: any): void {
        this.tempDateParams.dateOfSupply = date;
        if (date) {
            let formatDate = dayjs(date).format(GIDDH_DATE_FORMAT);
            if (dateField === 'dateOfSupply') {
                this.branchTransferCreateEditForm.get('dateOfSupply').setValue(formatDate);
            }
            if (dateField === 'dispatchedDate') {
                this.branchTransferCreateEditForm.get('transporterDetails.dispatchedDate')?.setValue(formatDate);
            }
        }
    }

    /**
     *This will be use for hide active row
     *
     * @param {*} event
     * @memberof CreateBranchTransferComponent
     */
    public hideActiveRow(event: any): void {
        if (event?.target?.nodeName !== "MAT-OPTION" && event?.target?.nodeName !== "SPAN") {
            this.activeIndx = null;
        }
    }

    /**
     *This will be use for navigate to branch transfer list
     *
     * @memberof CreateBranchTransferComponent
     */
    public navigateToList(): void {
        this.router.navigate(['/pages', 'inventory', 'v2', 'branch-transfer', 'list']);
    }

    /**
     * Thiw will be use for submit main UntypedFormArray
     *
     * @memberof CreateBranchTransferComponent
     */
    public submit(): void {
        const sourcesArray = this.branchTransferCreateEditForm.get('sources') as UntypedFormArray;
        for (let i = 0; i < sourcesArray.length; i++) {
            const sourcesFormGroup = sourcesArray.at(i) as UntypedFormGroup;
            const sourcesWarehouseFormGroup = sourcesFormGroup?.get('warehouse') as UntypedFormGroup;
            if (sourcesWarehouseFormGroup && sourcesWarehouseFormGroup?.get('address')?.value) {
                const [address, pin] = sourcesWarehouseFormGroup?.get('address')?.value?.split('\nPIN: ');
                sourcesWarehouseFormGroup.get('address')?.patchValue(address);
                sourcesWarehouseFormGroup.get('pincode')?.patchValue(pin);
            }
        }
        const destinationsArray = this.branchTransferCreateEditForm.get('destinations') as UntypedFormArray;
        for (let i = 0; i < destinationsArray.length; i++) {
            const destinationsFormGroup = destinationsArray.at(i) as UntypedFormGroup;
            const destianationsWarehouseFormGroup = destinationsFormGroup?.get('warehouse') as UntypedFormGroup;

            if (destianationsWarehouseFormGroup && destianationsWarehouseFormGroup?.get('address').value) {
                const [address, pin] = destianationsWarehouseFormGroup?.get('address').value?.split('\nPIN: ');
                destianationsWarehouseFormGroup.get('address')?.patchValue(address);
                destianationsWarehouseFormGroup.get('pincode')?.patchValue(pin);
            }
        }
        const productsArray = this.branchTransferCreateEditForm.get('products') as UntypedFormArray;
        for (let i = 0; i < productsArray.length; i++) {
            const productFormGroup = productsArray.at(i) as UntypedFormGroup;
            if (productFormGroup.get('showCodeType').value === "hsn") {
                productFormGroup.get('sacNumber').patchValue("");
            } else {
                productFormGroup.get('hsnNumber').patchValue("");
            }
        }
        if (this.transferType === 'senders') {
            const destinationsArray = this.branchTransferCreateEditForm.get('destinations') as UntypedFormArray;
            const sourcesArray = this.branchTransferCreateEditForm.get('sources') as UntypedFormArray;
            for (let i = 0; i < destinationsArray.length; i++) {
                const destinationsFormGroup = destinationsArray?.at(i) as UntypedFormGroup;
                const destianationsWarehouseFormGroup = destinationsFormGroup?.get('warehouse.stockDetails') as UntypedFormGroup;
                const sourcesFormGroup = sourcesArray?.at(0) as UntypedFormGroup;
                const sourcesWarehouseFormGroup = sourcesFormGroup?.get('warehouse.stockDetails') as UntypedFormGroup;
                if (destianationsWarehouseFormGroup.get('amount').value === null) {
                    destianationsWarehouseFormGroup.get('amount').patchValue(sourcesWarehouseFormGroup.get('amount').value);
                    destianationsWarehouseFormGroup.get('quantity').patchValue(sourcesWarehouseFormGroup.get('quantity').value);
                    destianationsWarehouseFormGroup.get('rate').patchValue(sourcesWarehouseFormGroup.get('rate').value);
                }
                if (destianationsWarehouseFormGroup.get('stockUnitUniqueName').value === null) {
                    destianationsWarehouseFormGroup.get('stockUnit').patchValue(sourcesWarehouseFormGroup.get('stockUnit').value);
                    destianationsWarehouseFormGroup.get('stockUnitUniqueName').patchValue(sourcesWarehouseFormGroup.get('stockUnitUniqueName').value);
                }
            }
            for (let i = 0; i < sourcesArray.length; i++) {
                const sourcesFormGroup = sourcesArray?.at(i) as UntypedFormGroup;
                const sourcesWarehouseFormGroup = sourcesFormGroup?.get('warehouse.stockDetails') as UntypedFormGroup;
                const destinationsArray = this.branchTransferCreateEditForm.get('destinations') as UntypedFormArray;
                const destinationsFormGroup = destinationsArray?.at(0) as UntypedFormGroup;
                const destianationsWarehouseFormGroup = destinationsFormGroup?.get('warehouse.stockDetails') as UntypedFormGroup;
                if (sourcesWarehouseFormGroup.get('amount').value === null) {
                    sourcesWarehouseFormGroup.get('amount').patchValue(destianationsWarehouseFormGroup.get('amount').value);
                    sourcesWarehouseFormGroup.get('quantity').patchValue(destianationsWarehouseFormGroup.get('quantity').value);
                    sourcesWarehouseFormGroup.get('stockUnit').patchValue(destianationsWarehouseFormGroup.get('stockUnit').value);
                    sourcesWarehouseFormGroup.get('stockUnitUniqueName').patchValue(destianationsWarehouseFormGroup.get('stockUnitUniqueName').value);
                }
                if (sourcesWarehouseFormGroup.get('stockUnitUniqueName').value === null) {
                    sourcesWarehouseFormGroup.get('stockUnit').patchValue(destianationsWarehouseFormGroup.get('stockUnit').value);
                    sourcesWarehouseFormGroup.get('stockUnitUniqueName').patchValue(destianationsWarehouseFormGroup.get('stockUnitUniqueName').value);
                }
            }
        }
        let branchMode = '';
        if (this.branchTransferMode === 'receipt-note') {
            branchMode = 'receiptnote';
        } else {
            branchMode = 'deliverynote';
        }
        this.branchTransferCreateEditForm.get('transferType').setValue(this.transferType);
        this.branchTransferCreateEditForm.get('entity').setValue(branchMode);
        this.branchTransferCreateEditForm.removeControl('myControlKey');
        let branchTransferObj = this.branchTransferCreateEditForm.value;
        delete branchTransferObj.myCurrentCompany
        this.isValidForm = !this.branchTransferCreateEditForm.invalid;
        this.isLoading = true;
        if (this.isValidForm) {
            if (this.editBranchTransferUniqueName) {
                this.inventoryService.updateNewBranchTransfer(branchTransferObj).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                    this.isLoading = false;
                    if (res) {
                        if (res.status === 'success') {
                            if (this.branchTransferMode === 'receipt-note') {
                                this.toasty.showSnackBar("success", 'Receipt Note has been updated successfully.');
                            } else {
                                this.toasty.showSnackBar("success", 'Delivery Challan has been updated successfully.');
                            }
                            this.router.navigate(['/pages', 'inventory', 'v2', 'branch-transfer', 'list']);
                        } else {
                            this.toasty.showSnackBar("error", res.message, res.code);
                        }
                    } else {
                        this.toasty.showSnackBar("error", this.commonLocaleData.app_something_went_wrong);
                        if (this.branchTransferMode === 'receiptnote') {
                            this.branchTransferMode = 'receipt-note';
                        } else {
                            this.branchTransferMode = 'delivery-challan';
                        }
                    }
                });
            } else {
                this.inventoryService.createNewBranchTransfer(branchTransferObj).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                    this.isLoading = false;
                    this.branchTransferCreateEditForm.addControl('myCurrentCompany', this.formBuilder.control(''));
                    if (res) {
                        if (res.status === 'success') {
                            if (this.branchTransferMode === 'receipt-note') {
                                this.toasty.showSnackBar("success", 'Receipt Note has been updated successfully.');
                            } else {
                                this.toasty.showSnackBar("success", 'Delivery Challan has been updated successfully.');
                            }
                            this.router.navigate(['/pages', 'inventory', 'v2', 'branch-transfer', 'list']);
                        } else {
                            this.toasty.showSnackBar("error", res.message, res.code);
                        }
                    } else {
                        this.toasty.showSnackBar("error", this.commonLocaleData.app_something_went_wrong);
                        if (this.branchTransferMode === 'receiptnote') {
                            this.branchTransferMode = 'receipt-note';
                        } else {
                            this.branchTransferMode = 'delivery-challan';
                        }
                    }
                });
            }
        }
    }

    /**
     *This will be use for get tax placeholder
     *
     * @return {*}  {string}
     * @memberof CreateBranchTransferComponent
     */
    public getEnterTaxText(): string {
        let text = 'Enter Tax';
        text = text?.replace("[TAX_NAME]", this.formFields['taxName']?.label);
        return text;
    }

    /**
     * This will be use for checkTaxNumberValidation
     *
     * @memberof CreateBranchTransferComponent
     */
    public checkTaxNumberValidation(): void {
        let isValid: boolean = false;
        const sourcesArray = this.branchTransferCreateEditForm?.get('sources') as UntypedFormArray;
        const warehouseFormGroup = sourcesArray?.at(0)?.get('warehouse') as UntypedFormGroup;
        const taxNumberValue = warehouseFormGroup?.get('taxNumber')?.value;
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

    /**
     *This will be use for add sender when multiple sender selected
     *
     * @memberof CreateBranchTransferComponent
     */
    public addSender(): void {
        const sources = this.branchTransferCreateEditForm.get('sources') as UntypedFormArray;
        sources.push(this.initSourceFormGroup());
        setTimeout(() => {
            this.openDropdown('last', 'sources');
        }, 10);
    }

    /**
     *This will be use for remove sender when multiple sender selected
     *
     * @memberof CreateBranchTransferComponent
     */
    public removeSenderDetailsForm(index: number) {
        const sources = this.branchTransferCreateEditForm.get('sources') as UntypedFormArray;
        if (sources.value.length === 1) {
            sources.reset();
        } else {
            sources.removeAt(index);
        }
    }

    /**
     *This will be use for add receiver when multiple receiver selected
     *
     * @memberof CreateBranchTransferComponent
     */
    public addReceiver(): void {
        const destinations = this.branchTransferCreateEditForm.get('destinations') as UntypedFormArray;
        destinations.push(this.initDestinationFormGroup());
        setTimeout(() => {
            this.openDropdown('last', 'destinations');
        }, 10);
    }

    /**
     *This will be use for remove receiver when multiple receiver selected
     *
     * @memberof CreateBranchTransferComponent
     */
    public removeReceiverDetailsForm(index: number) {
        const destinations = this.branchTransferCreateEditForm.get('destinations') as UntypedFormArray;
        if (destinations.value.length === 1) {
            destinations.reset();
        } else {
            destinations.removeAt(index);
        }
    }

    /**
     * This will be use for add product in active row
     *
     * @memberof CreateBranchTransferComponent
     */
    public addBlankProductsForm(): void {
        const products = this.branchTransferCreateEditForm.get('products') as UntypedFormArray;
        products.push(this.initProductFormGroup());
        setTimeout(() => {
            this.openDropdown('last', 'products');
        }, 10);
    }

    /**
     * This will be use for open dropdown according to type and first and last
     *
     * @memberof CreateBranchTransferComponent
     */
    public openDropdown(entry: string, type: string): void {
        let formArrayLength;
        if (type === 'products') {
            const productsArray = this.branchTransferCreateEditForm.get('products') as UntypedFormArray;
            formArrayLength = productsArray?.controls?.length;
        }
        if (type === 'sources') {
            const sourcesArray = this.branchTransferCreateEditForm.get('sources') as UntypedFormArray;
            formArrayLength = sourcesArray?.controls?.length;
        }
        if (type == 'destinations') {
            const destinationsArray = this.branchTransferCreateEditForm.get('destinations') as UntypedFormArray;
            formArrayLength = destinationsArray?.controls?.length;
        }
        if (entry === 'first') {
            this.setActiveRow(0);
        } else {
            this.setActiveRow(formArrayLength - 1);
        }
        setTimeout(() => {
            const firstEntry: any = this.selectAccount?.first;
            firstEntry?.openDropdownPanel();
        });
    }

    /**
     * This will be use for remove product in active row
     *
     * @memberof CreateBranchTransferComponent
     */
    public removeProductDetailsForm(index: number) {
        const products = this.branchTransferCreateEditForm.get('products') as UntypedFormArray;
        if (products.value.length === 1) {
            products.reset();
        } else {
            products.removeAt(index);
        }
    }

    /**
     * This will be use for stock search query
     *
     * @param {string} query
     * @param {number} [page=1]
     * @param {Function} [successCallback]
     * @memberof CreateBranchTransferComponent
     */
    public onStockSearchQueryChanged(query: string, page: number = 1, successCallback?: Function): void {
        this.stocksSearchResultsPaginationData.query = query;
        if (!this.preventDefaultScrollApiCall &&
            (query || (this.defaultStockSuggestions && this.defaultStockSuggestions.length === 0) || successCallback)) {
            // Call the API when either query is provided, default suggestions are not present or success callback is provided
            const requestObject: any = {
                q: encodeURIComponent(query),
                page
            }
            this.inventoryService.GetStocks(requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
                if (data && data.body && data.body.results) {
                    const searchResults = data.body.results.map(result => {
                        return {
                            value: result?.uniqueName,
                            label: result.name,
                            additional: result
                        }
                    }) || [];
                    if (page === 1) {
                        this.stockList = searchResults;
                    } else {
                        this.stockList = [
                            ...this.stockList,
                            ...searchResults
                        ];
                    }
                    this.stockList = this.stockList;
                    this.stocksSearchResultsPaginationData.page = data.body.page;
                    this.stocksSearchResultsPaginationData.totalPages = data.body.totalPages;
                    if (successCallback) {
                        successCallback(data.body.results);
                    } else {
                        this.defaultStockPaginationData.page = this.stocksSearchResultsPaginationData.page;
                        this.defaultStockPaginationData.totalPages = this.stocksSearchResultsPaginationData.totalPages;
                    }
                    this.detectChanges();
                }
            });
        } else {
            this.stockList = [...this.defaultStockSuggestions];
            this.stocksSearchResultsPaginationData.page = this.defaultStockPaginationData.page;
            this.stocksSearchResultsPaginationData.totalPages = this.defaultStockPaginationData.totalPages;
            this.preventDefaultScrollApiCall = true;
            setTimeout(() => {
                this.preventDefaultScrollApiCall = false;
                this.detectChanges();
            }, 500);
        }
    }

    /**
     * This will use for handle scroll end for products
     *
     * @memberof CreateBranchTransferComponent
     */
    public handleScrollEnd(): void {
        if (this.stocksSearchResultsPaginationData.page < this.stocksSearchResultsPaginationData.totalPages) {
            this.onStockSearchQueryChanged(
                this.stocksSearchResultsPaginationData.query,
                this.stocksSearchResultsPaginationData.page + 1,
                (response) => {
                    if (!this.stocksSearchResultsPaginationData.query) {
                        const results = response.map(result => {
                            return {
                                value: result?.uniqueName,
                                label: result.name,
                                additional: result
                            }
                        }) || [];
                        this.defaultStockSuggestions = this.defaultStockSuggestions.concat(...results);
                        this.defaultStockPaginationData.page = this.stocksSearchResultsPaginationData.page;
                        this.defaultStockPaginationData.totalPages = this.stocksSearchResultsPaginationData.totalPages;
                        this.detectChanges();
                    }
                });
        }
    }

    /**
     * This will be use for load default stock list
     *
     * @private
     * @memberof CreateBranchTransferComponent
     */
    private loadDefaultStocksSuggestions(): void {
        this.onStockSearchQueryChanged('', 1, (response) => {
            this.defaultStockSuggestions = response.map(result => {
                return {
                    value: result?.uniqueName,
                    label: result.name,
                    additional: result
                }
            }) || [];
            this.defaultStockPaginationData.page = this.stocksSearchResultsPaginationData.page;
            this.defaultStockPaginationData.totalPages = this.stocksSearchResultsPaginationData.totalPages;
            this.stockList = [...this.defaultStockSuggestions];
        });
    }

    /**
     *This will be use for change transfer type
     *
     * @memberof CreateBranchTransferComponent
     */
    public changeTransferType(): void {
        this.branchTransferCreateEditForm.reset();
        let dateOfSupply = dayjs(this.tempDateParams.dateOfSupply).format(GIDDH_DATE_FORMAT)
        this.branchTransferCreateEditForm.get('dateOfSupply').setValue(dateOfSupply);
        this.assignCurrentCompany();
        this.calculateOverallTotal();
        this.activeIndx = null
    }

    /**
     *This will be use for change table product transfer type
     *
     * @memberof CreateBranchTransferComponent
     */
    public handleTableCodeTypeChange(event: any, index: number): void {
        const productsArray = this.branchTransferCreateEditForm.get('products') as UntypedFormArray;
        const productFormGroup = productsArray?.at(index) as UntypedFormGroup;
        if (event.value === "hsn") {
            productFormGroup.get('hsnNumber').setValue(productFormGroup.get('sacNumber').value);
            productFormGroup.get('sacNumber').setValue('');
        } else if (event.value === "sac") {
            productFormGroup.get('sacNumber').setValue(productFormGroup.get('hsnNumber').value);
            productFormGroup.get('hsnNumber').setValue('');
        }
    }

    /**
     * This will be use for reset form
     *
     * @memberof CreateBranchTransferComponent
     */
    public resetForm(): void {
        this.branchTransferCreateEditForm.reset();
        setTimeout(() => {
            this.showContent = true;
            this.detectChanges();
        }, 10);
        this.showContent = false;
        this.isValidForm = true;
        let dateOfSupply = dayjs(this.tempDateParams.dateOfSupply).format(GIDDH_DATE_FORMAT)
        this.branchTransferCreateEditForm.get('dateOfSupply').setValue(dateOfSupply);
        this.assignCurrentCompany();
        this.calculateOverallTotal();
        this.activeIndx = null
        this.stockUnits[0] = [];
    }

    /**
     * This will be use for get braches
     *
     * @memberof CreateBranchTransferComponent
     */
    public getBranches(): void {
        this.store.dispatch(this.inventoryAction.GetAllLinkedStocks());
        this.store.pipe(select(select => select.inventoryBranchTransfer.linkedStocks), takeUntil(this.destroyed$)).subscribe((branches: LinkedStocksResponse) => {
            if (branches) {
                if (branches.results?.length) {
                    this.branches = this.linkedStocksVM(branches.results).map(branch => ({
                        label: `${branch.name}`,
                        value: branch?.uniqueName,
                        additional: branch
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

    /**
     *This will be use for get branch transfer list
     *
     * @memberof CreateBranchTransferComponent
     */
    public getBranchTransfer(): void {
        this.isUpdateMode = true;
        const sourcesArray = this.branchTransferCreateEditForm.get('sources') as UntypedFormArray;
        const destinationsArray = this.branchTransferCreateEditForm.get('destinations') as UntypedFormArray;
        const productsArray = this.branchTransferCreateEditForm.get('products') as UntypedFormArray;
        const destinationsFormGroup = destinationsArray?.at(0) as UntypedFormGroup;
        const sourcesFormGroup = sourcesArray?.at(0) as UntypedFormGroup;
        this.inventoryService.getNewBranchTransfer(this.editBranchTransferUniqueName).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response?.status === "success") {
                this.branchTransferCreateEditForm.patchValue({
                    dateOfSupply: response.body?.dateOfSupply,
                    challanNo: response.body?.challanNo,
                    uniqueName: response.body?.uniqueName,
                    note: response.body?.note,
                    entity: response.body?.entity,
                    transferType: 'products'
                });
                this.branchTransferCreateEditForm.get('transporterDetails').patchValue({
                    dispatchedDate: response.body?.transporterDetails?.dispatchedDate,
                    transporterName: this.transporterDropdown.find(res => res.value === response.body?.transporterDetails?.transporterId)?.label,
                    transporterId: response.body?.transporterDetails?.transporterId,
                    transportMode: response.body?.transporterDetails?.transportMode,
                    vehicleNumber: response.body?.transporterDetails?.vehicleNumber
                });

                (productsArray as UntypedFormArray).clear();

                response.body?.products?.forEach((product, index) => {
                    const productFormGroup = this.initProductFormGroup();
                    productFormGroup.patchValue({
                        name: product.name,
                        hsnNumber: product.hsnNumber,
                        sacNumber: product.sacNumber,
                        skuCode: product.skuCode,
                        uniqueName: product.uniqueName,
                        description: product.description
                    });

                    productFormGroup.get('variant').patchValue({
                        name: product.variant.name,
                        uniqueName: product.variant.uniqueName,
                    });

                    productFormGroup.get('stockDetails').patchValue({
                        stockUnitUniqueName: product.stockDetails.stockUnitUniqueName,
                        stockUnit: product.stockDetails.stockUnit,
                        amount: product.stockDetails.amount,
                        rate: product.stockDetails.rate,
                        quantity: product.stockDetails.quantity
                    });

                    productsArray.push(productFormGroup);
                    this.stockVariants[index] = [];
                    this.stockVariants[index].push(productFormGroup.get('variant'));

                    let stockObj = {
                        label: productFormGroup.get('name').value,
                        value: productFormGroup.get('uniqueName').value,
                        additional: productFormGroup.value
                    }
                    this.selectProduct(stockObj, productFormGroup, true, index);
                });

                response.body?.sources?.forEach(source => {
                    for (let i = 0; i < sourcesArray.length; i++) {
                        const sourcesFormGroup = sourcesArray.at(i);
                        sourcesFormGroup.patchValue({
                            name: source.name,
                            uniqueName: source.uniqueName,
                        });
                        sourcesFormGroup.get('warehouse').patchValue({
                            name: source.warehouse.name,
                            uniqueName: source.warehouse.uniqueName,
                            taxNumber: source.warehouse.taxNumber,
                            address: source.warehouse.address
                        })
                    }
                });

                response.body?.destinations?.forEach(destination => {
                    for (let i = 0; i < destinationsArray.length; i++) {
                        const destinationsFormGroup = destinationsArray.at(i);
                        destinationsFormGroup.patchValue({
                            name: destination.name,
                            uniqueName: destination.uniqueName,
                        });
                        destinationsFormGroup.get('warehouse').patchValue({
                            name: destination.warehouse.name,
                            uniqueName: destination.warehouse.uniqueName,
                            taxNumber: destination.warehouse.taxNumber,
                            address: destination.warehouse.address
                        })
                    }
                });

                let allWarehouses = [];
                if (Object.keys(this.allWarehouses)?.length > 0) {
                    const usedWarehouses = [];
                    if (sourcesArray && sourcesArray.length > 0) {
                        for (let i = 0; i < sourcesArray.length; i++) {
                            const branch = sourcesArray.at(i);
                            if (branch && branch.get('warehouse.uniqueName')) {
                                usedWarehouses.push(branch.get('warehouse.uniqueName')?.value);
                            }
                        }
                    }

                    if (destinationsArray && destinationsArray.length > 0) {
                        for (let i = 0; i < destinationsArray.length; i++) {
                            const branch = destinationsArray.at(i);

                            if (branch && branch.get('warehouse.uniqueName')) {
                                usedWarehouses.push(branch.get('warehouse.uniqueName')?.value);
                            }
                        }
                    }

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

                for (let i = 0; i < sourcesArray.length; i++) {
                    const source = sourcesArray.at(i);
                    if (source && source.get('warehouse.address')?.value) {
                        const pin = source.get('warehouse.pincode')?.value;
                        if (pin) {
                            const currentAddress = source.get('warehouse.address')?.value;
                            source.get('warehouse.address')?.setValue(`${currentAddress}\nPIN: ${pin}`);
                        }
                    }
                }

                for (let i = 0; i < destinationsArray.length; i++) {
                    const destination = destinationsArray.at(i);
                    if (destination && destination.get('warehouse.address')?.value) {
                        const pin = destination.get('warehouse.pincode')?.value;
                        if (pin) {
                            const currentAddress = destination.get('warehouse.address')?.value;
                            destination.get('warehouse.address')?.setValue(`${currentAddress}\nPIN: ${pin}`);
                        }
                    }
                }

                if (productsArray && productsArray.length > 0) {
                    for (let i = 0; i < productsArray.length; i++) {
                        const product = productsArray.at(i);
                        if (product && product.get('hsnNumber')) {
                            product.get('showCodeType')?.setValue('hsn');
                        } else {
                            product.get('showCodeType')?.setValue('sac');
                        }
                    }
                }

                let tempBranches = [];
                this.branches?.forEach(branch => {
                    if (!branch?.additional?.isArchived || (branch?.additional?.isArchived && (this.branchExists(branch?.value, destinationsArray[0]) || this.branchExists(branch?.value, sourcesArray[0])))) {
                        tempBranches.push(branch);
                    }
                });

                this.branches = cloneDeep(tempBranches);
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
                    let dateOfSupply = dayjs(this.tempDateParams.dateOfSupply).format(GIDDH_DATE_FORMAT)
                    this.branchTransferCreateEditForm.get('dateOfSupply')?.setValue(dateOfSupply);
                }
                if (response.body?.transporterDetails && response.body?.transporterDetails.dispatchedDate) {
                    this.tempDateParams.dispatchedDate = new Date(response.body?.transporterDetails.dispatchedDate.split("-").reverse().join("-"));
                    let dispatchedDate = dayjs(this.tempDateParams.dispatchedDate).format(GIDDH_DATE_FORMAT)
                    this.branchTransferCreateEditForm.get('transporterDetails.dispatchedDate')?.setValue(dispatchedDate);
                }
                this.calculateOverallTotal();

                this.resetDestinationWarehouses(0);
                this.resetSourceWarehouses(0);

                setTimeout(() => {
                    this.isDefaultLoad = false;
                }, 1000);
            } else {
                this.toasty.showSnackBar("error", response?.message);
            }
        });
        this.detectChanges();
    }

    /**
     * This will be use for get warehouse information
     *
     * @param {*} type
     * @param {number} index
     * @memberof CreateBranchTransferComponent
     */
    public getWarehouseDetails(type: any, index: number): void {

        const sourcesArray = this.branchTransferCreateEditForm?.get('sources') as UntypedFormArray;
        const sourceFormGroup = sourcesArray?.at(index) as UntypedFormGroup;
        const sourcesWarehouseFormGroup = sourceFormGroup?.get('warehouse') as UntypedFormGroup;

        const destinationsArray = this.branchTransferCreateEditForm?.get('destinations') as UntypedFormArray;
        const destinationsFormGroup = destinationsArray?.at(index) as UntypedFormGroup;
        const destinationsWarehouseFormGroup = destinationsFormGroup?.get('warehouse') as UntypedFormGroup;

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
                        this.resetDestinationWarehouses(index, true);
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
                        this.resetSourceWarehouses(index, false);
                    }
                });
            } else {
                destinationsWarehouseFormGroup.get('name')?.setValue('');
                destinationsWarehouseFormGroup.get('taxNumber')?.setValue('');
                destinationsWarehouseFormGroup.get('address')?.setValue('');
            }
        }
        this.detectChanges();
    }

    /**
     * This will be use for assign current company
     *
     * @memberof CreateBranchTransferComponent
     */
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

    /**
     *This will be use for linked stocks
     *
     * @param {ILinkedStocksResult[]} data
     * @return {*}  {LinkedStocksVM[]}
     * @memberof CreateBranchTransferComponent
     */
    public linkedStocksVM(data: ILinkedStocksResult[]): LinkedStocksVM[] {

        let branches: LinkedStocksVM[] = [];
        this.senderWarehouses = {};
        this.destinationWarehouses = {};
        this.allWarehouses = [];

        if (data && data.length > 0) {
            data.forEach(res => {
                if (res && !res.isCompany) {
                    res.warehouses?.forEach(warehouse => {
                        warehouse.taxNumber = warehouse.taxNumber || '';
                    });
                    if (this.editBranchTransferUniqueName || !res.isArchived) {
                        branches.push(new LinkedStocksVM(res.name, res?.uniqueName, false, res.alias, res.warehouses, res.isArchived));
                    }
                    if (res.warehouses?.length) {
                        this.senderWarehouses[res?.uniqueName] = [];
                        this.destinationWarehouses[res?.uniqueName] = [];
                        this.allWarehouses[res?.uniqueName] = [];

                        res.warehouses?.forEach(key => {
                            if (this.editBranchTransferUniqueName || !key.isArchived) {
                                this.allWarehouses[res?.uniqueName].push(key);
                                this.senderWarehouses[res?.uniqueName].push({ label: key.name, value: key?.uniqueName });
                                this.destinationWarehouses[res?.uniqueName].push({ label: key.name, value: key?.uniqueName });
                            }
                        });
                    }
                }
            });
        }
        return branches;
    }

    /**
     * This will be use for get onboarding UntypedFormArray
     *
     * @param {*} countryCode
     * @memberof CreateBranchTransferComponent
     */
    public getOnboardingForm(countryCode: string): void {
        this.store.dispatch(this.commonActions.resetOnboardingForm());
        this.store.pipe(select(select => select.common.onboardingform), takeUntil(this.destroyed$)).subscribe(res => {
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


    /**
     * This wil be use for on products no result found
     *
     * @param {number} [idx]
     * @memberof CreateBranchTransferComponent
     */
    public onProductNoResultsClicked(idx?: number): void {
        this.innerEntryIndex = idx;
        document.querySelector("body").classList.add("new-branch-transfer-page");
        this.asideMenuStateForProductService = this.dialog.open(this.asideMenuProductService, {
            position: {
                right: '0',
                top: '0'
            },
            width: '760px',
            height: '100vh !important'
        });

        this.asideMenuStateForProductService.afterClosed().pipe(take(1)).subscribe(response => {
            document.querySelector("body").classList.remove("new-branch-transfer-page");
        });


        if (!idx) {
            this.loadDefaultStocksSuggestions();
        }
    }


    /**
     * This will be use for select sender name
     *
     * @param {*} event
     * @param {number} index
     * @memberof CreateBranchTransferComponent
     */
    public selectSenderName(event: any, index: number): void {
        if (event?.value && this.branchTransferMode === 'receipt-note') {
            this.selectCompany(event, 'sources', index);
        }
    }

    /**
     * This will be use for select reciever name
     *
     * @param {*} event
     * @param {number} index
     * @memberof CreateBranchTransferComponent
     */
    public selectRecieverName(event: any, index: number): void {
        if (event?.value && this.branchTransferMode === 'delivery-challan') {
            this.selectCompany(event, 'destinations', index);
        }
    }

    /**
     * This will be use for select reciever warehouse
     *
     * @param {*} event
     * @param {number} index
     * @memberof CreateBranchTransferComponent
     */
    public selectReceiverWarehouse(event: any, index: number): void {
        if (event?.value) {
            const destinationsArray = this.branchTransferCreateEditForm.get('destinations') as UntypedFormArray;
            const destinationGroup = destinationsArray.at(index) as UntypedFormGroup;
            const destinationsWarehouseFormGroup = destinationGroup.get('warehouse') as UntypedFormGroup;
            destinationsWarehouseFormGroup.patchValue({
                name: event?.label,
                uniqueName: event?.value
            });
            this.getWarehouseDetails('destinations', index);
        }
    }

    /**
     * This will be use for select sender warehouse
     *
     * @param {*} event
     * @param {number} index
     * @memberof CreateBranchTransferComponent
     */
    public selectSenderWarehouse(event: any, index: number): void {
        if (event?.value) {
            const sourcesArray = this.branchTransferCreateEditForm.get('sources') as UntypedFormArray;
            const sourceGroup = sourcesArray.at(index) as UntypedFormGroup;
            const sourcesWarehouseFormGroup = sourceGroup.get('warehouse') as UntypedFormGroup;
            sourcesWarehouseFormGroup.patchValue({
                name: event?.label,
                uniqueName: event?.value
            });
            this.getWarehouseDetails('sources', index);
        }
    }

    /**
     *This will be use for on select transport company
     *
     * @param {*} event
     * @memberof CreateBranchTransferComponent
     */
    public onSelectTransportCompany(event: any): void {
        this.branchTransferCreateEditForm.get('transporterDetails.transporterName').setValue(event?.label);
        this.branchTransferCreateEditForm.get('transporterDetails.transporterId').setValue(event?.value);
    }

    /**
     *This will be use for on select transport mode
     *
     * @param {*} event
     * @memberof CreateBranchTransferComponent
     */
    public onSelectTransportMode(event: any): void {
        this.branchTransferCreateEditForm.get('transporterDetails.transportMode').setValue(event?.value);
    }

    /**
     * This will be use for select company
     *
     * @param {*} event
     * @param {*} type
     * @param {*} index
     * @memberof CreateBranchTransferComponent
     */
    public selectCompany(event: any, type: any, index: number): void {
        const productArray = this.branchTransferCreateEditForm.get('products') as UntypedFormArray;
        const productGroup = productArray?.at(0) as UntypedFormGroup;
        if (!this.isDefaultLoad && type) {
            if (type === "sources") {
                const sourcesArray = this.branchTransferCreateEditForm.get('sources') as UntypedFormArray;
                const sourceGroup = sourcesArray?.at(index) as UntypedFormGroup;
                const sourcesWarehouseFormGroup = sourceGroup.get('warehouse') as UntypedFormGroup;
                const stockDetailsFormGroup = sourcesWarehouseFormGroup?.get('stockDetails') as UntypedFormGroup;
                if (sourcesArray) {
                    sourceGroup.patchValue({
                        name: event?.label,
                        uniqueName: event?.value
                    });

                    sourcesWarehouseFormGroup.patchValue({
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
                    sourceGroup.get('warehouse.stockDetails.quantity')?.patchValue(event?.value ? 1 : null);
                    if (this.transferType === 'senders') {
                        sourceGroup.get('warehouse.stockDetails.rate')?.patchValue(productGroup?.get('stockDetails.rate').value);
                        this.calculateRowTotal(sourcesWarehouseFormGroup);
                    }
                    this.resetSourceWarehouses(index, true, true);
                }
            } else {
                const destinationsArray = this.branchTransferCreateEditForm.get('destinations') as UntypedFormArray;
                const destinationsFormGroup = destinationsArray?.at(index) as UntypedFormGroup;
                const destinationsWarehouseFormGroup = destinationsFormGroup.get('warehouse') as UntypedFormGroup;
                const stockDetailsFormGroup = destinationsWarehouseFormGroup?.get('stockDetails') as UntypedFormGroup;

                if (destinationsArray) {
                    destinationsFormGroup.patchValue({
                        name: event?.label,
                        uniqueName: event?.value
                    });

                    destinationsWarehouseFormGroup.patchValue({
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
                    destinationsFormGroup.get('warehouse.stockDetails.quantity')?.patchValue(event?.value ? 1 : null);
                    if (this.transferType === 'senders') {
                        destinationsFormGroup.get('warehouse.stockDetails.rate')?.patchValue(productGroup?.get('stockDetails.rate').value);
                        this.calculateRowTotal(destinationsWarehouseFormGroup);
                    }
                    this.resetDestinationWarehouses(index, true, true);
                }
            }
        }
    }

    /**
     * This will use for reset warehouse on clear
     *
     * @param {string} type
     * @param {number} index
     * @memberof CreateBranchTransferComponent
     */
    public resetWarehouse(type: string, index: number): void {

        const sourcesArray = this.branchTransferCreateEditForm.get('sources') as UntypedFormArray;
        const sourceFormGroup = sourcesArray.at(index) as UntypedFormGroup;
        const sourcesWarehouseFormGroup = sourceFormGroup.get('warehouse') as UntypedFormGroup;
        const sourcesStockDetailsFormGroup = sourcesArray.at(index).get('warehouse.stockDetails') as UntypedFormGroup;

        const destinationsArray = this.branchTransferCreateEditForm.get('destinations') as UntypedFormArray;
        const destinationsFormGroup = destinationsArray?.at(index) as UntypedFormGroup;
        const destinationsWarehouseFormGroup = destinationsFormGroup?.get('warehouse') as UntypedFormGroup;
        const destinationsStockDetailsFormGroup = destinationsArray?.at(index)?.get('warehouse.stockDetails') as UntypedFormGroup;

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
            this.resetSourceWarehouses(index, true, true);
            if (destinationsFormGroup && destinationsWarehouseFormGroup &&
                destinationsWarehouseFormGroup.get('uniqueName')?.value === null) {
                this.resetDestinationWarehouses(index, true, true);
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
            this.resetDestinationWarehouses(index, true, true);
            if (sourceFormGroup && sourcesWarehouseFormGroup &&
                sourcesStockDetailsFormGroup.get('uniqueName')?.value === null) {
                this.resetSourceWarehouses(index, true, true);
            }
        }
    }

    /**
     * This will be use for reset source warehouse
     *
     * @param {number} index
     * @param {boolean} [reInitializeWarehouses]
     * @memberof CreateBranchTransferComponent
     */
    public resetSourceWarehouses(index: number, withBranches: boolean = true, reInitializeWarehouses?: boolean): void {
        let sourcesArray = this.branchTransferCreateEditForm.get('sources') as UntypedFormArray;
        let sourceFormGroup = sourcesArray?.at(index) as UntypedFormGroup;
        let sourcesWarehouseFormGroup = sourceFormGroup?.get('warehouse') as UntypedFormGroup;

        let destinationsArray = this.branchTransferCreateEditForm.get('destinations') as UntypedFormArray;
        let destinationsFormGroup = destinationsArray?.at(index) as UntypedFormGroup;
        let destinationsWarehouseFormGroup = destinationsFormGroup?.get('warehouse') as UntypedFormGroup;

        if (destinationsArray && destinationsFormGroup && destinationsWarehouseFormGroup && destinationsWarehouseFormGroup.get('uniqueName')?.value !== null) {
            this.senderWarehouses[destinationsFormGroup.get('uniqueName').value] = [];
            let allowWarehouse = true;

            if (this.allWarehouses[destinationsFormGroup?.get('uniqueName')?.value] && this.allWarehouses[destinationsFormGroup?.get('uniqueName').value].length > 0) {

                this.allWarehouses[destinationsFormGroup?.get('uniqueName').value]?.forEach(key => {
                    allowWarehouse = true;

                    if (key?.uniqueName === destinationsWarehouseFormGroup?.get('uniqueName')?.value ||
                        key.taxNumber !== (destinationsWarehouseFormGroup?.get('taxNumber')?.value || '')) {
                        allowWarehouse = false;
                    }

                    if (allowWarehouse) {
                        this.senderWarehouses[destinationsFormGroup?.get('uniqueName')?.value]?.push({ label: key.name, value: key?.uniqueName });
                    }
                });
            }

            if (sourcesArray && sourceFormGroup && sourceFormGroup.get('uniqueName')?.value) {
                // Update source warehouses
                this.senderWarehouses[sourceFormGroup.get('uniqueName').value] = [];
                if (this.allWarehouses[sourceFormGroup.get('uniqueName').value] && this.allWarehouses[sourceFormGroup.get('uniqueName').value].length > 0) {
                    this.allWarehouses[sourceFormGroup.get('uniqueName').value]?.forEach(key => {
                        if (destinationsArray && destinationsWarehouseFormGroup && key?.uniqueName !== destinationsWarehouseFormGroup.get('uniqueName')?.value &&
                            key.taxNumber === (destinationsWarehouseFormGroup.get('taxNumber')?.value || '')) {
                            this.senderWarehouses[sourceFormGroup.get('uniqueName')?.value]?.push({ label: key.name, value: key?.uniqueName });
                        }
                    });
                    setTimeout(() => {
                        if (this.senderWarehouses[sourceFormGroup.get('uniqueName')?.value].length === 1) {
                            let event = {
                                label: this.senderWarehouses[sourceFormGroup.get('uniqueName')?.value][0]?.label,
                                value: this.senderWarehouses[sourceFormGroup.get('uniqueName')?.value][0]?.value
                            }
                            if (withBranches) {
                                this.selectSenderWarehouse(event, index);
                            }
                        }
                    }, 100);
                }
            }
        }
        else {
            if (this.allWarehouses && this.allWarehouses[destinationsFormGroup?.get('uniqueName')?.value]) {
                this.senderWarehouses[destinationsFormGroup?.get('uniqueName').value] = [];
                let allowWarehouse = true;

                this.allWarehouses[destinationsFormGroup?.get('uniqueName')?.value]?.forEach(key => {
                    allowWarehouse = true;

                    if (key?.uniqueName === destinationsWarehouseFormGroup.get('uniqueName')?.value ||
                        (!reInitializeWarehouses && key.taxNumber !== (destinationsWarehouseFormGroup.get('taxNumber')?.value || ''))) {
                        allowWarehouse = false;
                    }

                    if (allowWarehouse) {
                        this.senderWarehouses[destinationsFormGroup?.get('uniqueName')?.value]?.push({ label: key?.name, value: key?.uniqueName });
                    }
                });
            }

            // If multiple senders case for receipt note
            const sourceIndex = this.transferType !== 'products' ? index : 0;
            const destinationIndex = this.transferType !== 'products' ? 0 : index;
            sourceFormGroup = sourcesArray?.at(sourceIndex) as UntypedFormGroup;
            sourcesWarehouseFormGroup = sourceFormGroup?.get('warehouse') as UntypedFormGroup;
            destinationsFormGroup = destinationsArray?.at(destinationIndex) as UntypedFormGroup;
            destinationsWarehouseFormGroup = destinationsFormGroup?.get('warehouse') as UntypedFormGroup;

            if (sourceFormGroup && sourceFormGroup.get('uniqueName').value) {
                // Update source warehouses
                this.senderWarehouses[sourceFormGroup.get('uniqueName').value] = [];
                if (this.allWarehouses[sourceFormGroup.get('uniqueName').value] && this.allWarehouses[sourceFormGroup.get('uniqueName').value].length > 0) {
                    this.allWarehouses[sourceFormGroup.get('uniqueName').value].forEach(key => {
                        if (destinationsFormGroup && destinationsWarehouseFormGroup && key?.uniqueName !== destinationsWarehouseFormGroup.get('uniqueName')?.value &&
                            (reInitializeWarehouses || key.taxNumber === (destinationsWarehouseFormGroup.get('taxNumber')?.value || ''))) {
                            this.senderWarehouses[sourceFormGroup.get('uniqueName')?.value].push({ label: key.name, value: key?.uniqueName });
                        }
                    });
                    setTimeout(() => {
                        if (this.senderWarehouses[sourceFormGroup.get('uniqueName')?.value].length === 1) {
                            sourcesWarehouseFormGroup.get('uniqueName').setValue(sourcesWarehouseFormGroup.get('uniqueName')?.value);
                            let event = {
                                label: this.senderWarehouses[sourceFormGroup.get('uniqueName')?.value][0]?.label,
                                value: this.senderWarehouses[sourceFormGroup.get('uniqueName')?.value][0]?.value
                            }
                            this.selectSenderWarehouse(event, index);
                        }
                    }, 100);
                }
            }
        }
        this.detectChanges();
    }

    /**
     * This will be use for reset destination warehouse
     *
     * @param {*} index
     * @param {boolean} [reInitializeWarehouses]
     * @memberof CreateBranchTransferComponent
     */
    public resetDestinationWarehouses(index, withBranches: boolean = true, reInitializeWarehouses?: boolean): void {
        let sourcesArray = this.branchTransferCreateEditForm.get('sources') as UntypedFormArray;

        let sourceFormGroup = sourcesArray?.at(index) as UntypedFormGroup;
        let sourcesWarehouseFormGroup = sourceFormGroup?.get('warehouse') as UntypedFormGroup;

        let destinationsArray = this.branchTransferCreateEditForm.get('destinations') as UntypedFormArray;
        let destinationsFormGroup = destinationsArray?.at(index) as UntypedFormGroup;
        let destinationsWarehouseFormGroup = destinationsFormGroup?.get('warehouse') as UntypedFormGroup;

        if (sourcesArray && sourceFormGroup && sourcesWarehouseFormGroup && sourcesWarehouseFormGroup.get('uniqueName')?.value !== null) {
            this.destinationWarehouses[sourceFormGroup?.get('uniqueName').value] = [];
            let allowWarehouse = true;

            if (this.allWarehouses[sourceFormGroup?.get('uniqueName').value] && this.allWarehouses[sourceFormGroup?.get('uniqueName').value].length > 0) {

                this.allWarehouses[sourceFormGroup?.get('uniqueName').value].forEach(key => {
                    allowWarehouse = true;

                    if (key?.uniqueName === sourcesWarehouseFormGroup.get('uniqueName')?.value ||
                        key.taxNumber !== (sourcesWarehouseFormGroup.get('taxNumber')?.value || '')) {
                        allowWarehouse = false;
                    }

                    if (allowWarehouse) {
                        this.destinationWarehouses[sourceFormGroup?.get('uniqueName').value].push({ label: key.name, value: key?.uniqueName });
                    }
                });
            }
            if (destinationsArray && destinationsFormGroup && destinationsFormGroup.get('uniqueName').value) {
                // Update Destination warehouses
                this.destinationWarehouses[destinationsFormGroup.get('uniqueName').value] = [];
                if (this.allWarehouses[destinationsFormGroup.get('uniqueName').value] && this.allWarehouses[destinationsFormGroup.get('uniqueName').value].length > 0) {

                    this.allWarehouses[destinationsFormGroup.get('uniqueName').value].forEach(key => {

                        if (key?.uniqueName !== sourcesWarehouseFormGroup.get('uniqueName')?.value &&
                            key.taxNumber === (sourcesWarehouseFormGroup.get('taxNumber')?.value || '')) {
                            this.destinationWarehouses[destinationsFormGroup.get('uniqueName').value].push({ label: key.name, value: key?.uniqueName });
                        }
                    });
                }
                setTimeout(() => {
                    if (this.destinationWarehouses[sourceFormGroup.get('uniqueName')?.value].length === 1) {
                        let event = {
                            label: this.destinationWarehouses[destinationsFormGroup.get('uniqueName')?.value][0]?.label,
                            value: this.destinationWarehouses[destinationsFormGroup.get('uniqueName')?.value][0]?.value
                        }
                        if (withBranches) {
                            this.selectReceiverWarehouse(event, index);
                        }
                    }
                }, 100);
            }
        } else {
            if (this.allWarehouses && sourcesArray && this.allWarehouses[sourceFormGroup?.get('uniqueName')?.value]) {
                this.destinationWarehouses[sourceFormGroup?.get('uniqueName')?.value] = [];
                let allowWarehouse = true;

                if (this.allWarehouses[sourceFormGroup?.get('uniqueName')?.value] && this.allWarehouses[sourceFormGroup?.get('uniqueName')?.value].length > 0) {
                    this.allWarehouses[sourceFormGroup?.get('uniqueName')?.value].forEach(key => {
                        allowWarehouse = true;

                        if (key?.uniqueName === sourcesWarehouseFormGroup.get('uniqueName')?.value ||
                            (!reInitializeWarehouses && key.taxNumber !== (sourcesWarehouseFormGroup.get('taxNumber')?.value || ''))) {
                            allowWarehouse = false;
                        }

                        if (allowWarehouse) {
                            this.destinationWarehouses[sourceFormGroup?.get('uniqueName')?.value].push({ label: key.name, value: key?.uniqueName });
                        }
                    });
                }
            }
            // If multiple destinations case for delivery challan
            const destinationIndex = this.transferType !== 'products' ? index : 0;
            const sourceIndex = this.transferType !== 'products' ? 0 : index;
            sourceFormGroup = sourcesArray?.at(sourceIndex) as UntypedFormGroup;
            destinationsFormGroup = destinationsArray?.at(destinationIndex) as UntypedFormGroup;
            destinationsWarehouseFormGroup = destinationsFormGroup?.get('warehouse') as UntypedFormGroup;
            sourcesWarehouseFormGroup = sourceFormGroup?.get('warehouse') as UntypedFormGroup;
            if (destinationsFormGroup && destinationsFormGroup.get('uniqueName').value) {
                // Update Destination warehouses
                this.destinationWarehouses[destinationsFormGroup.get('uniqueName').value] = [];

                if (this.allWarehouses[destinationsFormGroup.get('uniqueName').value] && this.allWarehouses[destinationsFormGroup.get('uniqueName').value].length > 0) {
                    this.allWarehouses[destinationsFormGroup.get('uniqueName').value].forEach(key => {
                        if (sourceFormGroup && sourcesWarehouseFormGroup && key?.uniqueName !== sourceFormGroup.get('uniqueName')?.value &&
                            (reInitializeWarehouses || key.taxNumber === (sourcesWarehouseFormGroup.get('taxNumber')?.value || ''))) {
                            this.destinationWarehouses[destinationsFormGroup.get('uniqueName')?.value]?.push({ label: key.name, value: key?.uniqueName });
                        }
                    });
                }
                setTimeout(() => {
                    if (this.destinationWarehouses[destinationsFormGroup.get('uniqueName')?.value].length === 1) {
                        destinationsWarehouseFormGroup.get('uniqueName').setValue(destinationsWarehouseFormGroup.get('uniqueName')?.value);
                        let event = {
                            label: this.destinationWarehouses[destinationsFormGroup.get('uniqueName')?.value][0]?.label,
                            value: this.destinationWarehouses[destinationsFormGroup.get('uniqueName')?.value][0]?.value
                        }
                        this.selectReceiverWarehouse(event, index);
                    }
                }, 100);
            }
        }
        this.detectChanges();
    }

    /**
     * This will be use for branch exists
     *
     * @private
     * @param {string} branchUniqueName
     * @param {*} branches
     * @return {*}  {boolean}
     * @memberof CreateBranchTransferComponent
     */
    private branchExists(branchUniqueName: string, branches: any): boolean {
        const branchExists = branches?.filter(branch => branch?.uniqueName === branchUniqueName);
        return (branchExists?.length);
    }

    /**
     * This will be use for variant change selection
     *
     * @param {*} event
     * @param {*} product
     * @param {number} index
     * @memberof CreateBranchTransferComponent
     */
    public variantChanged(event: any, productFormGroup: any, index: number, defaultLoad: boolean = false): void {
        if (event) {
            const variantsFormGroup = productFormGroup?.get('variant') as UntypedFormGroup;
            variantsFormGroup.get('name')?.setValue(event.additional.name);
            variantsFormGroup.get('uniqueName')?.setValue(event.additional.uniqueName);
            this.loadStockUnits(event, index, productFormGroup, defaultLoad);
        }
    }

    /**
     *This will be use for save sku number
     *
     * @memberof CreateBranchTransferComponent
     */
    public saveSkuNumberPopup(): void {
        this.skuMenuTrigger?.closeMenu();
    }

    /**
     *This will be use for save hsn number
     *
     * @memberof CreateBranchTransferComponent
     */
    public saveHsnNumberPopup(): void {
        this.hsnSacMenuTrigger?.closeMenu();
    }

    /**
     *This will be use for  close save sku number
     *
     * @memberof CreateBranchTransferComponent
     */
    public closeShowCodeMenu(productFormGroup: any): void {
        productFormGroup.get('skuCode').patchValue('');
        this.skuMenuTrigger?.closeMenu();
    }

    /**
     *This will be use for  clear sac number
     *
     * @memberof CreateBranchTransferComponent
     */
    public closeSacNumber(productFormGroup: any): void {
        productFormGroup.get('sacNumber').patchValue('');
        productFormGroup.get('hsnNumber').patchValue('');
        this.hsnSacMenuTrigger?.closeMenu();
    }

    /**
     * This will be use for select product
     *
     * @param {*} event
     * @param {*} product
     * @param {number} [index]
     * @memberof CreateBranchTransferComponent
     */
    public selectProduct(event: any, productFormGroup: any, defaultLoad: boolean = false, index?: number): void {
        if (event && event.additional) {
            productFormGroup?.get('name')?.setValue(event.additional.name);
            productFormGroup?.get('uniqueName')?.setValue(event.additional.uniqueName);
            this.inventoryService.getStockV2(event.value).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
                if (response?.status === 'success') {
                    this.stockUnitResults[index] = response.body.stockUnit;
                    if (productFormGroup.get('uniqueName')?.value) {
                        const variantsFormGroup = productFormGroup?.get('variant') as UntypedFormGroup;
                        this.stockVariants[index] = [];
                        response?.body?.variants.forEach(item => {
                            if (!item.archive) {
                                this.stockVariants[index].push({
                                    label: item.name,
                                    value: item.uniqueName,
                                    additional: item
                                });
                            }
                        });
                        if (!defaultLoad) {
                            if (!variantsFormGroup.get('uniqueName')?.value) {
                                variantsFormGroup.get('name').setValue(this.stockVariants[index][0]?.label);
                                variantsFormGroup.get('uniqueName').setValue(this.stockVariants[index][0]?.value);
                                this.variantChanged(this.stockVariants[index][0], productFormGroup, index)
                            } else {
                                const selectedVariant = this.stockVariants[index].find(variant => variant.value === variantsFormGroup.get('uniqueName')?.value);
                                this.variantChanged(selectedVariant, productFormGroup, index)
                            }
                        } else {
                            const selectedVariant = this.stockVariants[index].find(variant => variant.value === variantsFormGroup.get('uniqueName')?.value);
                            this.variantChanged(selectedVariant, productFormGroup, index, defaultLoad)
                        }
                    }

                    this.calculateRowTotal(productFormGroup);
                }
            });
            productFormGroup.get('stockDetails.quantity')?.setValue(productFormGroup.get('stockDetails.quantity')?.value || 1);
            productFormGroup.get('stockDetails.skuCode')?.setValue(event.additional.skuCode);
            if (event.additional?.hsnNumber && event.additional?.sacNumber) {
                if (this.inventorySettings?.manageInventory) {
                    productFormGroup.get('hsnNumber')?.setValue(event.additional.hsnNumber);
                    productFormGroup.get('showCodeType')?.setValue("hsn");
                } else {
                    productFormGroup.get('sacNumber')?.setValue(event.additional.sacNumber);
                    productFormGroup.get('showCodeType')?.setValue("sac");
                }
            } else if (event.additional?.hsnNumber && !event.additional?.sacNumber) {
                productFormGroup.get('hsnNumber')?.setValue(event.additional.hsnNumber);
                productFormGroup.get('showCodeType')?.setValue("hsn");
            } else if (!event.additional?.hsnNumber && event.additional?.sacNumber) {
                productFormGroup.get('sacNumber')?.setValue(event.additional.sacNumber);
                productFormGroup.get('showCodeType')?.setValue("sac");
            } else if (!event.additional?.hsnNumber && !event.additional?.sacNumber) {
                if (this.inventorySettings?.manageInventory) {
                    productFormGroup.get('hsnNumber')?.setValue("");
                    productFormGroup.get('showCodeType')?.setValue("hsn");
                } else {
                    productFormGroup.get('sacNumber')?.setValue("");
                    productFormGroup.get('showCodeType')?.setValue("sac");
                }
            }

            if (this.transferType === 'senders') {
                const sourcesArray = this.branchTransferCreateEditForm.get('sources') as UntypedFormArray;
                const sourceFormGroup = sourcesArray?.at(index) as UntypedFormGroup;
                const sourcesWarehouseFormGroup = sourceFormGroup?.get('warehouse') as UntypedFormGroup;
                const destinationsArray = this.branchTransferCreateEditForm.get('destinations') as UntypedFormArray;
                const destinationsFormGroup = destinationsArray?.at(index) as UntypedFormGroup;
                const destinationsWarehouseFormGroup = destinationsFormGroup?.get('warehouse') as UntypedFormGroup;
                destinationsWarehouseFormGroup?.get('stockDetails.stockUnit')?.setValue(event.additional.stockUnit.code);
                destinationsWarehouseFormGroup?.get('stockDetails.stockUnitUniqueName')?.setValue(event.additional.stockUnit.uniqueName);
                destinationsWarehouseFormGroup?.get('stockDetails.stockUnitUniqueName')?.setValue(event.additional.stockUnit.uniqueName);
                sourcesWarehouseFormGroup?.get('stockDetails.stockUnit')?.setValue(event.additional.stockUnit.code);
                sourcesWarehouseFormGroup?.get('stockDetails.stockUnitUniqueName')?.setValue(event.additional.stockUnit.uniqueName);
            }
        }
    }

    /**
     * This will be use for handle code type change for hsn/sac
     *
     * @param {*} event
     * @memberof CreateBranchTransferComponent
     */
    public handleCodeTypeChange(event: any): void {
        const productsArray = this.branchTransferCreateEditForm.get('products') as UntypedFormArray;
        const productFormGroup = productsArray?.at(0) as UntypedFormGroup;
        if (event.value === "hsn") {
            productFormGroup.get('hsnNumber').setValue(productFormGroup.get('sacNumber').value);
            productFormGroup.get('sacNumber').setValue('');
        } else if (event.value === "sac") {
            productFormGroup.get('sacNumber').setValue(productFormGroup.get('hsnNumber').value);
            productFormGroup.get('hsnNumber').setValue('');
        }
    }

    /**
     * This will use for load stock units
     *
     * @param {*} event
     * @param {number} index
     * @param {UntypedFormGroup} productFormGroup
     * @param {boolean} [defaultLoad=false]
     * @memberof CreateBranchTransferComponent
     */
    public loadStockUnits(event: any, index: number, productFormGroup: UntypedFormGroup, defaultLoad: boolean = false): void {
        if (!this.stockUnits[index]) {
            this.stockUnits[index] = [];
        }
        let unitRates = [];
        if (event.additional.purchaseAccountDetails) {
            unitRates = event.additional.purchaseAccountDetails.unitRates.map(rate => ({
                label: rate.stockUnitCode,
                value: rate.stockUnitUniqueName,
                additional: rate.rate
            }));
        } else if (event.additional.fixedAssetAccountDetails) {
            unitRates = event.additional.fixedAssetAccountDetails.unitRates.map(rate => ({
                label: rate.stockUnitCode,
                value: rate.stockUnitUniqueName,
                additional: rate.rate
            }));
        } else {
            unitRates.push({
                label: this.stockUnitResults[index].code,
                value: this.stockUnitResults[index].uniqueName,
                additional: 1
            })
        }
        const baseUnitExists = unitRates?.filter(rate => rate.value === this.stockUnitResults[index].uniqueName);
        if (!baseUnitExists?.length) {
            unitRates.push({
                label: this.stockUnitResults[index].code,
                value: this.stockUnitResults[index].uniqueName,
                additional: 1
            });
        }
        if (!defaultLoad) {
            this.unitChanged(unitRates[0], productFormGroup);
        }
        this.stockUnits[index] = unitRates;

        this.assignRateInSourceDestinations();
    }

    /**
     * Assigns rate in sources/destination if multiple senders/receivers
     *
     * @private
     * @memberof CreateBranchTransferComponent
     */
    private assignRateInSourceDestinations(): void {
        if (this.transferType === 'senders' && this.stockUnits?.length && this.stockUnits[0]?.length) {
            const destinationsArray = this.branchTransferCreateEditForm.get('destinations') as UntypedFormArray;
            this.branchTransferCreateEditForm.get('destinations')['controls']?.forEach((destination, index) => {
                let destinationsFormGroup = destinationsArray?.at(index) as UntypedFormGroup;
                let destinationsWarehouseFormGroup = destinationsFormGroup.get('warehouse') as UntypedFormGroup;
                destinationsFormGroup.get('warehouse.stockDetails.rate')?.patchValue(this.stockUnits[0][0].additional);

                if (!destinationsFormGroup.get('warehouse.stockDetails.quantity')?.value) {
                    destinationsFormGroup.get('warehouse.stockDetails.quantity')?.patchValue(1);
                }
                this.calculateRowTotal(destinationsWarehouseFormGroup);
            });

            const sourcesArray = this.branchTransferCreateEditForm.get('sources') as UntypedFormArray;
            this.branchTransferCreateEditForm.get('sources')['controls']?.forEach((sources, index) => {
                let sourcesFormGroup = sourcesArray?.at(index) as UntypedFormGroup;
                let sourcesWarehouseFormGroup = sourcesFormGroup.get('warehouse') as UntypedFormGroup;
                sourcesFormGroup.get('warehouse.stockDetails.rate')?.patchValue(this.stockUnits[0][0].additional);

                if (!sourcesFormGroup.get('warehouse.stockDetails.quantity')?.value) {
                    sourcesFormGroup.get('warehouse.stockDetails.quantity')?.patchValue(1);
                }
                this.calculateRowTotal(sourcesWarehouseFormGroup);
            });
        }
    }

    /**
    * This will be use for variant change selection
    *
    * @param {*} event
    * @param {*} product
    * @param {number} index
    * @memberof CreateBranchTransferComponent
    */
    public unitChanged(event: any, productFormGroup: any): void {
        if (event) {
            productFormGroup.get('stockDetails.stockUnit')?.setValue(event.label);
            productFormGroup.get('stockDetails.stockUnitUniqueName')?.setValue(event.value);
            productFormGroup.get("stockDetails.rate")?.setValue(event.additional);
            this.calculateRowTotal(productFormGroup);
        }
    }


    /**
     * This will be use for calculating row total
     *
     * @param {*} product
     * @param {number} [index]
     * @memberof CreateBranchTransferComponent
     */
    public calculateRowTotal(productsFormGroup: any): void {
        const productStockDetailsFormGroup = productsFormGroup.get('stockDetails') as UntypedFormGroup;
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
        this.calculateOverallTotal();
        this.detectChanges();
    }

    /**
     * This will be use for calculating the overall total
     *
     * @memberof CreateBranchTransferComponent
     */
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
        this.detectChanges();
    }

    /**
     *This will be use for toggle transport modal dialog
     *
     * @memberof CreateBranchTransferComponent
     */
    public toggleTransporterModel(): void {
        let dialgRef = this.dialog.open(this.asideManageTransport, {
            position: {
                right: '0',
                top: '0'
            },
            width: '760px',
            height: '100vh !important'
        });
        dialgRef.afterClosed().pipe(take(1)).subscribe(response => {
            this.getTransportersList();
        });
    }

    /**
    * This Function is used to close Aside Menu Sidebar
    *
    * @memberof CreateBranchTransferComponent
    */
    public closeAsideMenuProductServiceModal(): void {
        this.asideMenuStateForProductService?.close();
        this.loadDefaultStocksSuggestions();
    }

    /**
     * This will be use for get transporters list
     *
     * @memberof CreateBranchTransferComponent
     */
    public getTransportersList(): void {
        this.invoiceServices.getAllTransporterList(this.transporterObj).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.body?.results?.length) {
                let transporterDropdown = null;
                let transporterArr = null;
                transporterDropdown = response.body?.results;
                transporterArr = transporterDropdown.map(trans => {
                    return { label: trans.transporterName, value: trans.transporterId };
                });
                this.transporterDropdown = transporterArr;
            }
        });
        this.detectChanges();
    }

    /**
     * THis will be use for change detection callback
     *
     * @memberof CreateBranchTransferComponent
     */
    public detectChanges(): void {
        if (!this.changeDetection['destroyed']) {
            this.changeDetection.detectChanges();
        }
    }


    /**
     * Lifecycle hook for destroy
     *
     * @memberof CreateBranchTransferComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
