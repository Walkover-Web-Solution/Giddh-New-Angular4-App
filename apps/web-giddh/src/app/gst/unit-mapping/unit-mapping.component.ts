import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ReplaySubject, Observable, combineLatest } from "rxjs";
import { takeUntil, map, startWith } from "rxjs/operators";
import { CommonService } from "../../services/common.service";
import { StockUnitRequest } from "../../models/api-models/Inventory";
import { select, Store } from "@ngrx/store";
import { AppState } from "../../store";
import { CustomStockUnitAction } from "../../actions/inventory/customStockUnit.actions";
import { Router } from "@angular/router";
import { cloneDeep } from "../../lodash-optimized";
import { ToasterService } from "../../services/toaster.service";


@Component({
    selector: 'unit-mapping',
    templateUrl: './unit-mapping.component.html',
    styleUrls: ['./unit-mapping.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class UnitMappingComponent implements OnInit, OnDestroy {
    /** This will hold the value out/in to open/close setting sidebar popup */
    public asideGstSidebarMenuState: string = 'in';
    /** this will check mobile screen size */
    public isMobileScreen: boolean = false;
    /** This will use for destroy */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Holds active company GST number */
    public activeCompanyGstNumber = '';
    /** Holds units array list */
    public units: any = [];
    /** Holds stock unit observable */
    public stockUnit$: Observable<StockUnitRequest[]>;
    /** Holds unit array list */
    public unitsArray: any[] = [];

    constructor(private breakpointObserver: BreakpointObserver, private commonService: CommonService, private store: Store<AppState>, private toasty: ToasterService, private customStockAction: CustomStockUnitAction, private router: Router, private changeDetection: ChangeDetectorRef) {
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
        this.store.dispatch(this.customStockAction.getStockUnit());
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


        combineLatest([this.commonService.getGstUnits(), this.stockUnit$]).pipe(takeUntil(this.destroyed$)).subscribe((resp: any[]) => {
            if (resp[0] && resp[1]) {
                this.unitsArray = [];
                let giddhUnits = resp[1];
                let gstUnit = resp[0]?.body;
                giddhUnits.forEach(res => {
                    this.unitsArray.push({ giddhUnit: res?.code, mappedGstUnit: gstUnit[res?.code], giddhUnitName: res?.name });
                });
                this.changeDetection.detectChanges();
            }
        });

    }

    /**
     * Lifecycle hook runs when component is destroyed
     *
     * @memberof UnitMappingComponent
     */
    public ngOnDestroy(): void {
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
     * This will use for get stock units
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

    /**
     * This will use for save mapping unit
     *
     * @memberof UnitMappingComponent
     */
    public saveMapping(): void {
        let unitsArray = cloneDeep(this.unitsArray)?.map(unit => {
            return {
                giddhUnit: unit.giddhUnit,
                mappedGstUnit: unit.mappedGstUnit || ""
            };
        });
        this.commonService.updateStockUnits(unitsArray).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === 'success') {
                this.toasty.showSnackBar("success", response?.body);
            } else {
                this.toasty.showSnackBar("error", response?.message);
            }
        });

    }
}
