import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { take, takeUntil } from 'rxjs/operators';
import { InventoryService } from '../../../services/inventory.service';
import { ReplaySubject } from 'rxjs';
import { StockUnits } from '../../../inventory/components/custom-stock-components/stock-unit';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from '../../../services/toaster.service';
import { cloneDeep } from '../../../lodash-optimized';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from '../../../theme/new-confirm-modal/confirm-modal.component';

@Component({
    selector: 'create-unit',
    templateUrl: './create-unit.component.html',
    styleUrls: ['./create-unit.component.scss']
})
export class CreateNewUnitComponent implements OnInit, OnDestroy {
    /** Holds unit details for edit */
    @Input() public unitDetails: any = {};
    /** Emits close unit form */
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    /** Emits if form is updated with unit details */
    @Output() public formHasLoaded: EventEmitter<boolean> = new EventEmitter(true);
    /** List of units to select */
    public unitList: any[] = [];
    /** Form Group for unit form */
    public unitForm: FormGroup;
    /** Holds if form is valid or not */
    public isValidForm: boolean = true;
    /** Holds if form mappings are valid or not */
    public isValidFormMappings: boolean = true;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if api call in progress */
    public isLoading: boolean = false;
    /* Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private inventoryService: InventoryService,
        private formBuilder: FormBuilder,
        private toaster: ToasterService,
        private dialog: MatDialog
    ) {

    }

    /**
     * Lifecycle hook for init component
     *
     * @memberof CreateNewUnitComponent
     */
    public ngOnInit(): void {
        this.initUnitForm();
        this.getUnitMappings();
    }

    /**
     * Lifecycle hook for destroy component
     *
     * @memberof CreateNewUnitComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Initializes unit form
     *
     * @memberof CreateNewUnitComponent
     */
    public initUnitForm(): void {
        this.unitForm = this.formBuilder.group({
            name: ['', Validators.required],
            code: ['', Validators.required],
            mappings: this.formBuilder.array([]),
        });

        if (!this.unitDetails?.uniqueName) {
            this.addNewMappedUnit();
        } else {
            this.unitForm.get('name').patchValue(this.unitDetails?.name);
            this.unitForm.get('code').patchValue(this.unitDetails?.code);

            if (this.unitDetails.mappings?.length) {
                this.unitDetails.mappings?.forEach(mapping => {
                    this.addNewMappedUnit(mapping);
                });
            } else {
                this.addNewMappedUnit();
            }

            this.formHasLoaded.emit(true);
        }
    }

    /**
     * Add new unit mapping
     *
     * @param {*} [mapping]
     * @memberof CreateNewUnitComponent
     */
    public addNewMappedUnit(mapping?: any): void {
        let mappings = this.unitForm.get('mappings') as FormArray;
        let mappingForm = this.formBuilder.group({
            quantity: [mapping?.quantity ?? ''],
            stockUnitX: this.formBuilder.group({
                name: [mapping?.stockUnitX?.name ?? ''],
                code: [mapping?.stockUnitX?.code ?? '']
            }),
            stockUnitXGroup: this.formBuilder.group({
                name: [mapping?.stockUnitXGroup?.name ?? ''],
                uniqueName: [mapping?.stockUnitXGroup?.uniqueName ?? '']
            }),
            stockUnitY: this.formBuilder.group({
                name: [mapping?.stockUnitY?.name ?? ''],
                code: [mapping?.stockUnitY?.code ?? '']
            }),
            stockUnitYGroup: this.formBuilder.group({
                name: [mapping?.stockUnitYGroup?.name ?? ''],
                uniqueName: [mapping?.stockUnitYGroup?.uniqueName ?? '']
            })
        });
        mappings.push(mappingForm);
    }

    /**
     * Resets form
     *
     * @memberof CreateNewUnitComponent
     */
    public resetForm(): void {
        this.unitForm?.reset();
        this.isValidForm = true;
        this.isValidFormMappings = true;

        let mappings = this.unitForm.get('mappings') as FormArray;
        for (let mapping of mappings.controls) {
            this.removeMappedUnit(0);
        }

        if (!mappings.controls?.length) {
            this.addNewMappedUnit();
        }
    }

    /**
     * Removes mapped unit
     *
     * @param {number} index
     * @memberof CreateNewUnitComponent
     */
    public removeMappedUnit(index: number): void {
        let mappings = this.unitForm.get('mappings') as FormArray;
        mappings.removeAt(index);
    }

