import { Component, ComponentFactoryResolver, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { BsDropdownConfig, BsModalService, ModalDirective, ModalOptions } from 'ngx-bootstrap';

import { CompanyActions } from '../../actions/company.actions';
import { ItemOnBoardingActions } from '../../actions/item-on-boarding/item-on-boarding.action';
import { SettingsBranchActions } from '../../actions/settings/branch/settings.branch.action';
import { SettingsProfileActions } from '../../actions/settings/profile/settings.profile.action';
import { OnBoardingType } from '../../app.constant';
import { OnBoardingComponent } from '../../shared/header/components';
import { ElementViewContainerRef } from '../../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { AppState } from '../../store/roots';

/**
 * Warehouse component
 *
 * @export
 * @class WarehouseComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'setting-warehouse',
    templateUrl: './warehouse.component.html',
    styleUrls: ['./warehouse.component.scss'],
    providers: [{ provide: BsDropdownConfig, useValue: { autoClose: false } }]
})

export class WarehouseComponent implements OnInit {

    public imgPath: string = '';

    @ViewChild('companyadd') public companyadd: ElementViewContainerRef;

    @ViewChild('addCompanyModal') public addCompanyModal: ModalDirective;

    /** Welcome component template ref for second step of warehouse on boarding */
    @ViewChild('welcomeComponent') public welcomeComponentTemplate: TemplateRef<any>;

    /** @ignore */
    constructor(
        private store: Store<AppState>,
        private itemOnBoardingActions: ItemOnBoardingActions,
        private settingsBranchActions: SettingsBranchActions,
        private bsModalService: BsModalService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private companyActions: CompanyActions,
        private settingsProfileActions: SettingsProfileActions
    ) { }

    /**
     * Initializes the component
     *
     * @memberof WarehouseComponent
     */
    public ngOnInit(): void {
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
    }

    /**
     * Displays the create company modal
     *
     * @memberof WarehouseComponent
     */
    public openCreateCompanyModal(): void {
        this.prepareNewCompanyModal();
        this.addCompanyModal.show();
    }

    /**
     * Hides the create company modal
     *
     * @private
     * @memberof WarehouseComponent
     */
    private hideAddCompanyModal(): void {
        this.addCompanyModal.hide();
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
        let viewContainerRef = this.companyadd.viewContainerRef;
        viewContainerRef.clear();
        let componentRef = viewContainerRef.createComponent(componentFactory);
        (componentRef.instance as OnBoardingComponent).onboardingType = OnBoardingType.Warehouse;
        (componentRef.instance as OnBoardingComponent).closeCompanyModal.subscribe((data: any) => {
            if (data && data.isFirstStepCompleted) {
                this.store.dispatch(this.itemOnBoardingActions.getOnBoardingStatusAction(true));
                this.store.dispatch(this.itemOnBoardingActions.getOnBoardingTypeAction(OnBoardingType.Warehouse));
                this.showWelcomePage();
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
        const modalConfig: ModalOptions = {
            class: 'warehouse-welcome-modal',
            animated: false,
            keyboard: false,
            backdrop: false
        };
        this.bsModalService.show(this.welcomeComponentTemplate, modalConfig);
    }

}
