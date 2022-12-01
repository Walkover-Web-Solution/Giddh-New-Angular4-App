import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { InventoryEntry, InventoryUser } from '../../../../models/api-models/Inventory-in-out';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IStocksItem } from '../../../../models/interfaces/stocksItem.interface';
import { IOption } from '../../../../theme/ng-virtual-select/sh-options.interface';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';

@Component({
    selector: 'transfer-inventory-user',
    templateUrl: './transfer-inventory-user.component.html',
    styles: [`

  `],
})

export class InventoryUserComponent implements OnChanges {
    @Output() public onCancel = new EventEmitter();
    @Output() public onSave = new EventEmitter<{ entry: InventoryEntry, user: Partial<InventoryUser> }>();
    @Input() public stockList: IStocksItem[];
    @Input() public userList: InventoryUser[];
    @Input() public isLoading: boolean;
    public recieverUniqueName: string;
    public stockListOptions: IOption[];
    public userListOptions: IOption[];
    public form: FormGroup;
    public config: Partial<BsDatepickerConfig> = { dateInputFormat: GIDDH_DATE_FORMAT };
    public today = new Date();

    constructor(private _fb: FormBuilder) {
        this.form = this._fb.group({
            name: ['']
        });
    }

    public get inventoryEntryDate(): FormControl {
        return this.form.get('inventoryEntryDate') as FormControl;
    }

    public get transactions(): FormArray {
        return this.form.get('transactions') as FormArray;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.stockList && this.stockList) {
            this.stockListOptions = this.stockList.map(p => ({ label: p.name, value: p?.uniqueName }));
        }
        if (changes.userList && this.userList) {
            this.userListOptions = this.userList.map(p => ({ label: p.name, value: p?.uniqueName }));
        }
    }

    public userChanged(option: IOption, index: number = -1) {
        const items = this.form.get('transactions') as FormArray;
        const user = this.userList.find(p => p?.uniqueName === option.value);
        const inventoryUser = user ? { uniqueName: user?.uniqueName } : null;
        if (index >= 0) {
            const control = items.at(index);
            control?.patchValue({
                ...control.value,
                inventoryUser
            });
        } else {
            items.controls.forEach(c => c?.patchValue({ ...c.value, inventoryUser }));
        }
    }

    public stockChanged(option: IOption, index: number = -1) {
        const items = this.form.get('transactions') as FormArray;
        const stockItem = this.stockList.find(p => p?.uniqueName === option.value);
        const stock = stockItem ? { uniqueName: stockItem?.uniqueName } : null;
        const stockUnit = stockItem ? { code: stockItem.stockUnit.code } : null;
        if (index >= 0) {
            const control = items.at(index);
            control?.patchValue({ ...control.value, stock, stockUnit });
        } else {
            items.controls.forEach(c => c?.patchValue({ ...c.value, stock, stockUnit }));
        }
    }

    public quantityChanged(event) {
        const items = this.form.get('transactions') as FormArray;
        items.controls.forEach(c => c?.patchValue({ ...c.value, quantity: event.target.value }));

    }

    public save() {
        if (this.form.valid) {
            const inventoryEntryDate = dayjs(this.form.value.transferDate).format(GIDDH_DATE_FORMAT);
            this.onSave.emit(this.form.value);
        }
    }
}
