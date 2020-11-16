import { Component, OnInit, ComponentFactoryResolver, ViewChild, OnDestroy } from '@angular/core';
import { ManageGroupsAccountsComponent } from '../shared/header/components';
import { ElementViewContainerRef } from '../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { take, takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store';
import { GeneralActions } from '../actions/general/general.actions';
import { GroupWithAccountsAction } from '../actions/groupwithaccounts.actions';
import { GeneralService } from '../services/general.service';
import { VAT_SUPPORTED_COUNTRIES } from '../app.constant';
import { NavigationExtras, Router } from '@angular/router';
import { PermissionService } from '../services/permission.service';
import { IUlist, ICompAidata } from '../models/interfaces/ulist.interface';
import { CompAidataModel } from '../models/db';
import { ReplaySubject } from 'rxjs';
import { DbService } from '../services/db.service';
import { NAVIGATION_ITEM_LIST } from '../models/defaultMenus';
import { find } from '../lodash-optimized';
import { OrganizationType } from '../models/user-login-state';
import { CurrentPage } from '../models/api-models/Common';

@Component({
    selector: 'all-modules',
    templateUrl: './all-modules.component.html',
    styleUrls: ['all-modules.component.scss']
})

export class AllModulesComponent implements OnInit, OnDestroy {

    @ViewChild('addmanage', { static: true }) public addmanage: ElementViewContainerRef;
    @ViewChild('manageGroupsAccountsModal', { static: true }) public manageGroupsAccountsModal: ModalDirective;

    public activeCompany: any;
    public vatSupportedCountries = VAT_SUPPORTED_COUNTRIES;
    /** To show loader if API calling in progress */
    public showLoader: boolean = false;
    /** All modules data array with routing shared with user */
    public allModulesList = [];
    /* This will check if company is allowed to beta test new modules */
    public isAllowedForBetaTesting: boolean = false;
    /* This will hold company data */
    private activeCompanyForDb: ICompAidata;
    /* Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private componentFactoryResolver: ComponentFactoryResolver, private store: Store<AppState>, private generalActions: GeneralActions, private groupWithAccountsAction: GroupWithAccountsAction, private generalService: GeneralService, private route: Router, private permissionService: PermissionService, private dbService: DbService) {

    }

    /**
     * Initializes the component
     *
     * @memberof AllModulesComponent
     */
    public ngOnInit(): void {
        // commenting for later use if required
        this.store.pipe(select(state => state.session.companies), take(1)).subscribe(companies => {
            companies = companies || [];
            this.activeCompany = companies.find(company => company.uniqueName === this.generalService.companyUniqueName);
            if(this.activeCompany && this.activeCompany.createdBy && this.activeCompany.createdBy.email) {
                this.isAllowedForBetaTesting = this.generalService.checkIfEmailDomainAllowed(this.activeCompany.createdBy.email);
            }
        });
        this.store.pipe(select((state: AppState) => state.session.companies), takeUntil(this.destroyed$)).subscribe(companies => {
            if (!companies) {
                return;
            }
            if (companies.length === 0) {
                return;
            }
            let selectedCmp = companies.find(cmp => {
                if (cmp && cmp.uniqueName) {
                    return cmp.uniqueName === this.generalService.companyUniqueName;
                } else {
                    return false;
                }
            });
            if (!selectedCmp) {
                return;
            }
            this.activeCompanyForDb = new CompAidataModel();
            this.activeCompanyForDb.name = selectedCmp.name;
            this.activeCompanyForDb.uniqueName = selectedCmp.uniqueName;
        });
        // commenting for later use
        // this.getSharedAllModules();
        let currentPageObj = new CurrentPage();
        currentPageObj.name = "All Modules";
        currentPageObj.url = "";
        this.store.dispatch(this.generalActions.setPageTitle(currentPageObj));
    }

    /**
     * Releases the memory
     *
     * @memberof AllModulesComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
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
        this.store.pipe(select(company => company.session.lastState), take(1)).subscribe((state: string) => {
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
    public navigateTo(route: any, queryParamsItem: any, isClickMethod: any): void {
        if (route) {
            this.analyzeMenus(route, queryParamsItem);

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

    /**
     * Save clicked menu items in DB
     *
     * @param {string} pageName
     * @param {*} [queryParamsObj]
     * @memberof AllModulesComponent
     */
    public analyzeMenus(pageName: string, queryParamsObj?: any): void {
        let menu: any = {};
        menu.time = +new Date();

        let menuItem: IUlist = find(NAVIGATION_ITEM_LIST, (item) => {
            if (queryParamsObj) {
                if (item.additional) {
                    return item.uniqueName.toLowerCase() === pageName.toLowerCase() && item.additional.tabIndex === queryParamsObj.tabIndex;
                }
            } else {
                return item.uniqueName.toLocaleLowerCase() === pageName.toLowerCase();
            }
        });

        if (menuItem) {
            menu = { ...menu, ...menuItem };
        } else {
            try {
                menu.name = pageName.split('/pages/')[1].toLowerCase();
                if (!menu.name) {
                    menu.name = pageName.split('/')[1].toLowerCase();
                }
            } catch (error) {
                menu.name = pageName.toLowerCase();
            }
            menu.name = this.getReadableNameFromUrl(menu.name);
            menu.uniqueName = pageName.toLowerCase();
            menu.type = 'MENU';

            if (queryParamsObj) {
                menu.additional = queryParamsObj;
            }
        }
        this.doEntryInDb('menus', menu);
    }

    /**
     * This will match the url
     *
     * @private
     * @param {*} url
     * @returns {string}
     * @memberof AllModulesComponent
     */
    private getReadableNameFromUrl(url: any): string {
        let name = '';
        switch (url) {
            case 'SETTINGS?TAB=PERMISSION&TABINDEX=5':
                name = 'Settings > Permission';
                break;
            case 'user-details/profile':
                name = 'User Details';
                break;
            case 'inventory-in-out':
                name = 'Inventory In/Out';
                break;
            case 'import/select-type':
                name = 'Import Data';
                break;
            default:
                name = url;
        }
        return name;
    }

    /**
     * This will add menu item in DB
     *
     * @private
     * @param {string} entity
     * @param {IUlist} item
     * @param {{ next: IUlist, previous: IUlist }} [fromInvalidState=null]
     * @memberof AllModulesComponent
     */
    private doEntryInDb(entity: string, item: IUlist, fromInvalidState: { next: IUlist, previous: IUlist } = null): void {
        if (this.activeCompanyForDb && this.activeCompanyForDb.uniqueName) {
            let isSmallScreen: boolean = !(window.innerWidth > 1440 && window.innerHeight > 717);
            let branches = [];
            this.store.pipe(select(appStore => appStore.settings.branches), take(1)).subscribe(response => {
                branches = response || [];
            });
            this.dbService.addItem(this.activeCompanyForDb.uniqueName, entity, item, fromInvalidState, isSmallScreen,
                this.generalService.currentOrganizationType === OrganizationType.Company && branches.length > 1);
        }
    }
}
