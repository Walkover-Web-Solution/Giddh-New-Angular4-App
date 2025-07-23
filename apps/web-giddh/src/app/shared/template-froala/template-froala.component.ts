import { Component, ElementRef, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import FroalaEditor from 'froala-editor';
import { Observable, ReplaySubject, takeUntil } from 'rxjs';
import Tribute from 'tributejs';
import { CustomEmailComponentStore } from './utility/template-froala.store';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/js/froala_editor.pkgd.min.js';
import { EmailType } from './utility/template-froala.const';
import { cloneDeep } from '../../lodash-optimized';
import { SelectMultipleFieldsComponent } from '../../theme/form-fields/select-multiple-fields/select-multiple-fields.component';

@Component({
    selector: 'template-froala',
    templateUrl: './template-froala.component.html',
    styleUrls: ['./template-froala.component.scss'],
    providers: [CustomEmailComponentStore]
})
export class TemplateFroalaComponent implements OnInit {
    /** Instance of select multiple fields*/
    @ViewChildren(SelectMultipleFieldsComponent) childComponents!: QueryList<SelectMultipleFieldsComponent>;
    /** Instance of subject input field */
    @ViewChild('subjectInputField', { static: false }) subjectInputField: ElementRef;
    /** Aside pane state*/
    public asideMenuState: string = 'out';
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** This will hold locale JSON data */
    public localeData: any = {};
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Holds Store update email template API success state as observable*/
    public updateCustomEmailIsSuccess$: Observable<any> = this.componentStore.select(state => state.updateCustomEmailIsSuccess);
    /** Holds Store get email template API success state as observable*/
    public emailTemplates$: Observable<any> = this.componentStore.select(state => state.emailTemplates);
    /** Holds Store get email content suggestions API success state as observable*/
    public emailContentSuggestions$: Observable<any> = this.componentStore.select(state => state.emailContentSuggestions);
    /** Instance of formgroup */
    public emailForm: FormGroup;
    /** Instance of Froala Tribute */
    public froalaTribute: any;
    /** Instance of subject field tribute */
    public subjectTribute: any;
    /** True if show cc */
    public showCc: boolean = false;
    /** True if show bcc */
    public showBcc: boolean = false;
    /** Hold froala editor instance */
    public froalaEditor: any;
    /** Hold froala editor text trigger */
    public froalaEditorTextTrigger: string = '{'; // By default froala editor instance is @ if not defined
    /** Hold email suggestion prefix */
    public emailSuggestionPrefix: string = '{';
    /** Hold email suggestion suffix */
    public emailSuggestionSuffix: string = '}';
    /** Hold froala editor options */
    public froalaOptions: any = {
        key: FROALA_EDITOR_KEY,
        attribution: false,
        heightMin: 300,
        heightMax: 300,
        zIndex: 2501,
        toolbarSticky: true,
        toolbarButtons: {
            moreText: {
                buttons: [
                    'bold', 'italic', 'underline', 'strikeThrough', 'fontFamily', 'fontSize', 'textColor',
                    'backgroundColor', 'clearFormatting',
                ],
                align: 'left',
                buttonsVisible: 9
            },
            moreRich: {
                buttons: [
                    'html', 'help',
                    'fullscreen', 'emoticons', 'fontAwesome', 'insertHR'
                ],
                align: 'left',
                buttonsVisible: 6
            },
            moreParagraph: {
                buttons: [
                    'alignLeft', 'alignCenter', 'alignRight', 'alignJustify',
                    'formatOLSimple', 'formatOL', 'formatUL', 'paragraphFormat',
                    'paragraphStyle', 'lineHeight', 'outdent', 'indent', 'quote'
                ],
                align: 'left',
                buttonsVisible: 13
            }
        },
        placeholderText: this.localeData?.email_content_suggestions,
        charCounterCount: false,
        wordCount: false,
        htmlAllowedTags: ['.*'],
        htmlAllowedAttrs: ['.*'],
        events: {
            initialized: (event) => {
                this.froalaEditor = event.getEditor();
                this.froalaEditor.events.on(
                    'keydown',
                    (e) => {
                        if (e.which == FroalaEditor.KEYCODE.ENTER && this.froalaTribute.isActive) {
                            return false;
                        }
                    },
                    true
                );
            },
            blur: () => { // Handles changes made in the code view when focus is lost
                if (this.froalaEditor.codeView?.isActive()) {
                    this.froalaEditor?.html?.set(this.froalaEditor?.codeView?.get());
                    this.updateFormControl();
                }
            }
        }
    };
    /** Hold to email options */
    public toEmails: any[] = [];
    /** Hold selected to email options */
    public selectedToEmails: any[] = [];
    /** Hold  cc email options */
    public ccEmails: any[] = [];
    /** Hold selected cc email options */
    public selectedCcEmails: any[] = [];
    /** Hold bcc email options */
    public bccEmails: any[] = [];
    /** Hold selected bcc email options */
    public selectedBccEmails: any[] = [];
    /** Hold if user click outside of email section */
    public clickedInsideEmailSection: boolean = false;
    /** Holds all static emails (To, Cc, Bcc) combined in a single string */
    public allStaticEmails: string = "";
    /** This variable is used to store the count of hidden emails, formatted as a string */
    public hiddenEmailList: string = "";
    /** Holds the maximum number of emails to display */
    public noOfMaximumEmailsShow: number = 2;
    /** Holds email type */
    public emailType: any = EmailType;
    /** This variable maintains the focus state for email types: "to", "cc", and "bcc". */
    public emailFocusStates: any = {
        isTo: true,
        isCc: true,
        isBcc: true
    };
    /** Calculates the total number of email addresses across To, Cc, and Bcc fields. */
    public get getTotalEmailsCount(): number {
        return this.selectedToEmails.length + this.selectedCcEmails.length + this.selectedBccEmails.length;
    };
    /** Holds width of select-multiple-fields */
    public optionClass: string = '';

    constructor(
        @Inject(MAT_DIALOG_DATA) public inputData,
        private formBuilder: FormBuilder,
        private componentStore: CustomEmailComponentStore,
        public dialogRef: MatDialogRef<any>
    ) { }

    /**
     * Initializes the component and performs necessary operations.
     *
     * This function sets up the initial state of the component, fetches email content suggestions,
     * email templates, and subscribes to relevant observables. It also initializes the form and
     * sets up the Froala editor with tribute suggestions.
     *
     * @returns {void}
     * @memberof TemplateFroalaComponent
     */
    public ngOnInit(): void {
        document.querySelector('body').classList.add('hide-chat-widget');
        this.initializeForm();
        this.getEmailContents();
        this.getEmailTemplates();

        this.emailContentSuggestions$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                const emailSuggestions = this.inputData?.activeTab ? response?.customerVendorSuggestions : response?.voucherSuggestions;
                const tributeSuggestions = emailSuggestions?.map(item => ({
                    value: item,
                    key: item
                }));

                setTimeout(() => {
                    this.initializeTribute(tributeSuggestions);
                }, 300);

                const mappedEmail = this.mapEmailSuggestions(response.emailSuggestions);
                this.toEmails = mappedEmail;
                this.ccEmails = mappedEmail;
                this.bccEmails = mappedEmail;
            }
        });

        this.emailTemplates$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                if (response?.bcc?.length) {
                    this.showBcc = true;
                    this.selectedBccEmails = response.bcc;
                }
                if (response?.cc?.length) {
                    this.showCc = true;
                    this.selectedCcEmails = response.cc;
                }
                if (response.to?.length) {
                    this.selectedToEmails = response.to;
                }
                this.clickedOutsideEmail();
                this.initializeForm(response);
            }
        });

        this.updateCustomEmailIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.dialogRef.close(response);
            }
        });
    }

    /**
     * This will update the html form control with the froala html
     *
     * @private
     * @memberof TemplateFroalaComponent
     */
    private updateFormControl(): void {
        this.emailForm.get('html')?.patchValue(this.froalaEditor.html.get());
    }

    /**
     * Updates the focus state for the email types ('to', 'cc', 'bcc').
     * @returns {void}
     * @param {string} emailType
     * @memberof TemplateFroalaComponent
     */
    public setEmailFocus(emailType: string): void {
        this.emailFocusStates.isTo = emailType === EmailType.To;
        this.emailFocusStates.isCc = emailType === EmailType.Cc;
        this.emailFocusStates.isBcc = emailType === EmailType.Bcc;
    }

    /**
     * Initializes the Froala editor with tribute suggestions.
     *
     * This function is responsible for setting up the tribute suggestions for the Froala editor and the subject input field.
     * It checks if the tribute instances already exist and detaches them if necessary. Then, it creates new instances of tribute
     * with the provided suggestions and attaches them to the respective elements.
     *
     * @param tributeSuggestions - An array of suggestions to be used in the tribute instances.
     * @returns {void}
     * @memberof TemplateFroalaComponent
     */
    private initializeTribute(tributeSuggestions: any[]): void {
        if (this.froalaTribute) {
            this.froalaTribute.detach(this.froalaEditor.el);
        }

        if (this.subjectTribute) {
            this.froalaTribute.detach(this.subjectInputField.nativeElement);
        }

        this.froalaTribute = new Tribute({
            trigger: this.froalaEditorTextTrigger,
            values: tributeSuggestions,
            selectTemplate: (item) => `<span class="fr-deletable fr-froalaTribute">${this.emailSuggestionPrefix}${item.original.value}${this.emailSuggestionSuffix}</span>`
        });

        this.subjectTribute = new Tribute({
            trigger: this.froalaEditorTextTrigger,
            values: tributeSuggestions,
            selectTemplate: (item) => `${this.emailSuggestionPrefix}${item.original.value}${this.emailSuggestionSuffix}`
        });

        if (this.froalaEditor) {
            this.froalaTribute.attach(this.froalaEditor.el);
        }
        if (this.subjectInputField && this.subjectInputField.nativeElement) {
            this.subjectTribute.attach(this.subjectInputField.nativeElement);
        }
    }

    /**
     * Maps email suggestions to a format suitable for the dropdown options.
     *
     * This function takes an array of email suggestions and transforms it into an array of objects,
     * each containing a `value` and `label` property. The `value` and `label` properties are set to the same value,
     * which is the original email suggestion.
     *
     * @param emailSuggestions - An array of email suggestions to be mapped.
     * @returns An array of objects, where each object has a `value` and `label` property set to the corresponding email suggestion.
     * If the `emailSuggestions` array is `null` or `undefined`, an empty array is returned.
     *
     * @memberof TemplateFroalaComponent
     */
    private mapEmailSuggestions(emailSuggestions: any[]): any[] {
        return emailSuggestions?.map(result => ({
            value: result,
            label: result
        })) || [];
    }

    /**
     * Fetches email conditions from the server and updates the store.
     *
     * This function triggers the `getEmailConditionSuggestion` action in the `CustomEmailComponentStore`
     * with a `null` payload. It is responsible for fetching email conditions based on the provided
     * parameters and updating the store with the retrieved data.
     *
     * @returns {void}
     *
     * @memberof TemplateFroalaComponent
     */
    public getEmailTemplates(): void {
        this.componentStore.getAllEmailTemplate(this.inputData?.activeTab ? this.inputData?.activeTab : this.inputData);
    }

    /**
     * Fetches email content suggestions from the server and updates the store.
     *
     * This function triggers the `getEmailContentSuggestions` action in the `CustomEmailComponentStore`
     * with a `null` payload. It is responsible for fetching email content suggestions based on the provided
     * parameters and updating the store with the retrieved data.
     *
     * @returns {void}
     *
     * @memberof TemplateFroalaComponent
     */
    public getEmailContents(): void {
        this.componentStore.getEmailContentSuggestions(this.inputData?.activeTab ? this.inputData.activeTab : this.inputData);
    }

    /**
     * Initializes the email form with the provided template data.
     *
     * @param {*} [template]
     * @memberof TemplateFroalaComponent
     */
    public initializeForm(template?: any): void {
        this.emailForm = this.formBuilder.group({
            to: [template?.to ?? ''],
            cc: [template?.cc ?? '',],
            bcc: [template?.bcc ?? ''],
            voucherTypes: [[this.inputData]],
            emailSubject: [template?.emailSubject ?? ''],
            html: [template?.html ?? '']
        });
    }

    /**
     * Handles the submission of the email form.
     *
     * This function is responsible for preparing the form data, validating it, and sending it to the server for updating the custom template.
     * It updates the `to`, `bcc`, and `cc` fields of the form with the selected email options, logs the form data, checks if the form is valid,
     * and constructs a request object with the necessary data. Finally, it triggers the `updateCustomTemplate` action in the `CustomEmailComponentStore`
     * with the constructed request object.
     *
     * @returns {void}
     *
     * @memberof TemplateFroalaComponent
     */
    public onSubmit(type: string): void {
        this.emailForm.get(EmailType.To)?.patchValue(this.selectedToEmails);
        this.emailForm.get(EmailType.Bcc)?.patchValue(this.selectedBccEmails);
        this.emailForm.get(EmailType.Cc)?.patchValue(this.selectedCcEmails);

        if (this.emailForm.invalid) {
            return;
        }

        const formValue = cloneDeep(this.emailForm.value);
        delete formValue?.voucherTypes;

        // Prepare request based on type
        const req = this.prepareRequest(type, formValue);
        this.componentStore.updateCustomTemplate(req);
    }

    /**
     * Prepares the request object based on the submission type
     * @param type - Type of submission ('save' or 'send')
     * @param formValue - Form values to be included in request
     * @returns Prepared request object
     */
    private prepareRequest(type: string, formValue: any): any {
        const isActiveTab = this.inputData?.activeTab;

        if (!isActiveTab) {
            return {
                voucherType: this.inputData,
                model: this.emailForm.value
            };
        }

        const model = {
            ...formValue,
            customerVendorUniqueNames: Array.isArray(this.inputData?.accountUniqueName) ? this.inputData?.accountUniqueName : [this.inputData?.accountUniqueName]
        };

        // Only add sendMail flag when type is 'send'
        if (type === 'send') {
            model.sendMail = true;
        }

        return {
            voucherType: isActiveTab,
            model
        };
    }

    /**
    * Show/Hide bcc/cc field
    * @returns {void}
    * @param {string} emailType
    * @memberof TemplateFroalaComponent
    */
    public toggleBccCc(emailType: string): void {
        this.setEmailFocus(emailType);
        if (this.childComponents.length > 0) {
            this.childComponents.forEach(result => {
                result?.trigger?.closePanel();
            });
        }
        this.showBcc = emailType === EmailType.Bcc ? true : this.showBcc;
        this.showCc = emailType === EmailType.Cc ? true : this.showCc;
    }

    /**
    * Releases the memory
    *
    * @memberof TemplateFroalaComponent
    */
    public ngOnDestroy(): void {
        document.querySelector('body').classList.remove('hide-chat-widget');
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
    /**
     * Clicked inside Email section
     *
     * @memberof TemplateFroalaComponent
     */
    public clickedInsideEmail(): void {
        this.allStaticEmails = '';
        this.hiddenEmailList = '';
        this.clickedInsideEmailSection = true;
    }

    /**
     * Clicked outside Email section
     *
     * @memberof TemplateFroalaComponent
     */
    public clickedOutsideEmail(): void {
        if (!this.allStaticEmails) {
            this.getAllStaticEmails();
            this.clickedInsideEmailSection = false;
            if ((this.emailFocusStates.isBcc && this.selectedBccEmails.length === 0) || (this.emailFocusStates.isCc && this.selectedCcEmails.length === 0)) {
                this.setEmailFocus(EmailType.To);
            }
            this.showBcc = this.selectedBccEmails.length > 0;
            this.showCc = this.selectedCcEmails.length > 0;
        }
    }

    /**
     * Get all Emails
     *
     * @memberof TemplateFroalaComponent
     */
    private getAllStaticEmails(): void {
        this.allStaticEmails = '';
        this.hiddenEmailList = '';

        // Helper function to append emails
        const appendEmails = (emails: string[], prefix = '', limit = this.noOfMaximumEmailsShow - (this.allStaticEmails.trim() === "" ? 0 : this.allStaticEmails.split(',').length)) => {
            for (let i = 0; i < Math.min(emails.length, limit); i++) {
                if (this.allStaticEmails) {
                    this.allStaticEmails += `, `;
                }
                this.allStaticEmails += `${i === 0 ? prefix : ""}${emails[i]}`;
            }
        };

        // Add To emails
        appendEmails(this.selectedToEmails);

        // Add Cc emails if there is space
        if (this.selectedToEmails.length < this.noOfMaximumEmailsShow) {
            appendEmails(this.selectedCcEmails);
        }

        // Add Bcc emails if there is space
        if (this.allStaticEmails.split(',').length < this.noOfMaximumEmailsShow) {
            appendEmails(this.selectedBccEmails, 'Bcc: ');
        }

        // Calculate hidden emails
        const totalEmails = this.getTotalEmailsCount;
        const visibleEmails = this.selectedToEmails.length + this.selectedCcEmails.length;
        const hiddenEmailsCount = totalEmails - this.noOfMaximumEmailsShow;

        if (hiddenEmailsCount > 0) {
            if (visibleEmails <= this.noOfMaximumEmailsShow) {
                this.hiddenEmailList += ` ${hiddenEmailsCount} Bcc`;
            } else {
                const bccInfo = this.selectedBccEmails.length ? ` (${this.selectedBccEmails.length} Bcc)` : '';
                this.hiddenEmailList += ` ${hiddenEmailsCount} ${this.commonLocaleData.app_more}${bccInfo}`;
            }
        }
    }

}
