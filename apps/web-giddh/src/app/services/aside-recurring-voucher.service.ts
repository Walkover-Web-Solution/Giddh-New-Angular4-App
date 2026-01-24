import { Injectable, Inject, Optional } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpWrapperService } from './http-wrapper.service';
import { GiddhErrorHandler } from './catchManager/catchmanger';
import { GeneralService } from './general.service';
import { IServiceConfigArgs, ServiceConfig } from './service.config';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT } from '../shared/helpers/defaultDateFormat';
import { RECURRING_API } from './apiurls/aside-recurring-voucher.api';

@Injectable({ providedIn: 'root' })
export class RecurrenceFormService {

  constructor(
    private errorHandler: GiddhErrorHandler,
    private http: HttpWrapperService,
    private generalService: GeneralService,
    @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs
  ) { }


  // Add this method to the RecurrenceFormService class

  /**
   * Cleans the form values based on the repeatOn type
   * @param formValue The raw form value to clean
   * @returns Cleaned form value with only relevant fields
   */
  cleanFormValues(formValue: any): any {
    // Create a deep copy to avoid mutating the original
    const cleaned = JSON.parse(JSON.stringify(formValue));
    // Format dates if they exist
    if (cleaned.startDate) {
      cleaned.startDate = dayjs(cleaned.startDate).format(GIDDH_DATE_FORMAT);
    }
    // Handle end object based on type
    if (cleaned.end) {
      if (cleaned.end.type === 'NEVER') {
        // Remove endDate when type is NEVER
        delete cleaned.end.endDate;
      } else if (cleaned.end.type === 'ON_DATE' && cleaned.end.endDate) {
        // Format endDate when type is ON_DATE
        cleaned.end.endDate = dayjs(cleaned.end.endDate).format(GIDDH_DATE_FORMAT);
      }
    }
    if (!cleaned.repeatOn?.type) return cleaned;
    const repeatType = cleaned.repeatOn.type;
    const repeatOn = cleaned.repeatOn;

    // ... existing code ...

    switch (repeatType) {
      case 'EVERY_DAY':
        // Remove repeatOn object completely for EVERY_DAY
        delete cleaned.repeatOn;
        break;

      case 'DAY_OF_MONTH':
        // For DAY_OF_MONTH, keep type and dayOfMonth, remove weekdays
        cleaned.repeatOn = {
          type: repeatType,
          dayOfMonth: repeatOn.dayOfMonth
        };
        break;

      case 'WEEK_DAYS':
        // For WEEK_DAYS, keep type and weekdays
        cleaned.repeatOn = {
          type: repeatType,
          weekdays: repeatOn.weekdays || []
        };
        break;

      case 'NTH_WEEKDAY':
        // For NTH_WEEKDAY, keep type and nth
        cleaned.repeatOn = {
          type: repeatType,
          nth: repeatOn.nth
        };
        break;

      default:
        // For any other type, keep only the type
        cleaned.repeatOn = { type: repeatType };
        break;
    }

    // ... rest of the code ...

    return cleaned;
  }

  // Add this method to clean the form before submission
  getCleanFormValue(form: FormGroup): any {
    const formValue = form.getRawValue();
    return this.cleanFormValues(formValue);
  }

  getDateMeta(date: Date) {
    const dayOfMonth = date.getDate();
    const dayOfWeek = date.getDay();
    const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
    const weekOfMonth = Math.ceil(dayOfMonth / 7);
    return { dayOfMonth, weekday, weekOfMonth };
  }

