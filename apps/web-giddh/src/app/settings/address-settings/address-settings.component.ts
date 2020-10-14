import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { PAGINATION_LIMIT } from '../../app.constant';
import { OrganizationType } from '../../models/user-login-state';

@Component({
    selector: 'address-settings',
    templateUrl: './address-settings.component.html',
    styleUrls: ['./address-settings.component.scss']
})
export class AddressSettingsComponent implements OnInit, OnDestroy {
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
    /** Search field event emitter */
    @Output() public searchAddress: EventEmitter<any> = new EventEmitter<any>();

    public searchAddressNameInput: FormControl = new FormControl();
    public searchAddressInput: FormControl = new FormControl();
    public searchStateInput: FormControl = new FormControl();

    public showSearchName: boolean;
    public showSearchAddress: boolean;
    public showSearchState: boolean;

    /** Stores the address search request */
    public addressSearchRequest: any = {
        name: '',
        address: '',
        state: ''
    };

    /** Subject to release subscriptions */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    /** @ignore */
    constructor() { }

    ngOnInit(): void {
        this.searchAddressNameInput.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe(addressName => {
            this.addressSearchRequest.name = addressName;
            this.searchAddress.emit(this.addressSearchRequest);
        });
        this.searchAddressInput.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe(address => {
            this.addressSearchRequest.address = address;
            this.searchAddress.emit(this.addressSearchRequest);
        });
        this.searchStateInput.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe(state => {
            this.addressSearchRequest.state = state;
            this.searchAddress.emit(this.addressSearchRequest);
        });
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
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
        if (event.page !== this.paginationConfig.page) {
            this.pageChanged.emit({...event, ...this.addressSearchRequest});
        }
    }

    public toggleSearch(fieldName: string, el: any) {
        if (fieldName === 'searchAddressNameInput') {
            this.showSearchName = true;
            this.showSearchAddress = false;
            this.showSearchState = false;
        } else if (fieldName === 'searchAddressInput') {
            this.showSearchAddress = true;
            this.showSearchName = false;
            this.showSearchState = false;
        } else if (fieldName === 'searchStateInput') {
            this.showSearchState = true;
            this.showSearchName = false;
            this.showSearchAddress = false;
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
        } else if (fieldName === 'searchAddressInput') {
            if (this.searchAddressInput.value !== null && this.searchAddressInput.value !== '') {
                return;
            }
        } else if (fieldName === 'searchStateInput') {
            if (this.searchStateInput.value !== null && this.searchStateInput.value !== '') {
                return;
            }
        }
        if (this.childOf(event.target, el)) {
            return;
        } else {
            if (fieldName === 'searchAddressNameInput') {
                this.showSearchName = false;
            } else if (fieldName === 'searchAddressInput') {
                this.showSearchAddress = false;
            } else if (fieldName === 'searchStateInput') {
                this.showSearchState = false;
            }
        }
    }

    public childOf(c, p) {
        while ((c = c.parentNode) && c !== p) {
        }
        return !!c;
    }
}
