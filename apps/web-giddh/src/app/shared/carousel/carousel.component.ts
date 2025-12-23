import { CommonModule } from '@angular/common';
import { Component, ContentChild, EventEmitter, HostListener, Input, Output, TemplateRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HtmlElementEnum } from '../../app.constant';

@Component({
    selector: 'giddh-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss'],
    imports: [
        MatButtonModule,
        MatTooltipModule,
        CommonModule
    ],
    standalone: true
})
export class CarouselComponent {
    /** Holds template of slide on the component itself */
    @ContentChild('slideTemplate', { static: false }) public slideTemplate: TemplateRef<any>;
    /** Hold next disable event */
    @Input() public isNextDisabled: boolean = false;
    /** Hold previous disable event */
    @Input() public isPreviousDisabled: boolean = false;
    /** Emits navigate to previous slide */
    @Output() public navigatePrevious: EventEmitter<boolean> = new EventEmitter<boolean>();
    /** Emits navigate to next slide */
    @Output() public navigateNext: EventEmitter<boolean> = new EventEmitter<boolean>();
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    
    constructor(
    ) { }

    /**
     *Handle previous navigate previous
     *
     * @memberof CarouselComponent
     */
    public handleNavigatePrevious(): void {
        this.navigatePrevious.emit(true);
    }

    /**
     * Emit handle navigation next event
     *
     * @memberof CarouselComponent
     */
    public handleNavigateNext(): void {
        this.navigateNext.emit(true);
    }

    @HostListener('window:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent) {
        // Get the active element in the document
        const activeElement = document.activeElement;

        // Check if the focused element is an input field, textarea, or a contenteditable element
        const isInputFocused = activeElement && (
            activeElement.tagName === HtmlElementEnum.Input ||
            activeElement.tagName === HtmlElementEnum.Textarea
        );

        if (!isInputFocused) { // Only navigate if no input field is focused
            if (event.key === 'ArrowRight') {
                this.handleNavigateNext();
                event.preventDefault();
            } else if (event.key === 'ArrowLeft') {
                this.handleNavigatePrevious();
                event.preventDefault();
            }
        }
    }

}
