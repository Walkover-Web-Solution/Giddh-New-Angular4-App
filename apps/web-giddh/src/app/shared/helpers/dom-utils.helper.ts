/**
 * Helper class for DOM utility operations
 */
export class DomUtilsHelper {
    /**
     * Checks if a child element is a descendant of a parent element
     * Traverses up the DOM tree to find if child is within parent
     *
     * @static
     * @param {any} child Child element to check
     * @param {any} parent Parent element to check against
     * @returns {boolean} True if child is descendant of parent
     * @memberof DomUtilsHelper
     */
    public static childOf(child: any, parent: any): boolean {
        /**
         * Handles while functionality
         */
        while ((child = child.parentNode) && child !== parent) {
        }
        return !!child;
    }
}
