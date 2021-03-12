import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable, of as observableOf, ReplaySubject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ToasterService } from "../../services/toaster.service";
import * as moment from 'moment/moment';
import { EcommerceService } from "../../services/ecommerce.service";
import { GIDDH_DATE_FORMAT } from "../helpers/defaultDateFormat";

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

    constructor(
        private fb: FormBuilder,
        private toaster: ToasterService,
        private ecommerceService: EcommerceService
    ) {

    }

    /**
     * Initializes the component
     *
     * @memberof ScheduleNowComponent
     */
    public ngOnInit(): void {
        this.createTimeSlots();

        this.scheduleNowForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', Validators.compose([Validators.required, Validators.email])],
            mobileNo: ['', Validators.required],
            description: [''],
            date: ['', Validators.required],
            time: ['']
        });
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
            content += "<b>Mobile Number:</b>&nbsp;" + this.scheduleNowForm.get('mobileNo').value + "<br>";
            content += "<b>Description:</b>&nbsp;" + this.scheduleNowForm.get('description').value + "<br>";
            content += "<b>Date:</b>&nbsp;" + date + "<br>";
            content += "<b>Time:</b>&nbsp;" + this.scheduleNowForm.get('time').value + "<br>";

            let scheduleNow = {
                subject: "Giddh - Schedule Now",
                sendFrom: "noreply@giddh.com",
                sendTo: {
                    recipients: ["ravinder@walkover.in"]
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
                    this.toaster.successToast(response?.body);
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
        let end = moment("09:00 pm", 'hh:mm a');
        let current = (moment() <= start) ? moment(start) : moment();

        while (current <= end) {
            this.timeSlots.push({ label: current.format('hh:mm a'), value: current.format('hh:mm a') });
            current.add(15, 'minutes');
        }
    }
}