import { Injectable } from '@angular/core';
import { eventsConst } from 'apps/web-giddh/src/app/shared/header/components/eventsConst';
import { BehaviorSubject, Subject } from 'rxjs';

import { ConfirmationModalButton, ConfirmationModalConfiguration } from '../common/confirmation-modal/confirmation-modal.interface';
import { CompanyCreateRequest } from '../models/api-models/Company';
import { UserDetails } from '../models/api-models/loginModels';
import { IUlist } from '../models/interfaces/ulist.interface';
import * as moment from 'moment';

@Injectable()
export class GeneralService {
    invokeEvent: Subject<any> = new Subject();
    // TODO : It is commented due to we have implement calendly and its under discussion to remove
    // public talkToSalesModal: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public isCurrencyPipeLoaded: boolean = false;

    public menuClickedFromOutSideHeader: BehaviorSubject<IUlist> = new BehaviorSubject<IUlist>(null);
    public invalidMenuClicked: BehaviorSubject<{ next: IUlist, previous: IUlist }> = new BehaviorSubject<{ next: IUlist, previous: IUlist }>(null);
    public isMobileSite: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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
        const messageCssClass: string = 'mrB1 text-light';
        const footerCssClass: string = 'mrB1';
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
        let convertdLocalTime = new Date(UTCDateString);

        let hourOffset = convertdLocalTime.getTimezoneOffset() / 60;

        convertdLocalTime.setHours(convertdLocalTime.getHours() + hourOffset);

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
}
