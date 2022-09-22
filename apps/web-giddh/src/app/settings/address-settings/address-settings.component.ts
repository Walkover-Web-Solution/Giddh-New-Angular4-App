import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
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
    /** Stores the confirmation modal instance */
    @ViewChild('deleteAddressConfirmationModal', { static: true }) public deleteAddressConfirmationModal: ModalDirective;

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
    /** True, if create/update address is in progress */
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
        balanceDisplayFormat: '',
        taxType: ''
    };
    /** Stores the current organization uniqueName
     * (required for checking the entity same as the organization in create-address link-entity field) */
    @Input() public currentOrganizationUniqueName: string;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
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
    /** Emits if create/update address is in progress */
    @Output() public isAddressChangeInProgressChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    /** Emits if aside pane needs to be closed */
    @Output() public closeSidePaneChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    /** Search address name input field form control */
    public searchAddressNameInput: FormControl = new FormControl();
    /** Search address input field form control */
    public searchAddressInput: FormControl = new FormControl();
    /** Search state input field form control */
    public searchStateInput: FormControl = new FormControl();
    /** Stores the current state of side menu */
    public accountAsideMenuState: string = 'out';
    /** True, if search name input field is to be shown */
    public showSearchName: boolean;
    /** True, if search address input field is to be shown */
    public showSearchAddress: boolean;
    /** True, if search state input field is to be shown */
    public showSearchState: boolean;
    /** Stores the address search request */
    public addressSearchRequest: any = {
        name: '',
        address: '',
        state: ''
    };
    /** Stores the address to be updated */
    public addressToUpdate: any;
    /** Selected address */
    public selectedAddress: any;

    /** Subject to release subscriptions */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    /** @ignore */
    constructor() { }

    /**
     * Initializes the component
     *
     * @memberof AddressSettingsComponent
     */
    public ngOnInit(): void {
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

    /**
     * Resets the filter
     *
     * @memberof AddressSettingsComponent
     */
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

    /**
     * Unsubscribe from all the listeners
     *
     * @memberof AddressSettingsComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Opens the side menu pane
     *
     * @memberof AddressSettingsComponent
     */
    public openAddAndManage(): void {
        this.toggleAccountAsidePane();
    }

    /**
     * Toggles the aside menu
     *
     * @memberof AddressSettingsComponent
     */
    public toggleAccountAsidePane(): void {
        this.accountAsideMenuState = this.accountAsideMenuState === 'out' ? 'in' : 'out';
        this.closeSidePane = false;
        this.isAddressChangeInProgress = false;
        this.isAddressChangeInProgressChange.emit(this.isAddressChangeInProgress);
        this.closeSidePaneChange.emit(this.closeSidePane);
        if (this.accountAsideMenuState === 'out') {
            this.addressConfiguration.type = SettingsAsideFormType.CreateAddress;
        }
        this.toggleBodyClass();
    }

    /**
     * Saves address
     *
     * @param {*} form Form value containinig details
     * @memberof AddressSettingsComponent
     */
    public saveAddress(form: any): void {
        this.saveNewAddress.emit(form);
    }

    /**
     * Updates address
     *
     * @param {*} form Form value containing details
     * @memberof AddressSettingsComponent
     */
    public updateAddress(form: any): void {
        form.formValue['uniqueName'] = this.addressToUpdate?.uniqueName;
        this.updatedAddress.emit(form);
    }

    /**
     * Adds fixed class to body when aside menu is opened
     *
     * @memberof AddressSettingsComponent
     */
    public toggleBodyClass(): void {
        if (this.accountAsideMenuState === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }

    /**
     * Pagination change handler
     *
     * @param {*} event Pagination event
     * @memberof AddressSettingsComponent
     */
    public handlePageChange(event: any): void {
        if (event.page !== this.paginationConfig.page) {
            this.pageChanged.emit({ ...event, ...this.addressSearchRequest });
        }
    }

    /**
     * Update address handller
     *
     * @param {*} address Address to be updatedd
     * @memberof AddressSettingsComponent
     */
    public handleUpdateAddress(address: any): void {
        this.addressConfiguration.type = SettingsAsideFormType.EditAddress;
        this.addressToUpdate = address;
        this.openAddAndManage();
    }

    /**
     * Delete address handler
     *
     * @param {*} address Address to be deleted
     * @memberof AddressSettingsComponent
     */
    public handleDeleteAddress(address: any): void {
        this.deleteAddress.emit(address);
    }

    /**
     * Unlink address handler
     *
     * @param {*} address Address to be unlinked
     * @memberof AddressSettingsComponent
     */
    public handleUnLinkAddress(address: any): void {
        this.unLinkAddress.emit(address);
    }

    /**
     * Set Default address handler
     *
     * @param {*} address Address to be set as default
     * @memberof AddressSettingsComponent
     */
    public handleSetDefaultAddress(address: any): void {
        this.setDefaultAddress.emit(address);
    }

    /**
     * Search field toggler
     *
     * @param {string} fieldName Field to be shown/hidden
     * @param {*} el Field instance
     * @memberof AddressSettingsComponent
     */
    public toggleSearch(fieldName: string, el: any): void {
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

    /**
     * Click outside handler
     *
     * @param {Event} event Click outside event
     * @param {HTMLElement} el Element instance
     * @param {string} fieldName Field name
     * @returns
     * @memberof AddressSettingsComponent
     */
    public clickedOutside(event: Event, el: HTMLElement, fieldName: string): void {
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

    /**
     * Checks if an element belongs to a parent
     *
     * @param {*} child Child element
     * @param {*} parent Parent element
     * @returns {boolean} Boolean value
     * @memberof AddressSettingsComponent
     */
    public childOf(child, parent): boolean {
        while ((child = child.parentNode) && child !== parent) {
        }
        return !!child;
    }

    /**
     * Displays the confirmation modal for taking any action
     *
     * @param {*} address Selected address
     * @memberof AddressSettingsComponent
     */
    public showConfirmationModal(address: any): void {
        this.selectedAddress = address;
        this.deleteAddressConfirmationModal.show();
    }

    /**
     * Handles the confirmation of the operation
     *
     * @memberof AddressSettingsComponent
     */
    public onConfirmation(): void {
        if (this.organizationType === OrganizationType.Branch) {
            this.handleUnLinkAddress(this.selectedAddress);
        } else {
            this.handleDeleteAddress(this.selectedAddress);
        }
        this.deleteAddressConfirmationModal.hide();
    }

    /**
     * Handles the cancel operation
     *
     * @memberof AddressSettingsComponent
     */
    public onCancel(): void {
        this.deleteAddressConfirmationModal.hide();
    }

    /**
     * Returns the search field text
     *
     * @param {*} title
     * @returns {string}
     * @memberof AddressSettingsComponent
     */
    public getSearchFieldText(title: any): string {
        let searchField = this.localeData?.search_field;
        searchField = searchField?.replace("[FIELD]", title);
        return searchField;
    }
}
