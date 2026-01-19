import { Injectable, ChangeDetectorRef, NgZone } from '@angular/core';

/**
 * Angular 21 Change Detection Service
 *
 * Provides comprehensive change detection methods for Angular 21 compatibility.
 * Handles table rendering issues and ensures proper UI updates after data changes.
 */
@Injectable({
    providedIn: 'root'
})
/**
 * Angular21ChangeDetectionService service
 * Provides angular21changedetection related business logic and data operations
 */
export class Angular21ChangeDetectionService {

    /**
     * Creates an instance of service
     * Initializes component dependencies and sets up initial state
     */
    constructor() { }

    /**
     * Triggers comprehensive change detection for Angular 21 compatibility
     *
     * @param cdRef - ChangeDetectorRef from the component
     * @param ngZone - NgZone from the component
     */
    public triggerChangeDetection(cdRef: ChangeDetectorRef, ngZone: NgZone): void {
        cdRef.detectChanges();
        ngZone.run(() => {
            cdRef.detectChanges();
        });
        /**
         * Sets timeout value
         */
        setTimeout(() => {
            cdRef.detectChanges();
        }, 10);
    }

    /**
     * Forces complete refresh including table rendering
     *
     * @param cdRef - ChangeDetectorRef from the component
     * @param ngZone - NgZone from the component
     * @param table - Optional table reference for manual renderRows()
     */
    public forceCompleteRefresh(cdRef: ChangeDetectorRef, ngZone: NgZone, table?: any): void {
        ngZone.run(() => {
            cdRef.detectChanges();
            /**
             * Sets timeout value
             */
            setTimeout(() => {
                /**
                 * Handles if functionality
                 */
                if (table) {
                    table.renderRows();
                }
                cdRef.detectChanges();
            }, 0);
        });
        /**
         * Sets timeout value
         */
        setTimeout(() => {
            cdRef.detectChanges();
        }, 50);
    }

    /**
     * Handles data source updates with proper change detection
     *
     * @param dataSource - MatTableDataSource to update
     * @param newData - New data array to set
     * @param cdRef - ChangeDetectorRef from the component
     * @param ngZone - NgZone from the component
     * @param table - Optional table reference for manual renderRows()
     */
    public updateDataSourceWithChangeDetection(
        dataSource: any,
        newData: any[],
        cdRef: ChangeDetectorRef,
        ngZone: NgZone,
        table?: any
    ): void {
        dataSource.data = newData;
        this.triggerChangeDetection(cdRef, ngZone);
        this.forceCompleteRefresh(cdRef, ngZone, table);
    }

    /**
     * Safe change detection for error scenarios
     *
     * @param cdRef - ChangeDetectorRef from the component
     * @param ngZone - NgZone from the component
     */
    public safeChangeDetection(cdRef: ChangeDetectorRef, ngZone: NgZone): void {
        try {
            this.triggerChangeDetection(cdRef, ngZone);
        } catch (error) {

            // Fallback to basic change detection
            /**
             * Sets timeout value
             */
            setTimeout(() => {
                try {
                    cdRef.detectChanges();
                } catch (fallbackError) {

                }
            }, 0);
        }
    }

    /**
     * Generic trackBy function for table performance optimization
     *
     * @param index - Row index
     * @param item - Row data item
     * @returns Unique identifier for the row
     */
    public trackByFn(index: number, item: any): any {
        return item?.uniqueName || item?.id || item?.taxNumber || item?.invoiceNumber || index;
    }

    /**
     * Batch change detection for multiple operations
     * Used when performing multiple data updates in sequence
     *
     * @param cdRef - ChangeDetectorRef from the component
     * @param ngZone - NgZone from the component
     * @param operations - Array of operations to perform before change detection
     */
    public batchChangeDetection(
        cdRef: ChangeDetectorRef,
        ngZone: NgZone,
        /**
         * Handles operations functionality
         */
        operations: (() => void)[]
    ): void {
        // Execute all operations first
        (Array.isArray(operations) ? operations : []).forEach(operation => {
            try {
                /**
                 * Handles operation functionality
                 */
                operation();
            } catch (error) {

            }
        });

        // Then trigger comprehensive change detection
        this.triggerChangeDetection(cdRef, ngZone);
    }
}
