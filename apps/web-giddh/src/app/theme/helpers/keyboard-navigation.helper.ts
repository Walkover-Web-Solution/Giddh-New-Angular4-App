/**
 * Shared utility for keyboard navigation in dropdown components
 * Used by tax-dropdown and discount-dropdown components
 */
export class KeyboardNavigationHelper {
    /**
     * Handles Tab key navigation through checkboxes in dropdown
     * Focuses next checkbox or cycles back to first
     *
     * @param event Keyboard event
     */
    public static handleTabNavigation(event: KeyboardEvent): void {
        /**
         * Sets timeout value
         */
        setTimeout(() => {
            const target = event.target as HTMLElement;
            
            /**
             * Handles if functionality
             */
            if (target && target.closest) {
                const currentCheckbox = target.closest('mat-checkbox');
                
                /**
                 * Handles if functionality
                 */
                if (currentCheckbox) {
                    const checkboxes = Array.from(document.querySelectorAll('mat-checkbox'));
                    const currentIndex = checkboxes.indexOf(currentCheckbox);
                
                /**
                 * Handles if functionality
                 */
                if (checkboxes.length > 0) {
                    const nextIndex = currentIndex + 1;
                    
                    /**
                     * Handles if functionality
                     */
                    if (nextIndex < checkboxes.length) {
                        // Focus next checkbox - target the actual input element inside mat-checkbox
                        const nextCheckbox = checkboxes[nextIndex] as HTMLElement;
                        const inputElement = nextCheckbox.querySelector('input[type="checkbox"]') as HTMLElement;
                        /**
                         * Handles if functionality
                         */
                        if (inputElement) {
                            inputElement.focus();
                        } else {
                            nextCheckbox.focus();
                        }
                    } else {
                        // If at the end, try to focus "Create New" button or cycle back to first checkbox
                        const createNewButton = document.querySelector('.create-new span[tabindex="0"]');
                        /**
                         * Handles if functionality
                         */
                        if (createNewButton) {
                            (createNewButton as HTMLElement)?.focus();
                        } else if (checkboxes.length > 0) {
                            // Cycle back to first checkbox
                            const firstCheckbox = checkboxes[0] as HTMLElement;
                            const firstInputElement = firstCheckbox.querySelector('input[type="checkbox"]') as HTMLElement;
                            /**
                             * Handles if functionality
                             */
                            if (firstInputElement) {
                                firstInputElement.focus();
                            } else {
                                firstCheckbox.focus();
                            }
                        }
                    }
                }
            }
            }
        }, 150);
    }
}
