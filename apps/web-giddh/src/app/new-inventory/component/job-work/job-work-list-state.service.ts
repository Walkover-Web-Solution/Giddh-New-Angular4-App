import { Injectable } from '@angular/core';
import { JobWorkListRequest } from 'apps/web-giddh/src/app/models/api-models/JobWork';

/** Persisted Job Work list filters while navigating to create/edit. */
export interface JobWorkListFilterSnapshot {
    searchRequest: JobWorkListRequest;
    selectedStatusLabel: string;
    selectedTypeLabel: string;
    selectedWarehouseName: string;
    selectedDateRangeUi: string;
    selectedRangeLabel: string;
    columnSearch: {
        jobWorkNo: string;
        jobworker: string;
        outputStock: string;
    };
}

/**
 * Holds Job Work list filter state across create/edit navigation
 * while JobWorkModule stays loaded.
 *
 * @export
 * @class JobWorkListStateService
 */
@Injectable()
export class JobWorkListStateService {
    private snapshot: JobWorkListFilterSnapshot | null = null;

    /**
     * Stores the current list filter snapshot.
     *
     * @param {JobWorkListFilterSnapshot} snapshot
     * @memberof JobWorkListStateService
     */
    save(snapshot: JobWorkListFilterSnapshot): void {
        this.snapshot = {
            searchRequest: { ...snapshot.searchRequest },
            selectedStatusLabel: snapshot.selectedStatusLabel,
            selectedTypeLabel: snapshot.selectedTypeLabel,
            selectedWarehouseName: snapshot.selectedWarehouseName,
            selectedDateRangeUi: snapshot.selectedDateRangeUi,
            selectedRangeLabel: snapshot.selectedRangeLabel,
            columnSearch: { ...snapshot.columnSearch }
        };
    }

    /**
     * Returns the stored snapshot without clearing it.
     *
     * @returns {JobWorkListFilterSnapshot | null}
     * @memberof JobWorkListStateService
     */
    get(): JobWorkListFilterSnapshot | null {
        return this.snapshot
            ? {
                searchRequest: { ...this.snapshot.searchRequest },
                selectedStatusLabel: this.snapshot.selectedStatusLabel,
                selectedTypeLabel: this.snapshot.selectedTypeLabel,
                selectedWarehouseName: this.snapshot.selectedWarehouseName,
                selectedDateRangeUi: this.snapshot.selectedDateRangeUi,
                selectedRangeLabel: this.snapshot.selectedRangeLabel,
                columnSearch: { ...this.snapshot.columnSearch }
            }
            : null;
    }

    /**
     * Clears the stored snapshot.
     *
     * @memberof JobWorkListStateService
     */
    clear(): void {
        this.snapshot = null;
    }
}
