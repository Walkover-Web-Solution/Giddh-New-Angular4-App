import { Injectable } from '@angular/core';
import { AuditLogsServiceModule } from './audit-logs.service.module';
import { IOption } from '../../theme/ng-virtual-select/sh-options.interface';

@Injectable({
    providedIn: AuditLogsServiceModule
})
export class LogsUtilityService {

    /**
     * Prepares the audit log filter
     *
     * @param {*} filterData Data received from the service
     * @returns {*} Formatted filter data
     * @memberof LogsUtilityService
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
     * @memberof LogsUtilityService
     */
    public getFormattedEntries(entries: Array<string>): Array<IOption> {
        return entries.map((entry: string) => {
            return { label: `${entry.substring(0, 1)}${entry.substring(1)?.toLowerCase()}`, value: entry };
        });
    }
}
