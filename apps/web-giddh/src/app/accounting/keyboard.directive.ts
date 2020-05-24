import { Directive, ElementRef, HostListener, Input } from '@angular/core';

const KEY_CODE_CONSTANTS = {
    ENTER: 13,
    SPACE: 32,
    BACKSPACE: 8,
    ESC: 27,
    ARROW_DOWN: 40,
    ARROW_UP: 38
};

@Directive({
    selector: '[onReturn]'
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
        // tslint:disable-next-line:max-line-length
        if ((e.which === KEY_CODE_CONSTANTS.ENTER || e.keyCode === KEY_CODE_CONSTANTS.ENTER) ||
            (e.which === KEY_CODE_CONSTANTS.BACKSPACE || e.keyCode === KEY_CODE_CONSTANTS.BACKSPACE) ||
            (e.which === KEY_CODE_CONSTANTS.SPACE || e.keyCode === KEY_CODE_CONSTANTS.SPACE) ||
            (e.which === KEY_CODE_CONSTANTS.ESC || e.keyCode === KEY_CODE_CONSTANTS.ESC) ||
            (e.which === KEY_CODE_CONSTANTS.ARROW_DOWN || e.keyCode === KEY_CODE_CONSTANTS.ARROW_DOWN) ||
            (e.which === KEY_CODE_CONSTANTS.ARROW_UP || e.keyCode === KEY_CODE_CONSTANTS.ARROW_UP)) {
            const selectedEle = e.target;
            const allElements: any = window.document.querySelectorAll('input[onReturn][type="text"], textarea[onReturn]');
            const nodeList = Array.from(allElements);
            const indx = nodeList.findIndex((ele) => ele === selectedEle);

            // nodeList[indx + 1].focus();
            if (e.which === KEY_CODE_CONSTANTS.ENTER || e.keyCode === KEY_CODE_CONSTANTS.ENTER) {

                if (e.ctrlKey) {
                    return selectedEle.setAttribute('data-changed', true);
                } else {
                    selectedEle.setAttribute('data-changed', false);
                }

                let target = allElements[indx + 1];

                if (this.selectedField && this.selectedField === allElements[indx] && allElements[indx].value === '') {
                    // detect by or to
                    const activatedRow: any = window.document.querySelectorAll('tr.activeRow');
                    const rowEntryType = activatedRow[0].children[0].children[0].value;
                    if (rowEntryType === 'by') {
                        target = allElements[indx + 4];
                    } else if (rowEntryType === 'to') {
                        target = allElements[indx + 5];
                    }
                } else if (allElements[indx] && allElements[indx].classList.contains('stock-field') && this.selectedField !== allElements[indx]) {
                    this.selectedField = allElements[indx];
                } else if (target && target.classList.contains('debit-credit')) {
                    target = allElements[indx + 2];
                } else if (allElements[indx + 1] && allElements[indx + 1].classList.contains('byTo') && allElements[indx + 1].disabled) {
                    target = allElements[indx + 2];
                } else if (allElements[indx] && allElements[indx].classList.contains('select-stock-in-invoice')) {
                    if (this.activeIndx === indx) {
                        target = allElements[indx + 1];
                        if (target.disabled) {
                            target = allElements[indx + 4];
                        }
                        this.activeIndx = null;
                        return target.focus();
                    } else {
                        return this.activeIndx = indx;
                    }
                } else if (allElements[indx] && allElements[indx].classList.contains('invoice-account-field')) {
                    if (this.activeIndx === indx) {
                        target = allElements[indx + 1];
                        return setTimeout(() => {
                            if (target.disabled && allElements[indx].value.trim() === '') {
                                return document.getElementById('invoice-narration').focus();
                            } else {
                                this.activeIndx = null;
                                return target.focus();
                            }
                        }, 100);
                    } else {
                        return this.activeIndx = indx;
                    }
                }

                if (target) {

                    if (target.disabled) {
                        target = allElements[indx + 2];
                    }

                    if (allElements[indx] && allElements[indx].classList.contains('upper-fields')) {
                        setTimeout(() => {
                            target.focus();
                        }, 210);
                    } else {
                        if (target.value === 'NaN' || target.value === 0) {
                            target.value = '';
                        }
                        if (this.clickCount > 1) {
                            // focus Narration
                            this.clickCount = 0;
                            return document.getElementById('narration').focus();
                        }
                        if (allElements[indx] && allElements[indx].classList.contains('from-or-to-acc')) {
                            this.clickCount++;
                        }
                        target.focus();
                    }
                }

            } else if (e.which === KEY_CODE_CONSTANTS.BACKSPACE || e.keyCode === KEY_CODE_CONSTANTS.BACKSPACE) {

                let target = allElements[indx - 1];

                const activatedRow: any = window.document.querySelectorAll('tr.activeRow');
                const rowEntryType = activatedRow[0].children[0].children[0].value;

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
                // } else if (allElements[indx] && allElements[indx].classList.contains('account-amount-field')) {
                //   return target.focus();
                // }
                // && !this.isOtherKeyPressed && this.selectedField !== target
                if (target && e.target.value.length === e.target.selectionEnd) {
                    if (selectedEle.getAttribute('data-changed') === 'false' || selectedEle.value.trim() === '') {
                        e.preventDefault();
                        if (target.disabled) {
                            target = allElements[indx - 2];
                            if (target.disabled) {
                                target = allElements[indx - 3];
                            }
                            return target.focus();
                        } else {
                            return target.focus();
                        }
                    }
                }
            } else if (e.which === KEY_CODE_CONSTANTS.SPACE || e.keyCode === KEY_CODE_CONSTANTS.SPACE) {
                const target = allElements[indx];
                if (target) {
                    // target.value = ''; // No need to make the field empty
                }
            } else if (e.which === KEY_CODE_CONSTANTS.ESC) {

                let gridType: any = window.document.getElementById('get-grid-type').getAttribute('data-gridType');

                if (gridType === 'invoice') {
                    let invDateField: any = nodeList.find((ele: any) => ele.classList.contains('invoice-date-field'));
                    invDateField.focus();
                } else if (gridType === 'voucher') {
                    let vouDateField: any = nodeList.find((ele: any) => ele.classList.contains('voucher-date-field'));
                    vouDateField.focus();
                }

                return setTimeout(() => {
                    selectedEle.focus();
                }, 100);
            } else if (e.which === KEY_CODE_CONSTANTS.ARROW_UP || e.which === KEY_CODE_CONSTANTS.ARROW_DOWN) {
                if (selectedEle.getAttribute('data-changed') === 'false') {
                    selectedEle.value = '';
                    return selectedEle.setAttribute('data-changed', true);
                }
            }
        } else if ((e.keyCode >= 48 && e.keyCode <= 57) || e.keyCode >= 65 && e.keyCode <= 90) {

            const selectedEle = e.target;
            // const allElements: any = window.document.querySelectorAll('input[onReturn][type="text"]');
            // const nodeList = Array.from(allElements);
            // const indx = nodeList.findIndex((ele) => ele === selectedEle);
            selectedEle.setAttribute('data-changed', true);
            // if (this.selectedField === allElements[indx]) {
            //   this.isOtherKeyPressed = true;
            // } else {
            //   this.isOtherKeyPressed = false;
            //   this.selectedField = allElements[indx];
            // }
        }
    }
}
