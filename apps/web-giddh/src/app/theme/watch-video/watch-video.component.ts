import { ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef, ViewChild, OnDestroy, ElementRef, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { VIDEOLINK } from './video-link.const';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'watch-video',
    templateUrl: './watch-video.component.html',
    styleUrls: ['./watch-video.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WatchVideoComponent implements OnInit, OnDestroy {
    /** Static counter for component instances */
    private static instanceCounter: number = 0;
    /** Instance ID for priority handling */
    private instanceId: number;
    /** Static registry of active instances */
    private static activeInstances: Map<number, WatchVideoComponent> = new Map();
    /** Flag to track if video dialog is open */
    private static isVideoDialogOpen: boolean = false;
    /** Holds template reference for video  */
    @ViewChild('videoTutorial') videoTutorial: TemplateRef<any>;
    /** Holds boolean value as enable/disable video autoplay*/
    @Input() public autoplay: number = 1;
    /** Holds Module Name by which video link will be selected */
    @Input() public moduleName: string = null;
    /** Holds CSS class for custom code */
    @Input() public cssClass: string = null;
    /** Holds CSS class for custom icon */
    @Input() public iconCssClass: string = null;
    /** Holds icon for custom code */
    @Input() public showIcon: boolean = false;
    /** Holds final youtube video link  */
    public videoLink: string = '';
    /* This will hold local JSON data */
    public localeData: any = {};
    /** Holds Translated text to display on button */
    public translatedText: string = '';

    constructor(
        public dialog: MatDialog,
        private sanitizer: DomSanitizer,
        private elementRef: ElementRef
    ) {
        this.instanceId = ++WatchVideoComponent.instanceCounter;
        WatchVideoComponent.activeInstances.set(this.instanceId, this);
    }

    /**
    * Initializes the component
    *
    * @memberof WatchVideoComponent
    */
    public ngOnInit(): void {
        this.videoLink = VIDEOLINK[this.moduleName];
        this.videoLink = this.domSantizer(`${this.videoLink}&rel=0&autoplay=${this.autoplay}`);
    }

    /**
    * Cleans up component instance on destroy
    *
    * @memberof WatchVideoComponent
    */
    public ngOnDestroy(): void {
        WatchVideoComponent.activeInstances.delete(this.instanceId);
    }

    /**
    * Detects if this component is inside a dialog (checks in real-time)
    *
    * @private
    * @returns {boolean} True if component is inside a dialog
    * @memberof WatchVideoComponent
    */
    private detectDialogContext(): boolean {
        let element = this.elementRef.nativeElement;
        
        while (element && element.parentElement) {
            element = element.parentElement;
            
            if (element.classList.contains('mat-dialog-container') || 
                element.classList.contains('cdk-overlay-pane') ||
                element.classList.contains('mat-dialog-content') ||
                element.hasAttribute('role') && element.getAttribute('role') === 'dialog' ||
                element.hasAttribute('role') && element.getAttribute('role') === 'alertdialog') {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Global keyboard shortcut handler for Alt+H
     *
     * @param {KeyboardEvent} event - Keyboard event
     * @memberof WatchVideoComponent
     */
    @HostListener('window:keydown', ['$event'])
    public handleGlobalKeydown(event: KeyboardEvent): void {
        // Check for Alt+H shortcut using multiple detection methods
        const isHKey = event.key === 'h' || 
                      event.key === 'H' || 
                      event.code === 'KeyH' || 
                      event.keyCode === 72 || 
                      event.which === 72;
        
        if (event.altKey && isHKey) {
            // Only proceed if this is the highest priority instance
            if (this.shouldHandleShortcut()) {
                event.preventDefault();
                event.stopPropagation();
                this.openVideoTutorialDialog();
            }
        }
    }

    /**
     * Opens video dialog if not already open
     *
     * @memberof WatchVideoComponent
     */
    public openVideoTutorialDialog(): void {
        // Don't open if dialog is already open
        if (WatchVideoComponent.isVideoDialogOpen) {
            return;
        }

        // Set flag to prevent multiple dialogs
        WatchVideoComponent.isVideoDialogOpen = true;

        // Open dialog
        const dialogRef = this.dialog.open(this.videoTutorial, {
            width: '800px',
            height: 'auto',
            role: 'alertdialog',
            ariaLabel: 'Video'
        });

        // Reset flag when dialog is closed
        dialogRef.afterClosed().subscribe(() => {
            WatchVideoComponent.isVideoDialogOpen = false;
        });
    }

    /**
    * Determines if this component instance should handle the keyboard shortcut
    *
    * @private
    * @returns {boolean} True if this instance should handle the shortcut
    * @memberof WatchVideoComponent
    */
    private shouldHandleShortcut(): boolean {
        const instances = Array.from(WatchVideoComponent.activeInstances.values());
        
        // Filter instances that are visible and in the DOM
        const visibleInstances = instances.filter(instance => {
            const element = instance.elementRef.nativeElement;
            return element && element.offsetParent !== null;
        });

        // If no visible instances, allow this one
        if (visibleInstances.length === 0) {
            return true;
        }

        // Check dialog context in real-time for all instances
        const dialogInstances = visibleInstances.filter(instance => instance.detectDialogContext());
        const isThisInDialog = this.detectDialogContext();
        
        if (dialogInstances.length > 0) {
            // If this is a dialog instance, check if it's the most recent one
            if (isThisInDialog) {
                const highestDialogId = Math.max(...dialogInstances.map(instance => instance.instanceId));
                return this.instanceId === highestDialogId;
            }
            // If there are dialog instances and this is not one, don't handle
            return false;
        }

        // Priority 2: If no dialog instances, the most recent main page instance handles
        const highestId = Math.max(...visibleInstances.map(instance => instance.instanceId));
        return this.instanceId === highestId;
    }

    /**
    * Angular's sanitizer service to bypass security and trust the provided string as a resource URL
    *
    * @param {string} str
    * @return {*}  {*}
    * @memberof WatchVideoComponent
    */
    public domSantizer(str: string): any {
        return this.sanitizer.bypassSecurityTrustResourceUrl(str);
    }

    /**
    * Callback for translation response complete
    *
    * @param {*} event
    * @memberof WatchVideoComponent
    */
    public translationComplete(event: any): void {
        if (event) {
            this.translatedText = this.localeData[this.moduleName];
        }
    }
}
