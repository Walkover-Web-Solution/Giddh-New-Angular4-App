import { Component, Inject, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { ServiceConfig } from '../../../services/service.config';
import { MatTableDataSource } from '@angular/material/table';

declare var isElectron;
declare var AppUrl;
declare var APP_FOLDER;

@Component({
    selector: 'about-combo-detail',
    templateUrl: './about-combo-detail.component.html',
    styleUrls: ['./about-combo-detail.component.scss'],

})

export class AboutComboDetailComponent implements OnInit {
    /** Stores if device is mobile or not */
    public isMobileScreen: boolean = true;
    /** Stores image path */
    public imgPath: string = '';
    /** Displayed columns for combo products table */
    public displayedColumns: string[] = ['image', 'stockName', 'unit', 'quantity', 'sellingPrice', 'purchasePrice'];
    /** Data source for combo products table */
    public dataSource = new MatTableDataSource<any>([
        {
            id: 1,
            image: 'Login-Page-Image.png',
            stockName: 'Product Name/Service',
            unit: 'Unit',
            quantity: '2',
            sellingPrice: '0.00',
            purchasePrice: '0.00'
        },
        {
            id: 2,
            image: 'Login-Page-Image.png',
            stockName: 'Product Name/Service',
            unit: 'Unit',
            quantity: '2',
            sellingPrice: '0.00',
            purchasePrice: '0.00'
        }
    ]);
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    constructor(
        @Inject(ServiceConfig) private serviceConfig,
        private _breakPointObservar: BreakpointObserver,) {
    }
    /**
     * Initializes component with image path and mobile screen detection
     *
     * @public
     * @memberof AboutComboDetailComponent
     */
    public ngOnInit(): void {
        this.imgPath = isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || AppUrl) + APP_FOLDER + 'assets/images/';

        this._breakPointObservar.observe([
            '(max-width: 767px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileScreen = result.matches;
        });
    }
    /**
     * Cleans up component subscriptions
     *
     * @public
     * @memberof AboutComboDetailComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
