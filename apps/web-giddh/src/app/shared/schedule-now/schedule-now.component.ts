import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable, of as observableOf, ReplaySubject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ToasterService } from "../../services/toaster.service";
import * as moment from 'moment/moment';
import { EcommerceService } from "../../services/ecommerce.service";
import { GIDDH_DATE_FORMAT } from "../helpers/defaultDateFormat";
import { IForceClear } from "../../models/api-models/Sales";
import { EMAIL_VALIDATION_REGEX } from "../../app.constant";
import { IOption } from "../../theme/ng-virtual-select/sh-options.interface";
import { select, Store } from "@ngrx/store";
import { AppState } from "../../store";
import { CommonActions } from "../../actions/common.actions";
import { GeneralService } from "../../services/general.service";

@Component({
    selector: 'schedule-now',
    templateUrl: './schedule-now.component.html',
    styleUrls: ['./schedule-now.component.scss']
})
export class ScheduleNowComponent implements OnInit, OnDestroy {
    /* Emitting the close popup event */
    @Output() public closeModal: EventEmitter<boolean> = new EventEmitter(true);
    /** Schedule Now Form Group */
    public scheduleNowForm: FormGroup;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True if beneficiary registration is in progress */
    public isLoading$: Observable<boolean> = observableOf(false);
    /** This will hold time slots */
    public timeSlots: any[] = [];
    /* moment object */
    public moment = moment;
    /** This will hold minimum date user can select in datepicker */
    public minDate: Date = new Date();
    /* Observable for force clear sh-select */
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    /** This will hold country codes */
    public callingCodes$: Observable<IOption[]> = observableOf([]);

    constructor(
        private fb: FormBuilder,
        private toaster: ToasterService,
        private ecommerceService: EcommerceService,
        private store: Store<AppState>,
        private commonActions: CommonActions,
        private generalService: GeneralService
    ) {

    }

    /**
     * Initializes the component
     *
     * @memberof ScheduleNowComponent
     */
    public ngOnInit(): void {
        this.scheduleNowForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', Validators.compose([Validators.required, Validators.email, Validators.pattern(EMAIL_VALIDATION_REGEX)])],
            phoneCode: ['91', Validators.required],
            mobileNo: ['', Validators.required],
            description: [''],
            date: [''],
            time: ['']
        });

        this.getCallingCodes();
        this.createTimeSlots();
    }

    /**
     * This will submit schedule now form
     *
     * @memberof ScheduleNowComponent
     */
    public submit(): void {
        if (!this.scheduleNowForm.invalid) {
            this.isLoading$ = observableOf(true);

            let date = (this.scheduleNowForm.get('date').value) ? moment(this.scheduleNowForm.get('date').value).format(GIDDH_DATE_FORMAT) : "";

            let content = "";
            content += "<b>Name:</b>&nbsp;" + this.scheduleNowForm.get('name').value + "<br>";
            content += "<b>Email:</b>&nbsp;" + this.scheduleNowForm.get('email').value + "<br>";
            content += "<b>Mobile Number:</b>&nbsp;+" + this.scheduleNowForm.get('phoneCode').value + "" +this.scheduleNowForm.get('mobileNo').value + "<br>";
            content += "<b>Description:</b>&nbsp;" + this.scheduleNowForm.get('description').value + "<br>";
            content += "<b>Date:</b>&nbsp;" + date + "<br>";
            content += "<b>Time:</b>&nbsp;" + this.scheduleNowForm.get('time').value + "<br>";

            let scheduleNow = {
                subject: "Giddh - Schedule Now",
                sendFrom: "noreply@giddh.com",
                sendTo: {
                    recipients: ["support@giddh.com"]
                },
                sendCc: {
                    recipients: []
                },
                content: content
            };

            this.ecommerceService.sendEmail(scheduleNow).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                this.toaster.clearAllToaster();
                this.isLoading$ = observableOf(false);

                if (response?.status === "success") {
                    this.closeModal.emit(true);
                    this.toaster.successToast("Your call has been scheduled successfully.");
                } else {
                    this.toaster.errorToast(response?.message);
                }
            });
        }
    }

    /**
     * Releases the memory
     *
     * @memberof ScheduleNowComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * This will create time slots
     *
     * @memberof ScheduleNowComponent
     */
    public createTimeSlots(): void {
        let start = moment("09:00 am", 'hh:mm a');
        let selectedDate = (this.scheduleNowForm?.get('date')?.value) ? moment(this.scheduleNowForm.get('date').value) : moment();
        let current = moment(start);
        let tomorrow = moment().add(1, 'days').hours(9).minutes(0);
        let end = moment("09:00 pm", 'hh:mm a');

        /** If the date is greater than or equals to tomorrow, we will start hours from 9 am */
        if(selectedDate.format(GIDDH_DATE_FORMAT) >= tomorrow.format(GIDDH_DATE_FORMAT)) {
            selectedDate = selectedDate.hours(9);
            selectedDate = selectedDate.minutes(0);
        } else {
            /** If the date is today, we will check current hours, if greater than 9, we will start from current time otherwise we will start from 9 am */
            if(moment().hour() >= 9) {
                selectedDate.hours(moment().hour());
                selectedDate.minutes(moment().minute());
            } else {
                selectedDate = selectedDate.hours(9);
                selectedDate = selectedDate.minutes(0);
            }
            current = moment(this.roundTimeQuarterHour(selectedDate));
        }

        this.forceClear$ = observableOf({ status: true });
        this.timeSlots = [];

        while (current <= end) {
            this.timeSlots.push({ label: current.format('hh:mm a'), value: current.format('hh:mm a') });
            current.add(15, 'minutes');
        }
    }

    /**
     * This will give the closest 15 minute time interval
     *
     * @returns {Date}
     * @memberof ScheduleNowComponent
     */
    public roundTimeQuarterHour(selectedDate: moment.Moment): Date {
        let timeToReturn = moment(selectedDate).toDate()
        timeToReturn.setMinutes(Math.ceil(timeToReturn.getMinutes() / 15) * 15);
        return timeToReturn;
    }

    /**
     * This will create list of calling code
     *
     * @memberof ScheduleNowComponent
     */
    public getCallingCodes(): void {
        this.store.pipe(select(s => s.common.callingcodes), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                let countryPhoneCode = [];
                Object.keys(res.callingCodes).forEach(key => {
                    countryPhoneCode.push({label: res.callingCodes[key], value: res.callingCodes[key]});
                });
                this.callingCodes$ = observableOf(countryPhoneCode);
            } else {
                this.store.dispatch(this.commonActions.GetCallingCodes());
            }
        });
    }

    /**
     * This is to allow only digits
     *
     * @param {*} event
     * @returns {boolean}
     * @memberof ScheduleNowComponent
     */
    public allowOnlyNumbers(event: any): boolean {
        return this.generalService.allowOnlyNumbers(event);
    }
}