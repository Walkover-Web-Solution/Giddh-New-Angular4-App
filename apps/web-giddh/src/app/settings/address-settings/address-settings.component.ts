import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { PAGINATION_LIMIT } from '../../app.constant';
import { OrganizationType } from '../../models/user-login-state';

@Component({
    selector: 'address-settings',
    templateUrl: './address-settings.component.html',
    styleUrls: ['./address-settings.component.scss']
})
export class AddressSettingsComponent implements OnInit {
    public isBranchElement: boolean = false;
    public accountAsideMenuState: string = 'out';

    /** Stores the type of the organization (company or profile)  */
    @Input() public organizationType: OrganizationType;
    /** Stores the addresses of an organization (company or profile)  */
    @Input() public addresses: Array<any>;
    /** Stores the pagination count */
    @Input() public paginationLimit: number = PAGINATION_LIMIT;
    /** Stores the pagination configuration */
    @Input() public paginationConfig: any;
    /** True if API is in progress */
    @Input() public shouldShowLoader: boolean;

    /** Page change event emitter */
    @Output() public pageChanged: EventEmitter<any> = new EventEmitter<any>();

    public searchAddressNameInput: FormControl = new FormControl();

    public showSearchName: boolean;

    /** @ignore */
    constructor() { }

    ngOnInit(): void {
    }

    public openAddAndManage() {
        this.toggleAccountAsidePane();
    }

    public toggleAccountAsidePane(event?): void {
        if (event) {
            event.preventDefault();
        }
        this.accountAsideMenuState = this.accountAsideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    public toggleBodyClass() {
        if (this.accountAsideMenuState === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }

    public handlePageChange(event: any): void {
        this.pageChanged.emit(event);
    }

    public toggleSearch(fieldName: string, el: any) {
        if (fieldName === 'searchAddressNameInput') {
            this.showSearchName = true;
        } else {
            this.showSearchName = false;
        }
        setTimeout(() => {
            el.focus();
        }, 200);
    }

    public clickedOutside(event: Event, el: HTMLElement, fieldName: string) {
        if (fieldName === 'searchAddressNameInput') {
            if (this.searchAddressNameInput.value !== null && this.searchAddressNameInput.value !== '') {
                return;
            }
        }
        if (this.childOf(event.target, el)) {
            return;
        } else {
            if (fieldName === 'searchAddressNameInput') {
                this.showSearchName = false;
            }
        }
    }

    public childOf(c, p) {
        while ((c = c.parentNode) && c !== p) {
        }
        return !!c;
    }
}