    /**
     * Gets unit mappings
     *
     * @memberof CreateNewUnitComponent
     */
    public getUnitMappings(): void {
        this.inventoryService.getStockMappedUnit().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response?.body?.length) {
                const tempUnits = response.body?.map(unit => {
                    return unit?.stockUnitX?.code;
                });

                StockUnits.forEach(unit => {
                    if (!tempUnits[unit?.value]) {
                        this.unitList.push(unit);
                    }
                });

                if (this.unitDetails?.uniqueName) {
                    if (!tempUnits[this.unitDetails?.code]) {
                        this.unitList.push({ label: this.unitDetails?.name, value: this.unitDetails?.code, uniqueName: this.unitDetails?.uniqueName });
                    }
                }
            } else {
                const tempUnits = [];
                StockUnits.forEach(unit => {
                    tempUnits[unit.value] = unit.label;
                    this.unitList.push(unit);
                });

                if (this.unitDetails?.uniqueName) {
                    if (!tempUnits[this.unitDetails?.code]) {
                        this.unitList.push({ label: this.unitDetails?.name, value: this.unitDetails?.code, uniqueName: this.unitDetails?.uniqueName });
                    }
                }
            }
        });
    }

    /**
     * Saves unit
     *
     * @memberof CreateNewUnitComponent
     */
    public saveUnit(): void {
        this.isValidForm = !this.unitForm.invalid;
        this.isValidFormMappings = true;

        this.unitForm.value?.mappings.forEach((mapping) => {
            let checkValidation: boolean = false;
            if (mapping?.stockUnitY?.code || mapping?.quantity || mapping?.stockUnitX?.code) {
                checkValidation = true;
            }
            if (checkValidation && (!mapping?.stockUnitY?.code || !mapping?.quantity || !mapping?.stockUnitX?.code)) {
                this.isValidFormMappings = false;
            }
        });

        if (this.isValidForm && this.isValidFormMappings) {
            let tempUnitForm = cloneDeep(this.unitForm.value);

            tempUnitForm.mappings = tempUnitForm.mappings?.filter(mapping => mapping?.stockUnitY?.code && mapping?.quantity && mapping?.stockUnitX?.code);

            if (!tempUnitForm?.mappings?.length) {
                delete tempUnitForm.mappings;
            }

            if (this.unitDetails?.uniqueName) {
                this.inventoryService.UpdateStockUnit(tempUnitForm, this.unitDetails.uniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    if (response?.status === "success") {
                        this.closeAsideEvent.emit(true);
                        this.toaster.showSnackBar("success", this.localeData?.unit_updated);
                    } else {
                        this.toaster.showSnackBar("error", response?.message);
                    }
                });
            } else {
                this.inventoryService.CreateStockUnit(tempUnitForm).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    if (response?.status === "success") {
                        this.resetForm();
                        this.closeAsideEvent.emit(true);
                        this.toaster.showSnackBar("success", this.localeData?.unit_created);
                    } else {
                        this.toaster.showSnackBar("error", response?.message);
                    }
                });
            }
        }
    }

    /**
     * Callback for select unit
     *
     * @param {*} event
     * @memberof CreateNewUnitComponent
     */
    public selectUnit(event: any): void {
        if (event) {
            event.value = event.value?.replace(/\s/g, "")?.toLowerCase();

            const isUnitAvailable = this.unitList?.filter(unit => unit.value === event.value);
            if (!isUnitAvailable?.length) {
                this.unitList.push(event);
            }

            this.unitForm.get('name').patchValue(event.label);
            this.unitForm.get('code').patchValue(event.value);
        }
    }

    /**
     * Deletes unit
     *
     * @memberof CreateNewUnitComponent
     */
    public deleteUnit(): void {
        let dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: '40%',
            data: {
                title: this.commonLocaleData?.app_confirmation,
                body: this.localeData?.delete_message,
                permanentlyDeleteMessage: this.commonLocaleData?.app_permanently_delete_message,
                ok: this.commonLocaleData?.app_yes,
                cancel: this.commonLocaleData?.app_no
            }
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                this.isLoading = true;
                this.inventoryService.DeleteStockUnit(this.unitDetails?.uniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                    this.isLoading = false;
                    if (response?.status === "success") {
                        this.toaster.showSnackBar("success", this.localeData?.unit_delete);
                        this.closeAsideEvent.emit(true);
                    } else {
                        this.toaster.showSnackBar("error", response?.message);
                    }
                });
            }
        });
    }
}