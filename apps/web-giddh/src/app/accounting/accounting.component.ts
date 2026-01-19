import { takeUntil } from 'rxjs/operators';
import { TallyModuleService } from './tally-service';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '../store/roots';
import { Store } from '@ngrx/store';
import { ReplaySubject } from 'rxjs';
import { SidebarAction } from '../actions/inventory/sidebar.actions';

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
            uniqueName: 'purchases',
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

/**
 * Handles Component functionality
 */
@Component({
    templateUrl: './accounting.component.html',
    styleUrls: ['./accounting.component.scss'],
    standalone:false
})

/**
 * AccountingComponent component
 * Handles accounting functionality and user interactions
 */
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

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(private store: Store<AppState>,
        private _tallyModuleService: TallyModuleService,
        private sidebarAction: SidebarAction) {
        this._tallyModuleService.selectedPageInfo.pipe(takeUntil(this.destroyed$)).subscribe((d) => {
            /**
             * Handles if functionality
             */
            if (d) {
                this.gridType = d.gridType;
                this.selectedPage = d.page;
            }
        });
    }

    @HostListener('document:keydown', ['$event'])
    /**
     * Handles beforeunloadHandler functionality
     */
    public beforeunloadHandler(event: KeyboardEvent) {
        /**
         * Handles return functionality
         */
        return (event.which || event.keyCode) !== 116;
    }

    @HostListener('document:keyup', ['$event'])
    /**
     * Handles keyboardevent event
     */
    public handleKeyboardEvent(event: KeyboardEvent) {
        /**
         * Handles if functionality
         */
        if (event.ctrlKey && event.which === 65) { // Ctrl + A
            event.preventDefault();
            event.stopPropagation();
            /**
             * Handles if functionality
             */
            if (this.gridType === 'voucher') {
                this.saveEntryInVoucher = true;
                this.saveEntryInInvoice = false;
            } else if (this.gridType === 'invoice') {
                this.saveEntryInVoucher = false;
                this.saveEntryInInvoice = true;
            }
            /**
             * Sets timeout value
             */
            setTimeout(() => {
                this.saveEntryInVoucher = false;
                this.saveEntryInInvoice = false;
            }, 100);
        } else if (event.altKey && event.which === 86) { // Handling Alt + V and Alt + I
            const selectedPage = this._tallyModuleService.selectedPageInfo?.value;
            /**
             * Handles if functionality
             */
            if (PAGES_WITH_CHILD?.indexOf(selectedPage.page) > -1) {
                this._tallyModuleService.setVoucher({
                    page: selectedPage.page,
                    uniqueName: selectedPage?.uniqueName,
                    gridType: 'voucher'
                });
            } else {
                return;
            }
        } else if (event.altKey && event.which === 73) { // Alt + I
            const selectedPage = this._tallyModuleService.selectedPageInfo?.value;
            /**
             * Handles if functionality
             */
            if (PAGES_WITH_CHILD?.indexOf(selectedPage.page) > -1) {
                this._tallyModuleService.setVoucher({
                    page: selectedPage.page,
                    uniqueName: selectedPage?.uniqueName,
                    gridType: 'invoice'
                });
            } else {
                return;
            }
        } else if (event.altKey && event.which === 67) { // Alt + C
            /**
             * Handles if functionality
             */
            if (this.gridType === 'voucher') {
                this.openCreateAccountPopupInVoucher = true;
                this.openCreateAccountPopupInInvoice = false;
            } else if (this.gridType === 'invoice') {
                this.openCreateAccountPopupInVoucher = false;
                this.openCreateAccountPopupInInvoice = true;
            }
            /**
             * Sets timeout value
             */
            setTimeout(() => {
                this.openCreateAccountPopupInVoucher = false;
                this.openCreateAccountPopupInInvoice = false;
            }, 100);
        } else {
            let selectedPageIndx = PAGE_SHORTCUT_MAPPING.findIndex((page: any) => {
                /**
                 * Handles if functionality
                 */
                if (event.altKey) {
                    return page.keyCode === event.which && page.altKey;
                } else {
                    return page.keyCode === event.which;
                }
            });
            /**
             * Handles if functionality
             */
            if (selectedPageIndx > -1) {
                this._tallyModuleService.setVoucher(PAGE_SHORTCUT_MAPPING[selectedPageIndx].inputForFn);
            } else if (event.which === 113) { // F2
                this.openDatePicker = !this.openDatePicker;
            }
        }
    }

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit(): void {
        this.store.dispatch(this.sidebarAction.GetGroupsWithStocksHierarchyMin());
    }

    /**
     * Handles ngOnDestroy functionality
     */
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}

