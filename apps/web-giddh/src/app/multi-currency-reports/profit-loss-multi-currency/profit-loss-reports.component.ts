import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MultiCurrencyReportsComponentStore } from '../multi-currency-reports.store';
import { ReportType } from '../multi-currency.const';
import { Observable } from 'rxjs';
import { EventEmitter } from 'stream';


@Component({
    selector: 'profit-loss-reports',
    templateUrl: './profit-loss-reports.component.html',
    providers: [MultiCurrencyReportsComponentStore]
})

export class ProfitLossReportsComponent {
    public showLoader$: Observable<boolean>;
    public data$: Observable<any>;
    @Input() public isV2: boolean = false;
    @Input() public isDateSelected: boolean = false;
    constructor(private cd: ChangeDetectorRef, private componentStore: MultiCurrencyReportsComponentStore) {
        
    }

    public ngOnInit() {
        
    }
    public searchData(event: any){
        console.log('creatMultiCurrencyReport', event);
        this.componentStore.creatMultiCurrencyReport({reportType: ReportType.ProfitLoss,payload: event});
    }

    public getProfitLossReport(){
        console.log("getMultiCurrencyReport");
        
        this.componentStore.getMultiCurrencyReport(ReportType.ProfitLoss);
    }
}
