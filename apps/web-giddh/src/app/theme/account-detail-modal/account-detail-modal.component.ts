import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GroupWithAccountsAction } from '../../actions/groupwithaccounts.actions';
import { VoucherTypeEnum } from '../../models/api-models/Sales';
import { BulkEmailRequest } from '../../models/api-models/Search';
import { IFlattenAccountsResultItem } from '../../models/interfaces/flattenAccountsResultItem.interface';
import { AccountService } from '../../services/account.service';
import { CompanyService } from '../../services/companyService.service';
import { ToasterService } from '../../services/toaster.service';
import { AppState } from '../../store';

@Component({
    selector: '[account-detail-modal-component]',
    templateUrl: './account-detail-modal.component.html',
    styleUrls: ['./account-detail-modal.component.scss']
})

export class AccountDetailModalComponent implements OnChanges, OnDestroy {
    @Input() public isModalOpen: boolean = false;
    @Input() public accountUniqueName: string;
    @Input() public from: string;
    @Input() public to: string;
    /** Required to hide generate invoice from modules that don't support it, for eg. Trial balance */
    @Input() public shouldShowGenerateInvoice: boolean = true;

    // take voucher type from parent component
    @Input() public voucherType: VoucherTypeEnum;
    /** Emits when modal needs to be opened */
    @Output() public modalOpened: EventEmitter<ModalDirective> = new EventEmitter<ModalDirective>();

    @ViewChild('mailModal', { static: true }) public mailModal: ModalDirective;
    @ViewChild('messageBox', { static: true }) public messageBox: ElementRef;

    public messageBody = {
        header: {
            email: '',
            sms: '',
            set: ''
        },
        btn: {
            email: '',
            sms: '',
            set: '',
        },
        type: '',
        msg: '',
        subject: ''
    };
    public dataVariables = [];
    @Input() public accInfo: IFlattenAccountsResultItem;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(private store: Store<AppState>, private _companyServices: CompanyService,
        private _toaster: ToasterService, private _groupWithAccountsAction: GroupWithAccountsAction, private _accountService: AccountService,
        private changeDetectorRef: ChangeDetectorRef) {
    }

