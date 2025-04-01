import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VoucherTypeEnum } from '../../models/api-models/Sales';
import { BulkEmailRequest } from '../../models/api-models/Search';
import { IFlattenAccountsResultItem } from '../../models/interfaces/flatten-accounts-result-item.interface';
import { AccountService } from '../../services/account.service';
import { CompanyService } from '../../services/company.service';
import { ToasterService } from '../../services/toaster.service';
import { GeneralService } from '../../services/general.service';

@Component({
    selector: '[account-detail-modal-component]',
    templateUrl: './account-detail-modal.component.html',
    styleUrls: ['./account-detail-modal.component.scss'],
    animations: [
        trigger("slideInOut", [
            state("in", style({
                transform: "translate3d(0, 0, 0)",
            })),
            state("out", style({
                transform: "translate3d(100%, 0, 0)",
            })),
            transition("in => out", animate("400ms ease-in-out")),
            transition("out => in", animate("400ms ease-in-out")),
        ]),
    ],
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
    /** Emits when modal needs to be closed */
    @Output() public modalClosed: EventEmitter<boolean> = new EventEmitter();
    /** Emits when modal needs to be closed temporary */
    @Output() public modalClosedTemporary: EventEmitter<any> = new EventEmitter();
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
    /** This will close modal on edit account icon click */
    @Input() public closeOnEdit: boolean = false;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Account update modal state */
    public accountAsideMenuState: string = "out";
    /** Account group unique name */
    public activeGroupUniqueName: string = "";
    /** True if api call in progress */
    public isLoading: boolean = false;

    constructor(
        private _companyServices: CompanyService,
        private _toaster: ToasterService,
        private _accountService: AccountService,
        private changeDetectorRef: ChangeDetectorRef,
        private generalService: GeneralService
    ) {
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
        this.isLoading = true;
        this._accountService.GetAccountDetailsV2(accountUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
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

    public performActions(type: number, event?: any) {
        switch (type) {
            case 0: // go to add and manage
                if (!this.closeOnEdit) {
                    this.activeGroupUniqueName = this.accInfo?.parentGroups[this.accInfo?.parentGroups?.length - 1]?.uniqueName;
                    this.toggleAccountAsidePane();
                    event.stopPropagation();
                } else {
                    this.modalClosedTemporary.emit(this.accInfo);
                }
                break;

            case 1: // go to ledger
                let additionalParams = this.generalService.voucherApiVersion === 2 ? `ledger/${this.accountUniqueName}` : 'ledger';
                this.goToRoute(additionalParams, `/${this.from}/${this.to}`);
                break;

            case 2: // go to sales/ purchase/ debit note or credit note generate page
                if (this.voucherType === VoucherTypeEnum.sales) {
                    // special case, because we don't have cash invoice as voucher type at api side so we are handling it ui side
                    let isCashInvoice = this.accountUniqueName === 'cash';
                    if (this.generalService.voucherApiVersion === 2) {
                        if (isCashInvoice) {
                            this.goToRoute(`/pages/vouchers/cash/create`);
                        } else {
                            this.goToRoute(`/pages/vouchers/sales/${this.accountUniqueName}/create`);
                        }
                    } else {
                        this.goToRoute(`proforma-invoice/invoice/${isCashInvoice ? 'cash' : 'sales'}`);
                    }
                } else {
                    // for purchase/ debit and credit note
                    if (this.generalService.voucherApiVersion === 2) {
                        this.goToRoute('/pages/vouchers/' + this.voucherType.toString().replace(/-/g, " ") + '/' + this.accountUniqueName + '/create');
                    } else {
                        this.goToRoute('proforma-invoice/invoice/' + this.voucherType);
                    }
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
        this.mailModal?.show();
    }

    // Open Modal for SMS
    public openSmsDialog() {
        this.messageBody.msg = '';
        this.messageBody.type = 'sms';
        this.messageBody.btn.set = this.messageBody.btn.sms;
        this.messageBody.header.set = this.messageBody.header.sms;
        this.mailModal?.show();
    }

    // Add Selected Value to Message Body
    public addValueToMsg(val: any) {
        this.typeInTextarea(val?.value);
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
        let text = el?.value;
        let before = text?.substring(0, start);
        let after = text?.substring(end, text?.length);
        el.value = (before + newText + after);
        el.selectionStart = el.selectionEnd = start + newText?.length;
        el.focus();
        this.messageBody.msg = el?.value;
    }

    // Send Email/Sms for Accounts
    public send() {
        let request: BulkEmailRequest = {
            data: {
                subject: this.messageBody.subject,
                message: this.messageBody.msg,
                accounts: [this.accInfo?.uniqueName],
            },
            params: {
                from: this.from,
                to: this.to,
                groupUniqueName: this.accInfo?.parentGroups[this.accInfo?.parentGroups?.length - 1]?.uniqueName || this.accInfo?.parentGroups[this.accInfo?.parentGroups?.length - 1]
            }
        };

        if (this.messageBody.btn.set === this.commonLocaleData?.app_send_email) {
            return this._companyServices.sendEmail(request).pipe(takeUntil(this.destroyed$))
                .subscribe((r) => {
                    r?.status === 'success' ? this._toaster.successToast(r?.body) : this._toaster.errorToast(r?.message);
                });
        } else if (this.messageBody.btn.set === this.localeData?.send_sms) {
            let temp = request;
            delete temp.data['subject'];
            return this._companyServices.sendSms(temp).pipe(takeUntil(this.destroyed$))
                .subscribe((r) => {
                    r?.status === 'success' ? this._toaster.successToast(r?.body) : this._toaster.errorToast(r?.message);
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
        let url = (this.generalService.voucherApiVersion === 2) ? part : location.href + `?returnUrl=${part}/${this.accountUniqueName}`;
        if (additionalParams) {
            url = `${url}${additionalParams}`;
        }

        if (isElectron) {
            let ipcRenderer = (window as any).require('electron').ipcRenderer;
            if (this.generalService.voucherApiVersion === 2) {
                url = location.origin + location.pathname + `#./pages/${part}`;
            } else {
                url = location.origin + location.pathname + `#./pages/${part}/${this.accountUniqueName}`;
            }
            ipcRenderer.send('open-url', url);
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

    /**
     * Toggle's account update modal
     *
     * @memberof AccountDetailModalComponent
     */
    public toggleAccountAsidePane(): void {
        this.accountAsideMenuState = this.accountAsideMenuState === "out" ? "in" : "out";
        this.toggleBodyClass();
    }

    /**
     * Toggle's fixed class in body
     *
     * @memberof AccountDetailModalComponent
     */
    public toggleBodyClass() {
        if (this.accountAsideMenuState === "in") {
            document.querySelector("body").classList.add("fixed");
        } else {
            document.querySelector("body").classList.remove("fixed");
        }
    }

    /**
     * Callback function on account modal close
     *
     * @param {*} event
     * @memberof AccountDetailModalComponent
     */
    public getUpdatedList(event: any): void {
        if (this.accountAsideMenuState === "in") {
            this.toggleAccountAsidePane();
        }
        this.modalClosed.emit(event);
    }
}
