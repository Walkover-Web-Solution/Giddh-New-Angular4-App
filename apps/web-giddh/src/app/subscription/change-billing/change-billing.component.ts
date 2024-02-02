import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'change-billing',
    templateUrl: './change-billing.component.html',
    styleUrls: ['./change-billing.component.scss']
})
export class ChangeBillingComponent implements OnInit {
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if api call in progress */
    public showLoader: boolean = true;
    public changeBillingForm: UntypedFormGroup;
    constructor(private fb: UntypedFormBuilder) { }

    public ngOnInit(): void {
        this.initForm();

    }

    public initForm(): void {
        this.changeBillingForm = this.fb.group({
            billingName: ['',],
            mobile: [''],
            companyName: [''],
            pincode: [''],
            county: [''],
            gstin: [''],
            state: [''],
            address: [''],
            emailId: ["", [Validators.email]],
        });
    }

}
