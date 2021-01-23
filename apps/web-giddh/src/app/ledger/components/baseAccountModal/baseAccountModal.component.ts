import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'base-account',
    templateUrl: './baseAccountModal.component.html',
    styles: [`
    .bg-grey {
        background: #eaebed;
    }
    `]
})
export class BaseAccountComponent implements OnInit {
    @Input() public accountUniqueName: string = '';
    // @Input() public from: string = '';
    // @Input() public to: string = '';
    @Output() public closeBaseAccountModal: EventEmitter<boolean> = new EventEmitter();
    @Output() public updateBaseAccount: EventEmitter<any> = new EventEmitter();
    @Input() public flattenAccountList: any;
    public changedAccountUniq: string = '';

    constructor() {

    }

    public ngOnInit() {
        //
    }

    public changeBaseAccount(item) {
        if (item) {
            this.changedAccountUniq = item.value;
        }
        // this.updateBaseAccount.emit(this.accountUniqueName);
    }

    public saveBaseAccount() {
        this.updateBaseAccount.emit(this.changedAccountUniq);
    }
}
