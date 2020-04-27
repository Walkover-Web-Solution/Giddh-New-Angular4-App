import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ILedgersInvoiceResult } from "../../../models/api-models/Invoice";
import { ReportsModel } from "../../../models/api-models/Reports";
import { Store } from "@ngrx/store";
import { AppState } from "../../../store";
import { GroupWithAccountsAction } from "../../../actions/groupwithaccounts.actions";
import { ModalDirective } from "ngx-bootstrap";
import { Router } from '@angular/router';


@Component({
    selector: 'reports-table-component',
    templateUrl: './report.table.component.html',
    styleUrls: ['./report.table.component.scss']
})
export class ReportsTableComponent implements OnInit {
    @Input() public reportRespone: ReportsModel[];
    @Input() public activeFinacialYr: any;
    @Input() salesRegisterTotal: any;
    @ViewChild('mailModal') public mailModal: ModalDirective;
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
    public toDate: string;
    public fromDate: string;
    public activeTab: any = 'customer';
    public purchaseOrSales: 'sales' | 'purchase';

    ngOnInit() {
    }

    constructor(private store: Store<AppState>, private _groupWithAccountsAction: GroupWithAccountsAction, private _router: Router) {
    }

    public performActions(type: number, account: any, event?: any) {

        switch (type) {
            case 0: // go to add and manage
                this.store.dispatch(this._groupWithAccountsAction.getGroupWithAccounts(account.name));
                this.store.dispatch(this._groupWithAccountsAction.OpenAddAndManageFromOutside(account.name));
                break;

            case 1: // go to ledger
                this.goToRoute('ledger', `/${this.fromDate}/${this.toDate}`, account.uniqueName);
                break;

            case 2: // go to sales or purchase
                this.purchaseOrSales = this.activeTab === 'customer' ? 'sales' : 'purchase';
                if (this.purchaseOrSales === 'purchase') {
                    this.goToRoute('purchase/create', '', account.uniqueName);
                } else {
                    this.goToRoute('sales', '', account.uniqueName);
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

    public goToRoute(part: string, additionalParams: string = '', accUniqueName: string) {
        let url = location.href + `?returnUrl=${part}/${accUniqueName}`;

        if (additionalParams) {
            url = `${url}${additionalParams}`;
        }

        if (isElectron) {
            let ipcRenderer = (window as any).require('electron').ipcRenderer;
            url = location.origin + location.pathname + `#./pages/${part}/${accUniqueName}`;
            console.log(ipcRenderer.send('open-url', url));
        } else if (isCordova) {
            // todo: gotoroute in cordova
        } else {
            (window as any).open(url);
        }
    }

    // Open Modal for SMS
    public openSmsDialog() {
        this.messageBody.msg = '';
        this.messageBody.type = 'sms';
        this.messageBody.btn.set = this.messageBody.btn.sms;
        this.messageBody.header.set = this.messageBody.header.sms;
        this.mailModal.show();
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

    public GotoDetailedSales(item: ReportsModel) {
        let from = item.from;
        let to = item.to;
        let aa = this.activeFinacialYr;

        if (from != null && to != null) {
            this._router.navigate(['pages', 'reports', 'sales-detailed-expand'], {queryParams: {from: from, to: to}});
        }
    }
}
