import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AppState } from '../../store';
import { select, Store } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';
import { IFlattenAccountsResultItem } from '../../models/interfaces/flattenAccountsResultItem.interface';
import { ModalDirective } from 'ngx-bootstrap';
import { BulkEmailRequest } from '../../models/api-models/Search';
import { CompanyService } from '../../services/companyService.service';
import { ToasterService } from '../../services/toaster.service';
import { GroupWithAccountsAction } from '../../actions/groupwithaccounts.actions';
import { Router } from '@angular/router';
import { VoucherTypeEnum } from '../../models/api-models/Sales';
import { AccountService } from '../../services/account.service';

@Component({
    selector: '[account-detail-modal-component]',
    templateUrl: './account-detail-modal.component.html',
    styleUrls: ['./account-detail-modal.component.scss']
})

export class AccountDetailModalComponent implements OnChanges {
    @Input() public isModalOpen: boolean = false;
    @Input() public accountUniqueName: string;
    @Input() public from: string;
    @Input() public to: string;
    /** Required to hide generate invoice from modules that don't support it, for eg. Trial balance */
    @Input() public shouldShowGenerateInvoice: boolean = true;

    // take voucher type from parent component
    @Input() public voucherType: VoucherTypeEnum;

    @ViewChild('mailModal') public mailModal: ModalDirective;
    @ViewChild('messageBox') public messageBox: ElementRef;

    public messageBody = {
        header: {
            email: 'Send Email',
            sms: 'Send Sms',
            set: ''
        },
        btn: {
            email: 'Send Email',
            sms: 'Send Sms',
            set: '',
        },
        type: '',
        msg: '',
        subject: ''
    };
    public dataVariables = [
        {
            name: 'Opening Balance',
            value: '%s_OB',
        },
        {
            name: 'Closing Balance',
            value: '%s_CB',
        },
        {
            name: 'Credit Total',
            value: '%s_CT',
        },
        {
            name: 'Debit Total',
            value: '%s_DT',
        },
        {
            name: 'From Date',
            value: '%s_FD',
        },
        {
            name: 'To Date',
            value: '%s_TD',
        },
        {
            name: 'Magic Link',
            value: '%s_ML',
        },
        {
            name: 'Account Name',
            value: '%s_AN',
        },
    ];
    public accInfo: IFlattenAccountsResultItem;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>, private _companyServices: CompanyService,
        private _toaster: ToasterService, private _groupWithAccountsAction: GroupWithAccountsAction, private _accountService: AccountService,
        private _router: Router,
        private changeDetectorRef: ChangeDetectorRef) {
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['accountUniqueName'] && changes['accountUniqueName'].currentValue
            && (changes['accountUniqueName'].currentValue !== changes['accountUniqueName'].previousValue)) {
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
        this._accountService.GetAccountDetailsV2(accountUniqueName).subscribe(response => {
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
                break;
            case 4: // send email
                if (event) {
                    event.stopPropagation();
                }
                this.openEmailDialog();
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
        let el: HTMLInputElement = this.messageBox.nativeElement;
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
                groupUniqueName: this.accInfo.parentGroups[this.accInfo.parentGroups.length - 1].uniqueName
            }
        };

        if (this.messageBody.btn.set === 'Send Email') {
            return this._companyServices.sendEmail(request)
                .subscribe((r) => {
                    r.status === 'success' ? this._toaster.successToast(r.body) : this._toaster.errorToast(r.message);
                });
        } else if (this.messageBody.btn.set === 'Send Sms') {
            let temp = request;
            delete temp.data['subject'];
            return this._companyServices.sendSms(temp)
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
        } else if(isCordova){
            // todo: go to routes
        }else {
            (window as any).open(url);
        }
    }
}
