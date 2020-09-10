import { Component, OnInit, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { ManageGroupsAccountsComponent } from '../shared/header/components';
import { ElementViewContainerRef } from '../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { ModalDirective } from 'ngx-bootstrap';
import { take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store';
import { GeneralActions } from '../actions/general/general.actions';
import { GroupWithAccountsAction } from '../actions/groupwithaccounts.actions';
import { GeneralService } from '../services/general.service';
import { VAT_SUPPORTED_COUNTRIES } from '../app.constant';
import { NavigationExtras, Router } from '@angular/router';
import { PermissionService } from '../services/permission.service';

@Component({
    selector: 'all-modules',
    templateUrl: './all-modules.component.html',
    styleUrls: ['all-modules.component.scss']
})

export class AllModulesComponent implements OnInit {

    @ViewChild('addmanage') public addmanage: ElementViewContainerRef;
    @ViewChild('manageGroupsAccountsModal') public manageGroupsAccountsModal: ModalDirective;
    public vatSupportedCountries = VAT_SUPPORTED_COUNTRIES;
    /** To show loader if API calling in progress */
    public showLoader: boolean = false;
    /** All modules data array with routing shared with user */
    public allModulesList = [];
    constructor(private componentFactoryResolver: ComponentFactoryResolver, private store: Store<AppState>, private generalActions: GeneralActions, private groupWithAccountsAction: GroupWithAccountsAction, private generalService: GeneralService, private route: Router, private permissionService: PermissionService) {

    }

    /**
     * Initializes the component
     *
     * @memberof AllModulesComponent
     */
    public ngOnInit(): void {
        // commenting for later use if required
        // this.store.pipe(select(state => state.session.companies), take(1)).subscribe(companies => {
        //     companies = companies || [];
        //     this.activeCompany = companies.find(company => company.uniqueName === this.generalService.companyUniqueName);

        //     if(this.activeCompany && this.activeCompany.createdBy && this.activeCompany.createdBy.email) {
        //         this.isAllowedForBetaTesting = this.generalService.checkIfEmailDomainAllowed(this.activeCompany.createdBy.email);
        //     }
        // });
        this.getSharedAllModules();
    }

    /**
     * This will initiate the manage groups and account popup data and will call function to show popup
     *
     * @memberof AllModulesComponent
     */
    public showManageGroupsModal(): void {
        this.store.dispatch(this.groupWithAccountsAction.getGroupWithAccounts(''));
        this.loadAddManageComponent();
        this.manageGroupsAccountsModal.show();
    }

    /**
     * This will show the manage groups and account popup
     *
     * @memberof AllModulesComponent
     */
    public loadAddManageComponent(): void {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(ManageGroupsAccountsComponent);
        let viewContainerRef = this.addmanage.viewContainerRef;
        viewContainerRef.clear();
        let componentRef = viewContainerRef.createComponent(componentFactory);
        (componentRef.instance as ManageGroupsAccountsComponent).closeEvent.subscribe((a) => {
            this.hideManageGroupsModal();
            viewContainerRef.remove();
        });
        this.manageGroupsAccountsModal.onShown.subscribe((a => {
            (componentRef.instance as ManageGroupsAccountsComponent).headerRect = (componentRef.instance as ManageGroupsAccountsComponent).header.nativeElement.getBoundingClientRect();
            (componentRef.instance as ManageGroupsAccountsComponent).myModelRect = (componentRef.instance as ManageGroupsAccountsComponent).myModel.nativeElement.getBoundingClientRect();
        }));
    }

    /**
     * This will hide the manage groups and account popup
     *
     * @memberof AllModulesComponent
     */
    public hideManageGroupsModal(): void {
        this.store.select(company => company.session.lastState).pipe(take(1)).subscribe((state: string) => {
            if (state && (state.indexOf('ledger/') > -1 || state.indexOf('settings') > -1)) {
                this.store.dispatch(this.generalActions.addAndManageClosed());
            }
        });

        this.manageGroupsAccountsModal.hide();
    }

    /**
     * To navigate specific modules
     *
     * @param {*} route routing string
     * @param {*} queryParamsItem query params
     * @param {*} isClickMethod to check is click method exist
     * @memberof AllModulesComponent
     */
    public navigateTo(route: any, queryParamsItem: any, isClickMethod: any) {
        if (route) {
            if (!queryParamsItem) {
                this.route.navigate([route]);
            } else {
                let navigationExtras: NavigationExtras = {
                    queryParams: queryParamsItem
                };
                this.route.navigate([route], navigationExtras);
            }
        }
        if (isClickMethod === 'showManageGroupsModal') {
            this.showManageGroupsModal();
        }
    }

    /**
     * To get all shared modules with their routings
     *
     * @memberof AllModulesComponent
     */
    public getSharedAllModules(): void {
        this.showLoader = true;
        this.permissionService.getSharedAllModules().subscribe(response => {
            if (response && response.status === 'success') {
                this.allModulesList = response.body;
            }
            this.showLoader = false;
        });
    }
}
