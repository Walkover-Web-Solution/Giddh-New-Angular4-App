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

@Component({
    selector: 'all-modules',
    templateUrl: './all-modules.component.html',
    styleUrls: ['all-modules.component.scss']
})

export class AllModulesComponent implements OnInit {

    @ViewChild('addmanage') public addmanage: ElementViewContainerRef;
    @ViewChild('manageGroupsAccountsModal') public manageGroupsAccountsModal: ModalDirective;

    public activeCompany: any;
    public vatSupportedCountries = VAT_SUPPORTED_COUNTRIES;
    /* This will check if company is allowed to beta test new modules */
    public isAllowedForBetaTesting: boolean = false;
    public list = [{
        "groupHeading": "General",
        "items": [
            {
                "routerLink": "/pages/contact/customer",
                "queryParams": '{"tab": "customer", "tabIndex": 0}',
                "name": "Customer",
                "isAvailable": null,
                "isClick": null
            },
            {
                "routerLink": "/pages/contact/aging-report",
                "queryParams": null,
                "name": "Aging Report ",
                "isAvailable": null,
                "isClick": null
            },
            {
                "name": "Vendor",
                "routerLink": "/pages/contact/vendor",
                "queryParams": '{"tab": "vendor", "tabIndex": 0}',
                "isAvailable": null,
                "isClick": null
            },
            {
                "name": "Journal Voucher *",
                "routerLink": "/pages/journal-voucher",
                "queryParams": '{"tab": "vendor", "tabIndex": 0}',
                "isAvailable": "isAllowedForBetaTesting",
                "isClick": null
            },
            {
                "name": "Create Account",
                "routerLink": "/pages/journal-voucher",
                "queryParams": null,
                "isAvailable": null,
                "isClick": "showManageGroupsModal"
            }
        ]
    },
    {
        "groupHeading": "Invoice",
        "items": [
            {
                "name": "Cash Invoice",
                "routerLink": "/pages/proforma-invoice/invoice/cash",
                "queryParams": null,
                "isAvailable": null,
                "isClick": null
            },
            {
                "routerLink": "/pages/proforma-invoice/invoice/sales",
                "queryParams": null,
                "name": "Sales Invoice",
                "isAvailable": null,
                "isClick": null
            },
            {
                "name": "Purchase Record",
                "routerLink": "/pages/proforma-invoice/invoice/purchase",
                "queryParams": null,
                "isAvailable": null,
                "isClick": null
            },
            {
                "name": "Dr/Cr Note",
                "routerLink": "/pages/invoice/preview/credit note",
                "queryParams": '{"tab": "credit note", "tabIndex": 1}',
                "isAvailable": null,
                "isClick": null
            },
            {
                "name": "Receipt Voucher",
                "routerLink": null,
                "queryParams": null,
                "isAvailable": null,
                "isClick": null
            },
            {
                "name": "Invoice Management",
                "routerLink": "/pages/invoice/preview/sales",
                "queryParams": null,
                "isAvailable": null,
                "isClick": null
            },
            {
                "name": "Purchase Management",
                "routerLink": "/pages/purchase-management/purchase",
                "queryParams": null,
                "isAvailable": null,
                "isClick": null
            },
            {
                "name": "Petty Cash Management",
                "routerLink": "/pages/expenses-manager",
                "queryParams": null,
                "isAvailable": null,
                "isClick": null
            }
        ]
    },
    {
        "groupHeading": "Inventory",
        "items": [
            {
                "routerLink": "/pages/inventory",
                "queryParams": null,
                "name": "Inventory",
                "isAvailable": "null",
                "isClick": null
            },
            {
                "routerLink": "/pages/manufacturing/report",
                "queryParams": null,
                "name": "Manufacturing",
                "isAvailable": null,
                "isClick": null
            },
            {
                "name": "Branch Transfer",
                "routerLink": "/pages/inventory/report",
                "queryParams": null,
                "isAvailable": null,
                "isClick": null
            },
            {
                "name": "Warehouse",
                "routerLink": "/pages/settings/warehouse",
                "queryParams": null,
                "isAvailable": null,
                "isClick": null
            }
        ]
    },
    {
        "groupHeading": "Security",
        "items": [
            {
                "routerLink": "/pages/import/select-type",
                "queryParams": null,
                "name": "Import Data",
                "isAvailable": "null",
                "isClick": null
            },
            {
                "routerLink": "/pages/tallysync",
                "queryParams": null,
                "name": "TALLY Import",
                "isAvailable": null,
                "isClick": null
            },
            {
                "name": "Company Import/Export",
                "routerLink": "/pages/company-import-export",
                "queryParams": null,
                "isAvailable": null,
                "isClick": null
            },
            {
                "name": "Permission",
                "routerLink": "/pages/permissions/list",
                "queryParams": null,
                "isAvailable": null,
                "isClick": null
            },
            {
                "name": "Integration",
                "routerLink": "/pages/settings/integration",
                "queryParams": '{ "tab": "integration", "tabIndex": 1 }',
                "isAvailable": null,
                "isClick": null
            }
        ]
    },
    {
        "groupHeading": "Analysis",
        "items": [
            {
                "routerLink": "/pages/home",
                "queryParams": null,
                "name": "Dashboard",
                "isAvailable": "null",
                "isClick": null
            },
            {
                "routerLink": "/pages/reports/reports-dashboard",
                "queryParams": null,
                "name": "Reports",
                "isAvailable": null,
                "isClick": null
            },
            {
                "name": "Sales Bifurcation",
                "routerLink": "/pages/new-vs-old-invoices",
                "queryParams": null,
                "isAvailable": null,
                "isClick": null
            },
            {
                "name": "Daybook",
                "routerLink": "/pages/daybook",
                "queryParams": null,
                "isAvailable": null,
                "isClick": null
            },
            {
                "name": "Audit Log",
                "routerLink": "/pages/audit-logs",
                "queryParams": null,
                "isAvailable": null,
                "isClick": null
            },
            {
                "name": "Audit Log New",
                "routerLink": "/pages/audit-logs/new",
                "queryParams": null,
                "isAvailable": null,
                "isClick": null
            },
            {
                "name": "Search",
                "routerLink": "/pages/search",
                "queryParams": null,
                "isAvailable": null,
                "isClick": null
            },
            {
                "name": "Trial Balance",
                "routerLink": "/pages/trial-balance-and-profit-loss",
                "queryParams": '{ "tab": "trial-balance", "tabIndex": 0 }',
                "isAvailable": null,
                "isClick": null
            },
            {
                "name": "P&L, B/S",
                "routerLink": "/pages/trial-balance-and-profit-loss",
                "queryParams": '{ "tab": "trial-balance", "tabIndex": 1 }',
                "isAvailable": null,
                "isClick": null
            }
        ]
    },
    {
        "groupHeading": "Others",
        "items": [
            {
                "routerLink": "/pages/gstfiling",
                "queryParams": null,
                "name": "GSTR",
                "isAvailable": "need update",
                "isClick": null
            },
            {
                "routerLink": "/pages/vat-report",
                "queryParams": null,
                "name": "Vat Report",
                "isAvailable": "need update",
                "isClick": null
            },
            {
                "name": "E-way Bill",
                "routerLink": "/pages/invoice/ewaybill",
                "queryParams": null,
                "isAvailable": null,
                "isClick": null
            },
            {
                "name": "Settings",
                "routerLink": "/pages/settings/taxes",
                "queryParams": '{ "tab": "taxes", "tabIndex": 0 }',
                "isAvailable": null,
                "isClick": null
            }
        ]
    },
    {
        "groupHeading": "User",
        "items": [
            {
                "routerLink": "pages/settings/profile",
                "queryParams": null,
                "name": "Profile",
                "isAvailable": null,
                "isClick": null
            },
            {
                "routerLink": "/pages/user-details/subscription",
                "queryParams": null,
                "name": "Subscription",
                "isAvailable": null,
                "isClick": null
            },
            {
                "name": "Linked Accounts",
                "routerLink": "/pages/settings/linked-accounts",
                "queryParams": null,
                "isAvailable": null,
                "isClick": null
            },
            {
                "name": "Onboarding",
                "routerLink": "/pages/onboarding",
                "queryParams": null,
                "isAvailable": null,
                "isClick": null
            }
        ]
    }
    ];

