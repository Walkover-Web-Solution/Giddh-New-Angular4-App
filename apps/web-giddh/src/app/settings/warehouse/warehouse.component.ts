import { Component, ComponentFactoryResolver, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { BsDropdownConfig, BsModalRef, BsModalService, ModalDirective, ModalOptions } from 'ngx-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ItemOnBoardingActions } from '../../actions/item-on-boarding/item-on-boarding.action';
import { OnBoardingType } from '../../app.constant';
import { OnBoardingComponent } from '../../shared/header/components';
import { ElementViewContainerRef } from '../../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { ItemOnBoarding } from '../../store/item-on-boarding/item-on-boarding.reducer';
import { AppState } from '../../store/roots';
import { SettingsUtilityService } from '../services/settings-utility.service';
import { WarehouseActions } from './action/warehouse.action';

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
    providers: [{ provide: BsDropdownConfig, useValue: { autoClose: false } }]
})
export class WarehouseComponent implements OnInit, OnDestroy {

    /** Image path relative to app environment */
    public imgPath: string = '';
    /** Stores item on boarding details */
    public itemOnBoardingDetails: ItemOnBoarding;

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
        private store: Store<AppState>,
        private itemOnBoardingActions: ItemOnBoardingActions,
        private bsModalService: BsModalService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private settingsUtilityService: SettingsUtilityService,
        private warehouseActions: WarehouseActions
    ) { }

    /**
     * Initializes the component
     *
     * @memberof WarehouseComponent
     */
    public ngOnInit(): void {
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
        this.store.pipe(select(state => state.itemOnboarding), takeUntil(this.destroyed$)).subscribe((itemOnBoardingDetails: ItemOnBoarding) => {
            this.itemOnBoardingDetails = itemOnBoardingDetails;
        });
    }

    /**
     * Releases all the observables to avoid memory leaks
     *
     * @memberof WarehouseComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Displays the create company modal
     *
     * @memberof WarehouseComponent
     */
    public openCreateCompanyModal(): void {
        this.startOnBoarding();
        this.prepareNewCompanyModal();
        this.warehouseOnBoardingModal.show();
    }

    /**
     * Hides the welcome page modal once the user presses 'back' button
     * on Welcome page
     *
     * @memberof WarehouseComponent
     */
    public hideWelcomePage(): void {
        if (this.welcomePageModalInstance) {
            this.welcomePageModalInstance.hide();
            this.openCreateCompanyModal();
        }
    }

    /**
     * Form submit handler responsible for creation of warehouse
     *
     * @param {*} formData
     * @memberof WarehouseComponent
     */
    public handleFormSubmit(formData: any): void {
        if (formData) {
            const { controls: formControls } = formData.welcomeForm;
            if (formControls && formData.otherData) {
                const requestParamter = this.settingsUtilityService.getWarehouseRequestObject(formControls, formData.otherData.taxName);
                console.log('Request: ', requestParamter);
                this.store.dispatch(this.warehouseActions.createWarehouse(requestParamter));
            }
        }
    }

    public onModalDismiss(event: ModalDirective) {
        if (event.dismissReason) {
            this.endOnBoarding();
        }
    }

    /**
     * Ends the on boarding process
     *
     * @private
     * @memberof WarehouseComponent
     */
    private endOnBoarding(): void {
        this.store.dispatch(this.itemOnBoardingActions.getOnBoardingStatusAction(false));
        this.store.dispatch(this.itemOnBoardingActions.getOnBoardingTypeAction(null));
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
     * new company modal
     *
     * @private
     * @memberof WarehouseComponent
     */
    private prepareNewCompanyModal(): void {
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
     * Displays the welcome page for second step of warehouse on boarding
     *
     * @private
     * @memberof WarehouseComponent
     */
    private showWelcomePage(): void {
        if (this.itemOnBoardingDetails && this.itemOnBoardingDetails.isOnBoardingInProgress) {
            const modalConfig: ModalOptions = {
                class: 'warehouse-welcome-modal',
                animated: false,
                keyboard: false,
                backdrop: false
            };
            this.welcomePageModalInstance = this.bsModalService.show(this.welcomeComponentTemplate, modalConfig);
        }
    }
}
