import { Component, ComponentFactoryResolver, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { BsDropdownConfig, BsModalRef, BsModalService, ModalDirective, ModalOptions } from 'ngx-bootstrap';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CommonActions } from '../../actions/common.actions';
import { GeneralActions } from '../../actions/general/general.actions';
import { ItemOnBoardingActions } from '../../actions/item-on-boarding/item-on-boarding.action';
import { OnBoardingType } from '../../app.constant';
import { OnBoardingComponent } from '../../shared/on-boarding/on-boarding.component';
import { ElementViewContainerRef } from '../../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { ItemOnBoardingState } from '../../store/item-on-boarding/item-on-boarding.reducer';
import { AppState } from '../../store/roots';
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
    providers: [{ provide: BsDropdownConfig, useValue: { autoClose: true } }]
})
export class WarehouseComponent implements OnInit, OnDestroy {

    /** Image path relative to app environment */
    public imgPath: string = '';
    /** Stores item on boarding details */
    public itemOnBoardingDetails: ItemOnBoardingState;
    /** Observable that keep track of all warehouses created for a company */
    public allWarehouses$: Observable<any>;
    /** Selected warehouse for welcome page to update warehouse information */
    public selectedWarehouse: any;

    /** View container to carry out on boarding */
    @ViewChild('onBoardingContainer') public onBoardingContainer: ElementViewContainerRef;
    /** Warehouse on boarding modal viewchild */
    @ViewChild('warehouseOnBoardingModal') public warehouseOnBoardingModal: ModalDirective;
    /** Welcome component template ref for second step of warehouse on boarding */
    @ViewChild('welcomeComponent') public welcomeComponentTemplate: TemplateRef<any>;

    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: Subject<boolean> = new Subject();
    /** Stores the current visible on boarding modal instance */
    private welcomePageModalInstance: BsModalRef;

    /** @ignore */
    constructor(
        private bsModalService: BsModalService,
        private commonActions: CommonActions,
        private componentFactoryResolver: ComponentFactoryResolver,
        private generalActions: GeneralActions,
        private itemOnBoardingActions: ItemOnBoardingActions,
        private settingsUtilityService: SettingsUtilityService,
        private store: Store<AppState>,
        private warehouseActions: WarehouseActions
    ) { }

    /**
     * Initializes the component
     *
     * @memberof WarehouseComponent
     */
    public ngOnInit(): void {
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
        this.allWarehouses$ = this.store.pipe(select(store => store.warehouse.warehouses), takeUntil(this.destroyed$));
        this.store.dispatch(this.warehouseActions.fetchAllWarehouses());
        this.store.pipe(select(state => state.itemOnboarding), takeUntil(this.destroyed$)).subscribe((itemOnBoardingDetails: ItemOnBoardingState) => {
            this.itemOnBoardingDetails = itemOnBoardingDetails;
        });
        this.store.pipe(select(state => state.warehouse), takeUntil(this.destroyed$)).subscribe(async (warehouseState: WarehouseState) => {
            if (warehouseState && (warehouseState.warehouseCreated || warehouseState.warehouseUpdated)) {
                await this.hideWelcomePage();
                this.endOnBoarding();
                this.store.dispatch(this.warehouseActions.resetCreateWarehouse());
                this.store.dispatch(this.warehouseActions.resetUpdateWarehouse());
                this.store.dispatch(this.warehouseActions.fetchAllWarehouses());
            }
        });
    }

    /**
     * Releases all the observables to avoid memory leaks
     *
     * @memberof WarehouseComponent
     */
    public ngOnDestroy(): void {
        this.store.dispatch(this.itemOnBoardingActions.getOnBoardingResetAction());
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
                const requestParamter = this.settingsUtilityService.getCreateWarehouseRequestObject(formControls, formData.otherData.taxName);
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
        this.startOnBoarding();
        this.store.dispatch(this.itemOnBoardingActions.getItemUpdateAction(true));
        this.showWelcomePage();
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
     * @memberof WarehouseComponent
     */
    private hideAddCompanyModal(): void {
        this.warehouseOnBoardingModal.hide();
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
        (componentRef.instance as OnBoardingComponent).onboardingType = OnBoardingType.Warehouse;
        (componentRef.instance as OnBoardingComponent).closeCompanyModal.subscribe((data: any) => {
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
}
