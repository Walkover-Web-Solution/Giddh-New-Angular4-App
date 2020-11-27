import { Injectable } from '@angular/core';
import { eventsConst } from 'apps/web-giddh/src/app/shared/header/components/eventsConst';
import { BehaviorSubject, Subject } from 'rxjs';

import { ConfirmationModalButton, ConfirmationModalConfiguration } from '../common/confirmation-modal/confirmation-modal.interface';
import { CompanyCreateRequest } from '../models/api-models/Company';
import { UserDetails } from '../models/api-models/loginModels';
import { IUlist } from '../models/interfaces/ulist.interface';
import * as moment from 'moment';
import { find } from '../lodash-optimized';
import { OrganizationType } from '../models/user-login-state';

@Injectable()
export class GeneralService {
    invokeEvent: Subject<any> = new Subject();
    // TODO : It is commented due to we have implement calendly and its under discussion to remove
    // public talkToSalesModal: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public isCurrencyPipeLoaded: boolean = false;

    /** Stores the current organization type */
    public currentOrganizationType: OrganizationType;
    /** Stores the branch unique name */
    public currentBranchUniqueName: string;
    public menuClickedFromOutSideHeader: BehaviorSubject<IUlist> = new BehaviorSubject<IUlist>(null);
    public invalidMenuClicked: BehaviorSubject<{ next: IUlist, previous: IUlist }> = new BehaviorSubject<{ next: IUlist, previous: IUlist }>(null);
    public isMobileSite: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private _dateRangePickerDefaultRanges = {
        Today: [moment(), moment()],
        Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [
            moment().subtract(1, 'month').startOf('month'),
            moment().subtract(1, 'month').endOf('month')
        ],
        'This Week': [{
            'Sun - Today': [moment().startOf('week'), moment()],
            'Mon - Today': [moment().startOf('week').add(1, 'd'), moment()]
        }],
        'This Quarter to Date': [
            moment().quarter(moment().quarter()).startOf('quarter'),
            moment()
        ],
        'This Financial Year to Date': [
            moment().startOf('year').subtract(9, 'year'),
            moment()
        ],
        'This Year to Date': [
            moment().startOf('year'),
            moment()
        ],
        'Last Quarter': [
            moment().quarter(moment().quarter()).subtract(1, 'quarter').startOf('quarter'),
            moment().quarter(moment().quarter()).subtract(1, 'quarter').endOf('quarter')
        ],
        'Last Financial Year': [
            moment().startOf('year').subtract(10, 'year'),
            moment().endOf('year').subtract(10, 'year')
        ],
        'Last Year': [
            moment().subtract(1, 'year').startOf('year'),
            moment().subtract(1, 'year').endOf('year')
        ]
    };

    get user(): UserDetails {
        return this._user;
    }

    set user(userData: UserDetails) {
        this._user = userData;
    }

    get companyUniqueName(): string {
        return this._companyUniqueName;
    }

    set companyUniqueName(companyUniqueName: string) {
        this._companyUniqueName = companyUniqueName;
    }

    get sessionId(): string {
        return this._sessionId;
    }

    set sessionId(sessionId: string) {
        this._sessionId = sessionId;
    }

    get dateRangePickerDefaultRanges(): any {
        return this._dateRangePickerDefaultRanges;
    }

    set dateRangePickerDefaultRanges(value: any) {
        this._dateRangePickerDefaultRanges = value;
    }

    // currencyType define specific type of currency out of four type of urrencyType a.1,00,00,000 ,b.10,000,000,c.10\'000\'000,d.10 000 000
    get currencyType(): string {
        return this._currencyType;
    }

    set currencyType(currencyType: string) {
        this._currencyType = currencyType;
    }

    get createNewCompany(): CompanyCreateRequest {
        return this._createNewCompany;
    }

    set createNewCompany(newCompanyRequest: CompanyCreateRequest) {
        this._createNewCompany = newCompanyRequest;
    }

    public eventHandler: Subject<{ name: eventsConst, payload: any }> = new Subject();
    public IAmLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    private _user: UserDetails;
    private _createNewCompany: CompanyCreateRequest;

    private _companyUniqueName: string;

    private _currencyType = '1,00,00,000';   // there will be four type of currencyType a.1,00,00,000 (INR),b.10,000,000,c.10\'000\'000,d.10 000 000

    private _sessionId: string;

    public resetGeneralServiceState() {
        this.user = null;
        this.sessionId = null;
        this.companyUniqueName = null;
    }

    public SetIAmLoaded(iAmLoaded: boolean) {
        this.IAmLoaded.next(iAmLoaded);
    }

