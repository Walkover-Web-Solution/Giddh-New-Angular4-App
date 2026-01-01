import {
    AfterViewInit,
    Component,
    ComponentFactoryResolver,
    Inject,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { CommonActions } from '../../actions/common.actions';
import { CompanyActions } from '../../actions/company.actions';
import { GeneralActions } from '../../actions/general/general.actions';
import { ItemOnBoardingActions } from '../../actions/item-on-boarding/item-on-boarding.action';
import { OnBoardingType, PAGINATION_LIMIT, PAGE_SIZE_OPTIONS, ASIDE_PANE_CONFIG, Configuration } from '../../app.constant';
import { PageEvent } from '@angular/material/paginator';
import { GeneralService } from '../../services/general.service';
import { SettingsProfileService } from '../../services/settings.profile.service';
import { SettingsWarehouseService } from '../../services/settings.warehouse.service';
import { ToasterService } from '../../services/toaster.service';
import { ElementViewContainerRef } from '../../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { ItemOnBoardingState } from '../../store/item-on-boarding/item-on-boarding.reducer';
import { AppState } from '../../store/roots';
import { SettingsAsideConfiguration, SettingsAsideFormType } from '../constants/settings.constant';
import { SettingsUtilityService } from '../services/settings-utility.service';
import { WarehouseActions } from './action/warehouse.action';
import { WarehouseState } from './reducer/warehouse.reducer';
import { OrganizationType } from '../../models/user-login-state';
import { VoucherComponentStore } from '../../vouchers/utility/vouchers.store';
import { ServiceConfig } from '../../services/service.config';
import { environment } from 'apps/web-giddh/src/environments/environment';

/**
 * Warehouse component
 *
 * @export
 * @class WarehouseComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
    selector: 'setting-warehouse',
    templateUrl: './warehouse.component.html',
    styleUrls: ['./warehouse.component.scss'],
    providers: [VoucherComponentStore],
    standalone:false
})
export class WarehouseComponent implements OnInit, OnDestroy, AfterViewInit {

    public isBranchElemnt: boolean = true;
    /** Image path relative to app environment */
    public imgPath: string = '';
    /** Stores item on boarding details */
    public itemOnBoardingDetails: ItemOnBoardingState;
    /** Observable that keep track of all warehouses created for a company */
    public allWarehouses$: Observable<any>;
    /** Selected warehouse for welcome page to update warehouse information */
    public selectedWarehouse: any;
    /** Configuration object for pagination component */
    public paginationConfig: any;
    /** Pagination limit */
    public paginationLimit: number = PAGINATION_LIMIT;
    /** Holds available page size options */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    /** Stores the list of warehouses */
    public warehouses: Array<any> = [];
    /** Warehouse search query */
    public searchWarehouseQuery: string = '';
    /** True, if API is in progress */
    public showLoader: boolean = true;
    /** True, if warehouse update is in progress */
    public isWarehouseUpdateInProgress: boolean;
    /** Warehouse details to update */
    public warehouseToUpdate: any;
    /** Stores the current organization uniqueName */
    public currentOrganizationUniqueName: string;
    public imgPath2: string = '';
    /** Warehouse search field instance */
    @ViewChild('searchWarehouse', { static: false }) public searchWarehouse: any;
    /** Aside Create Address Template Reference */
    @ViewChild('asideAccountAsidePane', { static: true }) public asideAccountAsidePane: any;
    /** Status Dialog Template Reference */
    @ViewChild('statusModal', { static: true }) public statusModal: any;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: Subject<boolean> = new Subject();
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold profile JSON data */
    public profileLocaleData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Holds warehouse to archive/unarchive */
    public warehouseStatusToUpdate: any;
    /** Holds current page number */
    private currentPage: number = 1;
    /** Holds modal reference */
    public statusModalRef: any;
    /** Holds Create Account Asidepane Dialog Ref */
    public asideAccountAsidePaneDialogRef: MatDialogRef<any>;

    /** Stores the address configuration */
    public addressConfiguration: SettingsAsideConfiguration = {
        type: SettingsAsideFormType.EditWarehouse,
        linkedEntities: []
    };
    /** True, if organization type is company and it has more than one branch (i.e. in addition to HO) */
    public isCompany: boolean;
    /** True if consolidated branch */
    public isConsolidatedBranch: boolean;
    /** True if address info is open */
    public isAddressInfoOpen: string = '';
    /** True if last address info is open */
    public isLastAddressInfoOpen: boolean = false;
    /** Voucher API version */
    public voucherApiVersion: number;

    /** @ignore */
    constructor(
        private commonActions: CommonActions,
        private companyActions: CompanyActions,
        private componentFactoryResolver: ComponentFactoryResolver,
        private generalActions: GeneralActions,
        private generalService: GeneralService,
        private itemOnBoardingActions: ItemOnBoardingActions,
        private settingsUtilityService: SettingsUtilityService,
        private store: Store<AppState>,
        private settingsProfileService: SettingsProfileService,
        private toasterService: ToasterService,
        private warehouseActions: WarehouseActions,
        private settingsWarehouseService: SettingsWarehouseService,
        public dialog: MatDialog,
        @Inject(ServiceConfig) private serviceConfig,
        private componentStore: VoucherComponentStore
    ) { }

    /**
     * Initializes the component
     *
     * @memberof WarehouseComponent
     */
    public ngOnInit(): void {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        this.imgPath = Configuration.isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || environment.AppUrl) + environment.APP_FOLDER + 'assets/images/';
        this.currentOrganizationUniqueName = this.generalService.currentBranchUniqueName || this.generalService.companyUniqueName;
        this.initSubscribers();

        this.store.pipe(select(select => select.branchConsolidated), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isConsolidatedBranch = response.isBranchConsolidated;
            }
        });

        this.componentStore.branchList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch && response?.length > 1;
            }
        });

        this.imgPath2 = isElectron ? 'assets/images/warehouse-vector.svg' : (this.serviceConfig.AppUrl || AppUrl) + APP_FOLDER + 'assets/images/warehouse-vector.svg';
    }

    /**
     * Listens to the input change event of warehouse search filter
     *
     * @memberof WarehouseComponent
     */
    public ngAfterViewInit(): void {
        fromEvent(this.searchWarehouse?.textField?.nativeElement, 'input').pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe((event: any) => {
            this.showLoader = true;
            this.store.dispatch(this.warehouseActions.fetchAllWarehouses({ page: 1, query: encodeURIComponent(event.target?.value), count: PAGINATION_LIMIT }));
        });
    }

    /**
     * Releases all the observables to avoid memory leaks
     *
     * @memberof WarehouseComponent
     */
    public async ngOnDestroy(): Promise<any> {
        this.store.dispatch(this.itemOnBoardingActions.getOnBoardingResetAction());
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Step 2 (Welcome page) form submit handler responsible for creation of warehouse
     *
     * @param {*} formData User entered data in form
     * @memberof WarehouseComponent
     */
    public handleFormSubmit(formData: any): void {
        this.resetWelcomeForm();
        if (formData && formData.otherData) {
            const { controls: formControls } = formData.welcomeForm;
            if (formControls) {
                const requestParamter = this.settingsUtilityService.getCreateWarehouseRequestObject(formControls);
                if (this.itemOnBoardingDetails && this.itemOnBoardingDetails.isItemUpdateInProgress) {
                    requestParamter['warehouseUniqueName'] = this.selectedWarehouse?.uniqueName;
                    this.store.dispatch(this.warehouseActions.updateWarehouse(requestParamter));
                } else {
                    this.store.dispatch(this.warehouseActions.createWarehouse(requestParamter));
                }
            }
        }
    }

    /**
     * Handles the update warehouse flow
     *
     * @param {*} warehouse Warehouse to update
     * @memberof WarehouseComponent
     */
    public editWarehouse(warehouse: any): void {
        this.selectedWarehouse = warehouse;
        this.loadAddresses('GET', () => {
            this.warehouseToUpdate = {
                name: warehouse.name,
                // address: warehouse.address,
                linkedEntities: warehouse.addresses || []
            };

            this.asideAccountAsidePaneDialogRef = this.dialog.open(this.asideAccountAsidePane, ASIDE_PANE_CONFIG);
        });
    }

    /**
     * Page change event handler
     *
     * @param {PageChangedEvent} event Page changed event
     * @memberof WarehouseComponent
     */
    /**
     * Handles the page change event from mat-paginator
     *
     * @param {PageEvent} event Page event
     * @memberof WarehouseComponent
     */
    public handlePageEvent(event: PageEvent): void {
        this.showLoader = true;
        this.currentPage = event.pageSize !== this.paginationLimit ? 1 : event.pageIndex + 1;
        this.paginationLimit = event.pageSize;
        this.store.dispatch(this.warehouseActions.fetchAllWarehouses({ page: this.currentPage, count: this.paginationLimit }));
    }



    /**
     * Resets the on boarding form
     *
     * @private
     * @memberof WarehouseComponent
     */
    public resetOnboardingForm(): void {
        this.generalService.createNewCompany = null;
        this.store.dispatch(this.commonActions.resetCountry());
        this.store.dispatch(this.companyActions.removeCompanyCreateSession());
    }

    /**
     * Set the warehouse as default warehouse
     *
     * @param {*} warehouse Selected warehouse to set as default
     * @param {number} warehouseIndex Selected warehouse index
     * @memberof WarehouseComponent
     */
    public setAsDefault(warehouse: any, warehouseIndex: number): void {
        if (!warehouse.isDefault) {
            this.store.dispatch(this.warehouseActions.setAsDefaultWarehouse({
                warehouseUniqueName: warehouse?.uniqueName,
                warehouseIndex
            }));
        }
    }

    /**
     * Resets the search filter
     *
     * @memberof WarehouseComponent
     */
    public resetFilter(): void {
        this.searchWarehouseQuery = '';
        this.showLoader = true;
        this.store.dispatch(this.warehouseActions.fetchAllWarehouses({ page: 1, count: PAGINATION_LIMIT }));
    }

    /**
     * Toggle aside pane
     *
     * @param {*} [event] Event
     * @memberof WarehouseComponent
     */
    public closeAsidePane(event?: any): void {
        this.isWarehouseUpdateInProgress = false;
        this.asideAccountAsidePaneDialogRef?.close();
    }

    /**
     * Updates warehouse info
     *
     * @param {*} warehouseDetails Warehouse details
     * @memberof WarehouseComponent
     */
    public updateWarehouseInfo(warehouseDetails: any): void {
        warehouseDetails.formValue.linkedEntity = warehouseDetails.formValue.linkedEntity || [];
        this.isWarehouseUpdateInProgress = true;
        const linkAddresses = warehouseDetails.addressDetails.linkedEntities?.filter(entity => (warehouseDetails.formValue.linkedEntity.includes(entity?.uniqueName))).map(filteredEntity => ({
            uniqueName: filteredEntity?.uniqueName,
            isDefault: filteredEntity.isDefault,
        }));
        const requestObj = {
            name: warehouseDetails.formValue.name,
            warehouseUniqueName: this.selectedWarehouse?.uniqueName,
            linkAddresses
        };
        this.settingsProfileService.updatWarehouseInfo(requestObj).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === 'success') {
                this.store.dispatch(this.warehouseActions.fetchAllWarehouses({ page: 1, count: PAGINATION_LIMIT }));
                this.toasterService.successToast(this.localeData?.warehouse_updated);
                this.closeAsidePane();
            } else {
                this.toasterService.errorToast(response?.message);
            }
            this.isWarehouseUpdateInProgress = false;
        }, () => {
            this.isWarehouseUpdateInProgress = false;
        });
    }

    /**
     * Initializes all the subscribers to warehouse store
     *
     * @private
     * @memberof WarehouseComponent
     */
    private initSubscribers(): void {
        this.allWarehouses$ = this.store.pipe(select(store => store.warehouse.warehouses), takeUntil(this.destroyed$));
        this.store.pipe(select(state => state.itemOnboarding), takeUntil(this.destroyed$)).subscribe((itemOnBoardingDetails: ItemOnBoardingState) => {
            this.itemOnBoardingDetails = itemOnBoardingDetails;
        });
        this.store.pipe(select(state => state.warehouse), takeUntil(this.destroyed$)).subscribe(async (warehouseState: WarehouseState) => {
            if (warehouseState && (warehouseState.warehouseCreated || warehouseState.warehouseUpdated)) {
                // Warehouse creation or updation is successful
                this.endOnBoarding();
                this.store.dispatch(this.warehouseActions.resetCreateWarehouse());
                this.store.dispatch(this.warehouseActions.resetUpdateWarehouse());
                this.showLoader = true;
                this.store.dispatch(this.warehouseActions.fetchAllWarehouses({ page: 1, count: PAGINATION_LIMIT }));
            }
            if (warehouseState && warehouseState.defaultWarehouseData) {
                this.resetDefaultWarehouse();
                this.setDefaulWarehouse(warehouseState.defaultWarehouseData);
            }
        });
        this.allWarehouses$.pipe(takeUntil(this.destroyed$)).subscribe((warehouseData: any) => {
            if (warehouseData) {
                this.warehouses = warehouseData.results;
                this.paginationConfig = {
                    count: warehouseData.count,
                    totalItems: warehouseData.totalItems,
                    totalPages: warehouseData.totalPages,
                }
                this.showLoader = false;
            }
        });
    }

    /**
     * Ends the on boarding process
     *
     * @private
     * @memberof WarehouseComponent
     */
    private endOnBoarding(): void {
        this.store.dispatch(this.itemOnBoardingActions.getOnBoardingResetAction());
    }

    /**
     * Resets the welcome form
     *
     * @private
     * @memberof WarehouseComponent
     */
    private resetWelcomeForm(): void {
        this.store.dispatch(this.generalActions.resetStatesList());
        this.store.dispatch(this.commonActions.resetOnboardingForm());
    }

    /**
     * Resets the isDefault flag for older default warehouse
     *
     * @private
     * @memberof WarehouseComponent
     */
    private resetDefaultWarehouse(): void {
        for (let index = 0; index < this.warehouses?.length; index++) {
            if (this.warehouses[index].isDefault) {
                this.warehouses[index].isDefault = false;
                break;
            }
        }
        this.store.dispatch(this.warehouseActions.resetDefaultWarehouseResponse());
    }

    /**
     * Sets the new warehouse as default warehouse
     *
     * @private
     * @param {*} defaultWarehouseData Warehouse data to be set as default
     * @memberof WarehouseComponent
     */
    private setDefaulWarehouse(defaultWarehouseData: any): void {
        if (defaultWarehouseData && defaultWarehouseData.body) {
            const warehouseIndex = defaultWarehouseData.request.warehouseIndex;
            this.warehouses[warehouseIndex].isDefault = true;
        }
    }

    /**
     * Loads all the addresses
     *
     * @private
     * @param {string} method API call method ('GET' for fetching and 'POST' for searching)
     * @param {Function} successCallback Callback to carry out further operations
     * @memberof WarehouseComponent
     */
    private loadAddresses(method: string, successCallback: Function): void {
        this.settingsProfileService.getCompanyAddresses(method, { count: 0 }).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response && response.body && response.status === 'success') {
                this.addressConfiguration.linkedEntities = this.settingsUtilityService.getFormattedCompanyAddresses(response.body.results).map(address => (
                    {
                        ...address,
                        isDefault: false,
                        label: address?.name,
                        value: address?.uniqueName
                    }));
                if (successCallback) {
                    successCallback();
                }
            }
        });
    }

    /**
     * This will show confirmation modal for warehouse archive/unarchive
     *
     * @param {*} warehouse
     * @memberof WarehouseComponent
     */
    public confirmStatusUpdate(warehouse: any): void {
        if (!warehouse?.isDefault || warehouse?.isArchived) {
            this.warehouseStatusToUpdate = warehouse;
            this.statusModalRef = this.dialog.open(this.statusModal, {
                        panelClass: 'modal-dialog',
                        width: '1000px',
                    });
        } else {
            this.toasterService.warningToast(this.localeData?.archive_notallowed);
        }
    }

    /**
     * Updates the warehouse status
     *
     * @memberof WarehouseComponent
     */
    public updateWarehouseStatus(): void {
        const isArchived = !this.warehouseStatusToUpdate?.isArchived;
        this.settingsWarehouseService.updateWarehouseStatus({ isArchived: isArchived }, this.warehouseStatusToUpdate?.uniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                this.store.dispatch(this.warehouseActions.fetchAllWarehouses({ page: this.currentPage, count: PAGINATION_LIMIT }));
                this.toasterService.successToast((isArchived) ? this.localeData?.warehouse_archived : this.localeData?.warehouse_unarchived);
            } else {
                this.toasterService.errorToast(response?.message);
            }
            this.statusModalRef?.close();
        });
    }

    /**
     * Opens the address info
     *
     * @param {boolean} isOpen
     * @param {string} [uniqueName='']
     * @memberof BranchComponent
     */
    public openAddressInfo(isOpen: boolean, uniqueName: string = ''): void {
        this.isLastAddressInfoOpen = isOpen;
        if (isOpen) {
            this.isAddressInfoOpen = uniqueName;
        } else {
            setTimeout(() => {
                if (!this.isLastAddressInfoOpen) {
                    this.isAddressInfoOpen = '';
                }
            }, 100);
        }
    }
}
