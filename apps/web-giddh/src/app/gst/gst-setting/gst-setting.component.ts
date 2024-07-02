import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ReplaySubject, Observable } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Store } from "@ngrx/store";
import { AppState } from "../../store";
import { IOption } from "../../theme/ng-virtual-select/sh-options.interface";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { SettingsProfileActions } from "../../actions/settings/profile/settings.profile.action";
import { GIDDH_DATE_FORMAT, GIDDH_DATE_FORMAT_YYYY_MM_DD } from "../../shared/helpers/defaultDateFormat";
import * as dayjs from "dayjs";
import { GstSettingComponentStore } from "./utility/gst-setting.store";
import { ToasterService } from "../../services/toaster.service";

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
    /** List of export types list */
    public exportTypes: IOption[] = [];
    /** Holds request export type */
    public exportType: string = '';
    /** Hold active company */
    public activeCompany: any;
    /** Holds gst setting form group */
    public gstSettingForm: FormGroup;
    /** Holds company with payment integrate form group */
    public paymentIntegrateForm: FormGroup;
    /** Entry index which is open in edit mode */
    public activeEntryIndex: number = null;
    /* Selected from date */
    public fromDate: string;
    /* Selected to date */
    public toDate: string;
    /** Observable for loading*/
    public isLoading$: Observable<any> = this.componentStore.isLoading$;
    /** Delete Lut Number in progress Observable */
    public deleteLutNumberIsSuccess$: Observable<any> = this.componentStore.deleteLutNumberIsSuccess$;
    /** Create Lut Number in progress Observable */
    public createUpdateIsSuccess$: Observable<any> = this.componentStore.createUpdateIsSuccess$;
    /** Hold response for error message for each index */
    public responseArray: any[] = [];
    /** Hold lut number item list*/
    public lutItemList: any[] = [];

    constructor(
        private breakpointObserver: BreakpointObserver,
        private formBuilder: FormBuilder,
        private store: Store<AppState>,
        private settingsProfileActions: SettingsProfileActions,
        private changeDetection: ChangeDetectorRef,
        private componentStore: GstSettingComponentStore,
        private toaster: ToasterService
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
        document.querySelector('body').classList.add('gst-sidebar-open');

        this.initGstSettingForm();
        this.getLutList();

        this.componentStore.universalDate$.pipe(takeUntil(this.destroyed$)).subscribe(dateObj => {
            if (dateObj) {
                let universalDate = _.cloneDeep(dateObj);
                this.fromDate = universalDate[0];
                this.toDate = universalDate[1];
                let gstFormArray = this.gstSettingForm.get('gstData') as FormArray;
                let gstFormGroup = gstFormArray?.at(0);
                gstFormGroup?.get('fromDate')?.patchValue(this.fromDate);
                gstFormGroup?.get('toDate')?.patchValue(this.toDate);
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

        this.deleteLutNumberIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(result => {
            if (result) {
                this.getLutList();
            }
        });

        this.componentStore.lutNumberList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.lutItemList = [];
            if (response?.length) {
                let mappings = this.gstSettingForm.get('gstData') as FormArray;
                mappings.clear();
                this.lutItemList = response;
                response.forEach((item) => {
                    this.addNewLutItem(item);
                });
            }
            this.changeDetection.detectChanges();
        });

        this.componentStore.lutNumberResponse$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.responseArray[response.lutIndex] = response;
                if (this.responseArray[response.lutIndex]?.successMessage) {
                    this.toaster.showSnackBar('success', this.responseArray[response.lutIndex].successMessage);
                }
                this.changeDetection.detectChanges();
            }
        });
    }

    /**
     * This will be use for init lut form
     *
     * @memberof GstSettingComponent
     */
    public initGstSettingForm(): void {
        this.gstSettingForm = this.formBuilder.group({
            gstData: this.formBuilder.array([
                this.initLutForm()
            ])
        });
        this.paymentIntegrateForm = this.formBuilder.group({
            withPay: [false]
        });
    }

    /**
     *This will be use for lut form FormArray group
     *
     * @return {*}  {FormGroup}
     * @memberof GstSettingComponent
     */
    public initLutForm(data?: any): FormGroup {
        return this.formBuilder.group({
            fromDate: [data?.fromDate ?? ''],
            toDate: [data?.toDate ?? ''],
            lutNumber: [data?.lutNumber ?? ''],
            uniqueName: [data?.uniqueName ?? '']
        });
    }

    /**
     * Get label for export type
     *
     * @returns {string}
     * @memberof GstSettingComponent
     */
    public getExportTypeLabel(): string {
        if (this.activeCompany) {
            let value = this.activeCompany.withPay ? this.commonLocaleData.app_yes.toLowerCase() : this.commonLocaleData.app_no.toLowerCase();
            const exportType = this.exportTypes.find(item => item?.value === value);
            return exportType ? exportType.label : '';
        }
    }

    /**
    * Saves export type
    *
    * @memberof GstSettingComponent
    */
    public setExportType(event?: any): void {
        if (event && event.value && this.exportType !== event.value) {
            this.paymentIntegrateForm.get('withPay')?.patchValue(event.value === this.commonLocaleData.app_yes.toLowerCase());
            const value = event.value === this.commonLocaleData.app_yes.toLowerCase() ? true : false;
            this.store.dispatch(this.settingsProfileActions.PatchProfile({ withPay: value }));
        }
    }

    /**
    * This will use for get lut item list
    *
    * @memberof GstSettingComponent
    */
    public getLutList(): void {
        this.componentStore.getLutNumberList();
    }

    /**
     * This will be use for add new lut item
     *
     * @param {*} [user]
     * @memberof GstSettingComponent
     */
    public addNewLutItem(user?: any): void {
        let mappings = this.gstSettingForm.get('gstData') as FormArray;
        if (user) {
            mappings.push(this.initLutForm({
                fromDate: this.fromDate,
                toDate: this.toDate
            }));
            let lastIndex = mappings.controls.findIndex(control => !control.get('lutNumber')?.value);
            let lastFormArray = mappings.at(lastIndex);
            let fromDate = null;
            let toDate = null;
            if (user.fromDate && user.toDate) {
                fromDate = dayjs(user?.fromDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT_YYYY_MM_DD);
                toDate = dayjs(user.toDate, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT_YYYY_MM_DD);
            }
            if (!lastFormArray?.get('lutNumber')?.value) {
                mappings.at(lastIndex).patchValue({
                    fromDate: fromDate,
                    toDate: toDate,
                    lutNumber: user.lutNumber,
                    uniqueName: user.uniqueName
                });
            }
        } else {
            mappings.push(this.initLutForm({
                fromDate: this.fromDate,
                toDate: this.toDate
            }));
        }
    }

    /**
     * This will be use for remove lut item
     *
     * @param {number} index
     * @memberof GstSettingComponent
     */
    public removeLutItem(index: number): void {
        let mappings = this.gstSettingForm.get('gstData') as FormArray;
        let mappingForm = mappings.at(index);
        if (index === 0) {
            if (mappingForm.get('uniqueName')?.value) {
                this.componentStore.deleteLutNumber({ lutNumberUniqueName: mappingForm.get('uniqueName')?.value });
                mappings.removeAt(index);
                mappings.push(this.initLutForm({
                    fromDate: this.fromDate,
                    toDate: this.toDate
                }));
                this.responseArray[index]['message'] = null;
            } else {
                mappingForm.get('lutNumber')?.patchValue(null);
                mappingForm.get('fromDate')?.patchValue(this.fromDate);
                mappingForm.get('toDate')?.patchValue(this.toDate);
                this.responseArray[index]['message'] = null;
            }
        } else {
            mappings.removeAt(index);
            if (mappingForm.get('uniqueName')?.value) {
                this.responseArray[index] = [];
                this.componentStore.deleteLutNumber({ lutNumberUniqueName: mappingForm.get('uniqueName')?.value });
            }
        }
    }

    /**
    * Callback for translation response complete
    *
    * @param {*} event
    * @memberof GstSettingComponent
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
     *This will be use for create update lut form
     *
     * @memberof GstSettingComponent
     */
    public saveLutNumbers(): void {
        if (!this.gstSettingForm.dirty) {
            return;
        }
        this.responseArray = [];
        const items = this.gstSettingForm.get('gstData') as FormArray;

        const itemsWithOriginalIndex = items.controls.map((ctrl, i) => ({
            ...ctrl.value,
            fromDate: dayjs(ctrl.value.fromDate).format(GIDDH_DATE_FORMAT),
            toDate: dayjs(ctrl.value.toDate).format(GIDDH_DATE_FORMAT)
        }));

        itemsWithOriginalIndex.forEach((obj1, index) => {
            if (!this.lutItemList[index] || this.lutItemList[index].fromDate !== obj1.fromDate || this.lutItemList[index].lutNumber !== obj1.lutNumber || this.lutItemList[index].toDate !== obj1.toDate) {
                const req = {
                    q: obj1,
                    index: index
                };
                if (!this.lutItemList[index]) {
                    this.componentStore.createLutNumber(req);
                } else {
                    this.componentStore.updateLutNumber(req);
                }
            }
        });
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
        this.asideGstSidebarMenuState = 'out';
    }

}
