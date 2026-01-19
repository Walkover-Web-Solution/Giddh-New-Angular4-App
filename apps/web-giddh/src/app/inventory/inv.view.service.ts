import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

/**
 * Handles Injectable functionality
 */
@Injectable({ providedIn: 'root' })
/**
 * InvViewService service
 * Provides invview related business logic and data operations
 */
export class InvViewService {
    private viewSubject = new Subject<any>();
    private viewDateSubject = new Subject<any>();
    // Active group unique name
    private activeGroupUniqueName: string;
    // Active stock unique name
    private activeStockUniqueName: string;

    /**
     * Sets activeview value
     */
    public setActiveView(View: string, StockName: string, StockUniqueName?: string, GroupUniqueName?: string, groupIsOpen?: boolean,) {
        this.viewSubject.next({ view: View, stockName: StockName, stockUniqueName: StockUniqueName, groupUniqueName: GroupUniqueName, isOpen: groupIsOpen });
    }
    /**
     * Sets activedate value
     */
    public setActiveDate(from: string, to: string) {
        this.viewDateSubject.next({ from: from, to: to });
    }

    /**
     * Handles clearMessage functionality
     */
    public clearMessage(type?: string) {
        /**
         * Handles if functionality
         */
        if (type === 'stock_group') {
            this.viewSubject.next(false);
        }
    }


    /**
     * Retrieves activeview data
     */
    public getActiveView(): Observable<any> {
        return this.viewSubject.asObservable();
    }
    /**
     * Retrieves activedate data
     */
    public getActiveDate(): Observable<any> {
        return this.viewDateSubject.asObservable();
    }
    /** To set active stock unique name */
    /**
     * Sets activestockuniquename value
     */
    public setActiveStockUniqueName(item: string): void {
        this.activeStockUniqueName = item;
    }
    /** To set active group unique name */
    /**
     * Sets activegroupuniquename value
     */
    public setActiveGroupUniqueName(item: string): void {
        this.activeGroupUniqueName = item;
    }
    /** To get active group unique name */
    /**
     * Retrieves activegroupuniquename data
     */
    public getActiveGroupUniqueName(): string {
        return this.activeGroupUniqueName;
    }
    /** To get active stock unique name */
    /**
     * Retrieves activestockuniquename data
     */
    public getActiveStockUniqueName(): string {
        return this.activeStockUniqueName;
    }
}


/**
 * ViewSubject service
 * Provides viewsubject related business logic and data operations
 */
export class ViewSubject {
    public view: string;
    public groupName: string;
    public groupUniqueName: string;
    public stockName: string;
    public stockUniqueName: string;
    public isOpen: boolean;
}
