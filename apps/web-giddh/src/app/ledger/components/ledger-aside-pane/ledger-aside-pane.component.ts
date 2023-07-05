import { takeUntil } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AppState } from '../../../store';
import { Store, select } from '@ngrx/store';
import { SidebarAction } from '../../../actions/inventory/sidebar.actions';
import { Observable, ReplaySubject } from 'rxjs';
import { AccountsAction } from '../../../actions/accounts.actions';
import { GeneralService } from '../../../services/general.service';

@Component({
    selector: 'ledger-aside-pane',
    templateUrl: './ledger-aside-pane.component.html',
    styleUrls: ['./ledger-aside-pane.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class LedgerAsidePaneComponent implements OnInit, OnDestroy {
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);

    public isAddStockOpen: boolean = false;
    public isAddAccountOpen: boolean = false;
    public hideFirstScreen: boolean = false;
    public createStockSuccess$: Observable<boolean>;
    public createAccountIsSuccess$: Observable<boolean>;

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Stores the voucher API version of company */
    public voucherApiVersion: 1 | 2;
    /** This will hold stock type */
    public stockType: string = '';

    constructor(private store: Store<AppState>, private inventorySidebarAction: SidebarAction, private accountsAction: AccountsAction, private generalService: GeneralService) {
        this.createStockSuccess$ = this.store.pipe(select(s => s.inventory.createStockSuccess), takeUntil(this.destroyed$));
        this.createAccountIsSuccess$ = this.store.pipe(select(s => s.groupwithaccounts.createAccountIsSuccess), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        document.querySelector('body').classList.add('ledger-aside-pane');
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        this.store.dispatch(this.inventorySidebarAction.GetGroupsWithStocksHierarchyMin());
        // subscribe createStockSuccess for resting form
        this.createStockSuccess$.subscribe(s => {
            if (s) {
                this.backButtonPressed();
            }
        });

        this.createAccountIsSuccess$.subscribe(s => {
            if (s) {
                this.backButtonPressed();
            }
        });
    }

    public toggleStockPane(type?: string) {
        this.hideFirstScreen = true;
        this.isAddAccountOpen = false;
        this.stockType = type;
        this.isAddStockOpen = !this.isAddStockOpen;
    }

    public toggleAccountPane() {
        this.hideFirstScreen = true;
        this.isAddStockOpen = false;
        this.isAddAccountOpen = !this.isAddAccountOpen;
    }

    /**
     * This will use for back button step
     *
     * @memberof LedgerAsidePaneComponent
     */
    public backButtonPressed() {
        this.store.dispatch(this.accountsAction.resetActiveGroup());
        this.stockType = '';
        this.hideFirstScreen = false;
        this.isAddStockOpen = false;
        this.isAddAccountOpen = false;
    }

    /**
     *This will use for close aside pane
     *
     * @param {*} [e]
     * @memberof LedgerAsidePaneComponent
     */
    public closeAsidePane(e?: any) {
        this.store.dispatch(this.accountsAction.resetActiveGroup());
        this.stockType = '';
        this.hideFirstScreen = false;
        this.isAddStockOpen = false;
        this.isAddAccountOpen = false;
        if (!e) {
            this.closeAsideEvent.emit();
        }
    }

    public ngOnDestroy() {
        document.querySelector('body').classList.remove('ledger-aside-pane');
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
