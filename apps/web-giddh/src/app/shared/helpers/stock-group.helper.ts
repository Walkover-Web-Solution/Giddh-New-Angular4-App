import { IGroupsWithStocksHierarchyMinItem } from '../../models/interfaces/groups-with-stocks.interface';
import { IOption } from '../../app.constant';

/**
 * Helper class for stock group operations
 */
export class StockGroupHelper {
    /**
     * Arranges stock groups into a flat array of options
     * Recursively processes child stock groups
     *
     * @static
     * @param {IGroupsWithStocksHierarchyMinItem[]} groups Stock groups to arrange
     * @param {IOption[]} [parents=[]] Parent options array to populate
     * @memberof StockGroupHelper
     */
    public static arrangeStockGroups(groups: IGroupsWithStocksHierarchyMinItem[], parents: IOption[] = []): void {
        groups.map(group => {
            if (group) {
                let newOption: IOption = { label: '', value: '', additional: {} };
                newOption.label = group?.name;
                newOption.value = group?.uniqueName;
                newOption.additional = group;
                parents.push(newOption);
                if (group?.childStockGroups?.length > 0) {
                    this.arrangeStockGroups(group?.childStockGroups, parents);
                }
            }
        });
    }
}
