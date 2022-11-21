import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { Component, OnInit } from "@angular/core";
import { ReplaySubject, Observable } from "rxjs";
import { takeUntil, map, startWith } from "rxjs/operators";
import { FormControl } from '@angular/forms';
import { CommonService } from "../../services/common.service";
import { StockUnitRequest } from "../../models/api-models/Inventory";
import { select, Store } from "@ngrx/store";
import { AppState } from "../../store";
import { CustomStockUnitAction } from "../../actions/inventory/customStockUnit.actions";
import { Router } from "@angular/router";


@Component({
    selector: 'unit-mapping',
    templateUrl: './unit-mapping.component.html',
    styleUrls: ['./unit-mapping.component.scss']
})

export class UnitMappingComponent implements OnInit {
    /** This will hold the value out/in to open/close setting sidebar popup */
    public asideGstSidebarMenuState: string = 'in';
    /** this will check mobile screen size */
    public isMobileScreen: boolean = false;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public activeCompanyGstNumber = '';
    myControl = new FormControl('');
    options: string[] = ['One', 'Two', 'Three'];
    filteredOptions: Observable<string[]>;
    public units: any = [];
    public stockUnit$: Observable<StockUnitRequest[]>;

    constructor(private breakpointObserver: BreakpointObserver, private commonService: CommonService, private store: Store<AppState>, private customStockAction: CustomStockUnitAction, private router: Router) {
        this.stockUnit$ = this.store.pipe(select(state => state.inventory.stockUnits), takeUntil(this.destroyed$));
        this.store.pipe(select(appState => appState.gstR.activeCompanyGst), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.activeCompanyGstNumber !== response) {
                this.activeCompanyGstNumber = response;
            }
        });
    }

    /**
     * Lifecycle hook runs when component is initialized
     * 
     * @memberof UnitMappingComponent
     */
    public ngOnInit(): void {
        this.getStockUnits();
        this.store.dispatch(this.customStockAction.GetStockUnit());
        document.querySelector('body').classList.add('gst-sidebar-open');
        document.querySelector('body').classList.add('unit-mapping-page');
        this.breakpointObserver
            .observe(['(max-width: 767px)'])
            .pipe(takeUntil(this.destroyed$))
            .subscribe((state: BreakpointState) => {
                this.isMobileScreen = state.matches;
                if (!this.isMobileScreen) {
                    this.asideGstSidebarMenuState = 'in';
                }
            });
        this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map(value => this.filter(value || '')),
        );
    }

    /**
     * Function to filter Dropdown data
     *
     * @private
     * @param {string} value
     * @return {*}  {string[]}
     * @memberof UnitMappingComponent
     */
    private filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.options?.filter(option => option.toLowerCase().includes(filterValue));
    }

    /**
     * Lifecycle hook runs when component is destroyed
     * 
     * @memberof UnitMappingComponent
     */
    public ngDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body').classList.remove('unit-mapping-page');
        this.asideGstSidebarMenuState = 'out';
    }

    /**
    * Handles GST Sidebar Navigation
    *
    * @memberof UnitMappingComponent
    */
    public handleNavigation(): void {
        this.router.navigate(['pages', 'gstfiling']);
    }

    /**
     * Function for bringing units to select field
     * 
     * @memberof UnitMappingComponent
     */
    public getStockUnits(): void {
        this.commonService.getStockUnits().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.units = response.body.map((result: any) => {
                return {
                    value: result.code,
                    label: `${result.code}-${result.name}`
                }
            });
        });
    }
}