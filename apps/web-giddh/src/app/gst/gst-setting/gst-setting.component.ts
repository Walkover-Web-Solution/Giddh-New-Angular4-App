import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ReplaySubject, Observable, combineLatest } from "rxjs";
import { takeUntil, map, startWith, take } from "rxjs/operators";
import { CommonService } from "../../services/common.service";
import { StockUnitRequest } from "../../models/api-models/Inventory";
import { select, Store } from "@ngrx/store";
import { AppState } from "../../store";
import { CustomStockUnitAction } from "../../actions/inventory/custom-stock-unit.actions";
import { Router } from "@angular/router";
import { cloneDeep } from "../../lodash-optimized";
import { ToasterService } from "../../services/toaster.service";
import { IOption } from "../../theme/ng-virtual-select/sh-options.interface";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { SettingsProfileActions } from "../../actions/settings/profile/settings.profile.action";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { GeneralService } from "../../services/general.service";
import { GIDDH_DATE_RANGE_PICKER_RANGES } from "../../app.constant";
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from "../../shared/helpers/defaultDateFormat";
import * as dayjs from "dayjs";
import { GstSettingComponentStore } from "./utility/gst-setting.store";


@Component({
    selector: 'gst-setting',
    templateUrl: './gst-setting.component.html',
    styleUrls: ['./gst-setting.component.scss'],
    providers: [GstSettingComponentStore],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class GstSettingComponent implements OnInit, OnDestroy {
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** This will hold the value out/in to open/close setting sidebar popup */
    public asideGstSidebarMenuState: string = 'in';
    /** this will check mobile screen size */
    public isMobileScreen: boolean = false;
    /** This will use for destroy */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Holds active company GST number */
    public activeCompanyGstNumber = '';
    /** List of available themes */
    public exportTypes: IOption[] = [];
    /** Holds export type */
    public exportType: string = '';
    /** Invoice Settings */
    public activeCompany: any;
    /** Holds unit array list */
    public lutListArray: any[] = [];
    /** Holds gst setting form group */
    public gstSettingForm: FormGroup;
    /** Entry index which is open in edit mode */
    public activeEntryIndex: number = null;
    /* Selected from date */
    public fromDate: string;
    /* Selected to date */
    public toDate: string;
    /** Get Lut Number get in progress Observable */
    public getLutNumberInProgress$: Observable<any> = this.componentStore.getLutNumberInProgress$;

    constructor(
        private breakpointObserver: BreakpointObserver,
        private formBuilder: FormBuilder,
        private store: Store<AppState>,
        private toasty: ToasterService,
        private settingsProfileActions: SettingsProfileActions,
        private changeDetection: ChangeDetectorRef,
        private componentStore: GstSettingComponentStore
    ) {
        this.componentStore.getLutNumberList();
        this.componentStore.activeCompany$.pipe(takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.activeCompany = activeCompany;
            }
        });
    }

    /**
     * Lifecycle hook runs when component is initialized
     *
     * @memberof GstSettingComponent
     */
    public ngOnInit(): void {
        this.initGstSettingForm();
        this.getLutList();
        document.querySelector('body').classList.add('gst-sidebar-open');
        document.querySelector('body').classList.add('gst-setting-page');
        this.componentStore.universalDate$.pipe(takeUntil(this.destroyed$)).subscribe(dateObj => {
            if (dateObj) {
                let universalDate = _.cloneDeep(dateObj);
                this.fromDate = universalDate[0];
                this.toDate = universalDate[1];
                console.log(this.fromDate);
                let gstFormArray = this.gstSettingForm.get('gstData') as FormArray;
                let gstFormGroup = gstFormArray.at(0);
                gstFormGroup.get('fromDate')?.patchValue(universalDate[0]);
                gstFormGroup.get('toDate')?.patchValue(universalDate[1]);
            }
        });
        this.breakpointObserver
            .observe(['(max-width: 767px)'])
            .pipe(takeUntil(this.destroyed$))
            .subscribe((state: BreakpointState) => {
                this.isMobileScreen = state.matches;
                if (!this.isMobileScreen) {
                    this.asideGstSidebarMenuState = 'in';
                }
            });
    }

    public initGstSettingForm(): void {
        this.gstSettingForm = this.formBuilder.group({
            withPay: [false],
            gstData: this.formBuilder.array([
                this.initLutForm()
            ])
        });
    }

    /**
 *This will be use for destination UntypedFormArray group
 *
 * @return {*}  {FormGroup}
 * @memberof GstSettingComponent
 */
    public initLutForm(): FormGroup {
        return this.formBuilder.group({
            fromDate: [''],
            toDate: [''],
            lutNumber: [''],
            uniqueName: ['']
        });
    }

    /**
 * Saves export type
 *
 * @memberof GstSettingComponent
 */
    public setExportType(event?: any): void {
        if (event && event.value && this.exportType !== event.value) {
            this.gstSettingForm.get('withPay')?.patchValue(event.value === 'yes');
            let value = event.value === 'yes' ? true : false;
            this.store.dispatch(this.settingsProfileActions.PatchProfile({ withPay: value }));
        }
    }


    /**
     * This will be use for add new lut item
     *
     * @param {*} [user]
     * @memberof OtherSettingsComponent
     */
    public addNewLutItem(user?: any): void {
        // Ensure gstData is initialized as a FormArray
        let mappings = this.gstSettingForm.get('gstData') as FormArray;

        let mappingForm = this.formBuilder.group({
            fromDate: [this.fromDate], // Use user values if available, else default to ''
            toDate: [this.toDate], // Use user values if available, else default to ''
            lutNumber: [''] // Use user values if available, else default to ''
        });
        mappings.push(mappingForm);
        if (user) {
            const fromDate = user.fromDate;
            const [fromDay, fromMonth, fromYear] = fromDate.split('-').map(Number);
            const formatFromDate = new Date(fromYear, fromMonth - 1, fromDay);
            const fromDateString = formatFromDate.toString();

            const toDate = user.fromDate;
            const [toDay, toMonth, toYear] = toDate.split('-').map(Number);
            const toFromDate = new Date(toYear, toMonth - 1, toDay);
            const toDateString = toFromDate.toString();

            console.log(mappings, fromDateString, toDateString);

            mappings.controls.forEach(control => {
                console.log(control);
                if (!control?.get('lutNumber').value) {
                    control.get('fromDate')?.patchValue(fromDateString);
                    control.get('toDate')?.patchValue(toDateString);
                    control.get('lutNumber')?.patchValue(user.lutNumber);
                    // Assuming you have a 'uniqueName' field in your form
                    // Replace 'uniqueName' with the actual field name in your form
                    control.get('uniqueName')?.patchValue(user.uniqueName);
                }
            });
        }

    }

    /**
 * This will be use for remove lut item
 *
 * @param {number} index
 * @memberof OtherSettingsComponent
 */
    public removeLutItem(index: number): void {
        let mappings = this.gstSettingForm.get('gstData') as FormArray;
        let mappingForm = mappings.at(index);
        if (index === 0) {
            mappingForm.get('lutNumber')?.patchValue(null);
            mappingForm.get('fromDate')?.patchValue(this.fromDate);
            mappingForm.get('toDate')?.patchValue(this.toDate);
        } else {
            mappings.removeAt(index);
        }
    }

    /**
 * Callback for translation response complete
 *
 * @param {*} event
 * @memberof OtherSettingsComponent
 */
    public translationComplete(event: any): void {
        if (event) {
            this.exportTypes = [
                { label: this.localeData?.with_pay, value: 'yes' },
                { label: this.localeData?.without_pay, value: 'no' }
            ];
            this.changeDetection.detectChanges();
        }
    }


    /**
     * Get label for export type
     *
     * @returns {string}
     * @memberof GstSettingComponent
     */
    public getExportTypeLabel(): string {
        let value = this.activeCompany.withPay ? 'yes' : 'no';
        const exportType = this.exportTypes.find(item => item.value === value);
        return exportType ? exportType.label : '';
    }

    /**
     * Lifecycle hook runs when component is destroyed
     *
     * @memberof GstSettingComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body').classList.remove('gst-sidebar-open');
        document.querySelector('body').classList.remove('gst-setting-page');
        this.asideGstSidebarMenuState = 'out';
    }

    /**
     * This will use for get stock units
     *
     * @memberof GstSettingComponent
     */
    public getLutList(): void {
        this.componentStore.lutNumberList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                response.forEach((item) => {
                    this.addNewLutItem(item);
                })
            }
        });
    }

}
