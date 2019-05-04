import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InvViewService {
    private viewSubject = new Subject<any>();

    public setActiveView(View: string, StockName: string, StockUniqueName?: string, GroupUniqueName?: string) {
        this.viewSubject.next({ view: View, stockName: StockName, stockUniqueName: StockUniqueName, groupUniqueName: GroupUniqueName });
    }

    public clearMessage() {
        this.viewSubject.next();
    }

    public getActiveView(): Observable<any> {
        return this.viewSubject.asObservable();
    }
}

export class ViewSubject {
    public view: string;
    public groupName: string;
    public groupUniqueName: string;
    public stockName: string;
    public stockUniqueName: string;
}
