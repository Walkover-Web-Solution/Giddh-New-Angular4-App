import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { InventoryService } from '../../../services/inventory.service';
import { ReplaySubject } from 'rxjs';
import { StockUnits } from '../../../inventory/components/custom-stock-components/stock-unit';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasterService } from '../../../services/toaster.service';

@Component({
    selector: 'create-unit',
    templateUrl: './create-unit.component.html',
    styleUrls: ['./create-unit.component.scss']
})
export class CreateNewUnitComponent implements OnInit {
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    public unitList: any[] = [];
    /** Form Group for unit form */
    public unitForm: FormGroup;
    public isValidForm: boolean = true;
    public isValidFormMappings: boolean = true;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private inventoryService: InventoryService,
        private formBuilder: FormBuilder,
        private toaster: ToasterService
    ) {

    }

    public ngOnInit(): void {
        this.initUnitForm();
        this.getUnitMappings();
    }

    public initUnitForm(): void {
        this.unitForm = this.formBuilder.group({
            name: ['', Validators.required],
            code: ['', Validators.required],
            mappings: this.formBuilder.array([]),
        });

        this.addNewMappedUnit();
    }

    public addNewMappedUnit(): void {
        let mappings = this.unitForm.get('mappings') as FormArray;
        mappings.push(this.addNewMappingForm());
    }

    private addNewMappingForm(): FormGroup {
        let mappingForm = this.formBuilder.group({
            quantity: [''],
            stockUnitX: this.formBuilder.group({
                name: [''],
                code: ['']
            }),
            stockUnitY: this.formBuilder.group({
                name: [''],
                code: ['']
            })
        });

        return mappingForm;
    }

    public resetForm(): void {
        this.unitForm?.reset();

        let mappings = this.unitForm.get('mappings') as FormArray;
        for (let mapping of mappings.controls) {
            this.removeMappedUnit(0);
        }

        if (!mappings.controls?.length) {
            this.addNewMappedUnit();
        }
    }

    public removeMappedUnit(index: number): void {
        let mappings = this.unitForm.get('mappings') as FormArray;
        mappings.removeAt(index);
    }

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
            }
        });
    }

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
            this.inventoryService.CreateStockUnit(this.unitForm.value).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response?.status === "success") {
                    this.resetForm();
                    this.closeAsideEvent.emit(true);
                    this.toaster.showSnackBar("success", "Unit added successfully");
                } else {
                    this.toaster.showSnackBar("error", response?.message);
                }
            });
        }
    }

    public selectedUnit(event: any): void {
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
}