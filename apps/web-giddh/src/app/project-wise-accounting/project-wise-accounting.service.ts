import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpWrapperService } from '../services/http-wrapper.service';
import { GiddhErrorHandler } from '../services/catchManager/catchmanger';
import { GeneralService } from '../services/general.service';
import { ACCOUNTING_API } from './project-wise-accounting.api';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { get } from '../lodash-optimized';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * ProjectAccountingService service
 * Provides projectaccounting related business logic and data operations
 */
export class ProjectAccountingService {

    /**
     * Creates an instance of service
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private http: HttpWrapperService,
        private errorHandler: GiddhErrorHandler,
        private generalService: GeneralService
    ) {
    }

    /**
     * Sends a POST request to create a new project.
     * 
     * @param model - An object containing the data required to create the project.
     * @returns An observable of the API response.
     * @memberof ProjectAccountingService
     */
    public createNewProject(model: any, payload: any): Observable<BaseResponse<any, any>> {
        /**
         * Handles if functionality
         */
        if (model.isCreateFlow) {
            return this.http.post(this.generalService.replaceUrlPlaceholders(ACCOUNTING_API.CREATE_PROJECT, model.data), payload)
                .pipe(
                    /**
                     * Handles map functionality
                     */
                    map((res) => {
                        let data: BaseResponse<any, any> = res;
                        data.request = '';
                        return data;
                    }),
                    /**
                     * Handles catchError functionality
                     */
                    catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
        } else {
            return this.http.patch(this.generalService.replaceUrlPlaceholders(ACCOUNTING_API.UPDATE_PROJECT, model.data), payload)
                .pipe(
                    /**
                     * Handles map functionality
                     */
                    map((res) => {
                        let data: BaseResponse<any, any> = res;
                        data.request = '';
                        return data;
                    }),
                    /**
                     * Handles catchError functionality
                     */
                    catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
        }
    }

    /**
     * Sends a PATCH request to update an existing project.
     * 
     * @param model - An object containing the data to update the project.
     * @returns An observable of the API response.
     * @memberof ProjectAccountingService
     */

    public editProjectDetails(model: any): Observable<BaseResponse<any, any>> {
        return this.http.patch(this.generalService.replaceUrlPlaceholders(ACCOUNTING_API.UPDATE_PROJECT, model), model)
            .pipe(
                /**
                 * Handles map functionality
                 */
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    return data;
                }),
                /**
                 * Handles catchError functionality
                 */
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
    }

    /**
     * Sends a GET request to retrieve all projects.
     * 
     * @param model - An optional object containing query parameters for the request.
     * @returns An observable of the API response with the list of projects.
     * @memberof ProjectAccountingService
     */
    public getAllProjects(model: any): Observable<BaseResponse<any, any>> {
        return this.http.get(this.generalService.replaceUrlPlaceholders(ACCOUNTING_API.GET_ALL_PROJECTS, model))
            .pipe(
                /**
                 * Handles map functionality
                 */
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    return data;
                }),
                /**
                 * Handles catchError functionality
                 */
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
    }

