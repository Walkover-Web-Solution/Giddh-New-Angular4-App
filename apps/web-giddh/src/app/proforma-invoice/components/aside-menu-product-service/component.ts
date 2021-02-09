import { Component, EventEmitter, Output, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AddAccountRequest } from '../../../models/api-models/Account';
import { AccountService } from '../../../services/account.service';
import { ToasterService } from '../../../services/toaster.service';

@Component({
    selector: 'aside-menu-product-service',
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
    animations: [
        trigger('slideInOut', [
            state('in', style({
                transform: 'translate3d(0, 0, 0)'
            })),
            state('out', style({
                transform: 'translate3d(100%, 0, 0)'
            })),
            transition('in => out', animate('400ms ease-in-out')),
            transition('out => in', animate('400ms ease-in-out'))
        ]),
    ]
})

export class AsideMenuProductServiceComponent {

    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    @Output() public animatePAside: EventEmitter<any> = new EventEmitter();
    @Input() public selectedVoucherType: string;
    public autoFocusInChild: boolean = true;

    // public
    public isAddStockOpen: boolean = false;
    public isAddServiceOpen: boolean = false;
    public hideFirstStep: boolean = false;
    /** Aside menu state */
    public accountAsideMenuState: string = "in";

    constructor(
        private accountService: AccountService,
        private toasterService: ToasterService
    ) {

    }

    public toggleStockPane() {
        this.hideFirstStep = true;
        this.isAddServiceOpen = false;
        this.isAddStockOpen = !this.isAddStockOpen;
    }

    public toggleServicePane() {
        this.hideFirstStep = true;
        this.isAddStockOpen = false;
        this.isAddServiceOpen = !this.isAddServiceOpen;
    }

    public closeAsidePane(e?: any) {
        this.hideFirstStep = false;
        this.isAddStockOpen = false;
        this.isAddServiceOpen = false;
        if (e) {
            //
        } else {
            this.closeAsideEvent.emit();
        }
    }

    public animateAside(e: any) {
        this.animatePAside.emit(e);
    }
    public backButtonPressed() {
        this.hideFirstStep = false;
        this.isAddStockOpen = false;
        this.isAddServiceOpen = false;
    }

    /**
     * This will create the service account
     *
     * @param {AddAccountRequest} item
     * @memberof AsideMenuProductServiceComponent
     */
    public addNewServiceAccount(item: AddAccountRequest): void {
        this.accountService.CreateAccountV2(item.accountRequest, item.activeGroupUniqueName).subscribe(response => {
            if(response.status === "success") {
                this.toasterService.successToast("Account Created Successfully");
                this.closeAsideEvent.emit();
            } else {
                this.toasterService.errorToast(response.message);
            }
        });
    }
}
