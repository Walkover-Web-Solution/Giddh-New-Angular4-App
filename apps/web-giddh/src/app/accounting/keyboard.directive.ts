import { Directive, ElementRef, HostListener, Input } from '@angular/core';

/** List of all the keyboard keys used as shortcut in JV */
const KEY_CODE_CONSTANTS = {
    ENTER: 'Enter',
    SPACE: [' ', 'Space'],
    BACKSPACE: 'Backspace',
    ESC: 'Escape',
    ARROW_DOWN: 'ArrowDown',
    ARROW_UP: 'ArrowUp'
};

@Directive({
    selector: '[onReturn]',
    standalone:false
})
export class OnReturnDirective {
    @Input() public onReturn: string;
    private el: ElementRef;
    private clickCount: number = 0;
    private activeIndx: number = null;
    private fieldToActivate: any = null;
    private selectedField;
    private isOtherKeyPressed: boolean = false;

    constructor(private _el: ElementRef) {
        this.el = this._el;

        setTimeout(() => {
            this.clickCount = 0;
        }, 2500);
    }

    @HostListener('keydown', ['$event'])
    public onKeyDown(e: any) {
        if (this.isNavigationKey(e)) {
            this.handleNavigationKeys(e);
        } else if (this.isAlphanumericKey(e)) {
            this.handleAlphanumericKeys(e);
        }
    }

    /**
     * Check if the pressed key is a navigation key
     */
    private isNavigationKey(e: any): boolean {
        return (e.key === KEY_CODE_CONSTANTS.ENTER || e.code === KEY_CODE_CONSTANTS.ENTER) ||
               (e.key === KEY_CODE_CONSTANTS.BACKSPACE || e.code === KEY_CODE_CONSTANTS.BACKSPACE) ||
               (KEY_CODE_CONSTANTS.SPACE.includes(e.key) || KEY_CODE_CONSTANTS.SPACE.includes(e.code)) ||
               (e.key === KEY_CODE_CONSTANTS.ESC || e.code === KEY_CODE_CONSTANTS.ESC) ||
               (e.key === KEY_CODE_CONSTANTS.ARROW_DOWN || e.code === KEY_CODE_CONSTANTS.ARROW_DOWN) ||
               (e.key === KEY_CODE_CONSTANTS.ARROW_UP || e.code === KEY_CODE_CONSTANTS.ARROW_UP);
    }

    /**
     * Check if the pressed key is alphanumeric
     */
    private isAlphanumericKey(e: any): boolean {
        return (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 65 && e.keyCode <= 90);
    }

    /**
     * Handle navigation keys (Enter, Backspace, Space, Esc, Arrow keys)
     */
    private handleNavigationKeys(e: any): void {
        const selectedEle = e.target;
        const allElements: any = window.document.querySelectorAll('input[onReturn][type="text"], textarea[onReturn]');
        const nodeList = Array.from(allElements);
        const indx = nodeList?.findIndex((ele) => ele === selectedEle);

        if (e.key === KEY_CODE_CONSTANTS.ENTER || e.code === KEY_CODE_CONSTANTS.ENTER) {
            this.handleEnterKey(e, selectedEle, allElements, indx);
        } else if (e.key === KEY_CODE_CONSTANTS.BACKSPACE || e.code === KEY_CODE_CONSTANTS.BACKSPACE) {
            this.handleBackspaceKey(e, selectedEle, allElements, indx);
        } else if (KEY_CODE_CONSTANTS.SPACE.includes(e.key) || KEY_CODE_CONSTANTS.SPACE.includes(e.code)) {
            this.handleSpaceKey(allElements, indx);
        } else if (e.key === KEY_CODE_CONSTANTS.ESC) {
            this.handleEscKey(selectedEle, nodeList);
        } else if (e.key === KEY_CODE_CONSTANTS.ARROW_UP || e.key === KEY_CODE_CONSTANTS.ARROW_DOWN) {
            this.handleArrowKeys(selectedEle);
        }
    }

    /**
     * Handle Enter key press
     */
    private handleEnterKey(e: any, selectedEle: any, allElements: any, indx: number): void {
        if (e.ctrlKey) {
            return selectedEle.setAttribute('data-changed', true);
        } else {
            selectedEle.setAttribute('data-changed', false);
        }

        let target = this.determineEnterTarget(allElements, indx);

        if (target) {
            this.focusTarget(target, allElements, indx);
        }
    }

    /**
     * Determine the target element for Enter key navigation
     */
    private determineEnterTarget(allElements: any, indx: number): any {
        let target = allElements[indx + 1];

        if (this.selectedField && this.selectedField === allElements[indx] && allElements[indx].value === '') {
            target = this.getTargetByRowType(allElements, indx);
        } else if (allElements[indx] && allElements[indx].classList.contains('stock-field') && this.selectedField !== allElements[indx]) {
            this.selectedField = allElements[indx];
        } else if (target && target.classList.contains('debit-credit')) {
            target = allElements[indx + 2];
        } else if (allElements[indx + 1] && allElements[indx + 1].classList.contains('byTo') && allElements[indx + 1].disabled) {
            target = allElements[indx + 2];
        } else if (allElements[indx] && allElements[indx].classList.contains('select-stock-in-invoice')) {
            return this.handleStockInvoiceField(allElements, indx);
        } else if (allElements[indx] && allElements[indx].classList.contains('invoice-account-field')) {
            return this.handleInvoiceAccountField(allElements, indx);
        }

        return target;
    }

