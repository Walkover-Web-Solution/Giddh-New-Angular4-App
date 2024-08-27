import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import FroalaEditor from 'froala-editor';
import { ReplaySubject, takeUntil } from 'rxjs';
import Tribute from 'tributejs';
import { CustomEmailComponentStore } from './utility/template-froala.store';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/js/froala_editor.pkgd.min.js';
import { GeneralService } from '../../services/general.service';
@Component({
    selector: 'template-froala',
    templateUrl: './template-froala.component.html',
    styleUrls: ['./template-froala.component.scss'],
    providers: [CustomEmailComponentStore]
})
export class TemplateFroalaComponent implements OnInit {
    /** Instance of subject input field */
    @ViewChild('subjectInputField', { static: false }) subjectInputField: ElementRef;
    /* Aside pane state*/
    public asideMenuState: string = 'out';
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /* This will hold locale JSON data */
    public localeData: any = {};
    /* Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Holds Store update email template API success state as observable*/
    public updateCustomEmailIsSuccess$ = this.componentStore.select(state => state.updateCustomEmailIsSuccess);
    /** Holds Store get email template API success state as observable*/
    public emailTemplates$ = this.componentStore.select(state => state.emailTemplates);
    /** Holds Store get email content suggestions API success state as observable*/
    public emailContentSuggestions$ = this.componentStore.select(state => state.emailContentSuggestions);
    /* Instance of formgroup */
    public emailForm: FormGroup;
    /* Instance of Froala Tribute */
    public froalaTribute: any;
    /* Instance of subject field tribute */
    public subjectTribute: any;
    /* True if show cc */
    public showCc: boolean = true;
    /* True if show bcc */
    public showBcc: boolean = true;
    /* Hold froala editor options */
    public froalaOptions = {
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
            contentChanged: () => { // Handles regular content changes
                this.updateFormControl();
            },
            blur: () => { // Handles changes made in the code view when focus is lost
                this.updateFormControl();
            },
            'codeView.update': () => { // Handles updates while in code view
                this.updateFormControl();
            }
        }
    };
    /* Hold froala editor instance */
    public froalaEditor: any;
    /* Hold to email options */
    public toEmails: any[] = [];
    /* Hold selected to email options */
    public selectedToEmails: any[] = [];
    /* Hold  cc email options */
    public ccEmails: any[] = [];
    /* Hold selected cc email options */
    public selectedCcEmails: any[] = [];
    /* Hold bcc email options */
    public bccEmails: any[] = [];
    /* Hold selected bcc email options */
    public selectedBccEmails: any[] = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public invoiceType,
        private fb: FormBuilder,
        private componentStore: CustomEmailComponentStore,
        private dialog: MatDialog,
        private generalService: GeneralService
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
        this.initializeForm();
        this.getEmailContents();
        this.getEmailTemplates();

        this.emailContentSuggestions$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                const tributeSuggestions = response?.voucherSuggestions?.map(item => ({
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
                }
                if (response?.cc?.length) {
                    this.showCc = true;
                }
                this.selectedToEmails = response.to;
                this.selectedBccEmails = response.bcc;
                this.selectedCcEmails = response.cc;
                this.initializeForm(response);
            }
        });

        this.updateCustomEmailIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response !== undefined || response !== null) {
                this.dialog.closeAll();
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
        const htmlContent = this.froalaEditor.html.get();
        this.emailForm.get('html')?.patchValue(htmlContent);
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
            values: tributeSuggestions,
            selectTemplate: function (item) {
                return `<span class="fr-deletable fr-froalaTribute">@${item.original.value}@</span>`;
            }
        });

        this.subjectTribute = new Tribute({
            values: tributeSuggestions,
            selectTemplate: function (item) {
                return `@${item.original.value}@`;
            }
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
        this.componentStore.getAllEmailTemplate(this.invoiceType);
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
        this.componentStore.getEmailContentSuggestions(null);
    }

    /**
     * Initializes the email form with the provided template data.
     *
     * @param {*} [template]
     * @memberof TemplateFroalaComponent
     */
    public initializeForm(template?: any): void {
        this.emailForm = this.fb.group({
            to: [template?.to ?? ''],
            cc: [template?.cc ?? '',],
            bcc: [template?.bcc ?? ''],
            voucherTypes: [[this.invoiceType]],
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
    public onSubmit(): void {
        this.emailForm.get('to')?.patchValue(this.selectedToEmails);
        this.emailForm.get('bcc')?.patchValue(this.selectedBccEmails);
        this.emailForm.get('cc')?.patchValue(this.selectedCcEmails);
        if (this.emailForm.invalid) {
            return;
        }
        let req = {
            invoiceType: this.invoiceType,
            model: this.emailForm.value
        }
        this.componentStore.updateCustomTemplate(req);
    }

    /**
    * Show/Hide bcc/cc field
    *
    * @param {string} type
    * @memberof TemplateFroalaComponent
    */
    public showHideBccCc(type: string): void {
        if (type == "bcc") {
            this.showBcc = !this.showBcc;
        } else {
            this.showCc = !this.showCc;
        }
    }

    /**
    * Releases the memory
    *
    * @memberof TemplateFroalaComponent
    */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