    public createQueryString(str, model) {
        let url = str;
        if ((model.from)) {
            url = url + 'from=' + model.from + '&';
        }
        if ((model.to)) {
            url = url + 'to=' + model.to + '&';
        }
        if ((model.page)) {
            url = url + 'page=' + model.page + '&';
        }
        if ((model.count)) {
            url = url + 'count=' + model.count;
        }

        if ((model.type)) {
            url = url + '&type=' + model.type;
        }
        if ((model.sort)) {
            url = url + '&sort=' + model.sort;
        }
        if ((model.sortBy)) {
            url = url + '&sortBy=' + model.sortBy;
        }
        if ((model.q)) {
            url = url + '&q=' + model.q;
        }
        return url;
    }
    public setIsMobileView(isMobileView: boolean) {
        this.isMobileSite.next(isMobileView);
    }

    public capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    public base64ToBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;
        let byteCharacters = atob(b64Data);
        let byteArrays = [];
        let offset = 0;
        while (offset < byteCharacters.length) {
            let slice = byteCharacters.slice(offset, offset + sliceSize);
            let byteNumbers = new Array(slice.length);
            let i = 0;
            while (i < slice.length) {
                byteNumbers[i] = slice.charCodeAt(i);
                i++;
            }
            let byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
            offset += sliceSize;
        }
        return new Blob(byteArrays, { type: contentType });
    }

    convertExponentialToNumber(n) {
        var [lead, decimal, pow] = n.toString().split(/e|\./);
        if (decimal) {
            return +pow <= 0
                ? "0." + "0".repeat(Math.abs(pow) - 1) + lead + decimal
                : lead + (+pow >= decimal.length ? (decimal + "0".repeat(+pow - decimal.length)) : (decimal.slice(0, +pow) + "." + decimal.slice(+pow)))
        } else {
            return n;
        }
    }

    storeUtmParameters(routerParams: any): void {
        if (routerParams['utm_source']) {
            localStorage.setItem('utm_source', routerParams['utm_source']);
        }
        if (routerParams['utm_medium']) {
            localStorage.setItem('utm_medium', routerParams['utm_medium']);
        }
        if (routerParams['utm_campaign']) {
            localStorage.setItem('utm_campaign', routerParams['utm_campaign']);
        }
        if (routerParams['utm_term']) {
            localStorage.setItem('utm_term', routerParams['utm_term']);
        }
        if (routerParams['utm_content']) {
            localStorage.setItem('utm_content', routerParams['utm_content']);
        }
    }

    getUtmParameter(param: string): string {
        if (localStorage.getItem(param)) {
            return localStorage.getItem(param);
        } else {
            return "";
        }
    }

    removeUtmParameters(): void {
        localStorage.removeItem("utm_source");
        localStorage.removeItem("utm_medium");
        localStorage.removeItem("utm_campaign");
        localStorage.removeItem("utm_term");
        localStorage.removeItem("utm_content");
    }

    getLastElement(array) {
        return array[array.length - 1];
    };

    /**
     * Returns the RCM modal configuration based on 'isRcmSelected' flag value
     *
     * @param {boolean} isRcmSelected True, if user selects the RCM checkbox
     * @returns {ConfirmationModalConfiguration} RCM modal configuration
     * @memberof GeneralService
     */
    public getRcmConfiguration(isRcmSelected: boolean): ConfirmationModalConfiguration {
        const buttons: Array<ConfirmationModalButton> = [{
            text: 'Yes',
            cssClass: 'btn btn-success'
        },
        {
            text: 'No',
            cssClass: 'btn btn-danger'
        }];
        const headerText: string = 'Reverse Charge Confirmation';
        const headerCssClass: string = 'd-inline-block mr-1';
        const messageCssClass: string = 'mr-b1 text-light';
        const footerCssClass: string = 'mr-b1';
        return (isRcmSelected) ? {
            headerText,
            headerCssClass,
            messageText: `Note: If you check this transaction for Reverse Charge,
            applied taxes will be considered under Reverse Charge taxes and
            will be added in tax report.`,
            messageCssClass,
            footerText: 'Are you sure you want to check this transaction for Reverse Charge?',
            footerCssClass,
            buttons
        } : {
                headerText,
                headerCssClass,
                messageText: `Note: If you uncheck this transaction from Reverse Charge, applied
                taxes will be considered as normal taxes and reverse
                charge effect will be removed from tax report.`,
                messageCssClass,
                footerText: 'Are you sure you want to uncheck this transaction from Reverse Charge?',
                footerCssClass,
                buttons
            };
    }

    /**
     * Decides based on current ledger and selected account details whether the RCM section
     * needs to be displayed
     *
     * @param {*} currentLedgerAccountDetails Current ledger detail
     * @param {*} selectedAccountDetails User selected particular account
     * @returns {boolean} True, if the current ledger and user selected particular account belongs to RCM category accounts
     * @memberof GeneralService
     */
    public shouldShowRcmSection(currentLedgerAccountDetails: any, selectedAccountDetails: any): boolean {
        if (currentLedgerAccountDetails && selectedAccountDetails) {
            if (![currentLedgerAccountDetails.uniqueName, selectedAccountDetails.uniqueName].includes('roundoff')) {
                // List of allowed first level parent groups
                const allowedFirstLevelUniqueNames = ['operatingcost', 'indirectexpenses', 'fixedassets'];
                // List of not allowed second level parent groups
                const disallowedSecondLevelUniqueNames = ['discount', 'exchangeloss'];
                const currentLedgerFirstParent = currentLedgerAccountDetails.parentGroups[0] ? currentLedgerAccountDetails.parentGroups[0].uniqueName : '';
                const currentLedgerSecondParent = currentLedgerAccountDetails.parentGroups[1] ? currentLedgerAccountDetails.parentGroups[1].uniqueName : '';
                const selectedAccountFirstParent = selectedAccountDetails.parentGroups[0] ? selectedAccountDetails.parentGroups[0].uniqueName : '';
                const selectedAccountSecondParent = selectedAccountDetails.parentGroups[1] ? selectedAccountDetails.parentGroups[1].uniqueName : '';
                // Both accounts (current ledger and selected account) in order to satisfy RCM MUST have first
                // level parent group unique name in allowed unique names and MUST NOT have their second level parent
                // in disallowed unique names
                return (allowedFirstLevelUniqueNames.some((firstLevelUniqueName: string) => [currentLedgerFirstParent, selectedAccountFirstParent].includes(firstLevelUniqueName)) &&
                    !disallowedSecondLevelUniqueNames.some((secondLevelUniqueName: string) => [currentLedgerSecondParent, selectedAccountSecondParent].includes(secondLevelUniqueName)));
            }
        }
        return false;
    }

    public getGoogleCredentials() {
        if (PRODUCTION_ENV) {
            return {
                GOOGLE_CLIENT_ID: '641015054140-3cl9c3kh18vctdjlrt9c8v0vs85dorv2.apps.googleusercontent.com',
                GOOGLE_CLIENT_SECRET: 'eWzLFEb_T9VrzFjgE40Bz6_l'
            };
        } else {
            return {
                GOOGLE_CLIENT_ID: '641015054140-uj0d996itggsesgn4okg09jtn8mp0omu.apps.googleusercontent.com',
                GOOGLE_CLIENT_SECRET: '8htr7iQVXfZp_n87c99-jm7a'
            };
        }
    }

    /**
     * Covert UTC time zone( server time zone ) into local system timezone
     *
     * @param {*} UTCDateString UTC timezone time string
     * @returns  coverted date(UTC---> Systme TimeZone)
     * @memberof CompletedComponent
     */
    public ConvertUTCTimeToLocalTime(UTCDateString) {
        UTCDateString = UTCDateString.replace("@", "");
        let convertdLocalTime = new Date(UTCDateString);
        let hourOffset = convertdLocalTime.getTimezoneOffset() / 60;
        convertdLocalTime.setMinutes(convertdLocalTime.getMinutes() - (hourOffset * 60));
        return convertdLocalTime;
    }

    /**
     * Trim string allow only alphanumeric string
     *
     * @param {string} value String that need to be trim by special characters
     * @returns {string} Trimed value
     * @memberof GeneralService
     */
    public allowAlphanumericChar(value: string): string {
        if (value) {
            return value.replace(/[^a-zA-Z0-9]/g, '');
        } else {
            return '';
        }
    }

    /**
     * This will remove the selectall value from array used for multi checkbox dropdown
     *
     * @param {Array<string>} array
     * @returns {Array<string>}
     * @memberof GeneralService
     */
    public removeSelectAllFromArray(array: Array<string>): Array<string> {
        let newArray = [];
        if (array && array.length > 0) {
            array.forEach(key => {
                if (key !== "selectall") {
                    newArray.push(key);
                }
            });
        }

        return newArray;
    }

    /**
     * Calculates tax inclusively for Advance receipt else exclusively
     *
     * @param {boolean} [inclusive=false] If true, inclusive tax will be calculated
     * @param {number} amount Amount on which tax needs to be calculated
     * @param {number} totalTaxPercentage  Tax percentage sum total
     * @param {number} totalDiscount Discount amount (and not percentage) applicable on amount
     * @returns {number} Tax value
     * @memberof GeneralService
     */
    public calculateInclusiveOrExclusiveTaxes(inclusive = false, amount: number, totalTaxPercentage: number, totalDiscount: number): number {
        if (inclusive) {
            // Inclusive tax rate
            return (totalTaxPercentage * (Number(amount) - totalDiscount)) / (100 + totalTaxPercentage);
        } else {
            // Exclusive tax rate
            return ((totalTaxPercentage * (Number(amount) - totalDiscount)) / 100);
        }
    }

    /**
     * This function will change the position of element in an array
     *
     * @param {*} array
     * @param {*} currentIndex
     * @param {*} newIndex
     * @returns
     * @memberof GeneralService
     */
    public changeElementPositionInArray(array, currentIndex, newIndex) {
        array.splice(newIndex, 0, array.splice(currentIndex, 1)[0]);
        return array;
    }

    /**
     * This will calculate the position of element
     *
     * @param {*} elementTarget
     * @param {*} element
     * @returns
     * @memberof DatepickerWrapperComponent
     */
    public getPosition(elementTarget, element?: any): any {
        var xPosition = 0;
        var yPosition = 40;

        while (elementTarget) {
            xPosition += (elementTarget.offsetLeft - elementTarget.scrollLeft + elementTarget.clientLeft);
            if (!element) {
                yPosition += (elementTarget.offsetTop - elementTarget.scrollTop + elementTarget.clientTop);
            }
            elementTarget = elementTarget.offsetParent;
        }
        if (element) {
            yPosition = element.clientY + 20;
        }

        if (window && window.innerHeight - yPosition < 450) { // 450 is approx height of datepicker
            yPosition -= (window.innerHeight - yPosition) / 2;
        }

        return { x: xPosition, y: yPosition };
    }

    /**
     * Returns a particular cookie value
     *
     * @param {string} cookieName Name of the cookie whose value is required
     * @returns {string} Cookie value
     * @memberof GeneralService
     */
    public getCookie(cookieName: string): string {
        const name = `${cookieName}=`;
        const decodedCookie = decodeURIComponent(document.cookie);
        const availableCookies = decodedCookie.split(';');
        for (let index = 0; index < availableCookies.length; index++) {
            let cookie = availableCookies[index];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(name) === 0) {
                return cookie.substring(name.length, cookie.length);
            }
        }
        return '';
    }

    /**
     * This will verify if the company is allowed to view the page or not
     *
     * @param {string} email
     * @returns {boolean}
     * @memberof NeedsAuthorization
     */
    public checkIfEmailDomainAllowed(email: string): boolean {
        let isAllowed = false;
        if (email) {
            let emailSplit = email.split("@");
            if (emailSplit.indexOf("giddh.com") > -1 || emailSplit.indexOf("walkover.in") > -1 || emailSplit.indexOf("muneem.co") > -1) {
                isAllowed = true;
            }
        }

        return isAllowed;
    }

    /**
     * This is to allow only digits and dot
     *
     * @param {*} event
     * @returns {boolean}
     * @memberof GeneralService
     */
    public allowOnlyNumbersAndDot(event: any): boolean {
        if (event.keyCode === 46 || (event.keyCode >= 48 && event.keyCode <= 57)) {
            return true;
        } else {
            return false;
        }

    }

    /**
    * This is to allow only digits
    *
    * @param {*} event
    * @returns {boolean}
    * @memberof GeneralService
    */
    public allowOnlyNumbers(event: any): boolean {
        if (event.keyCode >= 48 && event.keyCode <= 57) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * To get date range from DD-MM-YYYY to MM-DD-YYYY to set date in component datepicker
     *
     * @param {string} fromDate
     * @param {string} toDate
     * @memberof GeneralService
     */
    public dateConversionToSetComponentDatePicker(fromDateValue: string, toDateValue: string): any {
        let fromDateInMmDdYy;
        let toDateInMmDdYy;
        if (fromDateValue && toDateValue) {
            let fromDate = fromDateValue.split('-');
            let toDate = toDateValue.split('-');

            if (fromDate && fromDate.length) {
                fromDateInMmDdYy = fromDate[1] + '-' + fromDate[0] + '-' + fromDate[2];
            }
            if (toDate && toDate.length) {
                toDateInMmDdYy = toDate[1] + '-' + toDate[0] + '-' + toDate[2]
            }
        }
        return { fromDate: fromDateInMmDdYy, toDate: toDateInMmDdYy }
    }

    /**
     * This will replace underscore by space in string
     *
     * @param {*} type
     * @returns {string}
     * @memberof GeneralService
     */
    public getRevisionField(type: any): string {
        return type.replace(/_/g, " ");
    }

    /**
     * Returns the account category
     *
     * @param {*} account Account object
     * @param {string} accountName Account unique name
     * @returns {string} Account category
     * @memberof GeneralService
     */
    public getAccountCategory(account: any, accountName: string): string {
        let parent = account.parentGroups ? account.parentGroups[0] : '';
        if (parent) {
            if (find(['shareholdersfunds', 'noncurrentliabilities', 'currentliabilities'], p => p === parent.uniqueName)) {
                return 'liabilities';
            } else if (find(['fixedassets'], p => p === parent.uniqueName)) {
                return 'fixedassets';
            } else if (find(['noncurrentassets', 'currentassets'], p => p === parent.uniqueName)) {
                return 'assets';
            } else if (find(['revenuefromoperations', 'otherincome'], p => p === parent.uniqueName)) {
                return 'income';
            } else if (find(['operatingcost', 'indirectexpenses'], p => p === parent.uniqueName)) {
                if (accountName === 'roundoff') {
                    return 'roundoff';
                }
                let subParent = account.parentGroups[1];
                if (subParent && subParent.uniqueName === 'discount') {
                    return 'discount';
                }
                return 'expenses';
            } else {
                return '';
            }
        } else {
            return '';
        }
    }

    /**
     * Returns true if key pressed was character/number/special character
     *
     * @param {*} event
     * @returns {boolean}
     * @memberof GeneralService
     */
    public allowCharactersNumbersSpecialCharacters(event: any): boolean {
        if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode >= 186 && event.keyCode <= 192) || (event.keyCode >= 219 && event.keyCode <= 222)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Stores data in session storage
     *
     * @param {string} name
     * @param {*} value
     * @returns {void}
     * @memberof GeneralService
     */
    public setSessionStorage(name: string, value: any): void {
        sessionStorage.setItem(name, value);
    }

    /**
     * Returns data from session storage
     *
     * @param {string} name
     * @returns {any}
     * @memberof GeneralService
     */
    public getSessionStorage(name: string): any {
        return sessionStorage.getItem(name);
    }

    /**
     * Removes data from session storage
     *
     * @param {string} name
     * @returns {void}
     * @memberof GeneralService
     */
    public removeSessionStorage(name: string): void {
        sessionStorage.removeItem(name);
    }

    /**
     * This will add value in array if doesn't exists
     *
     * @param {Array<string>} array
     * @param {*} value
     * @returns {Array<string>}
     * @memberof GeneralService
     */
    public addValueInArray(array: Array<string>, value: any): Array<string> {
        let exists = false;
        if (array && array.length > 0) {
            array.forEach(item => {
                if (item === value) {
                    exists = true;
                }
            });
        }

        if (!exists) {
            array.push(value);
        }

        return array;
    }

    /**
     * This will check if value exists in array
     *
     * @param {Array<string>} array
     * @param {*} value
     * @returns {boolean}
     * @memberof GeneralService
     */
    public checkIfValueExistsInArray(array: Array<string>, value: any): boolean {
        let exists = false;

        if (array && array.length > 0) {
            array.forEach(item => {
                if (item === value) {
                    exists = true;
                }
            });
        }

        return exists;
    }

    /**
     * This will remove value from array
     *
     * @param {Array<string>} array
     * @param {*} value
     * @returns {Array<string>}
     * @memberof GeneralService
     */
    public removeValueFromArray(array: Array<string>, value: any): Array<string> {
        let index = -1;
        if (array && array.length > 0) {
            let loop = 0;
            array.forEach(item => {
                if (item === value) {
                    index = loop;
                }
                loop++;
            });
        }

        if (index > -1) {
            array.splice(index, 1);
        }

        return array;
    }

    /**
     * This will set global cookie for main domain
     *
     * @param {string} cookieName
     * @param {*} cookieValue
     * @param {number} expiryDays
     * @memberof GeneralService
     */
    public setCookie(cookieName: string, cookieValue: any, expiryDays: number): void {
        const date = new Date();
        date.setTime(date.getTime() + (expiryDays * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = cookieName + "=" + cookieValue + ";domain=giddh.com;" + expires + ";path=/";
    }
}
