import { Component, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { GeneralService } from '../../services/general.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TemplateFroalaComponent } from '../template-froala/template-froala.component';
import { take } from 'rxjs';
import { AccountUpdateNewDetailsModule } from '../header/components/account-update-new-details/account-update-new-details.module';
import { AsideMenuAccountModule } from '../aside-menu-account/aside.menu.account.module';
import { OrganizationType } from '../../models/user-login-state';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../store';
import { ASIDE_PANE_CONFIG } from '../../app.constant';

@Component({
    selector: 'app-action-menu',
    standalone: true,
    imports: [CommonModule, MatMenuModule, MatButtonModule, AccountUpdateNewDetailsModule, AsideMenuAccountModule],
    templateUrl: './action-menu.component.html',
    styleUrls: ['./action-menu.component.scss']
})
export class ActionMenuComponent {
    /** Template for the aside menu */
    @ViewChild('asideMenuTemplate') public asideMenuTemplate: TemplateRef<any>;
    /** Reference to the aside menu dialog */
    public asideMenuDialogRef: MatDialogRef<any>;
    /** Account object for which the action menu is displayed */
    @Input() account: any;
    /** Locale data for displaying button labels */
    @Input() commonLocaleData: any;
    /** Whether to show the 'Go to Ledger' button */
    @Input() showGotoLedger: boolean = true;
    /** Whether to show the 'Generate Invoice' button */
    @Input() showGenerateInvoice: boolean = true;
    /** Whether to show the 'Send Email' button */
    @Input() showSendEmail: boolean = true;
    /** If true, menu button visibility is based on row index */
    @Input() useRowIndexVisibility: boolean = false;
    /** The currently active row index for show/hide logic */
    @Input() activeRowIndex?: number;
    /** The row index of this menu instance */
    @Input() rowIndex?: number;
    /** Whether the current screen is tablet */
    @Input() isTabletScreen: boolean = false;
    /** Event emitted when the 'Go to Ledger' action is triggered */
    @Output() gotoLedger: EventEmitter<void> = new EventEmitter<void>();
    /** Event emitted when the 'Generate Invoice' action is triggered */
    @Output() generateInvoice: EventEmitter<void> = new EventEmitter<void>();
    /** Event emitted when the 'Send Email' action is triggered */
    @Output() sendEmail: EventEmitter<boolean> = new EventEmitter<boolean>();
    /** Event emitted when the 'Edit Account' action is triggered */
    @Output() editAccount: EventEmitter<void> = new EventEmitter<void>();
    /** From date */
    @Input() fromDate: string = '';
    /** To date */
    @Input() toDate: string = '';
    /** Current URL */
    @Input() currentUrl: string = '';
    /** Purchase or Sales */
    public purchaseOrSales: string = '';
    /** Voucher API version */
    public voucherApiVersion: number;
    /** Active account details */
    public activeAccountDetails: any;
    /** Is update account */
    public isUpdateAccount: boolean = false;
    /** Selected group for create account */
    public selectedGroupForCreateAcc: string = '';
    /** True, if organization type is company and it has more than one branch (i.e. in addition to HO) */
    public isCompany: boolean;
    /** True if action menu is open */
    public isActionMenu: boolean = true;

    constructor(private generalService: GeneralService, private dialog: MatDialog, private store: Store<AppState>) {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        this.store.pipe(select(appStore => appStore.settings.branches), take(1)).subscribe(response => {
            if (response) {
                this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch && response?.length > 1;
            }
        });
    }

    /**
       * Handles the 'Go to Ledger' action
       *
       * @param {number} type
       * @param {any} account
       * @param {Event} [event]
       * @memberof ActionMenuComponent
       */
    public performActions(type: number, account: any, event?: Event): void {
        switch (type) {
            case 1: // go to ledger
                if (this.voucherApiVersion === 2) {
                    const additionalParams = this.fromDate && this.toDate ? `/${account?.uniqueName}/${this.fromDate}/${this.toDate}` : `/${account?.uniqueName}`;
                    this.goToRoute("ledger", additionalParams, account?.uniqueName);
                } else {
                    this.goToRoute("ledger", `/${this.fromDate}/${this.toDate}`, account?.uniqueName);
                }
                break;

            case 2: // go to sales or purchase
                this.purchaseOrSales = this.account?.voucherGeneratedType;
                if (this.purchaseOrSales === "purchase") {
                    if (this.voucherApiVersion === 2) {
                        this.goToRoute("vouchers/purchase/" + account?.uniqueName + "/create", "", "");
                    } else {
                        this.goToRoute("proforma-invoice/invoice/purchase", "", account?.uniqueName);
                    }
                } else {
                    let isCashInvoice = account?.uniqueName === "cash";
                    if (this.voucherApiVersion === 2) {
                        if (isCashInvoice) {
                            this.goToRoute("vouchers/cash/create", "", "");
                        } else {
                            this.goToRoute("vouchers/sales/" + account?.uniqueName + "/create", "", "");
                        }
                    } else {
                        this.goToRoute(`proforma-invoice/invoice/${isCashInvoice ? "cash" : "sales"}`, "", account?.uniqueName);
                    }
                }
                break;
            case 3: // send email
                if (event) {
                    event.stopPropagation();
                }
                this.openCustomEmailDialog(account, this.account?.voucherGeneratedType === 'sales' ? 'customer' : 'vendor', false);
                break;
            case 4: // edit account
                if (event) {
                    event.stopPropagation();
                }
                this.updateCustomerAcc(this.account?.accountType === 'sales' ? 'customer' : 'vendor', account);
                break;
            default:
                break;
        }
    }

    /**
     * Go to route
     *
     * @param {string} part
     * @param {string} [additionalParams=""]
     * @param {string} accUniqueName
     * @memberof ActionMenuComponent
     */
    public goToRoute(part: string, additionalParams: string = "", accUniqueName: string): void {
        let url: string;
        
        if (this.generalService.voucherApiVersion === 2) {
            // Construct direct page URL
            url = `/pages/${part}`;
            if (additionalParams) {
                url = `${url}${additionalParams}`;
            }
            // Add redirectUrl parameter for ledger pages
            if (part === 'ledger') {
                const separator = url.includes('?') ? '&' : '?';
                url = `${url}${separator}redirectUrl=${encodeURIComponent(this.currentUrl)}`;
            }
        } else {
            // Legacy URL construction
            url = location.href + `?returnUrl=${part}/${accUniqueName}`;
            if (additionalParams) {
                url = `${url}${additionalParams}`;
            }
        }
        
        if (isElectron) {
            const ipcRenderer = (window as any).require('electron').ipcRenderer;
            const electronUrl = `${location.origin}${location.pathname}#./pages/${part}${part?.includes('ledger') ? `/${accUniqueName}` : ""}`;
            ipcRenderer.send('open-url', electronUrl);
        } else {
            (window as any).open(url);
        }
    }

    /**
     * Update customer account
     *
     * @param {"customer" | "vendor"} accountType
     * @param {any} account
     * @memberof ActionMenuComponent
     */
    public updateCustomerAcc(accountType: "customer" | "vendor", account: any): void {
        this.activeAccountDetails = account;
        this.isUpdateAccount = true;
        this.selectedGroupForCreateAcc = accountType === "customer" ? "sundrydebtors" : "sundrycreditors";
        this.openAccountAsidePaneDialog();
    }

    /**
     * Open account aside pane dialog
     *
     * @memberof ActionMenuComponent
     */
    public openAccountAsidePaneDialog(): void {
        this.asideMenuDialogRef = this.dialog.open(this.asideMenuTemplate, ASIDE_PANE_CONFIG);
    }

    /**
     * Open custom email dialog
     *
     * @param {any} account
     * @param {string} activeTab
     * @param {boolean} sendBulk
     * @memberof ContactComponent
     */
    public openCustomEmailDialog(account: any, activeTab: string, sendBulk: boolean): void {
        const dialogRef = this.dialog.open(TemplateFroalaComponent, {
            ...ASIDE_PANE_CONFIG,
            data: {
                activeTab: activeTab,
                accountUniqueName: sendBulk ? account?.map((account) => account.uniqueName) : account?.uniqueName
            }
        });dialogRef.afterClosed().subscribe(response => {
            if (response) {
                this.sendEmail.emit(true);
            }
        });
    }

    /**
     * Get updated list
     *
     * @param {any} [grpName]
     * @memberof ActionMenuComponent
     */
    public getUpdatedList(grpName?: any): void {
        if (grpName) {
            this.editAccount.emit();
            this.asideMenuDialogRef?.close();
        }
    }
}
