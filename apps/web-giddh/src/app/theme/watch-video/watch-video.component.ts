import { ChangeDetectionStrategy, Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VIDEOLINK } from './video-link.const';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'watch-video',
    templateUrl: './watch-video.component.html',
    styleUrls: ['./watch-video.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WatchVideoComponent implements OnInit {
    /** Holds template reference for video  */
    @ViewChild('videoTutorial') videoTutorial: TemplateRef<any>;
    /** Holds boolean value as enable/disable video autoplay*/
    @Input() public autoplay: number = 1;
    /** Holds Module Name by which video link will be selected */
    @Input() public moduleName: string = null;
    /** Holds CSS class for custom code */
    @Input() public cssClass: string = null;
    /** Holds final youtube video link  */
    public videoLink: string = '';
    /* This will hold local JSON data */
    public localeData: any = {};
    /** Holds Translated text to display on button */
    public translatedText: string = '';

    constructor(
        public dialog: MatDialog,
        private sanitizer: DomSanitizer
    ) { }

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
     *  Open video Dialog
     *
     * @memberof WatchVideoComponent
     */
    public openVideoTutorialDialog(): void {
        this.dialog.open(this.videoTutorial, {
            width: '800px',
            height: 'auto',
            role: 'alertdialog',
            ariaLabel: 'Video'
        });
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
