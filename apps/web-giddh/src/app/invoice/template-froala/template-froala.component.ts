import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import FroalaEditor from 'froala-editor';
import Tribute from 'tributejs';

@Component({
    selector: 'template-froala',
    templateUrl: './template-froala.component.html',
    styleUrls: ['./template-froala.component.scss']
})
export class TemplateFroalaComponent implements OnInit, AfterViewInit {
    public editorContent: string = '';
    public tribute: any;

    @ViewChild('froalaTextarea', { static: true }) froalaTextarea: ElementRef<HTMLTextAreaElement>;
    public editor: any;

    public froalaOptions: Object = {
        key: 'oc1F2vD1B1D1B3C1B5mEZXQUVJb1EZf1IWIAUKLJZMBQuD3E2D1C1C4G1H4F1A11C7==', // Replace with your Froala Editor license key
        heightMin: 300,
        heightMax: 500,
        theme: 'gray', // Example theme
        attribution: false,
        toolbarButtons: {
            moreText: {
                buttons: [
                    'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript',
                    'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'inlineClass', 'inlineStyle', 'clearFormatting'
                ],
                align: 'left'
            },
            moreParagraph: {
                buttons: [
                    'alignLeft', 'alignCenter', 'alignRight', 'alignJustify',
                    'formatOLSimple', 'formatOL', 'formatUL', 'paragraphFormat',
                    'paragraphStyle', 'lineHeight', 'outdent', 'indent', 'quote'
                ],
                align: 'left',
                buttonsVisible: 4
            },
            moreRich: {
                buttons: [
                    'insertLink', 'insertImage', 'insertFile', 'insertTable', 'undo', 'redo',
                    'fullscreen', 'help', 'emoticons', 'fontAwesome', 'specialCharacters', 'insertHR'
                ],
                align: 'left',
                buttonsVisible: 9
            }
        },
        toolbarSticky: true,
        imageUploadURL: '',
        requestWithCredentials: true,
        imageAllowedTypes: ['jpeg', 'jpg', 'png', 'gif'],
        imageMaxSize: 1024 * 1024, // 1MB
        fileUploadURL: '',
        fileAllowedTypes: ['pdf', 'docx', 'xlsx', 'pptx'],
        fileMaxSize: 1024 * 1024, // 1MB
        fullPage: true,
        zIndex: 10,
        useClasses: false,
        htmlRemoveTags: ['base', 'script', 'video', 'iframe', 'style'],
        quickInsertEnabled: false,
        emoticonsUseImage: false,
        codeMirrorOptions: {
            indentWithTabs: true,
            tabSize: 4,
            lineWrapping: true,
            mode: 'text/html',
            tabMode: 'indent',
        },
        focusOnInit: true,
        placeholderText: 'Start typing...',
    };

    constructor() { }

    ngOnInit() {
        // Any other initialization logic
    }

    ngAfterViewInit(): void {
        // Initialize Froala Editor on the textarea
        if (this.froalaTextarea && this.froalaTextarea.nativeElement) {
            this.editor = new FroalaEditor(this.froalaTextarea.nativeElement, this.froalaOptions, () => {
                console.log('Froala Editor Initialized');
            });

            // Configure Tribute.js
            this.tribute = new Tribute({
                values: [
                    { key: 'John Doe', value: 'john_doe' },
                    { key: 'Jane Doe', value: 'jane_doe' },
                    { key: 'Jack Doe', value: 'jack_doe' }
                ]
            });

            // Attach Tribute.js to the Froala editor instance (to the textarea element)
            this.tribute.attach(this.froalaTextarea.nativeElement);
        } else {
            console.error('Froala textarea element is not available.');
        }
    }
}
