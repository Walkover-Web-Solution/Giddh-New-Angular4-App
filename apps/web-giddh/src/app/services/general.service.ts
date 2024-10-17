import { Injectable } from '@angular/core';
import { eventsConst } from 'apps/web-giddh/src/app/shared/header/components/eventsConst';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ConfirmationModalButton, ConfirmationModalConfiguration } from '../theme/confirmation-modal/confirmation-modal.interface';
import { CompanyCreateRequest } from '../models/api-models/Company';
import { UserDetails } from '../models/api-models/loginModels';
import { IUlist } from '../models/interfaces/ulist.interface';
import { cloneDeep, find, orderBy } from '../lodash-optimized';
import { OrganizationType } from '../models/user-login-state';
import { AllItems } from '../shared/helpers/allItems';
import { Router } from '@angular/router';
import { AdjustedVoucherType, JOURNAL_VOUCHER_ALLOWED_DOMAINS, MOBILE_NUMBER_SELF_URL, SUPPORTED_OPERATING_SYSTEMS } from '../app.constant';
import { SalesOtherTaxesCalculationMethodEnum, VoucherTypeEnum } from '../models/api-models/Sales';
import { ITaxControlData, ITaxDetail, ITaxUtilRequest } from '../models/interfaces/tax.interface';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT } from '../shared/helpers/defaultDateFormat';
import { IDiscountUtilRequest, LedgerDiscountClass } from '../models/api-models/SettingsDiscount';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class GeneralService {
    invokeEvent: Subject<any> = new Subject();
    public isCurrencyPipeLoaded: boolean = false;

    /** Stores the current organization type */
    public currentOrganizationType: OrganizationType;
    /** Stores the branch unique name */
    public currentBranchUniqueName: string;
    public menuClickedFromOutSideHeader: BehaviorSubject<IUlist> = new BehaviorSubject<IUlist>(null);
    public invalidMenuClicked: BehaviorSubject<{ next: IUlist, previous: IUlist }> = new BehaviorSubject<{ next: IUlist, previous: IUlist }>(null);
    public isMobileSite: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    /** Stores the version number for new voucher APIs (1 for old APIs and 2 for new APIs) */
    public voucherApiVersion: 1 | 2 = 1;

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

    constructor(
        private router: Router,
        private http: HttpClient
    ) { }

    public SetIAmLoaded(iAmLoaded: boolean) {
        this.IAmLoaded.next(iAmLoaded);
    }

    public createQueryString(url: string, params: any) {
        Object.keys(params).forEach((key, index) => {
            if (params[key] !== undefined) {
                const delimiter = url.indexOf('?') === -1 ? '?' : (index === 0 ? '' : '&');
                url += `${delimiter}${key}=${params[key]}`
            }
        });
        return url;
    }

    public setIsMobileView(isMobileView: boolean) {
        this.isMobileSite.next(isMobileView);
    }

    public base64ToBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;
        let byteCharacters = atob(b64Data);
        let byteArrays = [];
        let offset = 0;
        if (byteCharacters && byteCharacters.length > 0) {
            while (offset < byteCharacters?.length) {
                let slice = byteCharacters.slice(offset, offset + sliceSize);
                let byteNumbers = new Array(slice?.length);
                let i = 0;
                while (i < slice?.length) {
                    byteNumbers[i] = slice.charCodeAt(i);
                    i++;
                }
                let byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
                offset += sliceSize;
            }
        }
        return new Blob(byteArrays, { type: contentType });
    }

    convertExponentialToNumber(n) {
        var [lead, decimal, pow] = n?.toString()?.split(/e|\./);
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
        if (routerParams['region']) {
            localStorage.setItem('region', routerParams['region']);
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
        localStorage.removeItem("region");
    }

    getLastElement(array) {
        return array[array?.length - 1];
    };

    /**
     * Returns the RCM modal configuration based on 'isRcmSelected' flag value
     *
     * @param {boolean} isRcmSelected True, if user selects the RCM checkbox
     * @returns {ConfirmationModalConfiguration} RCM modal configuration
     * @memberof GeneralService
     */
    public getRcmConfiguration(isRcmSelected: boolean, commonLocaleData?: any): ConfirmationModalConfiguration {
        const buttons: Array<ConfirmationModalButton> = [{
            text: (commonLocaleData) ? commonLocaleData?.app_yes : 'Yes',
            color: 'primary'
        },
        {
            text: (commonLocaleData) ? commonLocaleData?.app_no : 'No'
        }];
        const headerText: string = (commonLocaleData) ? commonLocaleData?.app_rc_heading : 'Reverse Charge Confirmation';
        const headerCssClass: string = 'd-inline-block mr-1';
        const messageCssClass: string = 'mr-b1 text-light';
        const footerCssClass: string = 'mr-b1';
        return (isRcmSelected) ? {
            headerText,
            headerCssClass,
            messageText: (commonLocaleData) ? commonLocaleData?.app_rc_selected_note : `Note: If you check this transaction for Reverse Charge,
            applied taxes will be considered under Reverse Charge taxes and
            will be added in tax report.`,
            messageCssClass,
            footerText: (commonLocaleData) ? commonLocaleData?.app_rc_selected_footer_note : 'Are you sure you want to check this transaction for Reverse Charge?',
            footerCssClass,
            buttons
        } : {
            headerText,
            headerCssClass,
            messageText: (commonLocaleData) ? commonLocaleData?.app_rc_unselected_note : `Note: If you uncheck this transaction from Reverse Charge, applied
                taxes will be considered as normal taxes and reverse
                charge effect will be removed from tax report.`,
            messageCssClass,
            footerText: (commonLocaleData) ? commonLocaleData?.app_rs_unselected_footer_note : 'Are you sure you want to uncheck this transaction from Reverse Charge?',
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
     * @param {*} activeCompany Active Company
     * @returns {boolean} True, if the current ledger and user selected particular account belongs to RCM category accounts
     * @memberof GeneralService
     */
    public shouldShowRcmSection(currentLedgerAccountDetails: any, selectedAccountDetails: any, activeCompany?: any): boolean {
        if (currentLedgerAccountDetails && selectedAccountDetails) {
            if (![currentLedgerAccountDetails?.uniqueName, selectedAccountDetails?.uniqueName].includes('roundoff')) {
                // List of allowed first level parent groups
                const allowedFirstLevelUniqueNames = (this.voucherApiVersion === 2 && (activeCompany?.country === "India" || activeCompany?.country === 'United Kingdom')) ? ['operatingcost', 'indirectexpenses', 'fixedassets', 'revenuefromoperations', 'otherincome'] : ['operatingcost', 'indirectexpenses', 'fixedassets'];
                // List of not allowed second level parent groups
                const disallowedSecondLevelUniqueNames = (this.voucherApiVersion === 2 && (activeCompany?.country === "India" || activeCompany?.country === 'United Kingdom')) ? ['discount', 'exchangeloss', 'roundoff', 'exchangegain', 'dividendincome', 'interestincome', 'dividendexpense', 'interestexpense'] : ['discount', 'exchangeloss'];
                const currentLedgerFirstParent = (currentLedgerAccountDetails.parentGroups && currentLedgerAccountDetails.parentGroups[0]) ? currentLedgerAccountDetails.parentGroups[0]?.uniqueName : '';
                const currentLedgerSecondParent = (currentLedgerAccountDetails.parentGroups && currentLedgerAccountDetails.parentGroups[1]) ? currentLedgerAccountDetails.parentGroups[1]?.uniqueName : '';
                const selectedAccountFirstParent = (selectedAccountDetails.parentGroups && selectedAccountDetails.parentGroups[0]) ? selectedAccountDetails.parentGroups[0]?.uniqueName : '';
                const selectedAccountSecondParent = (selectedAccountDetails.parentGroups && selectedAccountDetails.parentGroups[1]) ? selectedAccountDetails.parentGroups[1]?.uniqueName : '';
                // Both accounts (current ledger and selected account) in order to satisfy RCM MUST have first
                // level parent group unique name in allowed unique names and MUST NOT have their second level parent
                // in disallowed unique names
                return (allowedFirstLevelUniqueNames.some((firstLevelUniqueName: string) => [currentLedgerFirstParent, selectedAccountFirstParent].includes(firstLevelUniqueName)) &&
                    !disallowedSecondLevelUniqueNames.some((secondLevelUniqueName: string) => [currentLedgerSecondParent, selectedAccountSecondParent].includes(secondLevelUniqueName)));
            }
        }
        return false;
    }

    /**
     * Covert UTC time zone( server time zone ) into local system timezone
     *
     * @param {*} UTCDateString UTC timezone time string
     * @returns  coverted date(UTC---> Systme TimeZone)
     * @memberof CompletedComponent
     */
    public ConvertUTCTimeToLocalTime(UTCDateString) {
        UTCDateString = UTCDateString?.replace("@", "");
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
    public allowAlphanumericChar(value: any): string {
        if (value) {
            return value?.replace(/[^a-zA-Z0-9]/g, '');
        } else {
            return '';
        }
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
            if (JOURNAL_VOUCHER_ALLOWED_DOMAINS.includes(emailSplit[1])) {
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
        return type?.replace(/_/g, " ");
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
        let parent = account?.parentGroups ? account.parentGroups[0] : '';
        if (parent) {
            if (find(['shareholdersfunds', 'noncurrentliabilities', 'currentliabilities'], p => p === parent?.uniqueName)) {
                return 'liabilities';
            } else if (find(['fixedassets'], p => p === parent?.uniqueName)) {
                return 'fixedassets';
            } else if (find(['noncurrentassets', 'currentassets'], p => p === parent?.uniqueName)) {
                return 'assets';
            } else if (find(['revenuefromoperations', 'otherincome'], p => p === parent?.uniqueName)) {
                return 'income';
            } else if (find(['operatingcost', 'indirectexpenses'], p => p === parent?.uniqueName)) {
                if (accountName === 'roundoff') {
                    return 'roundoff';
                }
                let subParent = account?.parentGroups[1];
                if (subParent && subParent?.uniqueName === 'discount') {
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

    /**
     * Handles the voucher date change modal configuration
     *
     * @param {boolean} isVoucherDateSelected
     * @returns {ConfirmationModalConfiguration}
     * @memberof GeneralService
     */
    public getDateChangeConfiguration(localeData: any, commonLocaleData: any, isVoucherDateSelected: boolean): ConfirmationModalConfiguration {
        const buttons: Array<ConfirmationModalButton> = [{
            text: commonLocaleData?.app_yes,
            color: 'primary'
        },
        {
            text: commonLocaleData?.app_no
        }];
        const headerText: string = localeData?.date_change_confirmation_heading;
        const headerCssClass: string = 'd-inline-block mr-1';
        const messageCssClass: string = 'mr-b1';
        const footerCssClass: string = 'mr-b1';
        return (isVoucherDateSelected) ? {
            headerText,
            headerCssClass,
            messageText: localeData?.change_single_entry_date,
            messageCssClass,
            footerText: '',
            footerCssClass,
            buttons
        } : {
            headerText,
            headerCssClass,
            messageText: localeData?.change_all_entry_dates,
            messageCssClass,
            footerText: '',
            footerCssClass,
            buttons
        };
    }

    public getDeleteBranchTransferConfiguration(localeData: any, commonLocaleData: any, selectedBranchTransferType: string): ConfirmationModalConfiguration {

        const buttons: Array<ConfirmationModalButton> = [{
            text: 'Yes',
            color: 'primary'
        },
        {
            text: 'No'
        }];
        const headerText: string = 'Delete' + selectedBranchTransferType;
        const headerCssClass: string = 'd-inline-block mr-1';
        const messageCssClass: string = 'mr-b1 text-light';
        const footerCssClass: string = 'mr-b1';
        return {
            headerText,
            headerCssClass,
            messageText: 'Are you sure you want to delete this' + selectedBranchTransferType + '?',
            messageCssClass,
            footerText: 'It will be deleted permanently and will no longer be accessible from any other module.',
            footerCssClass,
            buttons
        };
    }

    /**
     * Handles the file return modal configuration
     *
     * @param {*} localeData
     * @param {*} commonLocaleData
     * @return {*}  {ConfirmationModalConfiguration}
     * @memberof GeneralService
     */
    public fileReturnConfiguration(localeData: any, commonLocaleData: any): ConfirmationModalConfiguration {

        const buttons: Array<ConfirmationModalButton> = [{
            text: localeData?.submit_file_return,
            color: 'primary'
        },
        {
            text: commonLocaleData?.app_cancel
        }];
        const headerText: string = commonLocaleData?.app_confirmation;
        const headerCssClass: string = 'd-inline-block mr-1';
        const messageCssClass: string = 'mr-b1';
        const footerCssClass: string = 'mr-b1';
        const actionBtnWrapperCssClass = 'justify-content-end';
        return {
            headerText,
            headerCssClass,
            messageText: localeData?.file_return_confirmation,
            messageCssClass,
            footerText: '',
            footerCssClass,
            buttons,
            actionBtnWrapperCssClass
        };
    }

    /**
     * This will use for confirmation delete attachment in vocher
     *
     * @param {*} localeData
     * @param {*} commonLocaleData
     * @param {boolean} isVoucherDateSelected
     * @return {*}  {ConfirmationModalConfiguration}
     * @memberof GeneralService
     */
    public getAttachmentDeleteConfiguration(localeData: any, commonLocaleData: any): ConfirmationModalConfiguration {
        const buttons: Array<ConfirmationModalButton> = [{
            text: commonLocaleData?.app_yes,
            color: 'primary'
        },
        {
            text: commonLocaleData?.app_no
        }];
        const headerText: string = commonLocaleData?.app_confirmation;
        const headerCssClass: string = 'd-inline-block mr-1';
        const messageCssClass: string = 'mr-b1 text-light';
        const footerCssClass: string = 'mr-b1';
        return {
            headerText,
            headerCssClass,
            messageText: localeData?.confirm_delete_file,
            messageCssClass,
            footerText: commonLocaleData?.app_permanently_delete_message,
            footerCssClass,
            buttons
        };
    }

    /**
     * This will return the file extension
     *
     * @param {string} path
     * @returns {string}
     * @memberof GeneralService
     */
    public getFileExtension(path: string): string {
        return (path && path.match(/(?:.+..+[^\/]+$)/ig) != null) ? path.split('.').pop() : 'null';
    }

    /**
     * this will store currency code
     *  @param {string} path
     *  @returns {string}
     *  @memberof GeneralService
     */
    public isRtlCurrency(currencyCode: string): boolean {
        const rtlCurrencyCodes = ['AED'];

        if (rtlCurrencyCodes?.indexOf(currencyCode) > -1) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * This will return supported locales
     *
     * @returns {*}
     * @memberof GeneralService
     */
    public getSupportedLocales(): any {
        return [
            { label: 'English', value: 'en' },
            { label: 'Hindi', value: 'hi' },
            { label: 'Marathi', value: 'mr' }
        ];
    }

    /**
     * Returns the array in priority
     *
     * @param {Array<string>} [stockTaxes] Taxes on stock
     * @param {Array<string>} [stockGroupTaxes] Taxes on group to which stock belongs
     * @param {Array<string>} [accountTaxes] Taxes on account that is linked with the stock
     * @param {Array<string>} [accountGroupTaxes] Taxes on group of account that is linked with the stock
     * @returns {Array<string>} Returns the taxes array in priority order
     * @memberof GeneralService
     */
    public fetchTaxesOnPriority(stockTaxes?: Array<string>, stockGroupTaxes?: Array<string>,
        accountTaxes?: Array<string>, accountGroupTaxes?: Array<string>): Array<string> {
        if (stockTaxes?.length) {
            return stockTaxes;
        } else if (stockGroupTaxes?.length) {
            return stockGroupTaxes;
        } else if (accountTaxes?.length) {
            return accountTaxes;
        } else if (accountGroupTaxes?.length) {
            return accountGroupTaxes;
        } else {
            return [];
        }
    }

    /**
     * Returns the string initials upto 2 letters/characters
     *
     * @param {string} name String whose intials are required
     * @param {string} [delimiter] Delimiter to break the strings
     * @return {*} {string} Initials of string
     * @memberof GeneralService
     */
    public getInitialsFromString(name: string, delimiter?: string): string {
        if (name) {
            let nameArray = name.split(delimiter || " ");
            if (nameArray?.length > 1) {
                // Check if "" is not present at 0th and 1st index
                let count = 0;
                let initials = '';
                nameArray.forEach(word => {
                    if (word && count < 2) {
                        initials += ` ${word[0]}`;
                        count++;
                    }
                })
                return initials;
            } else if (nameArray?.length === 1) {
                return nameArray[0][0];
            }
        }
        return '';
    }

    /**
     * Returns the visible menu items to be shown for menu panel (as per permission)
     *
     * @param {string} module name
     * @param {Array<any>} apiItems List of permissible items obtained from API
     * @param {Array<AllItems>} itemList List of all the items of menu
     * @param {string} countryCode
     * @returns {Array<AllItems>}
     * @memberof GeneralService
     */
    public getVisibleMenuItems(module: string, apiItems: Array<any>, itemList: Array<AllItems>, countryCode: string = ""): Array<AllItems> {
        const visibleMenuItems = cloneDeep(itemList);
        let index = 0;
        itemList?.forEach((menuItem, menuIndex) => {
            visibleMenuItems[menuIndex].items = [];

            if (visibleMenuItems[menuIndex]?.additional?.queryParams?.voucherVersion && visibleMenuItems[menuIndex]?.additional?.queryParams?.voucherVersion !== this.voucherApiVersion) {
                visibleMenuItems[menuIndex].hide = true;
            } else {
                visibleMenuItems[menuIndex].itemIndex = index;
                index++;
            }

            menuItem.items?.forEach(item => {
                const isValidItem = apiItems.find(apiItem => apiItem?.uniqueName === item.link);
                if (((isValidItem && item.hide !== module) || (item.alwaysPresent && item.hide !== module)) && (!item.additional?.queryParams?.countrySpecific?.length || item.additional?.queryParams?.countrySpecific?.indexOf(countryCode) > -1) && (!item.additional?.queryParams?.voucherVersion || item.additional?.queryParams?.voucherVersion === this.voucherApiVersion)) {
                    // If items returned from API have the current item which can be shown in branch/company mode, add it
                    visibleMenuItems[menuIndex].items.push(item);
                }
            });
        });
        return visibleMenuItems;
    }

    /**
     * Validates the bank details: Bank Name, Account number, IFSC code.
     * If either of them is provided then the rest two fields are also mandatory
     * as all the 3 values are required for payment purpose. If none of them is provided,
     * then also it is valid. It is invalid when anyone of them is missing and rest
     * are provided
     *
     * @returns {boolean} True, if bank details are valid
     * @memberof GeneralService
     */
    public checkForValidBankDetails(bankDetails: any, countryCode: string): boolean {
        const fieldsWithValue = bankDetails;
        const keys = countryCode === 'AE' ?
            ['beneficiaryName', 'bankName', 'branchName', 'bankAccountNo', 'swiftCode'] :
            ['bankName', 'bankAccountNo', 'ifsc'];
        let isValid = true;
        if (fieldsWithValue) {
            isValid = keys.every(key => Boolean(fieldsWithValue[key])) || keys.every(key => !Boolean(fieldsWithValue[key]));
            return isValid;
        } else {
            return isValid;
        }
    }

    /**
     * Navigates to the route provided
     *
     * @param {*} route Route to navigate to
     * @param {*} [parameter] Route params
     * @param {*} [isSocialLogin] To Reload page
     * @memberof GeneralService
     */
    public finalNavigate(route: any, parameter?: any, isSocialLogin?: boolean): void {
        let isQueryParams: boolean;
        if (route.includes('?')) {
            parameter = parameter || {};
            isQueryParams = true;
            const splittedRoute = route.split('?');
            route = splittedRoute[0];
            const paramString = splittedRoute[1];
            const params = paramString?.split('&');
            params?.forEach(param => {
                const [key, value] = param.split('=');
                parameter[key] = value;
            });
        }
        if (isQueryParams) {
            this.router.navigate([route], { queryParams: parameter });
        } else {
            this.router.navigate([route], parameter);
        }
        if (isElectron && isSocialLogin) {
            setTimeout(() => {
                window.location.reload();
            }, 200);
        }
    }

    /**
     * This will give multi-lingual current voucher label
     *
     * @param {string} voucherCode Voucher code
     * @param {*} commonLocaleData Global context of multi-lingual keys
     * @return {string} Multi-lingual current voucher label
     * @memberof GeneralService
     */
    public getCurrentVoucherLabel(voucherCode: string, commonLocaleData: any): string {
        switch (voucherCode) {
            case AdjustedVoucherType.Sales: case AdjustedVoucherType.SalesInvoice: return commonLocaleData?.app_voucher_types.sales;
            case AdjustedVoucherType.Purchase: case AdjustedVoucherType.PurchaseInvoice: return commonLocaleData?.app_voucher_types.purchase;
            case AdjustedVoucherType.CreditNote: return commonLocaleData?.app_voucher_types.credit_note;
            case AdjustedVoucherType.DebitNote: return commonLocaleData?.app_voucher_types.debit_note;
            case AdjustedVoucherType.Payment: return commonLocaleData?.app_voucher_types.payment;
            case AdjustedVoucherType.Journal: return commonLocaleData?.app_voucher_types.journal;
            default: return '';
        }
    }

    /**
     * Determines if an element is child element to another element
     *
     * @param {*} child Element received as child
     * @param {*} parent Element received as parent
     * @return {boolean} True, if element is child of another element
     * @memberof GeneralService
     */
    public childOf(child: any, parent: any): boolean {
        while ((child = child.parentNode) && child !== parent) {
        }
        return !!child;
    }

    /**
     * This will sort branches by alias
     *
     * @param {*} branchA
     * @param {*} branchB
     * @returns {*}
     * @memberof CompanyBranchComponent
     */
    public sortBranches(branchA: any, branchB: any): any {
        let regexA = /[^a-zA-Z]/g;
        let regexN = /[^0-9]/g;

        let branchAInt = parseInt(branchA?.alias, 10);
        let branchBInt = parseInt(branchB?.alias, 10);

        if (isNaN(branchAInt) && isNaN(branchBInt)) {
            let branchAOutput = branchA?.alias?.toLowerCase()?.replace(regexA, "");
            let branchBOutput = branchB?.alias?.toLowerCase()?.replace(regexA, "");
            if (branchAOutput === branchBOutput) {
                let branchANumeric = parseInt(branchA?.alias?.toLowerCase()?.replace(regexN, ""), 10);
                let branchBNumeric = parseInt(branchB?.alias?.toLowerCase()?.replace(regexN, ""), 10);
                return branchANumeric === branchBNumeric ? 0 : branchANumeric > branchBNumeric ? 1 : -1;
            } else {
                return branchAOutput > branchBOutput ? 1 : -1;
            }
        } else if (isNaN(branchAInt)) { //A is not an Int
            return 1; //to make alphanumeric sort first return -1 here
        } else if (isNaN(branchBInt)) { //B is not an Int
            return -1; //to make alphanumeric sort first return 1 here
        } else {
            return branchAInt > branchBInt ? 1 : -1;
        }
    }

    /**
     * This will expand left sidebar
     *
     * @memberof GeneralService
     */
    public expandSidebar(): void {
        const isAccountModalOpened = document.querySelector('.create-acc-form');
        if (!isAccountModalOpened) {
            document.querySelector('.primary-sidebar')?.classList?.remove('sidebar-collapse');
            document.querySelector('.nav-left-bar')?.classList?.remove('width-60');
        }
    }

    /**
     * This will collapse left sidebar
     *
     * @memberof GeneralService
     */
    public collapseSidebar(): void {
        document.querySelector('.primary-sidebar')?.classList?.add('sidebar-collapse');
        document.querySelector('.nav-left-bar')?.classList?.add('width-60');
    }

    /**
     * Adds voucher version to request's URL
     *
     * @param {string} url API URL
     * @param {number} voucherVersion Company voucher version
     * @memberof GeneralService
     */
    public addVoucherVersion(url: string, voucherVersion: number): string {
        const delimiter = url.includes('?') ? '&' : '?';
        return url.concat(`${delimiter}voucherVersion=${voucherVersion}`);
    }

    /**
     * This will remove special characters and spaces from amount
     *
     * @param {string} amount
     * @returns {string}
     * @memberof GeneralService
     */
    public removeSpecialCharactersFromAmount(amount: any): string {
        amount = amount?.toString();
        return amount?.replace(/,/g, "")?.replace(/ /g, "")?.replace(/'/g, "").trim();
    }

    /**
     * This will return available themes
     *
     * @returns {*}
     * @memberof GeneralService
     */
    public getAvailableThemes(): any {
        return [
            { label: 'Default', value: 'default-theme' },
            { label: 'Dark', value: 'dark-theme' }
        ];
    }

    /*
     * Adds tooltip text for grand total and total due amount
     * to item supplied (for Cash/Sales Invoice and CR/DR note)
     *
     * @private
     * @param {ReceiptItem} item Receipt item received from service
     * @returns {*} Modified item with tooltup text for grand total and total due amount
     * @memberof GeneralService
     */
    public addToolTipText(selectedVoucher: any, baseCurrency: string, item: any, localeData: any, commonLocaleData: any, giddhBalanceDecimalPlaces: number): any {
        try {
            let balanceDueAmountForCompany, balanceDueAmountForAccount, grandTotalAmountForCompany,
                grandTotalAmountForAccount;

            if (item && item.totalBalance && item.totalBalance.amountForCompany !== undefined && item.totalBalance.amountForAccount !== undefined) {
                balanceDueAmountForCompany = Number(item.totalBalance.amountForCompany) || 0;
                balanceDueAmountForAccount = Number(item.totalBalance.amountForAccount) || 0;
            }
            if ([VoucherTypeEnum.sales, VoucherTypeEnum.creditNote, VoucherTypeEnum.debitNote, VoucherTypeEnum.purchase, VoucherTypeEnum.receipt, VoucherTypeEnum.payment, VoucherTypeEnum.purchaseOrder]?.indexOf(selectedVoucher) > -1 && item.grandTotal) {
                grandTotalAmountForCompany = Number(item.grandTotal.amountForCompany) || 0;
                grandTotalAmountForAccount = Number(item.grandTotal.amountForAccount) || 0;
            }


            let grandTotalConversionRate = 0, balanceDueAmountConversionRate = 0;
            if (this.voucherApiVersion === 2) {
                grandTotalConversionRate = item.exchangeRate ?? 1;
            } else if (grandTotalAmountForCompany && grandTotalAmountForAccount) {
                grandTotalConversionRate = +((grandTotalAmountForCompany / grandTotalAmountForAccount) || 0).toFixed(giddhBalanceDecimalPlaces);
            }
            if (balanceDueAmountForCompany && balanceDueAmountForAccount) {
                balanceDueAmountConversionRate = +((balanceDueAmountForCompany / balanceDueAmountForAccount) || 0).toFixed(giddhBalanceDecimalPlaces);
                if (this.voucherApiVersion !== 2) {
                    item.exchangeRate = balanceDueAmountConversionRate;
                }
            }
            let text = localeData?.currency_conversion;
            let grandTotalTooltipText = text?.replace("[BASE_CURRENCY]", baseCurrency)?.replace("[AMOUNT]", grandTotalAmountForCompany)?.replace("[CONVERSION_RATE]", grandTotalConversionRate);
            let balanceDueTooltipText;
            if (enableVoucherAdjustmentMultiCurrency && item.gainLoss) {
                const gainLossText = localeData?.exchange_gain_loss_label?.
                    replace("[BASE_CURRENCY]", baseCurrency)?.
                    replace("[AMOUNT]", balanceDueAmountForCompany)?.
                    replace('[PROFIT_TYPE]', item.gainLoss > 0 ? commonLocaleData?.app_exchange_gain : commonLocaleData?.app_exchange_loss);
                balanceDueTooltipText = `${gainLossText}: ${Math.abs(item.gainLoss)}`;
            } else {
                balanceDueTooltipText = text?.replace("[BASE_CURRENCY]", baseCurrency)?.replace("[AMOUNT]", balanceDueAmountForCompany)?.replace("[CONVERSION_RATE]", balanceDueAmountConversionRate);
            }

            item['grandTotalTooltipText'] = grandTotalTooltipText;
            item['balanceDueTooltipText'] = balanceDueTooltipText;
        } catch (error) {
        }
        return item;
    }

    /**
     * This returns voucher number
     *
     * @private
     * @param {*} item
     * @returns {*}
     * @memberof GeneralService
     */
    public getVoucherNumberLabel(voucherType: string, voucherNumber: any, commonLocaleData: any): any {
        if ((voucherType === "pur" || voucherType === VoucherTypeEnum.purchase) && (!voucherNumber || voucherNumber === "-")) {
            voucherNumber = commonLocaleData?.app_not_available;
        } else if (!voucherNumber) {
            voucherNumber = "-";
        }

        return voucherNumber;
    }
    /**
     * This will use for convert V1 response to V2 version
     *
     * @param {*} data
     * @return {*}  {*}
     * @memberof GeneralService
     */
    public convertV1ResponseInV2(data: any): any {
        if (data?.company?.billingDetails?.taxNumber) {
        }
        return data;
    }

    /**
     * To check if it's receipt/payment entry
     *
     * @param {*} ledgerAccount
     * @param {*} entryAccount
     * @param {*} [voucherType]
     * @returns {boolean}
     * @memberof GeneralService
     */
    public isReceiptPaymentEntry(ledgerAccount: any, entryAccount: any, voucherType?: any): boolean {
        if (entryAccount?.parentGroups?.length > 0 && !entryAccount?.parentGroups[0]?.uniqueName) {
            entryAccount.parentGroups = entryAccount?.parentGroups?.map(group => {
                return {
                    uniqueName: group
                }
            });
        }
        if (
            this.voucherApiVersion === 2
            && entryAccount?.parentGroups?.length > 1 && ledgerAccount?.parentGroups?.length > 1 &&
            (((ledgerAccount?.parentGroups[1]?.uniqueName === 'sundrydebtors' || ledgerAccount?.parentGroups[1]?.uniqueName === 'sundrycreditors') && (entryAccount?.parentGroups[1]?.uniqueName === VoucherTypeEnum.cash || entryAccount?.parentGroups[1]?.uniqueName === 'bankaccounts' || (this.voucherApiVersion === 2 && entryAccount?.parentGroups[1]?.uniqueName === 'loanandoverdraft')))
                ||
                ((ledgerAccount?.parentGroups[1]?.uniqueName === VoucherTypeEnum.cash || ledgerAccount?.parentGroups[1]?.uniqueName === 'bankaccounts' || (this.voucherApiVersion === 2 && ledgerAccount?.parentGroups[1]?.uniqueName === 'loanandoverdraft')) && (entryAccount?.parentGroups[1]?.uniqueName === 'sundrydebtors' || entryAccount?.parentGroups[1]?.uniqueName === 'sundrycreditors')))
            &&
            (!voucherType || (["rcpt", "pay", "advance-receipt"].includes(voucherType)))
        ) {
            return true;
        }

        return false;
    }

    /**
     * Returns other tax amount for receipt/payment
     *
     * @param {string} tcsCalculationMethod
     * @param {number} totalAmount
     * @param {*} mainTaxPercentage
     * @param {*} tdsTaxPercentage
     * @param {*} tcsTaxPercentage
     * @returns {number}
     * @memberof GeneralService
     */
    public getReceiptPaymentOtherTaxAmount(tcsCalculationMethod: string, totalAmount: number, mainTaxPercentage: any, tdsTaxPercentage: any, tcsTaxPercentage: any): number {
        let taxableValue = 0;

        if (tcsCalculationMethod === SalesOtherTaxesCalculationMethodEnum.OnTaxableAmount) {
            if (tdsTaxPercentage) {
                //Advance Received/1+{(Rate of GST - Rate of TDS)/100}
                taxableValue = totalAmount / (1 + ((mainTaxPercentage - tdsTaxPercentage) / 100));
            } else if (tcsTaxPercentage) {
                //Advance Received/1+{(Rate of GST + Rate of TCS)/100}
                taxableValue = totalAmount / (1 + ((mainTaxPercentage + tcsTaxPercentage) / 100));
            }
        } else if (tcsCalculationMethod === SalesOtherTaxesCalculationMethodEnum.OnTotalAmount) {
            if (tdsTaxPercentage) {
                //{[{Advance received/(100-TDS Rate)}*100]/(100+GST rate)}*100
                taxableValue = (((totalAmount / (100 - tdsTaxPercentage)) * 100) / (100 + mainTaxPercentage)) * 100;
            } else if (tcsTaxPercentage) {
                //{[{Advance received/(100+TCS Rate)}*100]/(100+GST rate)}*100
                taxableValue = (((totalAmount / (100 + tcsTaxPercentage)) * 100) / (100 + mainTaxPercentage)) * 100;
            }
        }
        return taxableValue;
    }

    /**
     * Adds class from the dropdown list item
     *
     * @param {HTMLElement} dropdownListItem
     * @memberof GeneralService
     */
    public dropdownFocusIn(dropdownListItem: HTMLElement): void {
        dropdownListItem.classList.add('custom-keyboard-dropdown-list-focus');
    }

    /**
     * Removes class from the dropdown list item
     *
     * @param {HTMLElement} dropdownListItem
     * @memberof GeneralService
     */
    public dropdownFocusOut(dropdownListItem: HTMLElement): void {
        dropdownListItem.classList.remove('custom-keyboard-dropdown-list-focus');
    }

    /**
     * Adds link tag
     *
     * @param {string} path
     * @memberof GeneralService
     */
    public addLinkTag(path: string): void {
        let linkTag = document.createElement('link');
        linkTag.href = path;
        linkTag.rel = 'stylesheet';
        linkTag.crossOrigin = "anonymous";
        linkTag.as = "style";
        document.body.appendChild(linkTag);
    }

    /**
     * Returns true if css is loaded else false
     *
     * @param {string} path
     * @returns {boolean}
     * @memberof GeneralService
     */
    public checkIfCssExists(path: string): boolean {
        let found = false;
        for (let i = 0; i < document.styleSheets?.length; i++) {
            if (document.styleSheets[i]?.href == path) {
                found = true;
                break;
            }
        }
        return found;
    }

    /**
     * This will add object in array if doesn't exists
     *
     * @param {any[]} array
     * @param {*} value
     * @returns {Array<string>}
     * @memberof GeneralService
     */
    public addObjectInArray(array: any[], value: any): Array<string> {
        let exists = false;
        if (array && array.length > 0) {
            array.forEach(item => {
                if (item?.poUniqueName === value?.poUniqueName) {
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
     * This will check if object exists in array
     *
     * @param {any[]} array
     * @param {*} value
     * @returns {boolean}
     * @memberof GeneralService
     */
    public checkIfObjectExistsInArray(array: any[], value: any): boolean {
        let exists = false;

        if (array && array.length > 0) {
            array.forEach(item => {
                if (item?.poUniqueName === value?.poUniqueName) {
                    exists = true;
                }
            });
        }

        return exists;
    }

    /**
     * This will remove object from array
     *
     * @param {any[]} array
     * @param {*} value
     * @returns {Array<string>}
     * @memberof GeneralService
     */
    public removeObjectFromArray(array: any[], value: any): Array<string> {
        let index = -1;
        if (array && array.length > 0) {
            let loop = 0;
            array.forEach(item => {
                if (item?.poUniqueName === value?.poUniqueName) {
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
     * Set parameter in local storage
     *
     * @param {*} key
     * @param {*} value
     * @memberof GeneralService
     */
    public setParameterInLocalStorage(key: any, value: any): void {
        localStorage.setItem(key, value);
    }

    /**
     * Removes parameter from local storage
     *
     * @param {*} key
     * @memberof GeneralService
     */
    public removeLocalStorageParameter(key: any): void {
        localStorage.removeItem(key);
    }

    /**
     * Gets parameter from url
     *
     * @param {*} sParam
     * @returns {*}
     * @memberof GeneralService
     */
    public getUrlParameter(sParam: any): any {
        let sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : this.removeProtocol(decodeURIComponent(sParameterName[1]));
            }
        }
        return false;
    }

    /**
     * Removes protocol from url
     *
     * @param {string} url
     * @returns {string}
     * @memberof GeneralService
     */
    public removeProtocol(url: string): string {
        url = url.replace("https://", "");
        url = url.replace("http://", "");
        return url;
    }

    /**
     * Returns the formatted tax list based on the taxes applied
     * on any account, it is required when tax component is not rendered
     * in the UI. Currently, the tax component calculates the formatted tax
     * list and then provides the same to the parent component. With this
     * implementation, we no longer need to rely on tax component.
     *
     * @param {ITaxUtilRequest} requestObj Request object for formatting
     * @return {Array<ITaxControlData>} Formatted list of taxes
     * @memberof GeneralService
     */
    public getTaxValues(requestObj: ITaxUtilRequest): Array<ITaxControlData> {
        let {
            customTaxTypesForTaxFilter,
            taxes,
            exceptTaxTypes,
            taxRenderData,
            applicableTaxes,
            date
        } = requestObj;
        if (customTaxTypesForTaxFilter && customTaxTypesForTaxFilter.length) {
            taxes = taxes?.filter(f => customTaxTypesForTaxFilter.includes(f.taxType));
        }
        if (exceptTaxTypes && exceptTaxTypes.length) {
            taxes = taxes?.filter(f => !exceptTaxTypes.includes(f.taxType));
        }
        taxes.map(tax => {
            let index = taxRenderData?.findIndex(f => f?.uniqueName === tax?.uniqueName);
            // if tax is already prepared then only check if it's checked or not on basis of applicable taxes
            if (index > -1) {
                taxRenderData[index].isChecked =
                    applicableTaxes && applicableTaxes.length ? applicableTaxes.some(item => item === tax?.uniqueName) :
                        taxRenderData[index].isChecked ? taxRenderData[index].isChecked : false;
                if (date && tax.taxDetail && tax.taxDetail.length) {
                    taxRenderData[index].amount =
                        (dayjs(tax.taxDetail[0].date, GIDDH_DATE_FORMAT).isSame(dayjs(date, GIDDH_DATE_FORMAT)) || dayjs(tax.taxDetail[0].date, GIDDH_DATE_FORMAT) < dayjs(date, GIDDH_DATE_FORMAT)) ?
                            tax.taxDetail[0].taxValue : 0;
                }
            } else {
                let taxObj = new ITaxControlData();
                taxObj.name = tax.name;
                taxObj.uniqueName = tax?.uniqueName;
                taxObj.type = tax.taxType;

                if (date) {
                    date = (typeof date === "object") ? dayjs(date).format(GIDDH_DATE_FORMAT) : date;
                    let taxObject = orderBy(tax.taxDetail, (p: ITaxDetail) => {
                        return dayjs(p.date, GIDDH_DATE_FORMAT);
                    }, 'desc');
                    let exactDate = taxObject?.filter(p => dayjs(p.date, GIDDH_DATE_FORMAT).isSame(dayjs(date, GIDDH_DATE_FORMAT)));
                    if (exactDate?.length > 0) {
                        taxObj.amount = exactDate[0].taxValue;
                    } else {
                        let filteredTaxObject = taxObject?.filter(p => dayjs(p.date, GIDDH_DATE_FORMAT) < dayjs(date, GIDDH_DATE_FORMAT));
                        if (filteredTaxObject?.length > 0) {
                            taxObj.amount = filteredTaxObject[0].taxValue;
                        } else {
                            taxObj.amount = 0;
                        }
                    }
                } else {
                    taxObj.amount = tax.taxDetail[0].taxValue;
                }
                taxObj.isChecked = applicableTaxes && applicableTaxes.length ? applicableTaxes.some(s => s === tax?.uniqueName) : false;

                taxObj.isDisabled = false;
                taxRenderData.push(taxObj);
            }
        });
        if (taxRenderData?.length) {
            taxRenderData.sort((firstTax, secondTax) => (firstTax.isChecked === secondTax.isChecked ? 0 : firstTax.isChecked ? -1 : 1));
        }
        return taxRenderData;
    }

    /**
     * Returns the formatted discount list based on the discountes applied
     * on any account, it is required when discount component is not rendered
     * in the UI. Currently, the discount component calculates the formatted discount
     * list and then provides the same to the parent component. With this
     * implementation, we no longer need to rely on discount component.
     *
     * @param {IDiscountUtilRequest} requestObj Request object for formatting
     * @return {Array<LedgerDiscountClass>} Formatted list of discounts
     * @memberof GeneralService
     */
    public getDiscountValues(requestObj: IDiscountUtilRequest): Array<LedgerDiscountClass> {
        let {
            discountsList,
            discountAccountsDetails
        } = requestObj;
        discountsList.forEach(acc => {
            if (discountAccountsDetails) {
                let hasItem = discountAccountsDetails.some(s => s.discountUniqueName === acc?.uniqueName || s.uniqueName === acc?.uniqueName);
                if (!hasItem) {
                    let obj: LedgerDiscountClass = new LedgerDiscountClass();
                    obj.amount = acc.discountValue;
                    obj.discountValue = acc.discountValue;
                    obj.discountType = acc.discountType;
                    obj.isActive = false;
                    obj.particular = acc.linkAccount?.uniqueName;
                    obj.discountUniqueName = acc?.uniqueName;
                    obj.name = acc.name;
                    discountAccountsDetails.push(obj);
                }
            } else {
                discountAccountsDetails = [];
            }
        });
        return discountAccountsDetails;
    }

    /**
     * swap array elements
     *
     * @param {*} arr
     * @param {number} i
     * @param {number} j
     * @memberof GeneralService
     */
    public swap(arr: any, i: number, j: number): void {
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    /**
     * generate permutations of array
     *
     * @param {*} arr
     * @param {number} [start=0]
     * @param {*} [result=[]]
     * @returns {*}
     * @memberof GeneralService
     */
    public generatePermutations(arr: any, start = 0, result = []): any {
        if (start === arr.length - 1) {
            result.push([...arr]);
            return;
        }

        for (let i = start; i < arr.length; i++) {
            this.swap(arr, start, i);
            this.generatePermutations(arr, start + 1, result);
            this.swap(arr, start, i); // backtrack
        }

        return result;
    }

    /**
     * Reads the selected file and returns blob
     *
     * @param {*} file
     * @param {Function} callback
     * @memberof GeneralService
     */
    public getSelectedFile(file: any, callback: Function): void {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = () => {
            const blob = new Blob([reader.result], { type: file.type });
            callback(blob, file);
        };
    }

    /**
     * Reads the selected file and returns base64
     *
     * @param {*} file
     * @param {Function} callback
     * @memberof GeneralService
     */
    public getSelectedFileBase64(file: any, callback: Function): void {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            callback(reader.result);
        };
    }

    /**
     * Check if is cidr range
     *
     * @param {string} cidr
     * @return {*}  {boolean}
     * @memberof GeneralService
     */
    public isCidr(cidr: string): boolean {
        return (/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/([0-9]|[1-2][0-9]|3[0-2]))?$/g).test(cidr);
    };

    /**
     * Check pattern for matching with dash (-) , characters and numbers
     *
     * @param {string} checkDashCharacterNumberPattern
     * @return {*}  {boolean}
     * @memberof GeneralService
     */
    public checkDashCharacterNumberPattern(value: string): boolean {
        let checkPattern = new RegExp("^[A-Za-z0-9-]+$");
        return checkPattern.test(value);
    };

    /**
     * Get current date/time in this format - 06-11-2023 02:08:45
     *
     * @returns {string}
     * @memberof GeneralService
     */
    public getCurrentDateTime(): string {
        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    }

    /**
     * This will be use for generating random URLs
     *
     * @param {string} value
     * @return {*}  {string}
     * @memberof GeneralService
     */
    public generateRandomString(value: string): string {
        const randomLength = 8; // Adjust the length of the random string as needed
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < randomLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }
        return result + '.' + value;
    }

    /**
     * Returns configuration for printer selection
     *
     * @param {any[]} printers
     * @param {*} commonLocaleData
     * @returns {ConfirmationModalConfiguration}
     * @memberof GeneralService
     */
    public getPrinterSelectionConfiguration(printers: any[], commonLocaleData: any): ConfirmationModalConfiguration {
        const buttons: Array<ConfirmationModalButton> = [];
        printers?.forEach(printer => {
            buttons.push({
                text: printer,
                color: 'primary',
                cssClass: 'button-no-background'
            });
        });

        const headerText: string = commonLocaleData?.app_select_printer;
        const headerCssClass: string = 'd-inline-block mr-1';
        const messageCssClass: string = 'mr-b1 text-light';
        const footerCssClass: string = 'mr-b1';
        const disableRipple: boolean = true;
        return {
            headerText,
            headerCssClass,
            messageText: '',
            messageCssClass,
            footerText: '',
            footerCssClass,
            disableRipple,
            buttons
        };
    }

    /**
     * Returns Operating system
     *
     * @returns {SUPPORTED_OPERATING_SYSTEMS}
     * @memberof GeneralService
     */
    public getOperatingSystem(): SUPPORTED_OPERATING_SYSTEMS {
        const platform = window.navigator.userAgent.toLowerCase(),
            macosPlatforms = /(macintosh|macintel|macppc|mac68k|macos)/i,
            windowsPlatforms = /(win32|win64|windows|wince)/i;
        let operatingSystem = null;

        if (macosPlatforms.test(platform)) {
            operatingSystem = SUPPORTED_OPERATING_SYSTEMS.MacOS;
        } else if (windowsPlatforms.test(platform)) {
            operatingSystem = SUPPORTED_OPERATING_SYSTEMS.Windows;
        }

        return operatingSystem;
    }

    /**
     * Check if a given country name is included in the array of supported countries for Plaid, and return a boolean value
     * indicating whether the country is supported or not.
     *
     * @param {string} countryName
     * @returns {boolean}
     * @memberof GeneralService
     */
    public checkCompanySupportPlaid(countryName: string): boolean {
        const plaidSupportedCountryList = ['UNITED KINGDOM', 'GERMANY', 'FRANCE', 'NETHERLANDS', 'IRELAND', 'SPAIN', 'SWEDEN', 'DENMARK', 'POLAND', 'PORTUGAL', 'ITALY', 'LITHUANIA', 'LATVIA', 'ESTONIA', 'NORWAY', 'BELGIUM', 'UNITED STATES OF AMERICA', 'CANADA'];

        return plaidSupportedCountryList.includes(countryName.toUpperCase());
    }

    /**
    * Check if a given country code is included in the array of supported countries for Gocardless, and return a boolean value
    * indicating whether the country is supported or not.
    *
    * @param {string} countryCode
    * @returns {boolean}
    * @memberof GeneralService
    */
    public checkCompanySupportGoCardless(countryCode: string): boolean {
        const gocardlessSupportedCountryCodeList = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IE', 'IT', 'LV', 'LI', 'LT', 'LU', 'MT', 'NL', 'NO', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB'];
        return gocardlessSupportedCountryCodeList.includes(countryCode);
    }

    /**
     * This will return the system current user time zone
     *
     * @return {*}
     * @memberof GeneralService
     */
    public getUserTimeZone(): any {
        let offset = new Date().getTimezoneOffset(), o = Math.abs(offset);
        return (offset < 0 ? "+" : "-") + ("00" + Math.floor(o / 60)).slice(-2) + ":" + ("00" + (o % 60)).slice(-2);
    }

    /**
     * Retrieves the operating system configuration based on the user agent string.
     *
     * @returns {string} The name of the operating system.
     * @memberof GeneralService
     */
    public getOsConfiguration(): string {
        const userAgent = window.navigator.userAgent;
        let osName;

        if (userAgent.indexOf("Win") !== -1) {
            osName = "Windows";
        } else if (userAgent.indexOf("Mac") !== -1) {
            osName = "Macintosh";
        } else if (userAgent.indexOf("Linux") !== -1) {
            osName = "Linux";
        } else if (userAgent.indexOf("Android") !== -1) {
            osName = "Android";
        } else if (userAgent.indexOf("iOS") !== -1) {
            osName = "iOS";
        } else {
            osName = "Unknown";
        }

        return osName;
    }

    /**
     * Retrieves the device manufacturer based on the user agent string.
     *
     * @returns {string} The device manufacturer.
     * @memberof GeneralService
     */
    public getDeviceManufacture(): string {
        const userAgent = window.navigator.userAgent;
        let deviceManufacture = 'Unknown';

        if (userAgent.indexOf('iPhone') !== -1 || userAgent.indexOf('iPad') !== -1) {
            deviceManufacture = 'Apple';
        } else if (userAgent.indexOf('Android') !== -1) {
            deviceManufacture = 'Samsung'; // Assuming Samsung for Android, could be any Android device manufacturer
        } // Add additional checks for other common devices if needed

        return deviceManufacture;
    }

    /**
     * Retrieves the current timestamp in ISO format.
     *
     * @returns {string} The current timestamp.
     * @memberof GeneralService
     */
    public getTimeStamp(): any {
        const timestamp = new Date().toISOString();
        return timestamp;
    }

    /**
     * Retrieves the device model based on the user agent string.
     *
     * @returns {string} The device model.
     * @memberof GeneralService
     */
    public getDeviceModel(): string {
        const userAgent = window.navigator.userAgent;
        let deviceModel = 'Unknown';

        if (userAgent.indexOf('iPhone') !== -1) {
            // Extracting iPhone model from user agent string (Example: "iPhone12,1")
            const match = userAgent.match(/iPhone([\d,_]+)/);
            if (match && match.length > 1) {
                deviceModel = match[1].replace(/_/g, '.'); // Replacing underscores with dots
            }
        } else if (userAgent.indexOf('iPad') !== -1) {
            // Extracting iPad model from user agent string (Example: "iPad11,1")
            const match = userAgent.match(/iPad([\d,_]+)/);
            if (match && match.length > 1) {
                deviceModel = match[1].replace(/_/g, '.'); // Replacing underscores with dots
            }
        } else if (userAgent.indexOf('Android') !== -1) {
            // Example of assuming device model for Android devices
            deviceModel = 'Unknown'; // This might vary significantly
        } // Add additional checks for other common devices if needed

        return deviceModel;
    }

    /**
     * Retrieves the operating system family based on the user agent string.
     *
     * @returns {string} The operating system family.
     * @memberof GeneralService
     */
    public getOSFamily(): string {
        const userAgent = window.navigator.userAgent;
        let osFamily = 'Unknown';

        if (userAgent.indexOf('Windows') !== -1) {
            osFamily = 'Windows';
        } else if (userAgent.indexOf('Macintosh') !== -1) {
            osFamily = 'Macintosh';
        } else if (userAgent.indexOf('Linux') !== -1) {
            osFamily = 'Linux';
        } else if (userAgent.indexOf('Android') !== -1) {
            osFamily = 'Android';
        } else if (userAgent.indexOf('iPhone') !== -1 || userAgent.indexOf('iPad') !== -1) {
            osFamily = 'iOS';
        } // Add additional checks for other OS families if needed

        return osFamily;
    }

    /**
     * Retrieves the operating system version based on the user agent string.
     *
     * @returns {string} The operating system version.
     * @memberof GeneralService
     */
    public getOSVersion(): string {
        const userAgent = window.navigator.userAgent;
        let osVersion = 'Unknown';

        if (userAgent.indexOf('Windows NT') !== -1) {
            osVersion = this.extractWindowsVersion(userAgent);
        } else if (userAgent.indexOf('Mac OS X') !== -1) {
            osVersion = this.extractMacOSVersion(userAgent);
        } else if (userAgent.indexOf('Android') !== -1) {
            osVersion = this.extractAndroidVersion(userAgent);
        } else if (userAgent.indexOf('iPhone') !== -1 || userAgent.indexOf('iPad') !== -1) {
            osVersion = this.extractiOSVersion(userAgent);
        } // Add additional checks for Linux, etc. if needed

        return osVersion;
    }

    /**
     * Extracts the Windows version from the user agent string.
     *
     * @param {string} userAgent - The user agent string.
     * @returns {string} The Windows version.
     * @memberof GeneralService
     */
    public extractWindowsVersion(userAgent: string): string {
        // Example: "Windows NT 10.0"
        const startIndex = userAgent.indexOf('Windows NT');
        if (startIndex !== -1) {
            return userAgent.substring(startIndex + 11, userAgent.indexOf(';', startIndex));
        } else {
            return 'Unknown';
        }
    }

    /**
     * Extracts the macOS version from the user agent string.
     *
     * @param {string} userAgent - The user agent string.
     * @returns {string} The macOS version.
     * @memberof GeneralService
     */
    public extractMacOSVersion(userAgent: string): string {
        // Example: "Mac OS X 10_15_7"
        const startIndex = userAgent.indexOf('Mac OS X');
        if (startIndex !== -1) {
            return userAgent.substring(startIndex + 9, userAgent.indexOf(')', startIndex)).replace(/_/g, '.');
        } else {
            return 'Unknown';
        }
    }

    /**
     * Extracts the Android version from the user agent string.
     *
     * @param {string} userAgent - The user agent string.
     * @returns {string} The Android version.
     * @memberof GeneralService
     */
    public extractAndroidVersion(userAgent: string): string {
        // Example: "Android 10"
        const startIndex = userAgent.indexOf('Android');
        if (startIndex !== -1) {
            return userAgent.substring(startIndex + 8, userAgent.indexOf(';', startIndex));
        } else {
            return 'Unknown';
        }
    }

    /**
    * Extracts the OS version from the user agent string.
    *
    * @param {string} userAgent - The user agent string.
    * @returns {string} The Android version.
    * @memberof GeneralService
    */
    public extractiOSVersion(userAgent: string): string {
        // Example: "iPhone OS 14_4"
        const startIndex = userAgent.indexOf('iPhone OS');
        if (startIndex !== -1) {
            return userAgent.substring(startIndex + 10, userAgent.indexOf(';', startIndex)).replace(/_/g, '.');
        } else {
            return 'Unknown';
        }
    }

    /**
     * Get Client Screen Size (width, height,scaling-factor
     * and colour-depth) in single string
     *
     * @returns {string}
     * @memberof GeneralService
     */
    public getClientScreens(): string {
        const screen = window.screen;
        return `width=${screen.width}&height=${screen.height}&scaling-factor=${window.devicePixelRatio}&colour-depth=${screen.colorDepth}`;
    }

    /**
     * Get Client Window Size (width and height) in single string
     *
     * @returns {string}
     * @memberof GeneralService
     */
    public getClientWindowSize(): string {
        return `width=${window.innerWidth}&height=${window.innerHeight}`;
    }

    /**
     * This will be use for get user agent
     *
     * @param {*} clientIp
     * @return {*}
     * @memberof GeneralService
     */
    public getUserAgentData(): any {
        let args: any = {};
        args["timestamp"] = this.getTimeStamp();
        args["Gov-Client-Timezone"] = 'UTC' + this.getUserTimeZone();
        args["Gov-client-screens"] = this.getClientScreens();
        args["Gov-client-window-size"] = this.getClientWindowSize();
        return args;
    }

    /**
     *This will return the client IP address
     *
     * @memberof GeneralService
     */
    public getClientIp(): Observable<any> {
        return this.http.get<any>(MOBILE_NUMBER_SELF_URL);
    }

    /**
    * This will be use for open window in center
    *
    * @param {string} url
    * @param {string} title
    * @param {number} width
    * @param {number} height
    * @return {*}  {(Window | null)}
    * @memberof GeneralService
    */
    public openCenteredWindow(url: string, title: string, width: number, height: number): Window | null {
        const left = (window.screen.width / 2) - (width / 2);
        const top = (window.screen.height / 2) - (height / 2);

        // Open the window and return the reference
        return window.open(
            url,
            title,
            `width=${width},height=${height},top=${top},left=${left}`
        );
    }

    /**
    * Get Country Flag Image Url by 2 digit country code
    *
    * @param {string} countryCode
    * @return {*}  {string}
    * @memberof GeneralService
    */
    public getCountryFlagUrl(countryCode: string): string {
        return countryCode ? `https://giddh-uploads-2.s3.ap-south-1.amazonaws.com/flags/${countryCode?.toLowerCase()}.svg` : '';
    }

    /**
     *This will be use for get complete address information
     *
     * @param {*} addr
     * @return {*}  {string}
     * @memberof GeneralService
     */
    public getCompleteAddress(addr: any): string {
        // Check each property and assign to a variable with a fallback to empty string
        let address1 = addr?.bno ? addr.bno : '';
        let address2 = addr?.bnm ? addr.bnm : '';
        let address3 = addr?.st ? addr.st : '';
        let address4 = addr?.landMark ? addr.landMark : '';
        let address5 = addr?.loc ? addr.loc : '';

        // Construct the complete address string
        return `${address1} ${address2} ${address3} ${address4} ${address5}`.trim();
    }

    /**
     * This will be use for delete inventory adjust configuration
     *
     * @param {*} localeData
     * @param {*} commonLocaleData
     * @return {*}  {ConfirmationModalConfiguration}
     * @memberof GeneralService
     */
    public deleteInventoryAdjustAdjustConfiguration(localeData: any, commonLocaleData: any): ConfirmationModalConfiguration {

        const buttons: Array<ConfirmationModalButton> = [{
            text: commonLocaleData?.app_yes,
            color: 'primary'
        },
        {
            text: commonLocaleData?.app_no
        }];
        const headerText: string = commonLocaleData?.app_confirmation;
        const headerCssClass: string = 'd-inline-block mr-1';
        const messageCssClass: string = 'mr-b1 text-light';
        const footerCssClass: string = 'mr-b1';
        return {
            headerText,
            headerCssClass,
            messageText: localeData?.delete_confirmation_message,
            messageCssClass,
            footerText: localeData?.delete_message1,
            footerCssClass,
            buttons
        };
    }

    /**
     *  Delete sessions confirmation dialog
     *
     * @param confirmationMessage
     * @param commonLocaleData
     * @returns
     */
    public deleteConfiguration(confirmationMessage: any, commonLocaleData: any): ConfirmationModalConfiguration {
        const buttons: Array<ConfirmationModalButton> = [{
            text: commonLocaleData?.app_yes,
            color: 'primary'
        },
        {
            text: commonLocaleData?.app_no
        }];
        const headerText: string = commonLocaleData?.app_confirmation;
        const headerCssClass: string = 'd-inline-block mr-1';
        const messageCssClass: string = 'mr-b1';
        const messageText: string = confirmationMessage;
        return {
            buttons,
            headerText,
            headerCssClass,
            messageCssClass,
            messageText
        };
    }

    /**
     * This will use for confirmation delete vocher
     *
     * @param {string} headerText
     * @param {string} messageText
     * @param {string} footerText
     * @param {*} commonLocaleData
     * @return {*}  {ConfirmationModalConfiguration}
     * @memberof GeneralService
     */
    public getVoucherDeleteConfiguration(headerText: string, messageText: string, footerText: string, commonLocaleData: any): ConfirmationModalConfiguration {
        const buttons: Array<ConfirmationModalButton> = [{
            text: commonLocaleData?.app_yes,
            color: 'primary'
        },
        {
            text: commonLocaleData?.app_no
        }];
        const headerCssClass: string = 'd-inline-block mr-1';
        const messageCssClass: string = 'mr-b1';
        const footerCssClass: string = 'mr-b1 text-light';
        return {
            headerText,
            headerCssClass,
            messageText: messageText,
            messageCssClass,
            footerText: footerText,
            footerCssClass,
            buttons
        };
    }
}

