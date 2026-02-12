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
import { RecurringRepeatType, RecurringEndType, RecurringFrequencyUnit } from '../models/enums/recurring-voucher.enum';

/**
 * Service for managing recurring voucher form operations and API interactions.
 * Handles form value cleaning, date metadata extraction, and API calls for recurring vouchers.
 * Provides utilities for date formatting, ordinal conversion, and form validation.
 */
@Injectable({ providedIn: 'root' })
export class RecurrenceFormService {

  constructor(
    private errorHandler: GiddhErrorHandler,
    private http: HttpWrapperService,
    private generalService: GeneralService,
    @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs
  ) { }


  /**
   * Cleans the form values based on the repeatOn type
   * Removes unnecessary fields based on the repeat type to optimize API payload
   * Formats dates to GIDDH_DATE_FORMAT for API compatibility
   * @param {any} formValue - The raw form value to clean
   * @returns {any} Cleaned form value with only relevant fields for the selected repeat type
   */
  public cleanFormValues(formValue: any): any {
    const cleaned = JSON.parse(JSON.stringify(formValue));

    this.formatDates(cleaned);
    this.cleanRepeatOn(cleaned);

    return cleaned;
  }

  /**
   * Formats start and end dates to GIDDH_DATE_FORMAT
   * @private
   * @param {any} cleaned - The cleaned form object
   * @memberof RecurrenceFormService
   */
  private formatDates(cleaned: any): void {
    if (cleaned.startDate) {
      cleaned.startDate = dayjs(cleaned.startDate).format(GIDDH_DATE_FORMAT);
    }

    if (cleaned.end?.type === RecurringEndType.NEVER) {
      delete cleaned.end.endDate;
    } else if (cleaned.end?.type === RecurringEndType.ON_DATE && cleaned.end.endDate) {
      cleaned.end.endDate = dayjs(cleaned.end.endDate).format(GIDDH_DATE_FORMAT);
    }
  }

  /**
   * Cleans repeatOn object based on frequency unit and repeat type
   * @private
   * @param {any} cleaned - The cleaned form object
   * @memberof RecurrenceFormService
   */
  private cleanRepeatOn(cleaned: any): void {
    if (cleaned.frequency?.unit === RecurringFrequencyUnit.DAY || !cleaned.repeatOn?.type) {
      delete cleaned.repeatOn;
      return;
    }

    const { type, dayOfMonth, weekdays, nth, weekday } = cleaned.repeatOn;

    switch (type) {
      case RecurringRepeatType.EVERY_DAY:
        delete cleaned.repeatOn;
        break;

      case RecurringRepeatType.DAY_OF_MONTH:
        cleaned.repeatOn = { type, dayOfMonth };
        break;

      case RecurringRepeatType.WEEK_DAYS:
        cleaned.repeatOn = { type, weekdays: weekdays || [] };
        break;

      case RecurringRepeatType.NTH_WEEKDAY:
        cleaned.repeatOn = { type, nth, weekday };
        break;

      default:
        cleaned.repeatOn = { type };
        break;
    }
  }

  /**
   * Extracts raw form value and cleans it for API submission
   * Wrapper method that gets form raw value and passes it to cleanFormValues
   * @param {FormGroup} form - The form group to extract and clean values from
   * @returns {any} Cleaned form value ready for API submission
   */
  public getCleanFormValue(form: FormGroup): any {
    const formValue = form.getRawValue();
    return this.cleanFormValues(formValue);
  }

  /* =======================
     API CALLS
  ======================= */

  /**
   * Generates preview dates for a recurring voucher configuration
   * Calls the preview API with the form payload to get sample dates
   * @param {any} payload - The recurrence configuration payload
   * @returns {Observable<BaseResponse<any, any>>} Observable with preview dates response
   */
  public preview(payload: any): Observable<BaseResponse<any, any>> {
    const companyUniqueName = this.generalService.companyUniqueName;
    return this.http.post(
      this.config.apiUrl + RECURRING_API.PREVIEW.replace(':companyUniqueName', encodeURIComponent(companyUniqueName)),
      payload
    ).pipe(
      map(res => res as BaseResponse<any, any>),
      catchError(e => this.errorHandler.HandleCatch<any, any>(e, payload))
    );
  }

  /**
   * Retrieves all recurring vouchers for the current company
   * Supports filtering by voucher type and pagination parameters
   * @param {any} [params] - Optional query parameters (page, count, fromDate, toDate, q, sortBy, sort)
   * @returns {Observable<BaseResponse<any, any>>} Observable with list of recurring vouchers
   */
  public getAll(params?: any): Observable<BaseResponse<any, any>> {
    return this.http.get(this.generalService.replaceUrlPlaceholders(RECURRING_API.GET_ALL, params)).pipe(
      map(res => res as BaseResponse<any, any>),
      catchError(e => this.errorHandler.HandleCatch<any, any>(e))
    );
  }

  /**
   * Deletes a recurring voucher by its unique name
   * Removes the recurring voucher configuration from the system
   * @param {string} recurringVoucherUniqueName - The unique name of the recurring voucher to delete
   * @returns {Observable<BaseResponse<any, any>>} Observable with deletion response
   */
  public delete(recurringVoucherUniqueName: string): Observable<BaseResponse<any, any>> {
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

  /**
   * Retrieves detailed rule information for a specific recurring voucher
   * Includes configuration, schedule, and status information
   * @param {string} recurringVoucherUniqueName - The unique name of the recurring voucher
   * @param {string} [branchUniqueName] - Optional branch unique name filter
   * @param {string} [status] - Optional status filter (e.g., 'ACTIVE', 'INACTIVE')
   * @returns {Observable<BaseResponse<any, any>>} Observable with detailed rule information
   */
  public getRuleDetails(recurringVoucherUniqueName: string, branchUniqueName?: string, status?: string): Observable<BaseResponse<any, any>> {
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

  /**
   * Retrieves detailed information about a specific recurring voucher
   * Includes voucher items, amounts, and other transaction details
   * @param {string} recurringVoucherUniqueName - The unique name of the recurring voucher
   * @returns {Observable<BaseResponse<any, any>>} Observable with detailed voucher information
   */
  public getVoucherDetails(recurringVoucherUniqueName: string): Observable<BaseResponse<any, any>> {
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

  /**
   * Updates the status of a recurring voucher (ACTIVE/INACTIVE)
   * Changes the recurrence status without deleting the configuration
   * @param {string} recurringVoucherUniqueName - The unique name of the recurring voucher
   * @param {string} status - The new status (e.g., 'ACTIVE', 'INACTIVE')
   * @param {string} [branchUniqueName] - Optional branch unique name for branch-specific updates
   * @returns {Observable<BaseResponse<any, any>>} Observable with status update response
   */
  public updateStatus(recurringVoucherUniqueName: string, status: string, branchUniqueName?: string): Observable<BaseResponse<any, any>> {
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

  /**
   * Creates or updates a recurring voucher configuration
   * Converts a regular voucher into a recurring one with specified recurrence rules
   * @param {string} voucherUniqueName - The unique name of the voucher to make recurring
   * @param {any} payload - The recurrence configuration payload (cleaned form values)
   * @returns {Observable<BaseResponse<any, any>>} Observable with creation/update response
   */
  public makeRecurring(voucherUniqueName: string, payload: any): Observable<BaseResponse<any, any>> {
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
