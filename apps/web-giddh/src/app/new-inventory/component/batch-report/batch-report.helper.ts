import { IOption } from "../../../app.constant";
import { BatchReportItem } from "../../../models/interfaces/batch-report.interface";

/**
 * Map availability `body.results` to dropdown options.
 *
 * @param {*} response `{ status, body: { results: BatchReportItem[] } }`
 * @param {string} [excludeUniqueName] Origin batch to omit from transfer targets
 * @return {*}  {IOption[]}
 */
export function mapAvailabilityBatches(response: any, excludeUniqueName?: string): IOption[] {
    if (response?.status && response.status !== "success") {
        return [];
    }
    const body = response?.body ?? response;
    const results = Array.isArray(body) ? body : (body?.results ?? []);
    return (Array.isArray(results) ? results : []).reduce((list: IOption[], item: BatchReportItem) => {
        const value = item?.uniqueName;
        // if (!value || value === excludeUniqueName || list.some(option => option.value === value)) {
        //     return list;
        // }
        const label = item.batchNumber
            ? `${item.batchNumber}${item.name ? " - " + item.name : ""}`
            : (item.name ?? value);
        list.push({ label, value, additional: item });
        return list;
    }, []);
}
