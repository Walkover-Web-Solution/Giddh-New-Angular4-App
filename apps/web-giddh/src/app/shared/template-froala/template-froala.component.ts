import { Component, ElementRef, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import FroalaEditor from 'froala-editor';
import { debounceTime, distinctUntilChanged, filter, Observable, pipe, ReplaySubject, skip, take, takeUntil, Subscription } from 'rxjs';
import Tribute from 'tributejs';
import { CustomEmailComponentStore } from './utility/template-froala.store';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/js/froala_editor.pkgd.min.js';
import { DEFAULT_TRIGGER_TEMPLATE, EmailType, EntityEnum, OtherTimeOptionsEnum, TriggerActionEnum, TriggerModuleEnum } from './utility/template-froala.const';
import { SelectMultipleFieldsComponent } from '../../theme/form-fields/select-multiple-fields/select-multiple-fields.component';
import { GeneralService } from '../../services/general.service';
import { TitleCasePipe } from '@angular/common';
// import { TriggerComponentStore } from '../triggers/uitilty/trigger.store';
import { IOption, PAGINATION_LIMIT, WeekdaysEnum } from '../../app.constant';
import { AccountingGroupEnum } from '../Enums/common.enum';
import { PageLeaveUtilityService } from '../../services/page-leave-utility.service';
import { Configuration } from '../../app.constant';
import { environment } from '../../../environments/environment';
import { cloneDeep, find, forEach, get, includes, isArray, isEqual, keys, map, remove, set, some } from '../../lodash-optimized';

@Component({
    selector: 'template-froala',
    templateUrl: './template-froala.component.html',
    styleUrls: ['./template-froala.component.scss'],
    providers: [CustomEmailComponentStore],
    standalone:false
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
    /** Track subscriptions manually for Angular 21 compatibility */
    private subscriptions: Subscription[] = [];
    /** Flag to track component destruction state */
    private isDestroying = false;
    /** Holds Store update email template API success state as observable*/
    public updateCustomEmailIsSuccess$: Observable<any> = this.componentStore.select(state => state.updateCustomEmailIsSuccess);
    /** Holds Store get email template API success state as observable*/
    public emailTemplates$: Observable<any> = this.componentStore.select(state => state.emailTemplates);
    /** Holds Store get email content suggestions API success state as observable*/
    public emailContentSuggestions$: Observable<any> = this.componentStore.select(state => state.emailContentSuggestions);
    /** Holds Store get account group list API success state as observable*/
    public accountGroupList$: Observable<IOption[]> = this.componentStore.select(state => state.accountGroupList);
    /** Holds Store get email condition suggestions API success state as observable*/
    public emailConditionSuggestions$: Observable<any> = this.componentStore.select(state => state.emailConditionSuggestions);
    /** Instance of email form group */
    public emailForm: FormGroup;
    /** Instance of custom trigger form group */
    public customTriggerForm: FormGroup;
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
    /** Instance of is electron variable */
    public isElectron: any = Configuration.isElectron;
    /** Hold froala editor options */
    public froalaOptions: any;
    /** Retry counter for Froala initialization */
    private froalaInitRetryCount: number = 0;
    /** Maximum retry attempts for Froala initialization */
    private maxFroalaInitRetries: number = 5;
    /** Retry delay in milliseconds */
    private froalaInitRetryDelay: number = 500;
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
    /** Holds field options */
    public entityOptions: IOption[] = [];
    /** Holds entity account group options */
    public entityAccountGroupOptions: IOption[] = [];
    /** Holds trigger options */
    public triggerOptions: IOption[] = [];
    /** Holds action options */
    public actionOptions: IOption[] = [];
    /** Holds condition options */
    public conditionOptions: IOption[] = [];
    /** Holds days options i.e Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday */
    public dayOfWeekOptions: IOption[] = [];
    /** Holds date of month i.e 1 to 31 */
    public dayOfMonthOptions: IOption[] = [];
    /** Holds Time Other option like "Day of Week" or "Date of Month" */
    public timeOtherOptions: IOption[] = [];
    /** Holds all voucher list */
    public voucherList: IOption[] = [];
    /** Holds filtered voucher list */
    public filteredVoucherList: IOption[] = [];
    /** Holds filtered action list */
    public filteredActionList: IOption[] = [];
    /** Holds true if show day of week dropdown */
    public showDayOfWeek: boolean = null;
    /** Holds selected time action value for day action dropdown */
    public selectedTimeAction: string = '';
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
    /** Holds entity enum */
    public entityEnum: typeof EntityEnum = EntityEnum;
    /** Holds email condition suggestions label options */
    public emailConditionSuggestionsLabelOptions: { [key: string]: { dropdownLabel: string, inputLabel: string, options: IOption[] } } = {};
    /** This will use for instance of voucher list Dropdown */
    public voucherListDropdown: FormControl = new FormControl();
    /** This will use for instance of account group Dropdown */
    public accountGroupDropdown: FormControl = new FormControl();
    /** This will use for instance of action Dropdown */
    public actionListDropdown: FormControl = new FormControl();
    /** Holds true if form is invalid */
    public isFormInvalid: boolean = false;
    /** Holds true if it is trigger */
    public isTrigger: boolean;
    /** Holds true if form has unsaved changes */
    public hasUnsavedChanges: boolean = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public inputData,
        private formBuilder: FormBuilder,
        private componentStore: CustomEmailComponentStore,
        // private triggerStore: TriggerComponentStore,
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<any>,
        private generalService: GeneralService,
        private titleCasePipe: TitleCasePipe,
        private pageLeaveUtilityService: PageLeaveUtilityService
    ) {
        // Initialize Froala options after environment detection
        this.froalaOptions = this.getFroalaOptions();
    }

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
        this.isTrigger = this.inputData?.isTrigger;
        this.initializeForm();
        this.getEmailContents();
        if (this.isTrigger) {
            // this.triggerStore.createUpdateTriggerIsSuccess$.pipe(
            //     takeUntil(this.destroyed$),
            //     filter(Boolean),
            //     take(1)
            // ).subscribe(() => this.dialogRef.close(true));

            this.emailConditionSuggestions$.pipe(
                takeUntil(this.destroyed$),
                filter(suggestions => suggestions?.length > 0),
                distinctUntilChanged()
            ).subscribe(suggestions => this.addConditionControls(suggestions));

            // this.triggerStore.triggerDetails$.pipe(
            //     takeUntil(this.destroyed$),
            //     filter(Boolean),
            //     distinctUntilChanged()
            // ).subscribe(triggerDetails => {
            //     if (triggerDetails) {
            //         triggerDetails = {...triggerDetails, ...triggerDetails?.emailTemplate};
            //         triggerDetails['conditions'] = triggerDetails?.conditionMap;
            //         this.customTriggerForm.patchValue(triggerDetails, { emitEvent: false });
            //         this.selectedToEmails = this.customTriggerForm.get(EmailType.To)?.value;
            //         this.selectedBccEmails = this.customTriggerForm.get(EmailType.Bcc)?.value;
            //         this.selectedCcEmails = this.customTriggerForm.get(EmailType.Cc)?.value;
            //         this.showDayOfWeek = Boolean(triggerDetails.executionTime.dayOfWeek);
            //         this.onEntityChange({ value: triggerDetails.entity, label: triggerDetails.entity }, true);
            //         this.clickedOutsideEmail();
            //     }
            // });
            this.componentStore.getEmailConditionSuggestion(TriggerModuleEnum.VoucherDue);


            /** Search for voucher list dropdown */
            this.voucherListDropdown.valueChanges.pipe(this.searchPipe).subscribe((search: string) => {
                if (!search) {
                    this.filteredVoucherList = this.voucherList;
                } else {
                    this.filteredVoucherList = this.voucherList.filter(voucher => voucher?.label?.toLowerCase()?.includes(search?.toLowerCase()));
                }
            });

            /** Search for account group dropdown */
            this.accountGroupDropdown.valueChanges.pipe(this.searchPipe, filter(search => search !== null && search !== undefined)).subscribe(search => {
                this.getFlattenAccountGroupList({
                    page: 1,
                    count: PAGINATION_LIMIT,
                    entity: this.customTriggerForm?.get('entity')?.value,
                    query: search || ''
                });
            });

            /** Search for action dropdown */
            this.actionListDropdown.valueChanges.pipe(this.searchPipe).subscribe((search: string) => {
                if (!search) {
                    this.filteredActionList = this.actionOptions;
                } else {
                    this.filteredActionList = this.actionOptions.filter(action => action?.label?.toLowerCase()?.includes(search?.toLowerCase()));
                }
            });
        } else {
            this.getEmailTemplates();
        }

        this.emailContentSuggestions$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                const emailSuggestions = this.inputData?.activeTab ? response?.customerVendorSuggestions : response?.voucherSuggestions;
                const tributeSuggestions = emailSuggestions?.map(item => ({
                    value: item,
                    key: item
                }));

                if (!this.froalaEditor) {
                    this.froalaOptions = this.getFroalaOptions();
                }
                setTimeout(() => {
                    this.initializeTribute(tributeSuggestions);
                }, 300);

                const mappedEmail = this.mapEmailSuggestions(response.emailSuggestions);
                this.toEmails = mappedEmail;
                this.ccEmails = mappedEmail;
                this.bccEmails = mappedEmail;

                if (this.isTrigger) {
                    this.voucherList = this.generalService.getVoucherTypeList(this.commonLocaleData, response?.voucherNames);
                    this.filteredVoucherList = this.voucherList;
                }
            }
        });

        this.emailTemplates$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && !this.isTrigger) {
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

                // Patch existing form instead of recreating it
                this.emailForm.patchValue({
                    to: response.to ?? [],
                    cc: response.cc ?? [],
                    bcc: response.bcc ?? [],
                    emailSubject: response.emailSubject ?? null,
                    html: response.html ?? null
                }, { emitEvent: false });
            }
        });

        this.updateCustomEmailIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.dialogRef.close(response);
            }
        });

        (this.isTrigger ? this.customTriggerForm : this.emailForm).valueChanges.pipe(
            takeUntil(this.destroyed$),
            debounceTime(300),
            skip(1),
            distinctUntilChanged()
        ).subscribe(response => {
            if (response) {
                if (this.inputData?.triggerUniqueName && !response.title) return;
                this.hasUnsavedChanges = true;
            }
        });
    }

    /**
     * This will handle the search pipe for ngx-mat-select-search
     *
     * @private
     * @memberof TemplateFroalaComponent
     */
    private readonly searchPipe = pipe(
        distinctUntilChanged(),
        debounceTime(700),
        takeUntil(this.destroyed$)
    );

    /**
     * This will update the html form control with the froala html
     *
     * @private
     * @memberof TemplateFroalaComponent
     */
    private updateFormControl(): void {
        if (this.froalaEditor) {
            const currentForm = this.isTrigger ? this.customTriggerForm : this.emailForm;
            const htmlContent = this.froalaEditor.html.get();
            currentForm.get('html')?.patchValue(htmlContent, { emitEvent: false });
        }
    }

    /**
     * This will return the froala options
     *
     * @return {*}  {*}
     * @memberof TemplateFroalaComponent
     */
    public getFroalaOptions() : any {
        return {
            key: '',
            attribution: false,
            heightMin: 300,
            heightMax: 300,
            zIndex: 2501,
            toolbarSticky: true,
            // Add Electron-specific configurations
            requestWithCORS: Configuration.isElectron ? false : true,
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

                    // Add additional delay for Electron environment
                    const setupDelay = Configuration.isElectron ? 200 : 0;
                    setTimeout(() => {
                        this.setupFroalaEventHandlers();

                        // Set initial content from form control with additional delay for Electron
                        const contentDelay = Configuration.isElectron ? 300 : 0;
                        setTimeout(() => {
                            const currentForm = this.isTrigger ? this.customTriggerForm : this.emailForm;
                            const htmlValue = currentForm?.get('html')?.value;
                            if (htmlValue) {
                                this.froalaEditor.html.set(htmlValue);
                            }
                        }, contentDelay);
                    }, setupDelay);
                },
                blur: () => { // Handles changes made in the code view when focus is lost
                    if (this.froalaEditor?.codeView?.isActive()) {
                        this.froalaEditor?.html?.set(this.froalaEditor?.codeView?.get());
                        this.updateFormControl();
                    }
                },
                'contentChanged': () => {
                    this.updateFormControl();
                },
                // Add error handling for Electron
                'error': (error) => {
                    if (Configuration.isElectron && this.froalaInitRetryCount < this.maxFroalaInitRetries) {
                        this.retryFroalaInitialization();
                    }
                }
            }
        }
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
     * Sets up Froala event handlers
     *
     * @private
     * @memberof TemplateFroalaComponent
     */
    private setupFroalaEventHandlers(): void {
        if (this.froalaEditor) {
            this.froalaEditor.events.on(
                'keydown',
                (e) => {
                    console.log("Triggered : ", e);
                    if ((e.which == FroalaEditor.KEYCODE.ENTER || e.which == FroalaEditor.KEYCODE.BACKSPACE) && this.froalaTribute?.isActive) {
                        console.log("Run : ", e);
                        return false;
                    }
                }
            );
        }
    }

    /**
     * Retries Froala editor initialization
     *
     * @private
     * @memberof TemplateFroalaComponent
     */
    private retryFroalaInitialization(): void {
        this.froalaInitRetryCount++;
        setTimeout(() => {
            this.froalaOptions = this.getFroalaOptions();
        }, this.froalaInitRetryDelay * this.froalaInitRetryCount);
    }

    /**
     * Initializes tribute with retry mechanism for Electron
     *
     * @private
     * @param {any[]} tributeSuggestions
     * @memberof TemplateFroalaComponent
     */
    private initializeTributeWithRetry(tributeSuggestions: any[]): void {
        if (!tributeSuggestions || tributeSuggestions.length === 0) {
            return;
        }

        const attemptInitialization = (attempt: number = 1) => {
            if (this.froalaEditor && this.froalaEditor.el) {
                this.initializeTribute(tributeSuggestions);
            } else if (attempt < this.maxFroalaInitRetries) {
                setTimeout(() => attemptInitialization(attempt + 1), this.froalaInitRetryDelay);
            }
        };
        attemptInitialization();
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
            this.subjectTribute.detach(this.subjectInputField.nativeElement);
        }

        this.froalaTribute = new Tribute({
            trigger: this.froalaEditorTextTrigger,
            values: tributeSuggestions,
            selectTemplate: (item) => `<span class="fr-deletable fr-froalaTribute">${item?.original?.value ? this.emailSuggestionPrefix + item.original.value + this.emailSuggestionSuffix : ""}</span>`
        });

        this.subjectTribute = new Tribute({
            trigger: this.froalaEditorTextTrigger,
            values: tributeSuggestions,
            selectTemplate: (item) => `${item?.original?.value ? this.emailSuggestionPrefix + item.original.value + this.emailSuggestionSuffix : ""}`
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
        if (this.isTrigger) {
            this.customTriggerForm = this.formBuilder.group({
                title: [null, [Validators.required]],
                triggerModule: [TriggerModuleEnum.VoucherDue, [Validators.required]],
                entity: [null],
                entityUniqueNames: [[]],
                voucherTypes: [null],
                emailSubject: [null, [Validators.required]],
                to: [[]],
                cc: [[]],
                bcc: [[]],
                executionTime: this.getExecutionTimeFormGroup(),
                actions: [[TriggerActionEnum.AttachVoucherPdf]],
                html: [DEFAULT_TRIGGER_TEMPLATE, [Validators.required]],
                disabled: [false]
            }, { emitEvent: false });
        } else {
            this.emailForm = this.formBuilder.group({
                to: [template?.to ?? []],
                cc: [template?.cc ?? []],
                bcc: [template?.bcc ?? []],
                voucherTypes: [[this.inputData]],
                emailSubject: [template?.emailSubject ?? null],
                html: [template?.html ?? null]
            }, { emitEvent: false });
        }
    }

    /**
     * Returns a validator that ensures at least one of the specified fields has a value.
     *
     * @param {string[]} fields - The fields to check for values.
     * @returns {ValidatorFn} - A validator function that returns null if at least one field has a value, otherwise returns an error.
     */
    private atLeastOneValidator(fields: string[]): ValidatorFn {
        return (group: AbstractControl): ValidationErrors | null => {
            if (!(group instanceof FormGroup)) {
                return null;
            }

            const hasValue = fields.some(field => {
                const control = group.get(field);
                return control && control.get('value')?.value;
            });

            return hasValue ? null : { atLeastOneRequired: true };
        };
    }

    /**
     * Returns execution time form group
     *
     * @private
     * @return {*}  {FormGroup}
     * @memberof TemplateFroalaComponent
     */
    private getExecutionTimeFormGroup(value?: any): FormGroup {
        return this.formBuilder.group({
            time: [value?.time ?? ''],
            dayOfWeek: [value?.dayOfWeek ?? ''],
            dayOfMonth: [value?.dayOfMonth ?? '']
        });
    }

    /**
     * Adds condition controls to the form group.
     *
     * @param {any} conditions - The conditions to add.
     * @memberof TemplateFroalaComponent
     */
    private addConditionControls(conditions: any): void {
        const dynamicControls = new FormGroup({});
        const requiredFields: string[] = [];

        conditions.forEach((condition: any) => {
            Object.entries(condition).forEach(([conditionData, conditionKey]) => {
                if (conditionData === 'variable') {
                    const fieldName = conditionKey as string;
                    requiredFields.push(fieldName);

                    dynamicControls.addControl(fieldName, new FormGroup({
                        key: new FormControl(null),
                        value: new FormControl(null)
                    }));
                }
            });

            this.emailConditionSuggestionsLabelOptions[condition.variable] = {
                dropdownLabel: this.getLabel(condition.variable),
                inputLabel: this.getLabel(condition.variable, 'Value'),
                options: this.getOptionByArrayOfStrings(condition.conditions as string[])
            };
        });

        dynamicControls.setValidators(this.atLeastOneValidator(requiredFields));
        this.customTriggerForm.addControl('conditions', dynamicControls);
        if (this.inputData?.triggerUniqueName) {
            setTimeout(() => {
                // this.triggerStore.getTriggerDetails(this.inputData.triggerUniqueName);
            }, 50);
        }
    }

    /**
     * Returns an array of options based on the provided array of strings.
     *
     * @param {string[]} condition - The array of strings to convert into options.
     * @returns {IOption[]} An array of options with `value` and `label` properties.
     */
    private getOptionByArrayOfStrings(condition: string[]): IOption[] {
        return condition?.map(item => ({
            value: item,
            label: this.getLabel(item)
        }));
    }

    /**
     * Returns a formatted label based on the provided label and optional concatString.
     *
     * @param {string} label - The label to format.
     * @param {string} [concatString] - Optional string to append after the label.
     * @returns {string} The formatted label.
     */
    private getLabel(label: string, concatString?: string): string {
        return this.titleCasePipe.transform(`${label?.replace('_', ' ')}${concatString ? ` ${concatString}` : ''}`);
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
        this.setToCcBcc(this.emailForm);

        if (this.emailForm.invalid) {
            return;
        }

        const formValue = cloneDeep(this.emailForm.value);
        delete formValue?.voucherTypes;

        // Prepare request based on type
        const req = this.prepareRequest(type, formValue);

        // Reset unsaved changes flag as we're saving
        this.hasUnsavedChanges = false;
        this.componentStore.updateCustomTemplate(req);
    }

    /**
     * Handles the submission of the trigger form.
     *
     * @returns {void}
     * @memberof TemplateFroalaComponent
     */
    public createUpdateTrigger(): void {
        this.setToCcBcc(this.customTriggerForm);
        this.customTriggerForm.markAllAsTouched();

        if (this.customTriggerForm.invalid) {
            this.showFormValidityError();
            return;
        }

        const formValue = cloneDeep(this.customTriggerForm.value);

        if (!formValue.executionTime.dayOfWeek) {
            delete formValue.executionTime.dayOfWeek;
        }
        if (!formValue.executionTime.dayOfMonth) {
            delete formValue.executionTime.dayOfMonth;
        }
        if (!formValue.executionTime.time) {
            delete formValue.executionTime.time;
        }
        if (!formValue.voucherTypes?.length) {
            delete formValue.voucherTypes;
        }

        if (formValue.conditions) {
            Object.keys(formValue.conditions).forEach(key => {
                if (!(formValue.conditions[key].key && formValue.conditions[key].value)) {
                    delete formValue.conditions[key];
                }
            });
        }

        // Reset unsaved changes flag as we're saving
        this.hasUnsavedChanges = false;

        if (this.inputData?.triggerUniqueName) {
            // this.triggerStore.updateTrigger({ model: formValue, uniqueName: this.inputData.triggerUniqueName });
        } else {
            // this.triggerStore.createTrigger(formValue);
        }
    }

    /**
     * Handles the form validity error.
     *
     * @returns {void}
     * @memberof TemplateFroalaComponent
     */
    public showFormValidityError(): void {
        this.isFormInvalid = false;
        setTimeout(() => {
            this.isFormInvalid = true;
        }, 0);
    }

    /**
     * Sets the values of the form fields for To, Bcc, and Cc.
     *
     * @param {FormGroup} form - The form group to update.
     * @memberof TemplateFroalaComponent
     */
    private setToCcBcc(form: FormGroup): void {
        form.get(EmailType.To)?.patchValue(this.selectedToEmails, { emitEvent: false });
        form.get(EmailType.Bcc)?.patchValue(this.selectedBccEmails, { emitEvent: false });
        form.get(EmailType.Cc)?.patchValue(this.selectedCcEmails, { emitEvent: false });
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
        this.isDestroying = true;

        // Clean up all tracked subscriptions first
        this.subscriptions.forEach((subscription, index) => {
            try {
                if (subscription && !subscription.closed) {
                    subscription.unsubscribe();
                }
            } catch (error) {
                console.warn(`Error unsubscribing subscription ${index}:`, error);
            }
        });
        this.subscriptions = [];

        // Safely complete the destroyed$ subject
        try {
            if (this.destroyed$ && !this.destroyed$.closed) {
                this.destroyed$.next(true);
                this.destroyed$.complete();
            }
        } catch (error) {
            console.warn('Error completing destroyed$ subject:', error);
        }
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

    /**
     * Handles entity change
     *
     * @param {IOption} event - Selected option
     * @memberof TemplateFroalaComponent
     */
    public onEntityChange(event: IOption, manuallySet: boolean = false): void {
        if (!manuallySet) {
            this.customTriggerForm?.get('entityUniqueNames')?.setValue([], { emitEvent: false });
        }
        this.getFlattenAccountGroupList({
            page: 1,
            count: PAGINATION_LIMIT,
            entity: event.value
        });
    }

    /**
     * Retrieves the flattened account group list from the store.
     *
     * @param {any} model
     * @memberof TemplateFroalaComponent
     */
    private getFlattenAccountGroupList(model: any): void {
        this.componentStore.getFlattenAccountGroupList({
            request: model,
            model: [AccountingGroupEnum.SundryDebtors, AccountingGroupEnum.SundryCreditors]
        });
    }

    /**
     * Handles the change of time action
     *
     * @param event - Selected option
     * @memberof TemplateFroalaComponent
     */
    public onTimeActionChange(event?: IOption): void {
        this.customTriggerForm?.get('executionTime')?.get('dayOfMonth')?.setValue(null, { emitEvent: false });
        this.customTriggerForm?.get('executionTime')?.get('dayOfWeek')?.setValue(null, { emitEvent: false });

        if (event?.value) {
            this.showDayOfWeek = event.value === OtherTimeOptionsEnum.DayOfWeek;
            this.selectedTimeAction = event.value;
            this.setTimeActionValidator();
        }
    }

    /**
     * Sets the validators for the day of month and day of week fields.
     *
     * @memberof TemplateFroalaComponent
     */
    public setTimeActionValidator(): void {
        const executionTime = this.customTriggerForm?.get('executionTime');
        if (!executionTime) return;

        const dayOfMonth = executionTime.get('dayOfMonth');
        const dayOfWeek = executionTime.get('dayOfWeek');

        dayOfMonth?.clearValidators();
        dayOfWeek?.clearValidators();

        if (this.showDayOfWeek === null) {
        } else if (this.showDayOfWeek) {
            dayOfWeek?.setValidators([Validators.required]);
        } else {
            dayOfMonth?.setValidators([Validators.required]);
        }

        dayOfMonth?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
        dayOfWeek?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
        executionTime.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    }

    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof TemplateFroalaComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.dayOfWeekOptions = this.generalService.getDayOfWeekOptions(this.commonLocaleData, true, [WeekdaysEnum.SUNDAY]);
            this.dayOfMonthOptions = this.generalService.getDaysOfMonth();
            this.triggerOptions = [
                { label: this.localeData?.voucher_due, value: TriggerModuleEnum.VoucherDue }
            ];
            this.actionOptions = [
                { label: this.localeData?.attach_voucher_pdf, value: TriggerActionEnum.AttachVoucherPdf }
            ];
            this.filteredActionList = this.actionOptions;
            this.entityOptions = [
                { label: this.commonLocaleData?.app_account, value: EntityEnum.Account },
                { label: this.commonLocaleData?.app_group, value: EntityEnum.Group }
            ];
            this.timeOtherOptions = [
                { label: this.localeData?.day_of_week, value: OtherTimeOptionsEnum.DayOfWeek },
                { label: this.localeData?.date_of_month, value: OtherTimeOptionsEnum.DayOfMonth }
            ];
        }
    }

    /**
     * Get label value from options
     *
     * @param {IOption[]} options
     * @param {string} value
     * @returns {string}
     * @memberof TemplateFroalaComponent
     */
    public getLabelValue(options: IOption[], value: string): string {
        return options?.find(option => option?.value?.toUpperCase() === value?.toUpperCase())?.label || '';
    }

    /**
     * Get day action label value
     *
     * @returns {string}
     * @memberof TemplateFroalaComponent
     */
    public getDayActionLabelValue(): string {
        const executionTime = this.customTriggerForm?.get('executionTime');
        if (!executionTime) return '';

        const dayOfMonth = executionTime.get('dayOfMonth');
        const dayOfWeek = executionTime.get('dayOfWeek');

        if (dayOfWeek?.value) {
            this.selectedTimeAction = OtherTimeOptionsEnum.DayOfWeek;
            return this.getLabelValue(this.timeOtherOptions, OtherTimeOptionsEnum.DayOfWeek);
        } else if (dayOfMonth?.value) {
            this.selectedTimeAction = OtherTimeOptionsEnum.DayOfMonth;
            return this.getLabelValue(this.timeOtherOptions, OtherTimeOptionsEnum.DayOfMonth);
        }
        return '';
    }

    /**
     * Shows leave confirmation dialog
     *
     * @private
     * @returns {Promise<boolean>}
     * @memberof TemplateFroalaComponent
     */
    private showLeaveConfirmation(): Promise<boolean> {
        return new Promise((resolve) => {
            const dialogRef = this.pageLeaveUtilityService.openDialog();

            dialogRef.afterClosed().subscribe((result) => {
                resolve(Boolean(result));
            });
        });
    }

    /**
     * Handles dialog close with unsaved changes check
     *
     * @returns {Promise<void>}
     * @memberof TemplateFroalaComponent
     */
    public async handleDialogClose(): Promise<void> {
        if (this.hasUnsavedChanges || !this.validateEmailRecipientsUnchanged()) {
            const shouldLeave = await this.showLeaveConfirmation();
            if (shouldLeave) {
                this.hasUnsavedChanges = false; // Reset to avoid multiple confirmations
                this.dialogRef.close();
            }
        } else {
            this.dialogRef.close();
        }
    }

    /**
     * Validates if the email recipients (to, cc, bcc) have been modified
     *
     * @returns {boolean} true if recipients are unchanged, false if modified
     * @memberof TemplateFroalaComponent
     */
    private validateEmailRecipientsUnchanged(): boolean {
        const currentForm = this.isTrigger ? this.customTriggerForm.value : this.emailForm.value;
        const { to, bcc, cc } = currentForm;

        const formRecipients = { to, bcc, cc };
        const selectedRecipients = {
            to: this.selectedToEmails,
            bcc: this.selectedBccEmails,
            cc: this.selectedCcEmails
        };

        return isEqual(formRecipients, selectedRecipients);
    }

    /**
     * Helper method to track subscriptions for Angular 21 compatibility
     */
    protected addSubscription(subscription: Subscription): void {
        if (subscription && !subscription.closed) {
            this.subscriptions.push(subscription);
        }
    }


}
