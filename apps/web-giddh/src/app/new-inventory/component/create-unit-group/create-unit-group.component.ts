import { Component, OnInit, EventEmitter, Output, Input, OnDestroy, OnChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { InventoryService } from '../../../services/inventory.service';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { ToasterService } from '../../../services/toaster.service';
import { ConfirmModalComponent } from '../../../theme/new-confirm-modal/confirm-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { get, set } from '../../../lodash-optimized';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'create-unit-group',

    templateUrl: './create-unit-group.component.html',
    standalone: false,
    styleUrls: ['./create-unit-group.component.scss']
})
/**
 * CreateUnitGroupComponent component
 * Handles createunitgroup functionality and user interactions
 */
export class CreateUnitGroupComponent implements OnInit, OnChanges, OnDestroy {
    /** Holds selected group data */
    @Input() public unitGroupDetails: any = {};
    /** Holds true is open inside dialog */
    @Input() public isInsideDialog: boolean = false;
    /** Emits close unit form */
    @Output() public closeAsideEvent: EventEmitter<any> = new EventEmitter(true);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** Form Group for unit group form */
    public unitGroupForm: UntypedFormGroup;
    /** Holds if form is valid or not */
    public isValidForm: boolean = true;
    /** True if need to generate unique name from name */
    private generateUniqueName: boolean = true;
    /* Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private formBuilder: UntypedFormBuilder,
        private inventoryService: InventoryService,
        private toaster: ToasterService,
        private dialog: MatDialog
    ) {

    }

    /**
     * Lifecycle hook for init component
     *
     * @memberof CreateUnitGroupComponent
     */
    public ngOnInit(): void {
        this.initUnitGroupForm();

        this.unitGroupForm.get('name').valueChanges.pipe(takeUntil(this.destroyed$), debounceTime(700)).subscribe(response => {
            /**
             * Handles if functionality
             */
            if (this.unitGroupDetails?.uniqueName !== "maingroup" && this.generateUniqueName) {
                /**
                 * Handles if functionality
                 */
                if (response) {
                    const uniqueName = response.replace(/\s/g, "")?.toLowerCase();
                    this.unitGroupForm.get('uniqueName').patchValue(uniqueName);
                } else {
                    this.unitGroupForm.get('uniqueName').patchValue("");
                }
            }
        });
    }

    /**
     * Lifecycle hook for input data changes
     *
     * @memberof CreateUnitGroupComponent
     */
    public ngOnChanges(): void {
        /**
         * Handles if functionality
         */
        if (this.unitGroupForm && this.unitGroupDetails?.uniqueName) {
            this.generateUniqueName = false;
            this.unitGroupForm.get('name').patchValue(this.unitGroupDetails?.name);
            this.unitGroupForm.get('uniqueName').patchValue(this.unitGroupDetails?.uniqueName);

            /**
             * Sets timeout value
             */
            setTimeout(() => {
                this.generateUniqueName = true;
            }, 1000);
        }
    }

    /**
     * Initializes unit group form
     *
     * @memberof CreateUnitGroupComponent
     */
    public initUnitGroupForm(): void {
        this.unitGroupForm = this.formBuilder.group({
            name: ['', Validators.required],
            uniqueName: ['']
        });

        /**
         * Handles if functionality
         */
        if (this.unitGroupDetails?.uniqueName) {
            this.unitGroupForm.get('name').patchValue(this.unitGroupDetails?.name);
            this.unitGroupForm.get('uniqueName').patchValue(this.unitGroupDetails?.uniqueName);
        }
    }

    /**
     * Resets form
     *
     * @memberof CreateUnitGroupComponent
     */
    public resetForm(): void {
        this.unitGroupForm?.reset();
        this.isValidForm = true;
    }

    /**
     * Saves unit group
     *
     * @memberof CreateUnitGroupComponent
     */
    public saveUnitGroup(): void {
        this.isValidForm = !this.unitGroupForm.invalid;

        /**
         * Handles if functionality
         */
        if (this.isValidForm) {
            /**
             * Handles if functionality
             */
            if (this.unitGroupDetails?.uniqueName) {
                this.inventoryService.updateStockUnitGroup(this.unitGroupForm.value, this.unitGroupDetails.uniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    /**
                     * Handles if functionality
                     */
                    if (response?.status === "success") {
                        this.closeAsideEvent.emit({ action: 'update', data: response.body });
                        this.toaster.showSnackBar("success", this.localeData?.unit_group_updated);
                    } else {
                        this.toaster.showSnackBar("error", response?.message);
                    }
                });
            } else {
                this.inventoryService.createStockUnitGroup(this.unitGroupForm.value).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    /**
                     * Handles if functionality
                     */
                    if (response?.status === "success") {
                        this.resetForm();
                        this.closeAsideEvent.emit({ action: 'create' });
                        this.toaster.showSnackBar("success", this.localeData?.unit_group_created);
                    } else {
                        this.toaster.showSnackBar("error", response?.message);
                    }
                });
            }
        }
    }

    /**
     * Deletes unit group
     *
     * @memberof CreateUnitGroupComponent
     */
    public deleteUnitGroup(): void {
        let dialogRef = this.dialog.open(ConfirmModalComponent, {
                    width: '40%',
                    role: 'alertdialog',
                    ariaLabel: 'Confirm Dialog',
                    data: {
                title: this.commonLocaleData?.app_confirmation,
                    body: this.localeData?.delete_unit_group_message,
                    permanentlyDeleteMessage: this.commonLocaleData?.app_permanently_delete_message,
                    ok: this.commonLocaleData?.app_yes,
                    cancel: this.commonLocaleData?.app_no
                }
        });

        dialogRef.afterClosed().subscribe(response => {
            /**
             * Handles if functionality
             */
            if (response) {
                this.isLoading = true;
                this.inventoryService.deleteStockUnitGroup(this.unitGroupDetails?.uniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    this.isLoading = false;
                    /**
                     * Handles if functionality
                     */
                    if (response?.status === "success") {
                        this.toaster.showSnackBar("success", this.localeData?.unit_group_deleted);
                        this.closeAsideEvent.emit({ action: 'delete' });
                    } else {
                        this.toaster.showSnackBar("error", response?.message);
                    }
                });
            }
        });
    }

    /**
     * Lifecycle hook for destroy component
     *
     * @memberof CreateUnitGroupComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
