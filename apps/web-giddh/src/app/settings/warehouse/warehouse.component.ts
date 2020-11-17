import { animate, state, style, transition, trigger } from '@angular/animations';
import {
    AfterViewInit,
    Component,
    ComponentFactoryResolver,
    ElementRef,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { BsModalRef, BsModalService, ModalDirective, ModalOptions } from 'ngx-bootstrap/modal';
import { PageChangedEvent, PaginationComponent } from 'ngx-bootstrap/pagination';
import { fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { CommonActions } from '../../actions/common.actions';
import { CompanyActions } from '../../actions/company.actions';
import { GeneralActions } from '../../actions/general/general.actions';
import { ItemOnBoardingActions } from '../../actions/item-on-boarding/item-on-boarding.action';
import { OnBoardingType, PAGINATION_LIMIT } from '../../app.constant';
import { GeneralService } from '../../services/general.service';
import { SettingsProfileService } from '../../services/settings.profile.service';
import { ToasterService } from '../../services/toaster.service';
import { ElementViewContainerRef } from '../../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { OnBoardingComponent } from '../../shared/on-boarding/on-boarding.component';
import { ItemOnBoardingState } from '../../store/item-on-boarding/item-on-boarding.reducer';
import { AppState } from '../../store/roots';
import { SettingsAsideConfiguration, SettingsAsideFormType } from '../constants/settings.constant';
import { SettingsUtilityService } from '../services/settings-utility.service';
import { WarehouseActions } from './action/warehouse.action';
import { WarehouseState } from './reducer/warehouse.reducer';

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
    providers: [{ provide: BsDropdownConfig, useValue: { autoClose: true } }],
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
    /** Stores the list of warehouses */
    public warehouses: Array<any> = [];
    /** Warehouse search query */
    public searchWarehouseQuery: string = '';
    /** True, if API is in progress */
    public showLoader: boolean = true;
    /** 'in' if edit warehouse flow is carried out */
    public asideEditWarehousePane: string = 'out';
    /** True, if warehouse update is in progress */
    public isWarehouseUpdateInProgress: boolean;
    /** Warehouse details to update */
    public warehouseToUpdate: any;
    /** Stores the current organization uniqueName */
    public currentOrganizationUniqueName: string;


    /** View container to carry out on boarding */
    @ViewChild('onBoardingContainer', {static: true}) public onBoardingContainer: ElementViewContainerRef;
    /** Warehouse on boarding modal viewchild */
    @ViewChild('warehouseOnBoardingModal', {static: true}) public warehouseOnBoardingModal: ModalDirective;
    /** Welcome component template ref for second step of warehouse on boarding */
    @ViewChild('welcomeComponent', {static: true}) public welcomeComponentTemplate: TemplateRef<any>;
    /** Warehouse pagination instance */
    @ViewChild('warehousePagination', {static: true}) warehousePagination: PaginationComponent;
    /** Branch search field instance */
    @ViewChild('searchWarehouse', {static: false}) public searchWarehouse: ElementRef;

    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: Subject<boolean> = new Subject();
    /** Stores the current visible on boarding modal instance */
    private welcomePageModalInstance: BsModalRef;

    /** Stores the address configuration */
    public addressConfiguration: SettingsAsideConfiguration = {
        type: SettingsAsideFormType.EditWarehouse,
        linkedEntities: []
    };

    /** @ignore */
    constructor(
        private bsModalService: BsModalService,
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
        private warehouseActions: WarehouseActions
    ) { }

    /**
     * Initializes the component
     *
     * @memberof WarehouseComponent
     */
    public ngOnInit(): void {
        this.imgPath = (isElectron ||isCordova)  ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
        this.currentOrganizationUniqueName = this.generalService.currentBranchUniqueName || this.generalService.companyUniqueName;
        this.initSubscribers();
    }

    /**
     * Listens to the input change event of warehouse search filter
     *
     * @memberof WarehouseComponent
     */
    public ngAfterViewInit(): void {
        fromEvent(this.searchWarehouse.nativeElement, 'input').pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe((event: any) => {
            this.showLoader = true;
            this.store.dispatch(this.warehouseActions.fetchAllWarehouses({ page: 1, query: encodeURIComponent(event.target.value), count: PAGINATION_LIMIT }));
        });
    }

    /**
     * Releases all the observables to avoid memory leaks
     *
     * @memberof WarehouseComponent
     */
    public async ngOnDestroy(): Promise<any> {
        this.store.dispatch(this.itemOnBoardingActions.getOnBoardingResetAction());
        await this.hideAddCompanyModal();
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Displays the create warehouse modal
     *
     * @memberof WarehouseComponent
     */
    public openCreateWarehouseModal(): void {
        this.startOnBoarding();
        this.createNewWarehouseModal();
        this.warehouseOnBoardingModal.show();
    }

    /**
     * Hides the welcome page modal once the user presses 'back' button
     * on Welcome page
     *
     * @returns {Promise<any>} Promise to indicate successful hiding of model
     * @memberof WarehouseComponent
     */
    public hideWelcomePage(): Promise<any> {
        return new Promise((resolve) => {
            if (this.welcomePageModalInstance) {
                this.welcomePageModalInstance.hide();
                setTimeout(() => {
                    resolve();
                }, 500);
            }
        });
    }

    /**
     * Handler for back button on on boarding step 2 (Welcome page)
     *
     * @returns {Promise<any>} Promise to carry out further operation
     * @memberof WarehouseComponent
     */
    public async handleBackButtonClick(): Promise<any> {
        await this.hideWelcomePage();
        this.resetWelcomeForm();
        if (this.itemOnBoardingDetails) {
            if (!this.itemOnBoardingDetails.isItemUpdateInProgress) {
                this.openCreateWarehouseModal();
            } else {
                // Warehouse (item) update process was in progress, end it
                this.endOnBoarding();
                this.selectedWarehouse = null;
            }
        }
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
                    requestParamter['warehouseUniqueName'] = this.selectedWarehouse.uniqueName;
                    this.store.dispatch(this.warehouseActions.updateWarehouse(requestParamter));
                } else {
                    this.store.dispatch(this.warehouseActions.createWarehouse(requestParamter));
                }
            }
        }
    }

    /**
     * Handler to handle on boarding modal dismiss event
     *
     * @param {ModalDirective} event
     * @memberof WarehouseComponent
     */
    public onBoardingModalDismiss(event: ModalDirective) {
        if (event.dismissReason) {
            /* dismissReason is null if modal is dismissed
               with modal instance with hide() method (used in step 2 on Welcome page).
               End on boarding only when user closes the modal from
               step 1
            */
            this.endOnBoarding();
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
            this.toggleAsidePane();
        });
    }

    /**
     * Page change event handler
     *
     * @param {PageChangedEvent} event Page changed event
     * @memberof WarehouseComponent
     */
    public pageChanged(event: PageChangedEvent): void {
        this.showLoader = true;
        this.store.dispatch(this.warehouseActions.fetchAllWarehouses({ page: event.page, count: PAGINATION_LIMIT }));
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
                warehouseUniqueName: warehouse.uniqueName,
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
    public toggleAsidePane(event?: any): void {
        if (event) {
            event.preventDefault();
        }
        this.asideEditWarehousePane = this.asideEditWarehousePane === 'out' ? 'in' : 'out';
        this.isWarehouseUpdateInProgress = false;
        this.toggleBodyClass();
    }

    /**
     * Toggles fixed body class
     *
     * @memberof WarehouseComponent
     */
    public toggleBodyClass(): void {
        if (this.asideEditWarehousePane === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
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
        const linkAddresses = warehouseDetails.addressDetails.linkedEntities.filter(entity => (warehouseDetails.formValue.linkedEntity.includes(entity.uniqueName))).map(filteredEntity => ({
            uniqueName: filteredEntity.uniqueName,
            isDefault: filteredEntity.isDefault,
        }));
        const requestObj = {
            name: warehouseDetails.formValue.name,
            warehouseUniqueName: this.selectedWarehouse.uniqueName,
            linkAddresses
        };
        this.settingsProfileService.updatWarehouseInfo(requestObj).subscribe(response => {
            if (response.status === 'success') {
                this.asideEditWarehousePane = 'out';
                this.store.dispatch(this.warehouseActions.fetchAllWarehouses({ page: 1, count: PAGINATION_LIMIT }));
                this.toasterService.successToast('Warehouse updated successfully');
            } else {
                this.toasterService.errorToast(response.message);
            }
            this.isWarehouseUpdateInProgress = false;
        }, () => {
            this.isWarehouseUpdateInProgress = false;
        });
    }

    /**
     * Set default action handler
     *
     * @param {*} entity Entity to be set has default
     * @param {*} warehouse Selected warehouse for operation
     * @memberof WarehouseComponent
     */
    public setDefault(entity: any, warehouse: any): void {
        entity.isDefault = !entity.isDefault;
        warehouse.addresses.forEach(branchAddress => {
            if (branchAddress.uniqueName === entity.uniqueName) {
                branchAddress.isDefault = entity.isDefault;
            } else {
                branchAddress.isDefault = false;
            }
        });
        const requestObject: any = {
            name: warehouse.name,
            linkAddresses: warehouse.addresses,
            warehouseUniqueName: warehouse.uniqueName,
        }
        this.settingsProfileService.updatWarehouseInfo(requestObject).subscribe(() => {
            this.store.dispatch(this.warehouseActions.fetchAllWarehouses({ page: 1, count: PAGINATION_LIMIT }));
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
                await this.hideWelcomePage();
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
                setTimeout(() => {
                    if (this.warehousePagination) {
                        this.warehousePagination.writeValue(warehouseData.page);
                    }
                });
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
     * Starts the on boarding process
     *
     * @private
     * @memberof WarehouseComponent
     */
    private startOnBoarding(): void {
        this.store.dispatch(this.itemOnBoardingActions.getOnBoardingStatusAction(true));
        this.store.dispatch(this.itemOnBoardingActions.getOnBoardingTypeAction(OnBoardingType.Warehouse));
    }

    /**
     * Hides the create company modal
     *
     * @private
     * @returns {Promise<any>} Promise to carry out further operation
     * @memberof WarehouseComponent
     */
    private hideAddCompanyModal(): Promise<any> {
        return new Promise((resolve) => {
            if (this.warehouseOnBoardingModal && this.warehouseOnBoardingModal.isShown) {
                this.warehouseOnBoardingModal.hide();
                setTimeout(() => {
                    document.querySelectorAll('.modal-backdrop').forEach((backdrop: HTMLElement) => {
                        backdrop.style.setProperty('display', 'none', 'important');
                    });
                    resolve();
                }, 1000);
            }
        });
    }

    /**
     * Responsible for preparing the component to be shown in create
     * new warehouse modal
     *
     * @private
     * @memberof WarehouseComponent
     */
    private createNewWarehouseModal(): void {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(OnBoardingComponent);
        let viewContainerRef = this.onBoardingContainer.viewContainerRef;
        viewContainerRef.clear();
        let componentRef = viewContainerRef.createComponent(componentFactory);
        (componentRef.instance as OnBoardingComponent).onBoardingType = OnBoardingType.Warehouse;
        (componentRef.instance as OnBoardingComponent).closeCompanyModal.pipe(takeUntil(this.destroyed$)).subscribe((data: any) => {
            if (data && data.isFirstStepCompleted) {
                this.showWelcomePage();
            } else {
                this.endOnBoarding();
            }
            this.hideAddCompanyModal();
        });
    }

    /**
     * Displays the welcome page for second step of warehouse on boarding and for update
     * warehouse flow
     *
     * @private
     * @memberof WarehouseComponent
     */
    private showWelcomePage(): void {
        if (this.itemOnBoardingDetails &&
            (this.itemOnBoardingDetails.isOnBoardingInProgress || this.itemOnBoardingDetails.isItemUpdateInProgress)) {
            const modalConfig: ModalOptions = {
                class: 'warehouse-welcome-modal',
                animated: false,
                keyboard: false,
                backdrop: false
            };
            this.welcomePageModalInstance = this.bsModalService.show(this.welcomeComponentTemplate, modalConfig);
        }
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
        for (let index = 0; index < this.warehouses.length; index++) {
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
        this.settingsProfileService.getCompanyAddresses(method).subscribe((response) => {
            if (response && response.body && response.status === 'success') {
                this.addressConfiguration.linkedEntities = this.settingsUtilityService.getFormattedCompanyAddresses(response.body.results).map(address => (
                    {
                        ...address,
                        isDefault: false,
                        label: address.name,
                        value: address.uniqueName
                    }));
                if (successCallback) {
                    successCallback();
                }
            }
        });
    }
}
