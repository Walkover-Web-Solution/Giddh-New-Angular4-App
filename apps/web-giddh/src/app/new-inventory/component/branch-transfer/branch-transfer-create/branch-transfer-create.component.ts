import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormGroup, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute } from '@angular/router';
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
import { AppState } from 'apps/web-giddh/src/app/store';
import { IOption } from 'apps/web-giddh/src/app/theme/ng-virtual-select/sh-options.interface';
import { log } from 'console';
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
    /** Product Name Filter dropdown items*/
    public product: any = [];
    /** Holds if Multiple Products/Senders selected */
    public transferType: 'products' | 'senders' = 'products';
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
    public transporterFilterRequest: IEwayBillfilter = new IEwayBillfilter();
    public transporterDropdown$: Observable<IOption[]>;
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
    constructor(
        private route: ActivatedRoute,
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
                console.log(params);
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

        this.getBranches();

        // transporterModes.map(c => {
        //     this.transporterMode.push({ label: c.label, value: c.value });
        // });

        if (!this.editBranchTransferUniqueName) {
            this.allowAutoFocusInField = true;
            this.focusDefaultSource();
        } else {
            this.isDefaultLoad = true;
        }
        this.isBranch = this.generalService.currentOrganizationType === OrganizationType.Branch;
        this.isCompanyWithSingleBranch = this.generalService.currentOrganizationType === OrganizationType.Company && this.branches && this.branches.length === 1;
    }

    public setActiveRow(): void {
        this.activeRow = true;
    }

    public selectDateOfSupply(date): void {
        if (date && this.tempDateParams.dispatchedDate && date > this.tempDateParams.dispatchedDate) {
            this.tempDateParams.dispatchedDate = date;
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
        // Helper methods to create nested form groups
        this.createDestinationFormGroup();
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
                this.branchTransferCreateEditForm.reset();
            }
        });

        this.store.pipe(select(state => state.ewaybillstate.isAddnewTransporterInSuccess), takeUntil(this.destroyed$)).subscribe(p => {
            if (p) {
                this.clearTransportForm();
            }
        });
    }

    public clearTransportForm(): void {
        this.generateNewTransporter.transporterId = this.generateNewTransporter.transporterName = null;
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
                            console.log(key);

                            if (this.editBranchTransferUniqueName || !key.isArchived) {
                                this.allWarehouses[d?.uniqueName].push(key);

                                this.senderWarehouses[d?.uniqueName].push({ label: key.name, value: key?.uniqueName });
                                this.destinationWarehouses[d?.uniqueName].push({ label: key.name, value: key?.uniqueName });
                                console.log(this.senderWarehouses);

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

    public getBranchTransfer(): void {
        this.isUpdateMode = true;
        this.inventoryService.getNewBranchTransfer(this.editBranchTransferUniqueName).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            console.log(response);
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
        console.log(this.branchTransferCreateEditForm);

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


