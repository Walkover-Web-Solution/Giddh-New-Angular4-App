import { empty as observableEmpty, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GroupUpateRequest, MoveGroupResponse } from './../models/api-models/Group';
import { Inject, Injectable, Optional } from '@angular/core';
import { HttpWrapperService } from './httpWrapper.service';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { FlattenGroupsAccountsResponse, GroupCreateRequest, GroupResponse, GroupSharedWithResponse, GroupsTaxHierarchyResponse, MoveGroupRequest } from '../models/api-models/Group';
import { GROUP_API } from './apiurls/group.api';
import { GroupsWithAccountsResponse } from '../models/api-models/GroupsWithAccounts';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { PAGINATION_LIMIT } from '../app.constant';

declare var _: any;

@Injectable()
export class GroupService {
    private companyUniqueName: string;
    private _: any;

    constructor(private errorHandler: GiddhErrorHandler, public http: HttpWrapperService,
        private generalService: GeneralService,
        @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs) {
        this._ = config._;
        _ = config._;
    }

    public flattenGroup(rawList: any[], parents: any[] = []) {
        let listofUN;
        listofUN = _.map(rawList, (listItem) => {
            let newParents;
            let result;
            newParents = _.union([], parents);
            newParents.push({
                name: listItem.name,
                uniqueName: listItem.uniqueName
            });
            listItem = Object.assign({}, listItem, { parentGroups: [] });
            listItem.parentGroups = newParents;
            if (listItem.groups.length > 0) {
                result = this.flattenGroup(listItem.groups, newParents);
                result.push(_.omit(listItem, 'groups'));
            } else {
                result = _.omit(listItem, 'groups');
            }
            return result;
        });
        return _.flatten(listofUN);
    }

