import { Directive, HostListener, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';

/**
 * Directive that enables Enter key navigation to move focus to the next focusable element within a form.
 * Optimized for Angular production environments with enhanced performance and accessibility.
 * Also handles dropdown selection events to move focus after option selection.
 * 
 * @export
 * @class EnterNextDirective
 */
@Directive({
    selector: '[appEnterNext]'
})
export class EnterNextDirective implements OnDestroy, AfterViewInit {
    
    /**
     * Cached focusable selector for performance optimization
     * 
     * @private
     * @readonly
     * @memberof EnterNextDirective
     */
    private readonly FOCUSABLE_SELECTOR = 'input:not([tabindex="-1"]):not([disabled]), select:not([tabindex="-1"]):not([disabled]), textarea:not([tabindex="-1"]):not([disabled]), button:not([tabindex="-1"]):not([disabled]), [tabindex]:not([tabindex="-1"])';

    /**
     * Cached focusable tags set for O(1) lookup performance
     * 
     * @private
     * @readonly
     * @memberof EnterNextDirective
     */
    private readonly FOCUSABLE_TAGS = new Set(['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON']);

    /**
     * Cached form element reference for performance
     * 
     * @private
     * @memberof EnterNextDirective
     */
    private formElement: HTMLFormElement | null = null;

    /**
     * Creates an instance of EnterNextDirective
     * 
     * @param {ElementRef<HTMLElement>} el - Reference to the host element
     * @memberof EnterNextDirective
     */
    constructor(private readonly el: ElementRef<HTMLElement>) {}

    /**
     * Handles keydown events on the host element.
     * When Enter key is pressed, prevents default behavior and moves focus to next focusable element.
     * 
     * @param {KeyboardEvent} event - The keyboard event
     * @memberof EnterNextDirective
     */
    @HostListener('keydown', ['$event'])
    public onKeyDown(event: KeyboardEvent): void {
        if (event.key !== 'Enter') {
            return;
        }

        // Check for mat-select dropdown state before processing
        if (this.isMatSelectClosed()) {
            return; // Allow default behavior to open dropdown
        }

        event.preventDefault();
        event.stopPropagation();
        
        this.focusNextElement();
    }

    /**
     * Lifecycle hook runs after component view initialization
     * Sets up dropdown selection event listeners
     * 
     * @memberof EnterNextDirective
     */
    public ngAfterViewInit(): void {
        this.setupDropdownSelectionListener();
    }

    /**
     * Cleanup method for OnDestroy lifecycle
     * 
     * @memberof EnterNextDirective
     */
    public ngOnDestroy(): void {
        this.formElement = null;
    }

    /**
     * Sets up event listener for dropdown option selection
     * 
     * @private
     * @memberof EnterNextDirective
     */
    private setupDropdownSelectionListener(): void {
        const element = this.el.nativeElement;
        
        // For reactive-dropdown-field components, listen for autocomplete option selection
        if (element.tagName === 'REACTIVE-DROPDOWN-FIELD') {
            // Use a more direct approach - listen for the autocomplete panel closing
            setTimeout(() => {
                const matAutocomplete = element.querySelector('mat-autocomplete');
                if (matAutocomplete) {
                    // Listen for option selection events on the autocomplete
                    const options = matAutocomplete.querySelectorAll('mat-option');
                    options.forEach(option => {
                        option.addEventListener('click', () => {
                            setTimeout(() => {
                                this.focusNextElement();
                            }, 100);
                        });
                    });
                }
            }, 100);
        }
    }

    /**
     * Checks if the current element is a closed mat-select dropdown
     * 
     * @private
     * @returns {boolean} True if mat-select is closed, false otherwise
     * @memberof EnterNextDirective
     */
    private isMatSelectClosed(): boolean {
        const element = this.el.nativeElement;
        
        // Check if element is mat-select or contains mat-select
        const matSelect = element.tagName === 'MAT-SELECT' ? element : 
                         element.querySelector('mat-select') ||
                         element.closest('mat-select');
        
        if (!matSelect) {
            return false;
        }

        // Check if dropdown is closed (no mat-select-open class and no overlay)
        const hasOpenClass = matSelect.classList.contains('mat-select-open') ||
                            document.querySelector('.cdk-overlay-pane mat-select-panel');
        
        return !hasOpenClass;
    }

    /**
     * Finds and focuses the next focusable element in the form with optimized performance
     * 
     * @private
     * @memberof EnterNextDirective
     */
    private focusNextElement(): void {
        const form = this.getFormElement();
        if (!form) {
            return;
        }

        const focusableElements = this.getFocusableElements(form);
        const currentInput = this.findCurrentInput();
        
        if (!currentInput) {
            this.focusFirstAvailableElement(focusableElements);
            return;
        }

        const currentIndex = focusableElements.indexOf(currentInput);
        if (currentIndex > -1) {
            this.focusNextAvailableElement(focusableElements, currentIndex);
        }
    }

    /**
     * Gets the form element with caching for performance
     * 
     * @private
     * @returns {HTMLFormElement | null} The form element or null
     * @memberof EnterNextDirective
     */
    private getFormElement(): HTMLFormElement | null {
        if (!this.formElement) {
            this.formElement = this.el.nativeElement.closest('form');
        }
        return this.formElement;
    }

    /**
     * Gets all focusable elements within the form with optimized selector
     * 
     * @private
     * @param {HTMLFormElement} form - The form element
     * @returns {HTMLElement[]} Array of focusable elements
     * @memberof EnterNextDirective
     */
    private getFocusableElements(form: HTMLFormElement): HTMLElement[] {
        return Array.from(form.querySelectorAll(this.FOCUSABLE_SELECTOR)) as HTMLElement[];
    }

    /**
     * Finds the actual input element that should be considered as current.
     * Optimized for custom Angular components.
     * 
     * @private
     * @returns {HTMLElement | null} The current input element or null
     * @memberof EnterNextDirective
     */
    private findCurrentInput(): HTMLElement | null {
        const hostElement = this.el.nativeElement;
        
        if (this.isFocusableElement(hostElement)) {
            return hostElement;
        }

        // Use more specific selector for better performance
        const inputElement = hostElement.querySelector('input:not([disabled]), select:not([disabled]), textarea:not([disabled])') as HTMLElement;
        
        return inputElement && this.isElementVisible(inputElement) ? inputElement : null;
    }

    /**
     * Focuses the first available element from the list
     * 
     * @private
     * @param {HTMLElement[]} elements - Array of focusable elements
     * @memberof EnterNextDirective
     */
    private focusFirstAvailableElement(elements: HTMLElement[]): void {
        const firstElement = elements.find(element => this.isElementAvailableForFocus(element));
        if (firstElement) {
            this.focusElement(firstElement);
        }
    }

    /**
     * Focuses the next available element after the current index
     * 
     * @private
     * @param {HTMLElement[]} elements - Array of focusable elements
     * @param {number} currentIndex - Current element index
     * @memberof EnterNextDirective
     */
    private focusNextAvailableElement(elements: HTMLElement[], currentIndex: number): void {
        for (let i = currentIndex + 1; i < elements.length; i++) {
            if (this.isElementAvailableForFocus(elements[i])) {
                this.focusElement(elements[i]);
                return;
            }
        }
    }

    /**
     * Focuses an element with enhanced custom component support
     * 
     * @private
     * @param {HTMLElement} element - Element to focus
     * @memberof EnterNextDirective
     */
    private focusElement(element: HTMLElement): void {
        if (this.isFocusableElement(element)) {
            element.focus();
            return;
        }

        // Handle custom Angular components
        const focusableChild = element.querySelector('input:not([disabled]), select:not([disabled]), textarea:not([disabled])') as HTMLElement;
        if (focusableChild && this.isElementVisible(focusableChild)) {
            focusableChild.focus();
        }
    }

    /**
     * Checks if an element is focusable with optimized Set lookup
     * 
     * @private
     * @param {HTMLElement} element - Element to check
     * @returns {boolean} True if element is focusable
     * @memberof EnterNextDirective
     */
    private isFocusableElement(element: HTMLElement): boolean {
        return this.FOCUSABLE_TAGS.has(element.tagName) || element.hasAttribute('tabindex');
    }

    /**
     * Checks if an element is visible with optimized computation
     * 
     * @private
     * @param {HTMLElement} element - Element to check
     * @returns {boolean} True if element is visible
     * @memberof EnterNextDirective
     */
    private isElementVisible(element: HTMLElement): boolean {
        // Quick checks first for performance
        if (element.offsetParent === null) {
            return false;
        }
        
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && style.visibility !== 'hidden';
    }

    /**
     * Checks if an element is available for focus with optimized type checking
     * 
     * @private
     * @param {HTMLElement} element - Element to check
     * @returns {boolean} True if element is available for focus
     * @memberof EnterNextDirective
     */
    private isElementAvailableForFocus(element: HTMLElement): boolean {
        if (!this.isElementVisible(element)) {
            return false;
        }

        // Optimized type checking with early returns
        if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
            return !element.disabled && !element.readOnly;
        }
        
        if (element instanceof HTMLSelectElement || element instanceof HTMLButtonElement) {
            return !element.disabled;
        }

        // Handle custom components efficiently
        const focusableChild = element.querySelector('input, select, textarea') as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
        if (focusableChild) {
            if (focusableChild instanceof HTMLSelectElement || focusableChild instanceof HTMLButtonElement) {
                return !focusableChild.disabled && this.isElementVisible(focusableChild);
            }
            return !focusableChild.disabled && 
                   !(focusableChild as HTMLInputElement | HTMLTextAreaElement).readOnly && 
                   this.isElementVisible(focusableChild);
        }

        return true;
    }
}
