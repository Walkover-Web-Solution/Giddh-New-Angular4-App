import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TemplateRef } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VoucherTypeEnum } from '../../models/api-models/Sales';
import { IFlattenAccountsResultItem } from '../../models/interfaces/flatten-accounts-result-item.interface';
import { AccountService } from '../../services/account.service';
import { CompanyService } from '../../services/company.service';
import { ToasterService } from '../../services/toaster.service';
import { GeneralService } from '../../services/general.service';
import { Router } from '@angular/router';
import { ASIDE_PANE_CONFIG } from '../../app.constant';
import { Configuration } from '../../app.constant';

/**
 * Handles Component functionality
 */
@Component({
    selector: '[account-detail-modal-component]',
    templateUrl: './account-detail-modal.component.html',
    styleUrls: ['./account-detail-modal.component.scss'],
    standalone: false
})

/**
 * AccountDetailModalComponent component
 * Handles accountdetailmodal functionality and user interactions
 */
export class AccountDetailModalComponent implements OnChanges, OnDestroy {
    /** Template reference for aside menu */
    @ViewChild('asideMenuTemplate') public asideMenuTemplate: TemplateRef<any>;
    /** Reference to aside menu dialog */
    public asideMenuDialogRef: MatDialogRef<any>;
    @Input() public isModalOpen: boolean = false;
    @Input() public accountUniqueName: string;
    @Input() public from: string;
    @Input() public to: string;
    /** Required to hide generate invoice from modules that don't support it, for eg. Trial balance */
    @Input() public shouldShowGenerateInvoice: boolean = true;
    // take voucher type from parent component
    @Input() public voucherType: VoucherTypeEnum;
    /** Emits when modal needs to be opened */
    @Output() public modalOpened: EventEmitter<MatDialogRef<any>> = new EventEmitter<MatDialogRef<any>>();
    /** Emits when modal needs to be closed */
    @Output() public modalClosed: EventEmitter<boolean> = new EventEmitter();
    /** Emits when modal needs to be closed temporary */
    @Output() public modalClosedTemporary: EventEmitter<any> = new EventEmitter();
    @Input() public accInfo: IFlattenAccountsResultItem;
    /** This will close modal on edit account icon click */
    @Input() public closeOnEdit: boolean = false;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Account group unique name */
    public activeGroupUniqueName: string = "";
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** Hold current url */
    private currentUrl: string = "";

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private _toaster: ToasterService,
        private _accountService: AccountService,
        private changeDetectorRef: ChangeDetectorRef,
        private generalService: GeneralService,
        private router: Router,
        private dialog: MatDialog
    ) {
        this.currentUrl = this.router.url;
    }

    /**
     * Handles ngOnChanges functionality
     */
    public ngOnChanges(changes: SimpleChanges): void {
        /**
         * Handles if functionality
         */
        if (!this.accInfo && changes['accountUniqueName'] && changes['accountUniqueName'].currentValue
            && (changes['accountUniqueName'].currentValue !== changes['accountUniqueName'].previousValue)) {
            // Call the API only when the account info is not passed to avoid multiple API calls
            this.getAccountDetails(changes['accountUniqueName'].currentValue);
        }
    }

    /**
     * API call to get account details using *accountUniqueName*
     *
     * @param {string} accountUniqueName account unique name to get account details
     * @memberof AccountDetailModalComponent
     */
    public getAccountDetails(accountUniqueName: string): void {
        this.isLoading = true;
        this._accountService.GetAccountDetailsV2(accountUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            /**
             * Handles if functionality
             */
            if (response?.status === 'success') {
                this.isLoading = false;
                this.accInfo = response.body;
                this.changeDetectorRef.detectChanges();
            } else {
                this._toaster.errorToast(response?.message);
                this.isLoading = false;
            }
        });
    }

    /**
     * Handles performActions functionality
     */
    public performActions(type: number, event?: any) {
        /**
         * Handles switch functionality
         */
        switch (type) {
            case 0: // go to add and manage
                /**
                 * Handles if functionality
                 */
                if (!this.closeOnEdit) {
                    this.activeGroupUniqueName = this.accInfo?.parentGroups[this.accInfo?.parentGroups?.length - 1]?.uniqueName;
                    this.openAccountAsidePaneDialog();
                    event.stopPropagation();
                } else {
                    this.modalClosedTemporary.emit(this.accInfo);
                }
                break;

            case 1: // go to ledger
                /**
                 * Handles if functionality
                 */
                if (this.generalService.voucherApiVersion === 2) {
                    const additionalParams = this.from && this.to ? `/${this.accountUniqueName}/${this.from}/${this.to}` : `/${this.accountUniqueName}`;
                    this.goToRoute("ledger", additionalParams, this.accountUniqueName);
                } else {
                    this.goToRoute("ledger", `/${this.from}/${this.to}`, this.accountUniqueName);
                }
                break;

            case 2: // go to sales/ purchase/ debit note or credit note generate page
                /**
                 * Handles if functionality
                 */
                if (this.voucherType === VoucherTypeEnum.sales) {
                    // special case, because we don't have cash invoice as voucher type at api side so we are handling it ui side
                    let isCashInvoice = this.accountUniqueName === 'cash';
                    /**
                     * Handles if functionality
                     */
                    if (this.generalService.voucherApiVersion === 2) {
                        /**
                         * Handles if functionality
                         */
                        if (isCashInvoice) {
                            this.goToRoute("vouchers/cash/create", "", "");
                        } else {
                            this.goToRoute("vouchers/sales/" + this.accountUniqueName + "/create", "", "");
                        }
                    } else {
                        this.goToRoute(`proforma-invoice/invoice/${isCashInvoice ? 'cash' : 'sales'}`, "", this.accountUniqueName);
                    }
                } else {
                    // for purchase/ debit and credit note
                    /**
                     * Handles if functionality
                     */
                    if (this.generalService.voucherApiVersion === 2) {
                        this.goToRoute("vouchers/" + this.voucherType.toString().replace(/-/g, " ") + "/" + this.accountUniqueName + "/create", "", "");
                    } else {
                        this.goToRoute('proforma-invoice/invoice/' + this.voucherType, "", this.accountUniqueName);
                    }
                }
                break;
            default:
                break;
        }
    }

    /**
     *  Perform redirection using change routing
     *
     * @param {string} part routing url
     * @param {string} [additionalParams=''] addition params like date range
     * @param {string} [accUniqueName=''] account unique name for URL construction
     * @memberof AccountDetailModalComponent
     */
    public goToRoute(part: string, additionalParams: string = '', accUniqueName: string = ''): void {
        let url = this.buildInitialUrl(part, additionalParams, accUniqueName);

        /**
         * Handles if functionality
         */
        if (Configuration.isElectron) {
            this.handleElectronNavigation(part, accUniqueName, url);
        } else {
            this.handleWebNavigation(part, url);
        }
    }

    /**
     * Releases memory
     *
     * @memberof AccountDetailModalComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Opens account aside pane dialog
     *
     * @memberof AccountDetailModalComponent
     */
    public openAccountAsidePaneDialog(): void {
        this.asideMenuDialogRef = this.dialog.open(this.asideMenuTemplate, ASIDE_PANE_CONFIG);
    }

    /**
     * Callback function on account modal close
     *
     * @param {*} event
     * @memberof AccountDetailModalComponent
     */
    public getUpdatedList(event: any): void {
        this.modalClosed.emit(event);
        this.asideMenuDialogRef.close();
    }

    /**
     * Build initial URL based on voucher API version and parameters
     */
    private buildInitialUrl(part: string, additionalParams: string, accUniqueName: string): string {
        let url = (this.generalService.voucherApiVersion === 2) ? `/pages/${part}` : location.href + `?returnUrl=${part}/${accUniqueName || this.accountUniqueName}`;
        /**
         * Handles if functionality
         */
        if (additionalParams) {
            url = `${url}${additionalParams}`;
        }
        return url;
    }

    /**
     * Handle navigation in Electron environment
     */
    private handleElectronNavigation(part: string, accUniqueName: string, url: string): void {
        try {
            let electronIpcAvailable = false;

            // Try electronAPI first (secure context)
            /**
             * Handles if functionality
             */
            if ((window as any).electronAPI && (window as any).electronAPI.send) {
                try {
                    url = `${location.origin}${location.pathname}#./pages/${part}${part?.includes('ledger') ? `/${accUniqueName || this.accountUniqueName}` : ""}`;
                    (window as any).electronAPI.send('open-url', url);
                    electronIpcAvailable = true;
                } catch (ipcError) {
                    // Silent error handling
                }
            }

            // Try legacy electron require (fallback)
            /**
             * Handles if functionality
             */
            if (!electronIpcAvailable && (window as any).require) {
                try {
                    const electron = (window as any).require('electron');
                    /**
                     * Handles if functionality
                     */
                    if (electron && electron.ipcRenderer && electron.ipcRenderer.send) {
                        url = `${location.origin}${location.pathname}#./pages/${part}${part?.includes('ledger') ? `/${accUniqueName || this.accountUniqueName}` : ""}`;
                        electron.ipcRenderer.send('open-url', url);
                        electronIpcAvailable = true;
                    }
                } catch (requireError) {
                    // Silent error handling
                }
            }

            // Fallback to regular window.open if IPC not available
            /**
             * Handles if functionality
             */
            if (!electronIpcAvailable) {
                this.openUrlWithRedirect(part, url);
            }
        } catch (error) {
            this.openUrlWithRedirect(part, url);
        }
    }

    /**
     * Handle navigation in web environment
     */
    private handleWebNavigation(part: string, url: string): void {
        this.openUrlWithRedirect(part, url);
    }

    /**
     * Open URL with redirect parameter for ledger routes
     */
    private openUrlWithRedirect(part: string, url: string): void {
        /**
         * Handles if functionality
         */
        if (part === 'ledger') {
            const separator = url.includes('?') ? '&' : '?';
            url = url + `${separator}redirectUrl=${encodeURIComponent(location.href)}`;
        }
        (window as any).open(url);
    }
}
