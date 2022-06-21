import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { Component, OnInit } from "@angular/core";
import { ReplaySubject, Observable } from "rxjs";
import { takeUntil, map, startWith } from "rxjs/operators";
import { FormControl } from '@angular/forms';
import { CommonService } from "../../services/common.service";


@Component({
    selector: 'unit-mapping',
    templateUrl: './unit-mapping.component.html',
    styleUrls: ['./unit-mapping.component.scss']
})

export class UnitMappingComponent implements OnInit{
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

    constructor(private breakpointObserver: BreakpointObserver, private commonService: CommonService){}

    public ngOnInit(): void {
        this.getStockUnits();
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
      map(value => this._filter(value || '')),
    );
    }

    private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

    public ngDestroy(): void {
        document.querySelector('body').classList.remove('unit-mapping-page');
    }

    public getStockUnits(): void {
        this.commonService.getStockUnits().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.units = response;
            console.log(this.units);
            console.log(this.units.body.name);
            
        });
    }
}