    constructor(private componentFactoryResolver: ComponentFactoryResolver, private store: Store<AppState>, private generalActions: GeneralActions, private groupWithAccountsAction: GroupWithAccountsAction, private generalService: GeneralService, private route: Router) {

    }

    /**
     * Initializes the component
     *
     * @memberof AllModulesComponent
     */
    public ngOnInit(): void {
        this.store.pipe(select(state => state.session.companies), take(1)).subscribe(companies => {
            companies = companies || [];
            this.activeCompany = companies.find(company => company.uniqueName === this.generalService.companyUniqueName);

            if(this.activeCompany && this.activeCompany.createdBy && this.activeCompany.createdBy.email) {
                this.isAllowedForBetaTesting = this.generalService.checkIfEmailDomainAllowed(this.activeCompany.createdBy.email);
            }
        });
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
     * @param {*} queryParaamsItem query params
     * @param {*} isClickMethod to check is click method exist
     * @memberof AllModulesComponent
     */
    public navigateTo(route: any, queryParaamsItem: any, isClickMethod: any) {
        if (!queryParaamsItem) {
            this.route.navigate([route]);
        } else {
            let queryParaamsObject = JSON.parse(queryParaamsItem);
            let navigationExtras: NavigationExtras = {
                queryParams: queryParaamsObject
            };
            this.route.navigate([route], navigationExtras);
        }
        if (isClickMethod === 'showManageGroupsModal') {
            this.showManageGroupsModal();
        }
    }
}
