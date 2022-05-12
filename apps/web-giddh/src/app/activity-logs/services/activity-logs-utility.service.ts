import { Injectable } from '@angular/core';
import { ActivityLogsServiceModule } from './activity-logs.service.module';
import { IOption } from '../../theme/ng-virtual-select/sh-options.interface';

@Injectable({
    providedIn: ActivityLogsServiceModule
})
export class ActivityLogsUtilityService {

    /**
     * Prepares the audit log filter
     *
     * @param {*} filterData Data received from the service
     * @returns {*} Formatted filter data
     * @memberof ActivityLogsUtilityService
     */
    public prepareAuditLogFilters(filterData: any): any {
        const formattedFilterData = {};
        if (filterData) {
            filterData.forEach(data => {
                formattedFilterData[data.entity] = data.operations;
            });
        }
        return formattedFilterData;
    }

    /**
     * Returns the formatted entities for component
     *
     * @param {Array<string>} entities Entities to be formatted
     * @returns {Array<IOption>} Formatted entities
     * @memberof ActivityLogsUtilityService
     */
    public getFormattedEntries(entries: Array<string>): Array<IOption> {
        return entries.map((entry: string) => {
            return { label: `${entry.substring(0, 1)}${entry.substring(1).toLowerCase()}`, value: entry };
        });
    }
}
