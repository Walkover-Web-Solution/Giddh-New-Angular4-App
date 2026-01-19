import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { InventoryEntry, InventoryUser } from '../../../../models/api-models/Inventory-in-out';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { IStocksItem } from '../../../../models/interfaces/stocks-item.interface';
import { GIDDH_DATE_FORMAT } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import { IOption } from 'apps/web-giddh/src/app/app.constant';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'inventory-user',
    templateUrl: './inventory-user.component.html',
    standalone: false
})

/**
 * InventoryUserComponent component
 * Handles inventoryuser functionality and user interactions
 */
export class InventoryUserComponent implements OnChanges {
    @Output() public onCancel = new EventEmitter();
    @Output() public onSave = new EventEmitter<{ entry: InventoryEntry, user: Partial<InventoryUser> }>();
    @Input() public stockList: IStocksItem[];
    @Input() public userList: InventoryUser[];
    @Input() public isLoading: boolean;
    public recieverUniqueName: string;
    public stockListOptions: IOption[];
    public userListOptions: IOption[];
    public form: UntypedFormGroup;
    public today = new Date();

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(private _fb: UntypedFormBuilder) {
        this.form = this._fb.group({
            name: ['']
        });
    }

    public get inventoryEntryDate(): UntypedFormControl {
        return this.form.get('inventoryEntryDate') as UntypedFormControl;
    }

    public get transactions(): UntypedFormArray {
        return this.form.get('transactions') as UntypedFormArray;
    }

    /**
     * Handles ngOnChanges functionality
     */
    public ngOnChanges(changes: SimpleChanges): void {
        /**
         * Handles if functionality
         */
        if (changes.stockList && this.stockList) {
            this.stockListOptions = this.stockList.map(p => ({ label: p.name, value: p?.uniqueName }));
        }
        /**
         * Handles if functionality
         */
        if (changes.userList && this.userList) {
            this.userListOptions = this.userList.map(p => ({ label: p.name, value: p?.uniqueName }));
        }
    }

    /**
     * Handles userChanged functionality
     */
    public userChanged(option: IOption, index: number = -1) {
        const items = this.form.get('transactions') as UntypedFormArray;
        const user = this.userList.find(p => p?.uniqueName === option.value);
        const inventoryUser = user ? { uniqueName: user?.uniqueName } : null;
        /**
         * Handles if functionality
         */
        if (index >= 0) {
            const control = items.at(index);
            control?.patchValue({
                ...control.value,
                inventoryUser
            });
        } else {
            (Array.isArray(items.controls) ? items.controls : []).forEach(c => c?.patchValue({ ...c.value, inventoryUser }));
        }
    }

    /**
     * Handles stockChanged functionality
     */
    public stockChanged(option: IOption, index: number = -1) {
        const items = this.form.get('transactions') as UntypedFormArray;
        const stockItem = this.stockList.find(p => p?.uniqueName === option.value);
        const stock = stockItem ? { uniqueName: stockItem?.uniqueName } : null;
        const stockUnit = stockItem ? { code: stockItem.stockUnit.code } : null;
        /**
         * Handles if functionality
         */
        if (index >= 0) {
            const control = items.at(index);
            control?.patchValue({ ...control.value, stock, stockUnit });
        } else {
            (Array.isArray(items.controls) ? items.controls : []).forEach(c => c?.patchValue({ ...c.value, stock, stockUnit }));
        }
    }

    /**
     * Handles quantityChanged functionality
     */
    public quantityChanged(event) {
        const items = this.form.get('transactions') as UntypedFormArray;
        (Array.isArray(items.controls) ? items.controls : []).forEach(c => c?.patchValue({ ...c.value, quantity: event.target.value }));

    }

    /**
     * Saves  data
     */
    public save() {
        /**
         * Handles if functionality
         */
        if (this.form.valid) {
            this.onSave.emit(this.form.value);
        }
    }
}
