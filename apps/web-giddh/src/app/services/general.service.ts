import { Injectable } from '@angular/core';
import { UserDetails } from '../models/api-models/loginModels';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { eventsConst } from 'apps/web-giddh/src/app/shared/header/components/eventsConst';
import { IUlist } from '../models/interfaces/ulist.interface';
import { CompanyCreateRequest } from '../models/api-models/Company';
import { COMPANY_API } from "./apiurls/comapny.api";
import { catchError, map } from "rxjs/operators";
import { BaseResponse } from "../models/api-models/BaseResponse";
import { ReportsDetailedRequestFilter, SalesRegisteDetailedResponse } from "../models/api-models/Reports";

@Injectable()
export class GeneralService {
    invokeEvent: Subject<any> = new Subject();
    public talkToSalesModal: BehaviorSubject<boolean> = new BehaviorSubject(false);
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
}
