import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InvViewService {
    private viewSubject = new Subject<any>();
    private viewJobworkSubject = new Subject<any>();
    private viewDateSubject = new Subject<any>();
    // Active group unique name
    private activeGroupUniqueName: string;
    // Active stock unique name
    private activeStockUniqueName: string;

    public setActiveView(View: string, StockName: string, StockUniqueName?: string, GroupUniqueName?: string, groupIsOpen?: boolean,) {
        this.viewSubject.next({ view: View, stockName: StockName, stockUniqueName: StockUniqueName, groupUniqueName: GroupUniqueName, isOpen: groupIsOpen });
    }
    public setJobworkActiveView(View: string, UniqueName?: string, Name?: string) {
        this.viewJobworkSubject.next({ view: View, uniqueName: UniqueName, name: Name });
    }
    public setActiveDate(from: string, to: string) {
        this.viewDateSubject.next({ from: from, to: to });
    }

    public clearMessage(type?: string) {
        if (type === 'stock_group') {
            this.viewSubject.next(false);
        } else if (type === 'jobwork') {
            this.viewJobworkSubject.next(false);
        }
    }


    public getActiveView(): Observable<any> {
        return this.viewSubject.asObservable();
    }
    public getJobworkActiveView(): Observable<any> {
        return this.viewJobworkSubject.asObservable();
    }
    public getActiveDate(): Observable<any> {
        return this.viewDateSubject.asObservable();
    }
    /** To set active stock unique name */
    public setActiveStockUniqueName(item: string): void {
        this.activeStockUniqueName = item;
    }
    /** To set active group unique name */
    public setActiveGroupUniqueName(item: string): void {
        this.activeGroupUniqueName = item;
    }
    /** To get active group unique name */
    public getActiveGroupUniqueName(): string {
        return this.activeGroupUniqueName;
    }
    /** To get active stock unique name */
    public getActiveStockUniqueName(): string {
        return this.activeStockUniqueName;
    }
}


export class ViewSubject {
    public view: string;
    public groupName: string;
    public groupUniqueName: string;
    public stockName: string;
    public stockUniqueName: string;
    public isOpen: boolean;
}