    public ngOnChanges(changes: SimpleChanges): void {
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
        this._accountService.GetAccountDetailsV2(accountUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response.status === 'success') {
                this.accInfo = response.body;
                this.changeDetectorRef.detectChanges();
            } else {
                this._toaster.errorToast(response.message);
            }
        });
    }

    public performActions(type: number, event?: any) {
        switch (type) {
            case 0: // go to add and manage
                this.store.dispatch(this._groupWithAccountsAction.OpenAddAndManageFromOutside(this.accInfo.name));
                break;

            case 1: // go to ledger
                this.goToRoute('ledger', `/${this.from}/${this.to}`);
                break;

            case 2: // go to sales/ purchase/ debit note or credit note generate page
                if (this.voucherType === VoucherTypeEnum.sales) {
                    // special case, because we don't have cash invoice as voucher type at api side so we are handling it ui side
                    let isCashInvoice = this.accountUniqueName === 'cash';
                    this.goToRoute(`proforma-invoice/invoice/${isCashInvoice ? 'cash' : 'sales'}`);
                } else {
                    // for purchase/ debit and credit note
                    this.goToRoute('proforma-invoice/invoice/' + this.voucherType);
                }
                break;
            case 3: // send sms
                if (event) {
                    event.stopPropagation();
                }
                this.openSmsDialog();
                this.modalOpened.emit(this.mailModal);
                break;
            case 4: // send email
                if (event) {
                    event.stopPropagation();
                }
                this.openEmailDialog();
                this.modalOpened.emit(this.mailModal);
                break;
            default:
                break;
        }
    }

    // Open Modal for Email
    public openEmailDialog() {
        this.messageBody.msg = '';
        this.messageBody.subject = '';
        this.messageBody.type = 'Email';
        this.messageBody.btn.set = this.messageBody.btn.email;
        this.messageBody.header.set = this.messageBody.header.email;
        this.mailModal.show();
    }

    // Open Modal for SMS
    public openSmsDialog() {
        this.messageBody.msg = '';
        this.messageBody.type = 'sms';
        this.messageBody.btn.set = this.messageBody.btn.sms;
        this.messageBody.header.set = this.messageBody.header.sms;
        this.mailModal.show();
    }

    // Add Selected Value to Message Body
    public addValueToMsg(val: any) {
        this.typeInTextarea(val.value);
    }

    /**
     * Prepare message body
     *
     * @param {*} newText Shortcut tags
     * @memberof AccountDetailModalComponent
     */
    public typeInTextarea(newText) {
        let el: HTMLInputElement = this.messageBox?.nativeElement;
        let start = el.selectionStart;
        let end = el.selectionEnd;
        let text = el.value;
        let before = text.substring(0, start);
        let after = text.substring(end, text.length);
        el.value = (before + newText + after);
        el.selectionStart = el.selectionEnd = start + newText.length;
        el.focus();
        this.messageBody.msg = el.value;
    }

    // Send Email/Sms for Accounts
    public send() {
        let request: BulkEmailRequest = {
            data: {
                subject: this.messageBody.subject,
                message: this.messageBody.msg,
                accounts: [this.accInfo.uniqueName],
            },
            params: {
                from: this.from,
                to: this.to,
                groupUniqueName: this.accInfo.parentGroups[this.accInfo.parentGroups.length - 1].uniqueName || this.accInfo.parentGroups[this.accInfo.parentGroups.length - 1]
            }
        };

        if (this.messageBody.btn.set === this.commonLocaleData?.app_send_email) {
            return this._companyServices.sendEmail(request).pipe(takeUntil(this.destroyed$))
                .subscribe((r) => {
                    r.status === 'success' ? this._toaster.successToast(r.body) : this._toaster.errorToast(r.message);
                });
        } else if (this.messageBody.btn.set === this.localeData?.send_sms) {
            let temp = request;
            delete temp.data['subject'];
            return this._companyServices.sendSms(temp).pipe(takeUntil(this.destroyed$))
                .subscribe((r) => {
                    r.status === 'success' ? this._toaster.successToast(r.body) : this._toaster.errorToast(r.message);
                });
        }

        this.mailModal.hide();
    }

    /**
     *  Perform redirection using change routing
     *
     * @param {string} part routing url
     * @param {string} [additionalParams=''] addition params like date range
     * @memberof AccountDetailModalComponent
     */
    public goToRoute(part: string, additionalParams: string = ''): void {
        let url = location.href + `?returnUrl=${part}/${this.accountUniqueName}`;

        if (additionalParams) {
            url = `${url}${additionalParams}`;
        }
        if (isElectron) {
            let ipcRenderer = (window as any).require('electron').ipcRenderer;
            url = location.origin + location.pathname + `#./pages/${part}/${this.accountUniqueName}`;
            console.log(ipcRenderer.send('open-url', url));
        } else if (isCordova) {
            // todo: go to routes
        } else {
            (window as any).open(url);
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
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof AccountDetailModalComponent
     */
    public translationComplete(event: any): void {
        if(event) {
            this.messageBody.header.email = this.commonLocaleData?.app_send_email;
            this.messageBody.header.sms = this.localeData?.send_sms;

            this.messageBody.btn.email = this.commonLocaleData?.app_send_email;
            this.messageBody.btn.sms = this.localeData?.send_sms;

            this.dataVariables = [
                {
                    name: this.localeData?.opening_balance,
                    value: '%s_OB',
                },
                {
                    name: this.localeData?.closing_balance,
                    value: '%s_CB',
                },
                {
                    name: this.localeData?.credit_total,
                    value: '%s_CT',
                },
                {
                    name: this.localeData?.debit_total,
                    value: '%s_DT',
                },
                {
                    name: this.localeData?.from_date,
                    value: '%s_FD',
                },
                {
                    name: this.localeData?.to_date,
                    value: '%s_TD',
                },
                {
                    name: this.localeData?.magic_link,
                    value: '%s_ML',
                },
                {
                    name: this.commonLocaleData?.app_account_name,
                    value: '%s_AN',
                }
            ];
        }
    }
}
