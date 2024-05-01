
import { INTL_INPUT_OPTION, PHONE_NUMBER_REGEX } from '../../app.constant';
declare var window;

export class IntlPhoneLib {
    private intl: any;
    private changeFlagZIndexInterval: any;
    
    /**
     * Creates an instance of IntlPhoneLib.
     * @param {*} inputElement
     * @param {*} parentDom
     * @memberof IntlPhoneLib
     */
    constructor(
        inputElement,
        parentDom,
        changeFlagZIndex = false,
        intlOptions: object = {}
    ) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://giddh-plugin-resources.s3.ap-south-1.amazonaws.com/intlTelInput.min.js';
        script.onload = () => {
            this.intl = window.intlTelInput(inputElement, { ...INTL_INPUT_OPTION, ...intlOptions });
            this.checkMobileFlag(parentDom, changeFlagZIndex);
        };

        const intlStyleElement = document.createElement('link');
        intlStyleElement.rel = 'stylesheet';
        intlStyleElement.href = `https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/css/intlTelInput.css`;


        if (parentDom) {
            parentDom.appendChild(script);
            parentDom.appendChild(intlStyleElement);
        }
        setTimeout(() => {
            document.head.appendChild(script);
            document.head.appendChild(intlStyleElement);
        }, 200);

        let ulEl = document.getElementById('iti-0__country-listbox');
        if (ulEl) {
            let flagEl = Array.from(document.getElementsByClassName('iti__flag') as HTMLCollectionOf<HTMLElement>);
            for (let i = 0; i < flagEl.length; i++) {
                flagEl[i].style.backgroundImage =
                    'url(https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.17/img/flags@2x.png)';
            }
        }

        inputElement.addEventListener('keyup', () => {
            setTimeout(() => {
                if (this.isRequiredValidNumber) {
                    inputElement.classList.remove('invalid-input');
                } else {
                    inputElement.classList.add('invalid-input');
                }
            }, 100);
        });
        this.showCountryDropdown(parentDom);
        window.addEventListener('resize', (event) => {
            let shadowRoot = parentDom.querySelector('.iti__flag-container');
            let flagDropdownView = parentDom.querySelector('.iti__country-list');
            if (shadowRoot && flagDropdownView) {
                this.calculateFlagDropdownView(shadowRoot, flagDropdownView);
            }
        });
    }

    set phoneNumber(number: string) {
        this.intl?.setNumber(number);
    }

    set setCountry(country: string) {
        this.intl?.setCountry(country);
    }

    get intlData() {
        return this.intl;
    }

    get phoneNumber() {
        return this.intl?.getNumber();
    }

    get isRequiredValidNumber() {
        return this.intl?.isValidNumber();
    }

    get isValidNumber() {
        return this.intl?.getNumber()?.length ? this.intl?.isValidNumber() : true;
    }

    get selectedCountryData() {
        return this.intl?.getSelectedCountryData();
    }

    get getExtension() {
        return this.intl?.getExtension();
    }

    private checkMobileFlag(parentDom, changeFlagZIndex): void {
        let count = 0;
        let interval = setInterval(() => {
            let mobileViewInit = document.querySelector('body.iti-mobile');
            let childCount = 0;
            let flagDropDownElInterval = setInterval(() => {
                let flagDropdownView = parentDom.querySelector('.iti__flag-container');
                if (changeFlagZIndex) {
                    this.changeFlagZIndexInterval = setInterval(() => {
                        let flagDropDown = document.querySelector('.iti--container');
                        flagDropDown?.setAttribute('style', 'z-index: 9999999');
                        if (flagDropDown) {
                            clearInterval(this.changeFlagZIndexInterval);
                        }
                    }, 100);
                }
                if (flagDropdownView || childCount > 10) {
                    clearInterval(flagDropDownElInterval);
                }
                childCount++;
            }, 200);
            count++;
            if (mobileViewInit || count > 5) {
                clearInterval(interval);
            }
        }, 200);
    }

    /**
     * showCountryDropdown in fixed position
     *
     * @private
     * @param {HTMLElement} parentDom
     * @memberof IntlPhoneLib
     */
    private showCountryDropdown(parentDom: HTMLElement) {
        setTimeout(() => {
            let shadowRoot = parentDom.querySelector('.iti__flag-container');
            let flagDropdownView = parentDom.querySelector('.iti__country-list');
            if (flagDropdownView) {
                shadowRoot.addEventListener('click', (event: PointerEvent) => {
                    if (shadowRoot && flagDropdownView) {
                        this.calculateFlagDropdownView(shadowRoot, flagDropdownView);
                    }
                });
            }
            // flagDropdownView.setAttribute(
            //     'style',
            //     'position: fixed;top:' + top + 'px; left:' + rect.left + 'px'
            // );
        }, 700);
    }

    public calculateFlagDropdownView(shadowRoot, flagDropdownView) {
        if (shadowRoot && flagDropdownView) {
            // Get Clicked button coordinates
            const rect = shadowRoot.getBoundingClientRect();
            // Add current input height form top position
            const top = rect.top + 34;
            // Get document height
            const documentHeight = document.body.scrollHeight;
            // Calculate bottom height
            const bottom = documentHeight - top;

            // Add styles on country dropdown
            if (bottom >= 250) {
                flagDropdownView.setAttribute(
                    'style',
                    'position: fixed;top:' + (top + 4) + 'px; left:' + rect.left + 'px'
                );
            } else if (top >= 250) {
                flagDropdownView.setAttribute(
                    'style',
                    'position: fixed;top:' + (top - 250 - 34) + 'px; left:' + rect.left + 'px'
                );
            } else {
                flagDropdownView.setAttribute('style', 'position: fixed;top:' + top + 'px; left:' + rect.left + 'px');
            }
        }
    }

    public onlyPhoneNumber(e: KeyboardEvent): void {
        const inputChar = String.fromCharCode(e.charCode);
        if ((e.key !== 'Backspace' && !new RegExp(PHONE_NUMBER_REGEX).test(inputChar)) || e.code === 'Space') {
            e.preventDefault();
        }
    }

    public clearChangeFlagZIndexInterval() {
        clearInterval(this.changeFlagZIndexInterval);
    }

    public destroyIntlClass(): void {
        this.intl?.destroy();
    }
}