  getOrdinal(n: number): string {
    if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`;
    switch (n % 10) {
      case 1: return `${n}st`;
      case 2: return `${n}nd`;
      case 3: return `${n}rd`;
      default: return `${n}th`;
    }
  }

  /* =======================
     API CALLS
  ======================= */

  preview(payload: any): Observable<BaseResponse<any, any>> {
    const companyUniqueName = this.generalService.companyUniqueName;
    return this.http.post(
      this.config.apiUrl + RECURRING_API.PREVIEW.replace(':companyUniqueName', encodeURIComponent(companyUniqueName)),
      payload
    ).pipe(
      map(res => res as BaseResponse<any, any>),
      catchError(e => this.errorHandler.HandleCatch<any, any>(e, payload))
    );
  }

  getAll(voucherType?: string, params?: any): Observable<BaseResponse<any, any>> {
    const companyUniqueName = this.generalService.companyUniqueName;
    let url = this.config.apiUrl +
      RECURRING_API.GET_ALL.replace(':companyUniqueName', encodeURIComponent(companyUniqueName)) +
      (voucherType ? `&voucherType=${encodeURIComponent(voucherType)}` : '');
    
    // Add query parameters if provided
    if (params) {
      if (params.page) {
        url += `&page=${params.page}`;
      }
      if (params.count) {
        url += `&count=${params.count}`;
      }
      if (params.fromDate) {
        url += `&fromDate=${encodeURIComponent(params.fromDate)}`;
      }
      if (params.toDate) {
        url += `&toDate=${encodeURIComponent(params.toDate)}`;
      }
      if (params.q) {
        url += `&q=${encodeURIComponent(params.q)}`;
      }
      if (params.sortBy) {
        url += `&sortBy=${encodeURIComponent(params.sortBy)}`;
      }
      if (params.sort) {
        url += `&sort=${encodeURIComponent(params.sort)}`;
      }
    }
    
    return this.http.get(url).pipe(
      map(res => res as BaseResponse<any, any>),
      catchError(e => this.errorHandler.HandleCatch<any, any>(e))
    );
  }

  delete(recurringVoucherUniqueName: string): Observable<BaseResponse<any, any>> {
    const companyUniqueName = this.generalService.companyUniqueName;
    const url = this.config.apiUrl +
      RECURRING_API.DELETE
        .replace(':companyUniqueName', encodeURIComponent(companyUniqueName))
        .replace(':recurringVoucherUniqueName', encodeURIComponent(recurringVoucherUniqueName));
    return this.http.delete(url).pipe(
      map(res => res as BaseResponse<any, any>),
      catchError(e => this.errorHandler.HandleCatch<any, any>(e, recurringVoucherUniqueName))
    );
  }

  getRuleDetails(recurringVoucherUniqueName: string, branchUniqueName?: string, status?: string): Observable<BaseResponse<any, any>> {
    const companyUniqueName = this.generalService.companyUniqueName;
    let url = this.config.apiUrl +
      RECURRING_API.RULE_DETAILS
        .replace(':companyUniqueName', encodeURIComponent(companyUniqueName))
        .replace(':recurringVoucherUniqueName', encodeURIComponent(recurringVoucherUniqueName));
    if (branchUniqueName) {
      url += `&branchUniqueName=${encodeURIComponent(branchUniqueName)}`;
    }
    if (status) {
      url += `&status=${encodeURIComponent(status)}`;
    }
    return this.http.get(url).pipe(
      map(res => res as BaseResponse<any, any>),
      catchError(e => this.errorHandler.HandleCatch<any, any>(e))
    );
  }

  getVoucherDetails(recurringVoucherUniqueName: string): Observable<BaseResponse<any, any>> {
    const companyUniqueName = this.generalService.companyUniqueName;
    const url = this.config.apiUrl +
      RECURRING_API.VOUCHER_DETAILS
        .replace(':companyUniqueName', encodeURIComponent(companyUniqueName))
        .replace(':recurringVoucherUniqueName', encodeURIComponent(recurringVoucherUniqueName));
    return this.http.get(url).pipe(
      map(res => res as BaseResponse<any, any>),
      catchError(e => this.errorHandler.HandleCatch<any, any>(e))
    );
  }

  updateStatus(recurringVoucherUniqueName: string, status: string, branchUniqueName?: string): Observable<BaseResponse<any, any>> {
    const companyUniqueName = this.generalService.companyUniqueName;
    let url = this.config.apiUrl +
      RECURRING_API.STATUS_UPDATE
        .replace(':companyUniqueName', encodeURIComponent(companyUniqueName))
        .replace(':recurringVoucherUniqueName', encodeURIComponent(recurringVoucherUniqueName));
    url += `&status=${encodeURIComponent(status)}`;
    if (branchUniqueName) {
      url += `&branchUniqueName=${encodeURIComponent(branchUniqueName)}`;
    }
    return this.http.patch(url, {}).pipe(
      map(res => res as BaseResponse<any, any>),
      catchError(e => this.errorHandler.HandleCatch<any, any>(e))
    );
  }

  makeRecurring(voucherUniqueName: string, payload: any): Observable<BaseResponse<any, any>> {
    const companyUniqueName = this.generalService.companyUniqueName;
    const url = this.config.apiUrl +
      RECURRING_API.MAKE_RECURRING
        .replace(':companyUniqueName', encodeURIComponent(companyUniqueName))
        .replace(':voucherUniqueName', encodeURIComponent(voucherUniqueName));
    return this.http.post(url, payload).pipe(
      map(res => res as BaseResponse<any, any>),
      catchError(e => this.errorHandler.HandleCatch<any, any>(e, payload))
    );
  }
}
