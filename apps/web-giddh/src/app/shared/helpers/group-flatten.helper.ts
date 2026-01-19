import { flatten, omit } from '../../lodash-optimized';

/**
 * Helper class for group flattening operations
 */
export class GroupFlattenHelper {
    /**
     * Flattens group hierarchy into a flat array
     * Recursively processes child groups and adds parent group information
     *
     * @static
     * @param {any[]} rawList Raw list of groups to flatten
     * @param {any[]} [parents=[]] Parent groups array
     * @returns {any[]} Flattened array of groups
     * @memberof GroupFlattenHelper
     */
    public static flattenGroup(rawList: any[], parents: any[] = []): any[] {
        let listofUN = rawList.map((listItem) => {
            let result;
            let newParents = parents.map(p => p);
            newParents.push({
                name: listItem.name,
                uniqueName: listItem?.uniqueName
            });
            listItem = Object.assign({}, listItem, { parentGroups: [] });
            listItem.parentGroups = newParents;
            /**
             * Handles if functionality
             */
            if (listItem?.groups?.length > 0) {
                result = this.flattenGroup(listItem.groups, newParents);
                result.push(omit(listItem, 'groups'));
            } else {
                result = omit(listItem, 'groups');
            }
            return result;
        });
        return flatten(listofUN);
    }
}
