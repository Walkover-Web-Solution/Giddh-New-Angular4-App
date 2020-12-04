import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AccountService } from 'apps/web-giddh/src/app/services/account.service';
import { ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { CompanyActions } from '../../actions/company.actions';
import { SidebarAction } from '../../actions/inventory/sidebar.actions';
import { StateDetailsRequest } from '../../models/api-models/Company';
import { OrganizationType } from '../../models/user-login-state';
import { GeneralService } from '../../services/general.service';
import { AppState } from '../../store';
import { TallyModuleService } from '../tally-service';

/** List of functional keys used in JV module shortcut */
const FUNCTIONAL_KEYS = {
    F2: 'F2',
    F4: 'F4',
    F5: 'F5',
    F6: 'F6',
    F7: 'F7',
    F8: 'F8',
    F9: 'F9'
};

/** Key codes for combination of shortcut with Alt+V, Alt+I and other shortcuts */
const CODES = {
    KEY_C: ['KeyC'],
    KEY_I: ['AltLeft', 'KeyI'],
    KEY_V: ['KeyV'],
};

/** Keys of keyboard event for Enter and Tab button */
export const KEYS = {
    ENTER: 'Enter',
    TAB: 'Tab',
    ESC: 'Escape'
};

/** Vouchers that can be generated throught JV module */
export const VOUCHERS = {
    CONTRA: 'Contra',
    PAYMENT: 'Payment',
    RECEIPT: 'Receipt',
    JOURNAL: 'Journal',
    SALES: 'Sales',
    CREDIT_NOTE: 'Credit note',
    DEBIT_NOTE: 'Debit note'
}

/** Voucher page shortcut mapping */
export const PAGE_SHORTCUT_MAPPING = [
    {
        keyCode: 115, // 'F4',
        key: FUNCTIONAL_KEYS.F4,
        inputForFn: {
            page: 'Contra',
            uniqueName: 'purchases',
            gridType: 'voucher'
        }
    },
    // {
    //     keyCode: 116, // 'F5',
    //     key: FUNCTIONAL_KEYS.F5,
    //     inputForFn: {
    //         page: 'Payment',
    //         uniqueName: 'purchases',
    //         gridType: 'voucher'
    //     }
    // },
    {
        keyCode: 117, // 'F6',
        key: FUNCTIONAL_KEYS.F6,
        inputForFn: {
            page: 'Receipt',
            uniqueName: 'null',
            gridType: 'voucher'
        }
    },
    // {
    //     keyCode: 118, // 'F7',
    //     key: FUNCTIONAL_KEYS.F7,
    //     inputForFn: {
    //         page: 'Journal',
    //         uniqueName: 'purchases',
    //         gridType: 'voucher'
    //     }
    // }, {
    //     keyCode: 119, // 'F8',
    //     key: FUNCTIONAL_KEYS.F8,
    //     inputForFn: {
    //         page: 'Sales',
    //         uniqueName: 'purchases',
    //         gridType: 'voucher'
    //     }
    // }, {
    //     keyCode: 119, // 'F8',
    //     key: FUNCTIONAL_KEYS.F8,
    //     altKey: true,
    //     inputForFn: {
    //         page: 'Credit note',
    //         uniqueName: 'purchases',
    //         gridType: 'voucher'
    //     }
    // }, {
    //     keyCode: 120, // 'F9',
    //     key: FUNCTIONAL_KEYS.F9,
    //     inputForFn: {
    //         page: 'Purchase',
    //         uniqueName: 'purchases',
    //         gridType: 'voucher'
    //     }
    // }, {
    //     keyCode: 120, // 'F9',
    //     key: FUNCTIONAL_KEYS.F9,
    //     altKey: true,
    //     inputForFn: {
    //         page: 'Debit note',
    //         uniqueName: 'purchases',
    //         gridType: 'voucher'
    //     }
    // }
];

/** Pages which have Voucher and Invoice as options */
export const PAGES_WITH_CHILD = ['Purchase', 'Sales', 'Credit note', 'Debit note'];

@Component({
    templateUrl: './journal-voucher.component.html',
    styleUrls: ['./journal-voucher.component.scss']
})
export class JournalVoucherComponent implements OnInit, OnDestroy {

    public gridType: string = 'voucher';
    public selectedPage: string = 'Contra';
    public flattenAccounts: any = [];
    public openDatePicker: boolean = false;
    public openCreateAccountPopupInVoucher: boolean = false;
    public openCreateAccountPopupInInvoice: boolean = false;
    public saveEntryInVoucher: boolean = false;
    public saveEntryInInvoice: boolean = false;
    /** Current date to show the balance till date */
    public currentDate: string;
    /** True, if organization type is company and it has more than one branch (i.e. in addition to HO) */
    public isCompany: boolean;
    /** Current branches */
    public branches: Array<any>;

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    /** @ignore */
    constructor(
        private store: Store<AppState>,
        private companyActions: CompanyActions,
        private tallyModuleService: TallyModuleService,
        private accountService: AccountService,
        private sidebarAction: SidebarAction,
        private generalService: GeneralService
    ) {
        this.tallyModuleService.selectedPageInfo.subscribe((data) => {
            if (data) {
                this.gridType = data.gridType;
                this.selectedPage = data.page;
            }
        });
    }

    @HostListener('document:keydown', ['$event'])
    public beforeunloadHandler(event: KeyboardEvent) {
        return event.key !== FUNCTIONAL_KEYS.F5;
    }

    @HostListener('document:keyup', ['$event'])
    public handleKeyboardEvent(event: KeyboardEvent) {
        if (event.ctrlKey && event.key.toLowerCase() === 'a') { // Ctrl + A
            event.preventDefault();
            event.stopPropagation();
            if (this.gridType === 'voucher') {
                this.saveEntryInVoucher = true;
                this.saveEntryInInvoice = false;
            } else if (this.gridType === 'invoice') {
                this.saveEntryInVoucher = false;
                this.saveEntryInInvoice = true;
            }
            setTimeout(() => {
                this.saveEntryInVoucher = false;
                this.saveEntryInInvoice = false;
            }, 100);
        } else if (event.altKey && CODES.KEY_V.includes(event.code)) { // Alt + V
            // const selectedPage = this.tallyModuleService.selectedPageInfo.value;
            // if (PAGES_WITH_CHILD.indexOf(selectedPage.page) > -1) {
            //     this.tallyModuleService.setVoucher({
            //         page: selectedPage.page,
            //         uniqueName: selectedPage.uniqueName,
            //         gridType: 'voucher'
            //     });
            // } else {
            //     return;
            // }
        } else if (event.altKey && CODES.KEY_I.includes(event.code)) { // Alt + I
            // const selectedPage = this.tallyModuleService.selectedPageInfo.value;
            // if (PAGES_WITH_CHILD.indexOf(selectedPage.page) > -1) {
            //     this.tallyModuleService.setVoucher({
            //         page: selectedPage.page,
            //         uniqueName: selectedPage.uniqueName,
            //         gridType: 'invoice'
            //     });
            // } else {
            //     return;
            // }
        } else if (event.altKey && CODES.KEY_C.includes(event.code)) {
            // Alt + C: Create new stock
            // if (this.gridType === 'voucher') {
            //     this.openCreateAccountPopupInVoucher = true;
            //     this.openCreateAccountPopupInInvoice = false;
            // } else if (this.gridType === 'invoice') {
            //     this.openCreateAccountPopupInVoucher = false;
            //     this.openCreateAccountPopupInInvoice = true;
            // }
            // setTimeout(() => {
            //     this.openCreateAccountPopupInVoucher = false;
            //     this.openCreateAccountPopupInInvoice = false;
            // }, 100);
        } else {
            let selectedPageIndx = PAGE_SHORTCUT_MAPPING.findIndex((page: any) => {
                if (event.altKey) {
                    return page.key === event.key && page.altKey;
                } else {
                    return page.key === event.key;
                }
            });
            if (selectedPageIndx > -1) {
                this.tallyModuleService.setVoucher(PAGE_SHORTCUT_MAPPING[selectedPageIndx].inputForFn);
            } else if (event.key === FUNCTIONAL_KEYS.F2) { // F2
                this.openDatePicker = !this.openDatePicker;
            }
        }
    }

    /**
     * Initializes the store listeners
     *
     * @memberof JournalVoucherComponent
     */
    public ngOnInit(): void {
        let companyUniqueName = null;
        this.store.pipe(select(appState => appState.session.companyUniqueName), take(1)).subscribe(company => companyUniqueName = company);
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'journal-voucher';

        this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.branches = response || [];
                this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch && this.branches.length > 1;
            }
        });

        this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));

        this.store.pipe(select(appState => appState.session.companyUniqueName), take(1)).subscribe(a => {
            if (a && a !== '') {
                this.accountService.getFlattenAccounts('', '', '').pipe(takeUntil(this.destroyed$)).subscribe(data => {
                    if (data && data.status === 'success') {
                        this.flattenAccounts = data.body.results;
                        this.tallyModuleService.setFlattenAccounts(data.body.results);
                    }
                });
            }
        });

        this.store.dispatch(this.sidebarAction.GetGroupsWithStocksHierarchyMin());
    }

    /**
     * Unsubscribes from all the listeners
     *
     * @memberof JournalVoucherComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
