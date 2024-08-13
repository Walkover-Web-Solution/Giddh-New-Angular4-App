import { Component, Input, OnInit, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import FroalaEditor from 'froala-editor';
import Tribute from 'tributejs';

@Component({
    selector: 'froala-editor',
    templateUrl: 'froala-editor.component.html',
    styleUrls: ['./froala-editor.component.scss']
})
export class FroalaEditorComponent implements OnInit, OnDestroy {
    @Input() control!: FormControl; // FormControl passed from the parent component
    @Input() enableTribute: boolean = false; // Enable or disable Tribute.js
    @Input() tributeValues: { key: string; value: string }[] = []; // Values for Tribute.js
    @Input() options: any = {}; // Custom options for Froala

    private editor: any;
    private tribute: Tribute<{ key: string; value: string }>;

    constructor(private el: ElementRef, private renderer: Renderer2) { }

    ngOnInit(): void {
        this.initializeEditor();

        if (this.enableTribute) {
            this.initializeTribute();
        }

        // Sync Froala editor content with FormControl
        this.editor.events.on('contentChanged', () => {
            this.control.setValue(this.editor.html.get(), { emitEvent: false });
        });

        // Sync FormControl content with Froala editor
        this.control.valueChanges.subscribe(value => {
            if (this.editor.html.get() !== value) {
                this.editor.html.set(value);
            }
        });
    }

    ngOnDestroy(): void {
        // Destroy Froala editor instance to avoid memory leaks
        if (this.editor) {
            this.editor.destroy();
        }
    }

    private initializeEditor(): void {
        this.editor = new FroalaEditor(this.el.nativeElement, this.options);
    }

    private initializeTribute(): void {
        console.log(this.tributeValues);
        this.tribute = new Tribute({
            values: this.tributeValues,
            selectTemplate: function (item) {
                return `<span class="fr-deletable fr-tribute">${item.original.key}</span>`;
            }
        });
        this.tribute.attach(this.el.nativeElement);
    }
}
