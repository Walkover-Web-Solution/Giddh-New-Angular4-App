import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import FroalaEditor from 'froala-editor';
import { ReplaySubject, takeUntil } from 'rxjs';
import Tribute from 'tributejs';
import { CustomEmailComponentStore } from './utility/template-froala.store';


@Component({
    selector: 'template-froala',
    templateUrl: './template-froala.component.html',
    styleUrls: ['./template-froala.component.scss'],
    providers: [CustomEmailComponentStore]
})
export class TemplateFroalaComponent implements OnInit {
    /* Aside pane state*/
    public asideMenuState: string = 'out';
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /* This will hold locale JSON data */
    public localeData: any = {};
    /** Form Group for Reason form */
    public reasonForm: FormGroup;
    /* Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Holds Store create adjust inventory is success API success state as observable*/
    public createCustomEmailInProgress$ = this.componentStore.select(state => state.createCustomEmailInProgress);
    /** Holds Store create adjust inventory in progress API success state as observable*/
    public createCustomEmailIsSuccess$ = this.componentStore.select(state => state.createCustomEmailIsSuccess);
    /** Holds Store update adjust inventory is success API success state as observable*/
    public updateCustomEmailInProgress$ = this.componentStore.select(state => state.updateCustomEmailInProgress);
    /** Holds Store update adjust inventory in progress API success state as observable*/
    public updateCustomEmailIsSuccess$ = this.componentStore.select(state => state.updateCustomEmailIsSuccess);
    /** Holds Store update adjust inventory in progress API success state as observable*/
    public emailTemplates$ = this.componentStore.select(state => state.emailTemplates);
    /** Holds Store update adjust inventory in progress API success state as observable*/
    public emailContentSuggestions$ = this.componentStore.select(state => state.emailContentSuggestions);
    public emailForm: FormGroup;
    public tribute = new Tribute({
        values: [
            { key: 'Phil', value: 'pheartman' },
            { key: 'Gordon', value: 'gramsey' },
            { key: 'Jacob', value: 'jacob' },
            { key: 'Ethan', value: 'ethan' },
            { key: 'Emma', value: 'emma' },
            { key: 'Isabella', value: 'isabella' }
        ],
        selectTemplate: function (item) {
            return '<span class="fr-deletable fr-tribute">' + item.original.key + '</a></span>';
        }
    });
    public showCc: boolean = false;
    public showBcc: boolean = false;
    public froalaOptions = {
        key: 'oc1F2vD1B1D1B3C1B5mEZXQUVJb1EZf1IWIAUKLJZMBQuD3E2D1C1C4G1H4F1A11C7==', // Replace with your Froala Editor license key
        attribution: false, // Removes "Powered by Froala" message
        heightMin: 300,
        heightMax: 300,
        zIndex: 2501,
        toolbarSticky: true,
        // quickInsertEnabled: true, // Disable the quick insert options

        // // Set up the toolbar buttons
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

        // // Image Upload Configuration
        // imageUploadURL: '', // Set your image upload URL here
        // imageAllowedTypes: ['jpeg', 'jpg', 'png', 'gif'],
        // imageMaxSize: 1024 * 1024, // 1MB

        // // File Upload Configuration
        // fileUploadURL: '', // Set your file upload URL here
        // fileAllowedTypes: ['pdf', 'docx', 'xlsx', 'pptx'],
        // fileMaxSize: 1024 * 1024, // 1MB

        // // Enable Code View with CodeMirror
        codeMirror: true, // Use CodeMirror for code view
        codeMirrorOptions: {
            indentWithTabs: true,
            lineNumbers: true,
            tabSize: 4,
            lineWrapping: true,
            mode: 'text/html',
            tabMode: 'indent'
        },

        // // Placeholder
        placeholderText: 'Start typing...',
        charCounterCount: false,
        wordCount: false,
        // // Enable all HTML tags and attributes
        htmlAllowedTags: ['.*'],
        htmlAllowedAttrs: ['.*'],

        // // Full-page editing
        // fullPage: true,

        // // Image and emoticons options
        // emoticonsUseImage: false, // Use emoticon characters instead of images
        // useClasses: false, // Do not use CSS classes
        htmlRemoveTags: ['base', 'script', 'video', 'iframe', 'style'], // Tags to remove for security

        events: {
            initialized: (event) => {
                console.log(event);
                this.editor = event.getEditor();
                console.log(event); //
                this.tribute?.attach(this.editor.el);
                // this.editor?.toolbar?.hide();
                this.editor.events.on(
                    'keydown',
                    (e) => {
                        if (e.which == FroalaEditor.KEYCODE.ENTER && this.tribute.isActive) {
                            return false;
                        }
                    },
                    true
                );
            },
        }
    };
    public editor: any;
    public toEmails: any[] = [];
    public selectedToEmails: any[] = [];
    public ccEmails: any[] = [];
    public selectedCcEmails: any[] = [];
    public bccEmails: any[] = [];
    public selectedBccEmails: any[] = [];
    textContent: string = '';


    constructor(private fb: FormBuilder, private componentStore: CustomEmailComponentStore) { }

    public ngOnInit(): void {
        this.initializeForm();
        this.getEmailContents();
        this.getEmailTemplates();

        this.emailContentSuggestions$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                console.log(response);
            }
        });
        this.emailTemplates$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                console.log(response);
            }
        });
    }

    public getEmailConditions(): void {
        this.componentStore.getEmailConditionSuggestion(null);
    }

    public getEmailTemplates(): void {
        this.componentStore.getAllEmailTemplate(null);
    }

    public getEmailContents(): void {
        this.componentStore.getEmailContentSuggestions(null);
    }

    public initializeForm(): void {
        this.emailForm = this.fb.group({
            to: ['', [Validators.email]],
            cc: ['', [Validators.email]],
            bcc: ['', [Validators.email]],
            voucherTypes: [''],
            emailSubject:[],
            html: ['']
        });
    }

    public onSubmit(): void {
        if (this.emailForm.valid) {
            console.log(this.emailForm.value);
        } else {
            console.error('Form is invalid');
        }
    }

    // Update textarea content from Froala Editor
    onEditorChange(content: string) {
        this.textContent = content;
    }

    // Update Froala Editor content from textarea
    onTextareaChange(event: Event) {
        const target = event.target as HTMLTextAreaElement;
        this.textContent = target.value;
    }
}
