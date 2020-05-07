import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AccountService } from 'apps/web-giddh/src/app/services/account.service';
import { ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { CompanyActions } from '../../actions/company.actions';
import { SidebarAction } from '../../actions/inventory/sidebar.actions';
import { AppState } from '../../store';
import { StateDetailsRequest } from '../models/api-models/Company';
import { TallyModuleService } from '../tally-service';

export const PAGE_SHORTCUT_MAPPING = [
    {
        keyCode: 118, // 'F7',
        inputForFn: {
            page: 'Journal',
            uniqueName: 'purchases',
            gridType: 'voucher'
        }
    },
    {
        keyCode: 120, // 'F9',
        inputForFn: {
            page: 'Purchase',
            uniqueName: 'purchases',
            gridType: 'voucher'
        }
    },
    {
        keyCode: 119, // 'F8',
        inputForFn: {
            page: 'Sales',
            uniqueName: 'purchases',
            gridType: 'voucher'
        }
    },
    {
        keyCode: 120, // 'F9',
        altKey: true,
        inputForFn: {
            page: 'Debit note',
            uniqueName: 'purchases',
            gridType: 'voucher'
        }
    },
    {
        keyCode: 119, // 'F8',
        altKey: true,
        inputForFn: {
            page: 'Credit note',
            uniqueName: 'purchases',
            gridType: 'voucher'
        }
    },
    {
        keyCode: 116, // 'F5',
        inputForFn: {
            page: 'Payment',
            uniqueName: 'purchases',
            gridType: 'voucher'
        }
    },
    {
        keyCode: 117, // 'F6',
        inputForFn: {
            page: 'Receipt',
            uniqueName: 'null',
            gridType: 'voucher'
        }
    },
    {
        keyCode: 115, // 'F4',
        inputForFn: {
            page: 'Contra',
            uniqueName: 'purchases',
            gridType: 'voucher'
        }
    }
];

export const PAGES_WITH_CHILD = ['Purchase', 'Sales', 'Credit note', 'Debit note'];

@Component({
    templateUrl: './journal-voucher.component.html',
    styleUrls: ['./journal-voucher.component.scss']
})

export class AccountingComponent implements OnInit, OnDestroy {

    public gridType: string = 'voucher';
    public selectedPage: string = 'journal';
    public flattenAccounts: any = [];
    public openDatePicker: boolean = false;
    public openCreateAccountPopupInVoucher: boolean = false;
    public openCreateAccountPopupInInvoice: boolean = false;
    public saveEntryInVoucher: boolean = false;
    public saveEntryInInvoice: boolean = false;

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private store: Store<AppState>,
        private companyActions: CompanyActions,
        private _tallyModuleService: TallyModuleService,
        private _accountService: AccountService,
        private sidebarAction: SidebarAction
    ) {
        this._tallyModuleService.selectedPageInfo.subscribe((d) => {
            if (d) {
                this.gridType = d.gridType;
                this.selectedPage = d.page;
            }
        });
    }

    @HostListener('document:keydown', ['$event'])
    public beforeunloadHandler(event: KeyboardEvent) {
        return (event.which || event.keyCode) !== 116;
    }

    @HostListener('document:keyup', ['$event'])
    public handleKeyboardEvent(event: KeyboardEvent) {
        if (event.ctrlKey && event.which === 65) { // Ctrl + A
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
        } else if (event.altKey && event.which === 86) { // Handling Alt + V and Alt + I
            const selectedPage = this._tallyModuleService.selectedPageInfo.value;
            if (PAGES_WITH_CHILD.indexOf(selectedPage.page) > -1) {
                this._tallyModuleService.setVoucher({
                    page: selectedPage.page,
                    uniqueName: selectedPage.uniqueName,
                    gridType: 'voucher'
                });
            } else {
                return;
            }
        } else if (event.altKey && event.which === 73) { // Alt + I
            const selectedPage = this._tallyModuleService.selectedPageInfo.value;
            if (PAGES_WITH_CHILD.indexOf(selectedPage.page) > -1) {
                this._tallyModuleService.setVoucher({
                    page: selectedPage.page,
                    uniqueName: selectedPage.uniqueName,
                    gridType: 'invoice'
                });
            } else {
                return;
            }
        } else if (event.altKey && event.which === 67) { // Alt + C
            if (this.gridType === 'voucher') {
                this.openCreateAccountPopupInVoucher = true;
                this.openCreateAccountPopupInInvoice = false;
            } else if (this.gridType === 'invoice') {
                this.openCreateAccountPopupInVoucher = false;
                this.openCreateAccountPopupInInvoice = true;
            }
            setTimeout(() => {
                this.openCreateAccountPopupInVoucher = false;
                this.openCreateAccountPopupInInvoice = false;
            }, 100);
        } else {
            let selectedPageIndx = PAGE_SHORTCUT_MAPPING.findIndex((page: any) => {
                if (event.altKey) {
                    return page.keyCode === event.which && page.altKey;
                } else {
                    return page.keyCode === event.which;
                }
            });
            if (selectedPageIndx > -1) {
                this._tallyModuleService.setVoucher(PAGE_SHORTCUT_MAPPING[selectedPageIndx].inputForFn);
            } else if (event.which === 113) { // F2
                this.openDatePicker = !this.openDatePicker;
            }
        }
    }

    public ngOnInit(): void {
        let companyUniqueName = null;
        this.store.select(c => c.session.companyUniqueName).pipe(take(1)).subscribe(s => companyUniqueName = s);
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'accounting-voucher';

        this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));

        this.store.select(p => p.session.companyUniqueName).pipe(take(1)).subscribe(a => {
            if (a && a !== '') {
                this._accountService.getFlattenAccounts('', '', '').pipe(takeUntil(this.destroyed$)).subscribe(data => {
                    if (data.status === 'success') {
                        this.flattenAccounts = data.body.results;
                        this._tallyModuleService.setFlattenAccounts(data.body.results);
                    }
                });
            }
        });

        this.store.dispatch(this.sidebarAction.GetGroupsWithStocksHierarchyMin());
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