    /**
     * Sends a GET request to retrieve the details of a single project.
     * 
     * @param model - An object containing the unique identifier of the project.
     * @returns An observable of the API response with the project details.
     * @memberof ProjectAccountingService
     */
    public getProjectById(model: any): Observable<BaseResponse<any, any>> {
        return this.http.get(this.generalService.replaceUrlPlaceholders(ACCOUNTING_API.GET_PROJECT, model))
            .pipe(
                /**
                 * Handles map functionality
                 */
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    return data;
                }),
                /**
                 * Handles catchError functionality
                 */
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
    }

    /**
     * Sends a DELETE request to remove a project.
     * 
     * @param model - An object containing the unique identifier of the project to be deleted.
     * @returns An observable of the API response.
     * @memberof ProjectAccountingService
     */
    public removeProject(model: any): Observable<BaseResponse<any, any>> {
        return this.http.delete(this.generalService.replaceUrlPlaceholders(ACCOUNTING_API.DELETE_PROJECT, model))
            .pipe(
                /**
                 * Handles map functionality
                 */
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    return data;
                }),
                /**
                 * Handles catchError functionality
                 */
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
    }

    /**
     * Sends a GET request to retrieve the net profit for a specific project.
     * 
     * @param model - An object containing the unique identifier of the project.
     * @returns An observable of the API response with the net profit details.
     * @memberof ProjectAccountingService
     */
    public getProjectProfit(model: any): Observable<BaseResponse<any, any>> {
        return this.http.get(this.generalService.replaceUrlPlaceholders(ACCOUNTING_API.GET_NET_PROFIT, model))
            .pipe(
                /**
                 * Handles map functionality
                 */
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    return data;
                }),
                /**
                 * Handles catchError functionality
                 */
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
    }

    /**
     * Sends a POST request to create a new accounting entry for a project.
     *
     * @param model - An object containing the unique identifier of the project.
     * @param payload - The data to be sent in the body of the request.
     * @returns An observable of the API response with the details of the created entry.
     * @memberof ProjectAccountingService
     */
    public createEntry(model: any, payload: any): Observable<BaseResponse<any, any>> {
        return this.http.post(this.generalService.replaceUrlPlaceholders(ACCOUNTING_API.CREATE_AND_DELETE_ENTRY, model), payload)
            .pipe(
                /**
                 * Handles map functionality
                 */
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    return data;
                }),
                /**
                 * Handles catchError functionality
                 */
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
    }

    /**
     * Sends a DELETE request to remove an accounting entry for a project.
     *
     * @param model - An object containing the unique identifier of the project.
     * @param payload - The data to be sent in the body of the request.
     * @returns An observable of the API response confirming the deletion.
     * @memberof ProjectAccountingService
     */

    public removeEntry(model: any, payload: any): Observable<BaseResponse<any, any>> {
        return this.http.deleteWithBody(this.generalService.replaceUrlPlaceholders(ACCOUNTING_API.CREATE_AND_DELETE_ENTRY, model), payload)
            .pipe(
                /**
                 * Handles map functionality
                 */
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    return data;
                }),
                /**
                 * Handles catchError functionality
                 */
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
    }

    /**
     * Sends a PUT request to update an accounting entry for a project.
     *
     * @param model - An object containing the unique identifier of the project.
     * @param payload - The updated data to be sent in the body of the request.
     * @returns An observable of the API response with the updated entry details.
     * @memberof ProjectAccountingService
     */
    public updateEntry(model: any, payload: any): Observable<BaseResponse<any, any>> {
        return this.http.put(this.generalService.replaceUrlPlaceholders(ACCOUNTING_API.UPDATE_ENTRY, model), payload)
            .pipe(
                /**
                 * Handles map functionality
                 */
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    return data;
                }),
                /**
                 * Handles catchError functionality
                 */
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
    }

    /**
     * Sends a GET request to search for accounting entries based on specific criteria.
     *
     * @param model - An object containing the search criteria.
     * @returns An observable of the API response with the matching entries.
     * @memberof ProjectAccountingService
     */
    public searchEntry(model: any): Observable<BaseResponse<any, any>> {
        return this.http.get(this.generalService.replaceUrlPlaceholders(ACCOUNTING_API.ENTRY_SEARCH, model))
            .pipe(
                /**
                 * Handles map functionality
                 */
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    return data;
                }),
                /**
                 * Handles catchError functionality
                 */
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
    }

    /**
     * Sends a GET request to retrieve a list of all accounting entries for a project.
     *
     * @param model - An object containing the unique identifier of the project.
     * @returns An observable of the API response with the list of entries.
     * @memberof ProjectAccountingService
     */
    public getAllEntryList(model: any): Observable<BaseResponse<any, any>> {
        return this.http.get(this.generalService.replaceUrlPlaceholders(ACCOUNTING_API.GET_ALL_ENTRY, model))
            .pipe(
                /**
                 * Handles map functionality
                 */
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    return data;
                }),
                /**
                 * Handles catchError functionality
                 */
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
    }

    /**
     * Sends a GET request to retrieve the profit and loss details for a project.
     *
     * @param model - An object containing the unique identifier of the project.
     * @returns An observable of the API response with the profit and loss details.
     * @memberof ProjectAccountingService
     */
    public getProjectProfitAndLoss(model: any): Observable<BaseResponse<any, any>> {
        return this.http.get(this.generalService.replaceUrlPlaceholders(ACCOUNTING_API.GET_PROJECT_PROFIT_LOSS, model))
            .pipe(
                /**
                 * Handles map functionality
                 */
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    return data;
                }),
                /**
                 * Handles catchError functionality
                 */
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
    }
    
    /**
    * Sends a GET request to retrieve the total revenue and expense details for a project.
    * @param model - An object containing the unique identifier of the project.
    * @returns An observable of the API response with the total revenue and expense details.
    * @memberof ProjectAccountingService
    */
    public getTotalRevenueAndExpense(model: any): Observable<BaseResponse<any, any>> {
        return this.http.get(this.generalService.replaceUrlPlaceholders(ACCOUNTING_API.GET_TOTAL_REVENUE_EXPENSES, model))
            .pipe(
                /**
                 * Handles map functionality
                 */
                map((res) => {
                    let data: BaseResponse<any, any> = res;
                    data.request = '';
                    return data;
                }),
                /**
                 * Handles catchError functionality
                 */
                catchError((e) => this.errorHandler.HandleCatch<any, any>(e, '')));
    }
}