    public CreateGroup(model: GroupCreateRequest): Observable<BaseResponse<GroupResponse, GroupCreateRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + GROUP_API.CREATE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map((res) => {
            let data: BaseResponse<GroupResponse, GroupCreateRequest> = res;
            data.request = model;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<GroupResponse, GroupCreateRequest>(e, model)));
    }

    public UpdateGroup(modele: GroupUpateRequest, groupUniqueName: string): Observable<BaseResponse<GroupResponse, GroupUpateRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + GROUP_API.UPDATE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':groupUniqueName', encodeURIComponent(groupUniqueName)), modele).pipe(map((res) => {
            let data: BaseResponse<GroupResponse, GroupUpateRequest> = res;
            data.queryString = { groupUniqueName };
            data.request = modele;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<GroupResponse, GroupUpateRequest>(e, modele, { groupUniqueName })));
    }

    // need to check on Effect
    public UnShareGroup(userEmail: string, groupUniqueName: string): Observable<BaseResponse<string, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;

        return this.http.put(this.config.apiUrl + GROUP_API.UNSHARE.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':groupUniqueName', encodeURIComponent(groupUniqueName)), { user: userEmail }).pipe(map((res) => {
            let data: BaseResponse<string, string> = res;
            data.request = userEmail;
            data.queryString = { groupUniqueName };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<string, string>(e, userEmail, { groupUniqueName })));
    }

    public ShareWithGroup(groupUniqueName: string): Observable<BaseResponse<GroupSharedWithResponse[], string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + GROUP_API.SHARED_WITH.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':groupUniqueName', encodeURIComponent(groupUniqueName))).pipe(map((res) => {
            let data: BaseResponse<GroupSharedWithResponse[], string> = res;
            data.queryString = { groupUniqueName };
            data.request = groupUniqueName;
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<GroupSharedWithResponse[], string>(e, groupUniqueName, { groupUniqueName })));
    }

    public GetGroupsWithAccounts(q: string, branchUniqueName?: string): Observable<BaseResponse<GroupsWithAccountsResponse[], string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        let url = this.config.apiUrl + GROUP_API.GROUPS_WITH_ACCOUNT.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':q', encodeURIComponent(q || ''));
        if (branchUniqueName) {
            branchUniqueName = branchUniqueName !== this.companyUniqueName ? branchUniqueName : '';
            url = url.concat(`&branchUniqueName=${branchUniqueName}`);
        }
        if (this.companyUniqueName) {
            return this.http.get(url).pipe(map((res) => {
                let data: BaseResponse<GroupsWithAccountsResponse[], string> = res;
                data.request = q;
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<GroupsWithAccountsResponse[], string>(e, q)));
        } else {
            return observableEmpty();
        }
    }

    public MoveGroup(modele: MoveGroupRequest, groupUniqueName: string): Observable<BaseResponse<MoveGroupResponse, MoveGroupRequest>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.put(this.config.apiUrl + GROUP_API.MOVE_GROUP.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':groupUniqueName', encodeURIComponent(groupUniqueName)), modele).pipe(map((res) => {
            let data: BaseResponse<MoveGroupResponse, MoveGroupRequest> = res;
            data.request = modele;
            data.queryString = { groupUniqueName };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<MoveGroupResponse, MoveGroupRequest>(e, modele, { groupUniqueName })));
    }

    public GetGroupDetails(groupUniqueName: string): Observable<BaseResponse<GroupResponse, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + GROUP_API.GET_GROUP_DETAILS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':groupUniqueName', encodeURIComponent(groupUniqueName))).pipe(map((res) => {
            let data: BaseResponse<GroupResponse, string> = res;
            data.request = groupUniqueName;
            data.queryString = { groupUniqueName };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<GroupResponse, string>(e, groupUniqueName, { groupUniqueName })));
    }

    public DeleteGroup(groupUniqueName: string): Observable<BaseResponse<any, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.delete(this.config.apiUrl + GROUP_API.DELETE_GROUP.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':groupUniqueName', encodeURIComponent(groupUniqueName))).pipe(map((res) => {
            let data: BaseResponse<any, string> = res;
            data.request = groupUniqueName;
            data.queryString = { groupUniqueName };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<any, string>(e, groupUniqueName, { groupUniqueName })));
    }

    public GetFlattenGroupsAccounts(q: string = '', page: number = 1, count: number = 20000, showEmptyGroups: string = 'false', branchUniqueName?: string): Observable<BaseResponse<FlattenGroupsAccountsResponse, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        if (this.companyUniqueName) {
            let url = this.config.apiUrl + GROUP_API.FLATTEN_GROUP_WITH_ACCOUNTS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))
                .replace(':q', encodeURIComponent(q || ''))
                .replace(':page', encodeURIComponent(page.toString()))
                .replace(':count', encodeURIComponent(count.toString()))
                .replace(':showEmptyGroups', encodeURIComponent(showEmptyGroups));
            if (branchUniqueName) {
                url = url.concat(`&branchUniqueName=${branchUniqueName !== this.companyUniqueName ? branchUniqueName : ''}`);
            }
            return this.http.get(url).pipe(map((res) => {
                let data: BaseResponse<FlattenGroupsAccountsResponse, string> = res;
                data.request = '';
                data.queryString = { q, page, count, showEmptyGroups };
                return data;
            }), catchError((e) => this.errorHandler.HandleCatch<FlattenGroupsAccountsResponse, string>(e, '', { q, page, count, showEmptyGroups })));
        } else {
            return observableEmpty();
        }
    }

    public GetTaxHierarchy(groupUniqueName: string): Observable<BaseResponse<GroupsTaxHierarchyResponse, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + GROUP_API.TAX_HIERARCHY.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':groupUniqueName', encodeURIComponent(groupUniqueName))).pipe(map((res) => {
            let data: BaseResponse<GroupsTaxHierarchyResponse, string> = res;
            data.request = groupUniqueName;
            data.queryString = { groupUniqueName };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<GroupsTaxHierarchyResponse, string>(e, groupUniqueName, { groupUniqueName })));
    }

    /**
     * API call to create custom fields for company
     *
     * @param {*} model
     * @returns {Observable<BaseResponse<any, string>>}
     * @memberof GroupService
     */
    public createCompanyCustomField(model: any): Observable<BaseResponse<any, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.post(this.config.apiUrl + GROUP_API.CREATE_COMPANY_CUSTOM_FIELD.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)), model).pipe(map(response => {
            let data: BaseResponse<any, string> = response;
            data.request = model;
            return data;
        }), catchError((exception) => this.errorHandler.HandleCatch<string, any>(exception, model)));
    }

    /**
    * API call to get custom fields for company
    *
    * @param {*} model
    * @returns {Observable<BaseResponse<any, string>>}
    * @memberof GroupService
    */
    public getCompanyCustomField(): Observable<BaseResponse<any, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + GROUP_API.CREATE_COMPANY_CUSTOM_FIELD.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map(response => {
            let data: BaseResponse<any, string> = response;
            return data;
        }), catchError((exception) => this.errorHandler.HandleCatch<string, any>(exception)));
    }

    /**
     * Search groups API call
     *
     * @param {*} params Params (q:- query, page:- pagination, removeTop:- If true, will remove the top hierarchy of groups)
     * @returns {Observable<any>} Observable to carry out further operations
     * @memberof GroupService
     */
    public searchGroups(params: any): Observable<any> {
        const companyUniqueName = this.generalService.companyUniqueName;
        let contextPath = `${this.config.apiUrl}${GROUP_API.SEARCH_GROUPS}`.replace(':companyUniqueName', encodeURIComponent(companyUniqueName));
        if (params) {
            Object.keys(params).forEach((key, index) => {
                const delimiter = index === 0 ? '?' : '&'
                if (params[key] !== undefined) {
                    if (key === 'branchUniqueName') {
                        params[key] = params[key] === companyUniqueName ? '' : params[key];
                    }
                    contextPath += `${delimiter}${key}=${params[key]}`
                }
            });
        }
        return this.http.get(contextPath)
            .pipe(catchError((error) => this.errorHandler.HandleCatch<any, any>(error)));
    }

    public getMasters(groupUniqueName: string, page: Number): Observable<BaseResponse<GroupResponse, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + GROUP_API.GET_MASTERS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName)).replace(':groupUniqueName', encodeURIComponent(groupUniqueName)).replace(':page', encodeURIComponent(page.toString())).replace(':count', encodeURIComponent(PAGINATION_LIMIT))).pipe(map((res) => {
            let data: BaseResponse<GroupResponse, string> = res;
            data.request = groupUniqueName;
            data.queryString = { groupUniqueName };
            return data;
        }), catchError((e) => this.errorHandler.HandleCatch<GroupResponse, string>(e, groupUniqueName, { groupUniqueName })));
    }

    public getTopSharedGroups(): Observable<BaseResponse<GroupResponse, string>> {
        this.companyUniqueName = this.generalService.companyUniqueName;
        return this.http.get(this.config.apiUrl + GROUP_API.GET_TOP_SHARED_GROUPS.replace(':companyUniqueName', encodeURIComponent(this.companyUniqueName))).pipe(map((res) => {
            let data: BaseResponse<GroupResponse, string> = res;
            return data;
        }), catchError((error) => this.errorHandler.HandleCatch<any, any>(error)));
    }
}
