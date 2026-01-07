import { Component, EventEmitter, Output, Input, OnDestroy, OnInit, ChangeDetectorRef, Inject, ViewChild, TemplateRef } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { AddAccountRequest } from '../../models/api-models/Account';
import { AccountService } from '../../services/account.service';
import { ToasterService } from '../../services/toaster.service';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store';
import { PageLeaveUtilityService } from '../../services/page-leave-utility.service';
import { AccountsAction } from '../../actions/accounts.actions';
import { GeneralService } from '../../services/general.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ASIDE_PANE_CONFIG } from '../../app.constant';

@Component({
    selector: 'aside-menu-product-service',
    styleUrls: ['./aside-menu-product-service.component.scss'],
    templateUrl: './aside-menu-product-service.component.html',
    standalone: false
})
export class AsideMenuProductServiceComponent implements OnInit, OnDestroy {
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    @Input() public selectedVoucherType: string;
    /* This will hold branch transfer mode input  */
    @Input() public inputData: string = '';
    @Input() public includeSearchedGroup: boolean = false;
    /** Template reference for aside menu account */
    @ViewChild("accountTemplate", { static: true }) public accountTemplate: TemplateRef<any>;
    /** Reference for account aside menu dialog */
    public accountTemplateRef: MatDialogRef<any>;
    public autoFocusInChild: boolean = true;
    public isAddStockOpen: boolean = false;
    public isAddServiceOpen: boolean = false;
    public hideFirstStep: boolean = false;
    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if account has unsaved changes */
    public hasUnsavedChanges: boolean = false;
    /** Stores the voucher API version of company */
    public voucherApiVersion: number;
    /** This will hold stock type */
    public stockType: string = '';


    constructor(
        private accountService: AccountService,
        private toasterService: ToasterService,
        private store: Store<AppState>,
        private pageLeaveUtilityService: PageLeaveUtilityService,
        private accountsAction: AccountsAction,
        private changeDetectionRef: ChangeDetectorRef,
        private generalService: GeneralService,
        private dialog: MatDialog
    ) {
    }

    /**
     * Lifecycle hook runs on component initialization
     *
     * @memberof AsideMenuProductServiceComponent
     */
    public ngOnInit(): void {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        document.querySelector('body')?.classList?.add('aside-menu-product-service-page');

        this.store.pipe(select(state => state.groupwithaccounts.hasUnsavedChanges), takeUntil(this.destroyed$)).subscribe(response => {
            this.hasUnsavedChanges = response;
        });
    }

    /**
     * This will create the service account
     *
     * @param {AddAccountRequest} item
     * @memberof AsideMenuProductServiceComponent
     */
    public addNewServiceAccount(item: AddAccountRequest): void {
        this.accountService.CreateAccountV2(item.accountRequest, item.activeGroupUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                this.toasterService.successToast(this.commonLocaleData?.app_account_created);
                this.accountTemplateRef?.close();
                this.closeAsideEvent.emit();
            } else {
                this.toasterService.errorToast(response?.message);
            }
        });
    }

    /**
     * This will use for toggle stock pane
     *
     * @param {string} [type]
     * @memberof AsideMenuProductServiceComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body')?.classList?.remove('aside-menu-product-service-page');
    }

    public toggleStockPane(type?: string): void {
        this.hideFirstStep = true;
        this.isAddServiceOpen = false;
        this.stockType = type;
        this.isAddStockOpen = !this.isAddStockOpen;
    }

    /**
    * Ths will use for toggle service pane
    *
    *
    * @memberof AsideMenuProductServiceComponent
    */
    public toggleServicePane(): void {
        this.hideFirstStep = true;
        this.isAddStockOpen = false;
        this.isAddServiceOpen = !this.isAddServiceOpen;
    }

    /**
     * Ths will use for close aside pane
     *
     * @param {*} [e]
     * @memberof AsideMenuProductServiceComponent
     */
    public closeAsidePane(event?: any): void {
        if (this.isAddServiceOpen && this.hasUnsavedChanges) {
            this.pageLeaveUtilityService.confirmPageLeave((action) => {
                if (action) {
                    this.accountTemplateRef?.close();
                    this.stockType = '';
                    this.hideFirstStep = false;
                    this.isAddStockOpen = false;
                    this.isAddServiceOpen = false;
                    this.closeAsideEvent.emit();
                }
            });
        } else {
            this.accountTemplateRef?.close();
            this.stockType = '';
            this.hideFirstStep = false;
            this.isAddStockOpen = false;
            this.isAddServiceOpen = false;
            this.closeAsideEvent.emit();
        }
    }

    /**
     * This will use for back button presse
     *
     * @memberof AsideMenuProductServiceComponent
     */
    public backButtonPressed(): void {
        if (this.isAddServiceOpen && this.hasUnsavedChanges) {
            this.pageLeaveUtilityService.confirmPageLeave((action) => {
                if (action) {
                    this.accountTemplateRef?.close();
                    this.store.dispatch(this.accountsAction.hasUnsavedChanges(false));
                    this.stockType = '';
                    this.hideFirstStep = false;
                    this.isAddStockOpen = false;
                    this.isAddServiceOpen = false;
                    this.changeDetectionRef.detectChanges();
                }
            });
        } else {
            this.accountTemplateRef?.close();
            this.stockType = '';
            this.hideFirstStep = false;
            this.isAddStockOpen = false;
            this.isAddServiceOpen = false;
        }
        this.focusButton();
    }

    /**
     * This will use for toggle account pane
     *
     * @memberof AsideMenuProductServiceComponent
     */
    public toggleAccountPane() {
        this.hideFirstStep = true;
        this.isAddStockOpen = false;
        this.isAddServiceOpen = !this.isAddServiceOpen;
        this.accountTemplateRef = this.dialog.open(this.accountTemplate,
            {
                ...ASIDE_PANE_CONFIG,
                hasBackdrop: false
            }
        );
        this.accountTemplateRef.afterClosed().subscribe(() => {
            this.focusButton();
        });
    }

    /**
     * Find the first visible button in the component
     *
     * @memberof AsideMenuProductServiceComponent
     */
    private focusButton(): void {
         setTimeout(() => {
                const visibleButton = document.querySelector('.aside-panel-ledger button[matButton="filled"]:not([hidden])') as HTMLButtonElement;
                if (visibleButton) {
                    visibleButton.focus();
                }
        }, 200);
    }
}
