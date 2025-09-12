import { catchError, map } from "rxjs/operators";
import { BehaviorSubject, Observable } from "rxjs";
import { Inject, Injectable, Optional } from "@angular/core";
import { HttpWrapperService } from "./http-wrapper.service";
import { BaseResponse } from "../models/api-models/BaseResponse";
import { GiddhErrorHandler } from "./catchManager/catchmanger";
import { IServiceConfigArgs, ServiceConfig } from "./service.config";
import * as dayjs from "dayjs";
import { GeneralService } from "./general.service";
import { AI_OCR_API } from "./apiurls/ai-ocr.api";

@Injectable()
export class AiOcrService {
    /** Provides date manipulation utilities using the dayjs library. */
    public dayjs = dayjs;
    /** Holds the details of the OCR voucher, updated with the latest data. */
    public aiOcrDetails$: BehaviorSubject<any> = new BehaviorSubject(null);
    /** Holds the list of OCR vouchers, updated with the latest data. */
    public ocrList$: BehaviorSubject<any> = new BehaviorSubject(null);
    /** Indicates whether the OCR data retrieval process is active. */
    public getOcrData$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    /** Indicates the success status of the OCR data upload process. */
    public uploadDataSuccess$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    /** Indicates whether the "Save and Next" action is active. */
    public saveAndNext$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    /** Holds the success status of the "Save and Next" action, updated with the latest data. */
    public saveAndNextSuccess$: BehaviorSubject<any> = new BehaviorSubject(null);
    /** Indicates whether the "Skip and Next" action is active. */
    public skipAndNext$: BehaviorSubject<any> = new BehaviorSubject(null);
    /** Indicates whether the "Date Range" action is active. */
    public dateRangeEmit$: BehaviorSubject<any> = new BehaviorSubject(null);
    /** Indicates whether the "Send List Data" action is active. */
    public sendListData$: BehaviorSubject<any> = new BehaviorSubject(null);
    /** Indicates whether the "Reset Data" action is active. */
    public resetData$: BehaviorSubject<any> = new BehaviorSubject(null);
    /** Indicates whether the "Select Branch" action is active. */
    public selectBranch$: BehaviorSubject<any> = new BehaviorSubject(null);
    /** Indicates whether the "Main Page" action is active. */
    public mainPage$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    /** Holds the main page OCR data, updated with the latest data. */
    public mainPageOcrData$: BehaviorSubject<any> = new BehaviorSubject(null);

    constructor(
        private errorHandler: GiddhErrorHandler,
        public http: HttpWrapperService,
        private generalService: GeneralService,
        @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs
    ) { }

    /**
     * Retrieves all OCR documents with pagination and provided model.
     *
     * @param query - Query parameters for pagination and filtering.
     * @param model - Data model for filtering.
     * @returns Observable<BaseResponse<any, any>> - Observable emitting the response.
     * @memberof AiOcrService
     */
    public getAllOcrDocuments(query: any, model: any): Observable<BaseResponse<any, any>> {
        const branchUniqueName = query?.branchUniqueName ? query?.branchUniqueName : this.generalService.currentBranchUniqueName ?? "";
        return this.http
            .post(
                this.config.apiUrl +
                AI_OCR_API.GET_ALL_DOCUMENTS?.replace(":page", encodeURIComponent(query?.page ?? ""))
                    ?.replace(":count", encodeURIComponent(query?.count ?? ""))
                    ?.replace(":from", encodeURIComponent(query?.from ?? ""))
                    ?.replace(":to", encodeURIComponent(query?.to ?? ""))
                    ?.replace(":sort", encodeURIComponent(query?.sort ?? ""))
                    ?.replace(":sortBy", encodeURIComponent(query?.sortBy ?? ""))
                    ?.replace(":companyUniqueName", encodeURIComponent(this.generalService.companyUniqueName))
                    ?.replace(":branchUniqueName", encodeURIComponent(branchUniqueName)),
                model
            )
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = "";
                    data.queryString = {};
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, "", {}))
            );
    }

    /**
     * Uploads an OCR document.
     *
     * @param fileName - The name of the file to upload.
     * @returns Observable<BaseResponse<any, any>> - Observable emitting the response.
     * @memberof AiOcrService
     */
    public uploadOcrDocument(fileName: string): Observable<BaseResponse<any, any>> {
        const branchUniqueName = this.generalService.currentBranchUniqueName ?? "";
        return this.http
            .get(
                this.config.apiUrl +
                AI_OCR_API.UPLOAD_DOCUMENTS?.replace(":fileName", encodeURIComponent(fileName))
                    ?.replace(":companyUniqueName", encodeURIComponent(this.generalService.companyUniqueName))
                    ?.replace(":branchUniqueName", encodeURIComponent(branchUniqueName))
            )
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = "";
                    data.queryString = {};
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, "", {}))
            );
    }

    /**
     * Imports an OCR document.
     *
     * @param payload - The data payload for the import.
     * @returns Observable<BaseResponse<any, any>> - Observable emitting the response.
     * @memberof AiOcrService
     */
    public importOcrDocument(payload: any): Observable<BaseResponse<any, any>> {
        const branchUniqueName = this.generalService.currentBranchUniqueName ?? "";
        return this.http
            .post(
                this.config.apiUrl +
                AI_OCR_API.IMPORT?.replace(":branchUniqueName", encodeURIComponent(branchUniqueName))?.replace(
                    ":companyUniqueName",
                    encodeURIComponent(this.generalService.companyUniqueName)
                ),
                payload
            )
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = "";
                    data.queryString = {};
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, "", {}))
            );
    }

    /**
     * Retrieves the count of completed OCR documents.
     *
     * @returns Observable<BaseResponse<any, any>> - Observable emitting the response.
     * @memberof AiOcrService
     */
    public getCompletedCount(): Observable<BaseResponse<any, any>> {
        const branchUniqueName = this.generalService.currentBranchUniqueName ?? "";
        return this.http
            .get(
                this.config.apiUrl +
                AI_OCR_API.COMPLETED_COUNT?.replace(
                    ":branchUniqueName",
                    encodeURIComponent(branchUniqueName)
                )?.replace(":companyUniqueName", encodeURIComponent(this.generalService.companyUniqueName))
            )
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = "";
                    data.queryString = {};
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, "", {}))
            );
    }

    /**
     * Retrieves extracted OCR documents.
     *
     * @param req - The request parameters for extraction.
     * @returns Observable<BaseResponse<any, any>> - Observable emitting the response.
     * @memberof AiOcrService
     */
    public getExtractDocuments(req: any): Observable<BaseResponse<any, any>> {
        const branchUniqueName = this.generalService.currentBranchUniqueName ?? "";
        return this.http
            .get(
                this.config.apiUrl +
                AI_OCR_API.EXTRACT_DOCUMENTS?.replace(":branchUniqueName", encodeURIComponent(branchUniqueName))
                    ?.replace(":companyUniqueName", encodeURIComponent(this.generalService.companyUniqueName))
                    ?.replace(":currentToken", encodeURIComponent(req.type === "skip" ? req.token : ""))
                    ?.replace(":nextToken", encodeURIComponent(req.type === "save" ? req.token : ""))
            )
            .pipe(
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = "";
                    data.queryString = {};
                    return data;
                }),
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, "", {}))
            );
    }
}
