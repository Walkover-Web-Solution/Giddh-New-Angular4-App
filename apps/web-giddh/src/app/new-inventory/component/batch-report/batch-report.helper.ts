import { IOption } from "../../../app.constant";
import { BatchReportItem } from "../../../models/interfaces/batch-report.interface";

/**
 * Normalize availability API batch rows to {@link BatchReportItem}.
 *
 * @param {*} item Raw availability result
 * @return {*}  {BatchReportItem}
 */
export function normalizeAvailabilityBatchItem(item: any): BatchReportItem {
    return {
        ...item,
        uniqueName: String(item?.uniqueName ?? item?.batchUniqueName ?? "").trim(),
        batchNumber: String(item?.batchNumber ?? "").trim(),
        name: String(item?.name ?? "").trim()
    };
}

/**
 * Dropdown option value for an availability batch.
 * Uses API `uniqueName`; only falls back to `batchNumber` when `uniqueName` is missing.
 *
 * @param {BatchReportItem} item Availability batch item
 * @return {*}  {string}
 */
export function getBatchAvailabilityOptionValue(item: BatchReportItem): string {
    const uniqueName = String(item?.uniqueName ?? "").trim();
    if (uniqueName) {
        return uniqueName;
    }
    return String(item?.batchNumber ?? "").trim();
}

/**
 * Map availability `body.results` to dropdown options.
 *
 * @param {*} response `{ status, body: { results: BatchReportItem[] } }`
 * @return {*}  {IOption[]}
 */
export function mapAvailabilityBatches(response: any, excludeUniqueName?: string): IOption[] {
    if (response?.status && response.status !== "success") {
        return [];
    }
    const body = response?.body ?? response;
    const results = Array.isArray(body) ? body : (body?.results ?? []);
    return (Array.isArray(results) ? results : []).reduce((list: IOption[], rawItem: BatchReportItem) => {
        const item = normalizeAvailabilityBatchItem(rawItem);
        const value = item.batchNumber;
        if (!value) {
            return list;
        }
        const label = `${item.batchNumber} - ${item.name}`;
        list.push({ label, value, additional: item });
        return list;
    }, []);
}
