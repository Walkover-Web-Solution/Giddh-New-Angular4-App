import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import * as _ from '../../lodash-optimized';
import { INameUniqueName } from '../../models/api-models/Inventory';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';

const INV_PAGE = [
    { name: 'Invoice', uniqueName: 'invoice' },
    { name: 'Proforma', uniqueName: 'proforma' }
];

@Component({
    selector: 'invoice-page-dd',
    templateUrl: './invoice.page.dd.component.html',
    styleUrls: ['./invoice.page.dd.component.scss']
})

export class InvoicePageDDComponent implements OnInit, OnDestroy {

    public navItems: INameUniqueName[] = INV_PAGE;
    public selectedType: string = null;
    @Output('pageChanged') public pageChanged: EventEmitter<any> = new EventEmitter(null);
    @Output('selectVoucher') public selectVoucher: EventEmitter<any> = new EventEmitter(null);

    public dropDownPages: any[] = [
        { name: 'Invoice', uniqueName: 'invoice', path: 'sales' },
        { name: 'Recurring', uniqueName: 'recurring', path: 'recurring' },
        { name: 'Receipt', uniqueName: 'receipt', path: 'receipt' },
        { name: 'Credit Note', uniqueName: 'cr-note', path: 'credit note' },
        { name: 'Debit Note', uniqueName: 'dr-note', path: 'debit note' }
    ];
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private _activatedRoute: ActivatedRoute) {

    }

    public ngOnInit(): void {
        this._activatedRoute.firstChild.params.pipe(takeUntil(this.destroyed$)).subscribe(a => {
            if (a) {
                this.setUrl(a.voucherType);
            }
        });
    }

    public changePage(page): void {
        this.selectedType = _.cloneDeep(page.name);
        this.setUrl(page.path);
    }

    private removeObjFromArr(str) {
        let res = _.remove(INV_PAGE, (item: INameUniqueName) => {
            return item.uniqueName !== str;
        });
        return res;
    }

    private onShown(): void {
    }

    private setUrl(mainUrl: string) {
        switch (mainUrl) {
            case 'sales':
                this.selectedType = 'Invoice';
                break;
            case 'recurring':
                this.selectedType = 'Recurring';
                break;
            case 'receipt':
                this.selectedType = 'Receipt';
                break;
            case 'credit note':
                this.selectedType = 'Credit Note';
                break;
            case 'debit note':
                this.selectedType = 'Debit Note';
                break;
            default:
                this.selectedType = 'Invoice';
                break;
        }
        if (mainUrl) {
            this.selectVoucher.emit(mainUrl);
            this.pageChanged.emit(mainUrl);
        }
    }

    /**
     * This will destroy all the memory used by this component
     *
     * @memberof InvoicePageDDComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
