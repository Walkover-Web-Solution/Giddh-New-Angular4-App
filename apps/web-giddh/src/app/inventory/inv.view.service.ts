import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InvViewService {
    private viewSubject = new Subject<any>();
    private viewJobworkSubject = new Subject<any>();
    private viewDateSubject = new Subject<any>();

    public setActiveView(View: string, StockName: string, StockUniqueName?: string, GroupUniqueName?: string, groupIsOpen?: boolean, ) {
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
            this.viewSubject.next();
        } else if (type === 'jobwork') {
            this.viewJobworkSubject.next();
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
}

export class ViewSubject {
    public view: string;
    public groupName: string;
    public groupUniqueName: string;
    public stockName: string;
    public stockUniqueName: string;
    public isOpen: boolean;
}