    /**
     * Get target based on row entry type (by/to)
     */
    private getTargetByRowType(allElements: any, indx: number): any {
        const activatedRow: any = window.document.querySelectorAll('tr.active-row');
        const rowEntryType = activatedRow[0].children[0].children[0]?.value;

        if (rowEntryType === 'by') {
            return allElements[indx + 4];
        } else if (rowEntryType === 'to') {
            return allElements[indx + 5];
        }
        return allElements[indx + 1];
    }

    /**
     * Handle stock invoice field navigation
     */
    private handleStockInvoiceField(allElements: any, indx: number): any {
        if (this.activeIndx === indx) {
            let target = allElements[indx + 1];
            if (target.disabled) {
                target = allElements[indx + 4];
            }
            this.activeIndx = null;
            target.focus();
            return null;
        } else {
            this.activeIndx = indx;
            return null;
        }
    }

    /**
     * Handle invoice account field navigation
     */
    private handleInvoiceAccountField(allElements: any, indx: number): any {
        if (this.activeIndx === indx) {
            const target = allElements[indx + 1];
            setTimeout(() => {
                if (target.disabled && allElements[indx]?.value.trim() === '') {
                    document.getElementById('invoice-narration').focus();
                } else {
                    this.activeIndx = null;
                    target.focus();
                }
            }, 100);
            return null;
        } else {
            this.activeIndx = indx;
            return null;
        }
    }

    /**
     * Focus on the target element with appropriate logic
     */
    private focusTarget(target: any, allElements: any, indx: number): void {
        if (target.disabled) {
            target = allElements[indx + 2];
        }

        if (allElements[indx] && allElements[indx].classList.contains('upper-fields')) {
            setTimeout(() => {
                target.focus();
            }, 210);
        } else {
            if (target?.value === 'NaN' || target?.value === 0) {
                target.value = '';
            }
            if (this.clickCount > 1) {
                this.clickCount = 0;
                document.getElementById('narration').focus();
                return;
            }
            if (allElements[indx] && allElements[indx].classList.contains('from-or-to-acc')) {
                this.clickCount++;
            }
            target.focus();
        }
    }

    /**
     * Handle Backspace key press
     */
    private handleBackspaceKey(e: any, selectedEle: any, allElements: any, indx: number): void {
        let target = allElements[indx - 1];

        const activatedRow: any = window.document.querySelectorAll('tr.active-row');
        const rowEntryType = activatedRow[0].children[0].children[0]?.value;

        target = this.determineBackspaceTarget(allElements, indx, target, rowEntryType);

        if (target && e.target?.value?.length === e.target.selectionEnd) {
            if (selectedEle.getAttribute('data-changed') === 'false' || selectedEle?.value.trim() === '') {
                e.preventDefault();
                this.focusBackspaceTarget(target, allElements, indx);
            }
        }
    }

    /**
     * Determine the target element for Backspace key navigation
     */
    private determineBackspaceTarget(allElements: any, indx: number, target: any, rowEntryType: string): any {
        if (allElements[indx] && allElements[indx].classList.contains('debit-credit')) {
            if (rowEntryType === 'by') {
                target = allElements[indx - 4];
            } else if (rowEntryType === 'to') {
                target = allElements[indx - 5];
            }
        } else if (allElements[indx] && allElements[indx].classList.contains('byTo')) {
            if (target.disabled) {
                target = allElements[indx - 2];
            }
        } else if (allElements[indx - 1] && allElements[indx - 1].classList.contains('byTo') && allElements[indx - 1].disabled) {
            target = allElements[indx - 2];
        }
        return target;
    }

    /**
     * Focus on backspace target with disabled field handling
     */
    private focusBackspaceTarget(target: any, allElements: any, indx: number): void {
        if (target.disabled) {
            target = allElements[indx - 2];
            if (target.disabled) {
                target = allElements[indx - 3];
            }
        }
        target.focus();
    }

    /**
     * Handle Space key press
     */
    private handleSpaceKey(allElements: any, indx: number): void {
        const target = allElements[indx];
        if (target) {
            // Space key handling - currently no specific action needed
        }
    }

    /**
     * Handle Escape key press
     */
    private handleEscKey(selectedEle: any, nodeList: any[]): void {
        const gridType: any = window.document.getElementById('get-grid-type').getAttribute('data-gridType');

        if (gridType === 'invoice') {
            const invDateField: any = nodeList.find((ele: any) => ele.classList.contains('invoice-date-field'));
            invDateField.focus();
        } else if (gridType === 'voucher') {
            const vouDateField: any = nodeList.find((ele: any) => ele.classList.contains('voucher-date-field'));
            vouDateField.focus();
        }

        setTimeout(() => {
            selectedEle.focus();
        }, 100);
    }

    /**
     * Handle Arrow keys (Up/Down)
     */
    private handleArrowKeys(selectedEle: any): void {
        if (selectedEle.getAttribute('data-changed') === 'false') {
            selectedEle.value = '';
            selectedEle.setAttribute('data-changed', true);
        }
    }

    /**
     * Handle alphanumeric key press
     */
    private handleAlphanumericKeys(e: any): void {
        const selectedEle = e.target;
        selectedEle.setAttribute('data-changed', true);
    }
}
