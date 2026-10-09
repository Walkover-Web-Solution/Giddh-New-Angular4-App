import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpWrapperService } from '../../services/http-wrapper.service';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { GiddhErrorHandler } from '../../services/catchManager/catchmanger';
import { GeneralService } from '../../services/general.service';
import { IServiceConfigArgs, ServiceConfig } from '../../services/service.config';
import { ALL_REPORTS_API } from './all-reports.api';
import { AllReportsResponse, ReportItem } from './all-reports.model';

@Injectable({
    providedIn: 'root'
})
export class AllReportsService {
    private errorHandler = inject(GiddhErrorHandler);
    private http = inject(HttpWrapperService);
    private generalService = inject(GeneralService);
    private config = inject<IServiceConfigArgs>(ServiceConfig);


    /**
     * Fetches all reports and favorite reports list.
     */
    public getAllReports(): Observable<BaseResponse<AllReportsResponse, any>> {
        const url = this.config.apiUrl + ALL_REPORTS_API.GET_ALL
            .replace(':companyUniqueName', encodeURIComponent(this.generalService.companyUniqueName));
        return this.http.get(url).pipe(
            map((res) => res as BaseResponse<AllReportsResponse, any>),
            catchError((e) => this.errorHandler.HandleCatch<AllReportsResponse, any>(e, null, ''))
        );
    }

    /**
     * Saves the favorite reports list.
     */
    public saveFavoriteReports(favorites: ReportItem[]): Observable<BaseResponse<string, ReportItem[]>> {
        const url = this.config.apiUrl + ALL_REPORTS_API.SAVE_FAVORITES
            .replace(':companyUniqueName', encodeURIComponent(this.generalService.companyUniqueName));
        return this.http.post(url, favorites).pipe(
            map((res) => res as BaseResponse<string, ReportItem[]>),
            catchError((e) => this.errorHandler.HandleCatch<string, ReportItem[]>(e, favorites, ''))
        );
    }
}
