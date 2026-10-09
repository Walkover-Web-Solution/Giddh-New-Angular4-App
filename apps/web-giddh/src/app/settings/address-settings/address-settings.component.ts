import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, TemplateRef, SimpleChanges, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { combineLatest, ReplaySubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { SettingsBranchActions } from '../../actions/settings/branch/settings.branch.action';
import { PAGINATION_LIMIT, PAGE_SIZE_OPTIONS, ASIDE_PANE_CONFIG } from '../../app.constant';
import { PageEvent } from '@angular/material/paginator';
import { BranchFilterRequest } from '../../models/api-models/Company';
import { OrganizationType } from '../../models/user-login-state';
import { AppState } from '../../store';
import { OrganizationProfile, SettingsAsideFormType } from '../constants/settings.constant';
import { WarehouseActions } from '../warehouse/action/warehouse.action';
import { GeneralService } from '../../services/general.service';

@Component({
    selector: 'address-settings',
    templateUrl: './address-settings.component.html',
    styleUrls: ['./address-settings.component.scss'],
    standalone:false
})
export class AddressSettingsComponent implements OnInit, OnChanges, OnDestroy {
    /** Holds Aside Account AsidePane Dialog Template Reference */
    @ViewChild("asideAccountAsidePane") public asideAccountAsidePane: TemplateRef<any>;
    /** Holds Delete Address Confirmation Dialog Template Reference */
    @ViewChild("deleteAddressConfirmationModal") public deleteAddressConfirmationModal: TemplateRef<any>;
    /** True if we need to show manage address section only */
    @Input() public addressOnly: boolean = false;
    /** Tax type (gst/trn) */
    @Input() public taxType: string = '';
    /** Stores the type of the organization (company or profile)  */
    @Input() public organizationType: OrganizationType;
    /** Stores the addresses of an organization (company or profile)  */
    @Input() public addresses: Array<any>;
    /** Stores the pagination count */
    @Input() public paginationLimit: number = PAGINATION_LIMIT;
    /** Holds available page size options */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
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
    /** True, if show gst column */
    @Input() public showTaxColumn: boolean = false;
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
    public searchAddressNameInput: UntypedFormControl = new UntypedFormControl();
    /** Search address input field form control */
    public searchAddressInput: UntypedFormControl = new UntypedFormControl();
    /** Search tax input field form control */
    public searchTaxInput: UntypedFormControl = new UntypedFormControl();
    /** Search state input field form control */
    public searchStateInput: UntypedFormControl = new UntypedFormControl();
    /** True, if search name input field is to be shown */
    public showSearchName: boolean;
    /** True, if search address input field is to be shown */
    public showSearchAddress: boolean;
    /** True, if search tax input field is to be shown */
    public showSearchTax: boolean;
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
    /** True if need to hide link entity */
    public hideLinkEntity: boolean = true;
    /** Subject to release subscriptions */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Holds Table Columns */
    public displayedColumns: string[] = ['no', 'name', 'address', 'defaultAddress', 'gstin', 'state', 'linked'];
    /** Holds Delete Address Confirmation Dialog Reference */
    private deleteAddressConfirmationModalRef: MatDialogRef<any>;
    /** Holds Aside Account AsidePane Dialog Reference */
    private asideAccountAsidePaneRef: MatDialogRef<any>;
    /** True if consolidated branch */
    public isConsolidatedBranch: boolean;
    /** Stores the voucher API version of current company */
    public voucherApiVersion: number;

    /** @ignore */
    constructor(
        private store: Store<AppState>,
        private warehouseActions: WarehouseActions,
        private settingsBranchActions: SettingsBranchActions,
        public dialog: MatDialog,
        private generalService: GeneralService
    ) { }

    /**
     * Initializes the component
     *
     * @memberof AddressSettingsComponent
     */
    public ngOnInit(): void {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        /** If this is true, it means we are in branch consolidated mode.  */
        this.store.pipe(select(select => select.branchConsolidated), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isConsolidatedBranch = response.isBranchConsolidated;
            }
        });
        this.store.dispatch(this.warehouseActions.fetchAllWarehouses({ page: 1, query: "", count: 2 })); // count is 2 because we only have to check if there are more than 1 records
        let branchFilterRequest = new BranchFilterRequest();
        branchFilterRequest.from = "";
        branchFilterRequest.to = "";
        this.store.dispatch(this.settingsBranchActions.GetALLBranches(branchFilterRequest));

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
        this.searchTaxInput.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe(address => {
            if (!this.searchTaxInput.pristine) {
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
     * Checks the input data if changed
     *
     * @memberof AddressSettingsComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        this.hideLinkEntity = true;

        if (this.addresses?.length > 1) {
            this.hideLinkEntity = false;
        } else {
            combineLatest([this.store.pipe(select(state => state.warehouse.warehouses)), this.store.pipe(select(state => state.settings.branches))]).pipe(takeUntil(this.destroyed$)).subscribe((response: any[]) => {
                if (response && response[0] && response[1]) {
                    if (response[0]?.results?.length > 1 || response[1]?.length > 1) {
                        this.hideLinkEntity = false;
                    }
                }
            });
        }

        if (changes.closeSidePane?.currentValue) {
            this.closeAccountAsidePane();
        }
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
        this.searchTaxInput.reset();
        this.showSearchAddress = false;
        this.showSearchTax = false;
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
    public openAddAndManage() {
        this.toggleAccountAsidePane();

    }

    /**
     * Toggles the aside menu
     *
     * @memberof AddressSettingsComponent
     */
    public toggleAccountAsidePane(): void {
        this.isAddressChangeInProgress = false;
        this.isAddressChangeInProgressChange.emit(this.isAddressChangeInProgress);
        this.asideAccountAsidePaneRef = this.dialog.open(this.asideAccountAsidePane, ASIDE_PANE_CONFIG);
    }

    /**
     * Close Account asidepane dialog
     *
     * @memberof AddressSettingsComponent
     */
    public closeAccountAsidePane(): void {
        this.asideAccountAsidePaneRef?.close();
        this.addressConfiguration.type = SettingsAsideFormType.CreateAddress;
        this.addressToUpdate = null;
    }

    /**
     * Saves address
     *
     * @param {*} form Form value containinig details
     * @memberof AddressSettingsComponent
     */
    public saveAddress(form: any): void {
        this.saveNewAddress.emit(form);
        this.closeAccountAsidePane();
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
        this.closeAccountAsidePane();
    }

    /**
     * Pagination change handler
     *
     * @param {*} event Pagination event
     * @memberof AddressSettingsComponent
     */
    /**
     * Handles the page change event from mat-paginator
     *
     * @param {PageEvent} event Page event
     * @memberof AddressSettingsComponent
     */
    public handlePageEvent(event: PageEvent): void {
        this.paginationConfig.page = event.pageSize !== this.paginationLimit ? 1 : event.pageIndex + 1;
        this.paginationConfig.count = event.pageSize;
        this.pageChanged.emit({ page: this.paginationConfig.page, count: this.paginationConfig.count, ...this.addressSearchRequest });
    }



    /**
     * Update address handler
     *
     * @param {*} address Address to be updatedd
     * @memberof AddressSettingsComponent
     */
    public handleUpdateAddress(address: any): void {
        this.addressConfiguration.type = SettingsAsideFormType.EditAddress;
        this.addressToUpdate = address;
        this.toggleAccountAsidePane();
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
            this.showSearchTax = false;
            this.showSearchState = false;
        } else if (fieldName === 'searchAddressInput') {
            this.showSearchAddress = true;
            this.showSearchTax = false;
            this.showSearchName = false;
            this.showSearchState = false;
        } else if (fieldName === 'searchTaxInput') {
            this.showSearchTax = true;
            this.showSearchAddress = false;
            this.showSearchName = false;
            this.showSearchState = false;
        } else if (fieldName === 'searchStateInput') {
            this.showSearchState = true;
            this.showSearchName = false;
            this.showSearchAddress = false;
            this.showSearchTax = false;
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
            if (this.searchAddressNameInput?.value !== null && this.searchAddressNameInput?.value !== '') {
                return;
            }
        } else if (fieldName === 'searchAddressInput') {
            if (this.searchAddressInput?.value !== null && this.searchAddressInput?.value !== '') {
                return;
            }
        } else if (fieldName === 'searchTaxInput') {
            if (this.searchTaxInput?.value !== null && this.searchTaxInput?.value !== '') {
                return;
            }
        } else if (fieldName === 'searchStateInput') {
            if (this.searchStateInput?.value !== null && this.searchStateInput?.value !== '') {
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
            } else if (fieldName === 'searchTaxInput') {
                this.showSearchTax = false;
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
     * Displays the confirmation dialog
     *
     * @param {*} address Selected address
     * @memberof AddressSettingsComponent
     */
    public showConfirmationModal(address: any) {
        this.selectedAddress = address;
        this.deleteAddressConfirmationModalRef = this.dialog.open(this.deleteAddressConfirmationModal, {
            panelClass: "mat-dialog-sm",
            disableClose: true
        });
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
        this.deleteAddressConfirmationModalRef?.close();
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
