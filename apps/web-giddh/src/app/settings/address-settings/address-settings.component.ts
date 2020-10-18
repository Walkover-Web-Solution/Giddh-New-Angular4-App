import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { PAGINATION_LIMIT } from '../../app.constant';
import { OrganizationType } from '../../models/user-login-state';
import { OrganizationProfile, SettingsAsideFormType } from '../constants/settings.constant';

@Component({
    selector: 'address-settings',
    templateUrl: './address-settings.component.html',
    styleUrls: ['./address-settings.component.scss'],
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
    /** Tre, if create/update address is in progress */
    @Input() public isAddressChangeInProgress: boolean;
    /** Address configuration */
    @Input() public addressConfiguration: any;
    /** True, if aside pane needs to be closed */
    @Input() public closeSidePane: boolean;
    /** Stores the profile data of an organization (company or profile) */
    @Input() public profileData: OrganizationProfile = {
        name: '',
        uniqueName: '',
        companyName: '',
        logo: '',
        alias: '',
        parent: {},
        country: {
            countryName: '',
            countryCode: '',
            currencyName: '',
            currencyCode: ''
        },
        businessTypes: [],
        businessType: '',
        nameAlias: '',
        balanceDisplayFormat: ''
    };

    /** Page change event emitter */
    @Output() public pageChanged: EventEmitter<any> = new EventEmitter<any>();
    /** Search field event emitter */
    @Output() public searchAddress: EventEmitter<any> = new EventEmitter<any>();
    /** Save new address event emitter */
    @Output() public saveNewAddress: EventEmitter<any> = new EventEmitter<any>();
    /** Update address event emitter */
    @Output() public updatedAddress: EventEmitter<any> = new EventEmitter<any>();
    /** Delete address event emitter */
    @Output() public deleteAddress: EventEmitter<any> = new EventEmitter<any>();
    /** Unlink address event emitter */
    @Output() public unLinkAddress: EventEmitter<any> = new EventEmitter<any>();
    /** Set default address event emitter */
    @Output() public setDefaultAddress: EventEmitter<any> = new EventEmitter<any>();

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
    /** Stores the address to be updated */
    public addressToUpdate: any;

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
            if (!this.searchAddressNameInput.pristine) {
                this.addressSearchRequest.name = addressName;
                this.searchAddress.emit(this.addressSearchRequest);
            }
        });
        this.searchAddressInput.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe(address => {
            if (!this.searchAddressInput.pristine) {
                this.addressSearchRequest.address = address;
                this.searchAddress.emit(this.addressSearchRequest);
            }
        });
        this.searchStateInput.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe(stateName => {
            if (!this.searchStateInput.pristine) {
                this.addressSearchRequest.state = stateName;
                this.searchAddress.emit(this.addressSearchRequest);
            }
        });
    }

    public resetFilter(): void {
        this.addressSearchRequest = {
            name: '',
            address: '',
            state: ''
        };
        this.searchStateInput.reset();
        this.showSearchState = false;
        this.searchAddressInput.reset();
        this.showSearchAddress = false;
        this.searchAddressNameInput.reset();
        this.showSearchName = false;

        this.searchAddress.emit(this.addressSearchRequest);
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public openAddAndManage() {
        this.toggleAccountAsidePane();
    }

    public toggleAccountAsidePane(): void {
        this.accountAsideMenuState = this.accountAsideMenuState === 'out' ? 'in' : 'out';
        this.closeSidePane = false;
        this.toggleBodyClass();
    }

    public saveAddress(form: any): void {
        console.log(form);
        this.saveNewAddress.emit(form);
    }

    public updateAddress(form: any): void {
        form.formValue['uniqueName'] = this.addressToUpdate.uniqueName;
        this.updatedAddress.emit(form);
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
            this.pageChanged.emit({ ...event, ...this.addressSearchRequest });
        }
    }

    public handleUpdateAddress(address: any): void {
        this.addressConfiguration.type = SettingsAsideFormType.EditAddress;
        this.addressToUpdate = address;
        this.openAddAndManage();
    }

    handleDeleteAddress(address: any): void {
        this.deleteAddress.emit(address);
    }

    handleUnLinkAddress(address: any): void {
        this.unLinkAddress.emit(address);
    }

    handleSetDefaultAddress(address: any): void {
        this.setDefaultAddress.emit(address);
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
