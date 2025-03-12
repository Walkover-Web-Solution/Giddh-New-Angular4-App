import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, ContentChild, EventEmitter, HostListener, Inject, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

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
export class CarouselComponent implements OnInit, AfterContentInit {
    /** Holds template of slide on the component itself */
    @ContentChild('slideTemplate', { static: false }) public slideTemplate: TemplateRef<any>;
    /** */
    @Input() public isNextDisabled: boolean = false;
    /** */
    @Input() public isPreviousDisabled: boolean = false;
    /** Emits navigate to previous slide */
    @Output() public navigatePrevious: EventEmitter<boolean> = new EventEmitter<boolean>();
    /** Emits navigate to next slide */
    @Output() public navigateNext: EventEmitter<boolean> = new EventEmitter<boolean>();
    public isContentFocused: boolean;

    constructor(
        private dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public inputData
    ) { }

    /**
     * Initializes the component
     *
     * @memberof CarouselComponent
     */
    public ngOnInit(): void {
        console.log("inputData", this.inputData);
    }

    /**
     * Called after content has been projected into the view.
     *
     * @memberof CarouselComponent
     */
    public ngAfterContentInit(): void {
        console.log(this.slideTemplate); // Now slideTemplate should be available
    }

    public handleNavigatePrevious(): void {
        this.navigatePrevious.emit(true);
    }

    public handleNavigateNext(): void {
        this.navigateNext.emit(true);
    }

    @HostListener('window:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent) {
        if (!this.isContentFocused) {
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
