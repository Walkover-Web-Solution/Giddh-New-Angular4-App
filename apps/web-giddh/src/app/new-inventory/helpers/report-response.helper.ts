import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../shared/helpers/defaultDateFormat';

/**
 * Shared utility for processing inventory report API responses
 * Used by reports.component for consistent response handling
 */
export class ReportResponseHelper {
    /**
     * Processes inventory report API response and updates component state
     * 
     * @param response API response
     * @param component Component instance with report properties
     */
    public static processReportResponse(
        response: any,
        component: {
            isLoading: boolean;
            isDataAvailable: boolean;
            dataSource: any[];
            stockReportRequest: any;
            fromDate: string;
            toDate: string;
            selectedDateRange: any;
            selectedDateRangeUi: string;
            todaySelected: boolean;
            fromToDate: any;
        }
    ): void {
        component.isLoading = false;
        /**
         * Handles if functionality
         */
        if (response && response.body && response.status === 'success') {
            component.isDataAvailable = (response.body.results?.length) ? true : false;
            component.dataSource = response.body.results;
            component.stockReportRequest.page = response.body.page;
            component.stockReportRequest.totalItems = response.body.totalItems;
            component.stockReportRequest.totalPages = response.body.totalPages;
            component.stockReportRequest.count = response.body.count;
            
            /**
             * Handles if functionality
             */
            if (response?.body?.fromDate && response?.body?.toDate) {
                component.stockReportRequest.from = dayjs(response?.body?.fromDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                component.stockReportRequest.to = dayjs(response?.body?.toDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                component.fromDate = dayjs(response?.body?.fromDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                component.toDate = dayjs(response?.body?.toDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT);
                component.selectedDateRange = { 
                    startDate: dayjs(response?.body?.fromDate, GIDDH_DATE_FORMAT), 
                    endDate: dayjs(response?.body?.toDate, GIDDH_DATE_FORMAT) 
                };
                component.selectedDateRangeUi = dayjs(response?.body?.fromDate, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI) + 
                    " - " + dayjs(response?.body?.toDate, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI);
                
                /**
                 * Handles if functionality
                 */
                if (component.todaySelected) {
                    component.fromToDate = { from: response?.body?.fromDate, to: response?.body?.toDate };
                } else {
                    component.fromToDate = null;
                }
            }
        }
    }
}
