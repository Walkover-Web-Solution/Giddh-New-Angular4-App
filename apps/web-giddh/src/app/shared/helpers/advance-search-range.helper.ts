import { UntypedFormGroup } from '@angular/forms';
import { IOption } from '../../app.constant';

/**
 * Shared utility for handling range selection in advance search forms
 * Used by daybook and ledger advance search components
 */
export class AdvanceSearchRangeHelper {
    /**
     * Handles range selection for amount and inventory quantity fields
     * 
     * @param type - Field type ('amount' or 'inventoryQty')
     * @param data - Selected option with comparison operator
     * @param form - Form group containing the fields to update
     */
    public static onRangeSelect(type: string, data: IOption, form: UntypedFormGroup): void {
        switch (type + '-' + data?.value) {
            case 'amount-greaterThan':
                form.get('includeAmount')?.patchValue(true);
                form.get('amountGreaterThan')?.patchValue(true);
                form.get('amountLessThan')?.patchValue(false);
                form.get('amountEqualTo')?.patchValue(false);
                break;
            case 'amount-lessThan':
                form.get('includeAmount')?.patchValue(true);
                form.get('amountGreaterThan')?.patchValue(false);
                form.get('amountLessThan')?.patchValue(true);
                form.get('amountEqualTo')?.patchValue(false);
                break;
            case 'amount-greaterThanOrEquals':
                form.get('includeAmount')?.patchValue(true);
                form.get('amountGreaterThan')?.patchValue(true);
                form.get('amountLessThan')?.patchValue(false);
                form.get('amountEqualTo')?.patchValue(true);
                break;
            case 'amount-lessThanOrEquals':
                form.get('includeAmount')?.patchValue(true);
                form.get('amountGreaterThan')?.patchValue(false);
                form.get('amountLessThan')?.patchValue(true);
                form.get('amountEqualTo')?.patchValue(true);
                break;
            case 'amount-equals':
                form.get('includeAmount')?.patchValue(true);
                form.get('amountGreaterThan')?.patchValue(false);
                form.get('amountLessThan')?.patchValue(false);
                form.get('amountEqualTo')?.patchValue(true);
                break;
            case 'amount-exclude':
                form.get('includeAmount')?.patchValue(false);
                form.get('amountGreaterThan')?.patchValue(false);
                form.get('amountLessThan')?.patchValue(false);
                form.get('amountEqualTo')?.patchValue(true);
                break;
            case 'amount-null':
                form.get('includeAmount')?.patchValue(false);
                form.get('amountGreaterThan')?.patchValue(false);
                form.get('amountLessThan')?.patchValue(false);
                form.get('amountEqualTo')?.patchValue(false);
                break;
            case 'inventoryQty-greaterThan':
                form.get('inventory.includeQuantity')?.patchValue(true);
                form.get('inventory.quantityGreaterThan')?.patchValue(true);
                form.get('inventory.quantityLessThan')?.patchValue(false);
                form.get('inventory.quantityEqualTo')?.patchValue(false);
                break;
            case 'inventoryQty-lessThan':
                form.get('inventory.includeQuantity')?.patchValue(true);
                form.get('inventory.quantityGreaterThan')?.patchValue(false);
                form.get('inventory.quantityLessThan')?.patchValue(true);
                form.get('inventory.quantityEqualTo')?.patchValue(false);
                break;
            case 'inventoryQty-greaterThanOrEquals':
                form.get('inventory.includeQuantity')?.patchValue(true);
                form.get('inventory.quantityGreaterThan')?.patchValue(true);
                form.get('inventory.quantityLessThan')?.patchValue(false);
                form.get('inventory.quantityEqualTo')?.patchValue(true);
                break;
            case 'inventoryQty-lessThanOrEquals':
                form.get('inventory.includeQuantity')?.patchValue(true);
                form.get('inventory.quantityGreaterThan')?.patchValue(false);
                form.get('inventory.quantityLessThan')?.patchValue(true);
                form.get('inventory.quantityEqualTo')?.patchValue(true);
                break;
            case 'inventoryQty-equals':
                form.get('inventory.includeQuantity')?.patchValue(true);
                form.get('inventory.quantityGreaterThan')?.patchValue(false);
                form.get('inventory.quantityLessThan')?.patchValue(false);
                form.get('inventory.quantityEqualTo')?.patchValue(true);
                break;
            case 'inventoryQty-exclude':
                form.get('inventory.includeQuantity')?.patchValue(false);
                form.get('inventory.quantityGreaterThan')?.patchValue(false);
                form.get('inventory.quantityLessThan')?.patchValue(false);
                form.get('inventory.quantityEqualTo')?.patchValue(false);
                break;
            case 'inventoryQty-null':
                form.get('inventory.includeQuantity')?.patchValue(false);
                form.get('inventory.quantityGreaterThan')?.patchValue(false);
                form.get('inventory.quantityLessThan')?.patchValue(false);
                form.get('inventory.quantityEqualTo')?.patchValue(false);
                break;
        }
    }
}
