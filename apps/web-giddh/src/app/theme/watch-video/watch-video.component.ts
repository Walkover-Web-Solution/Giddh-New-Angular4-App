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

    /** Holds text inside toggle button */
    @Input() public displayText: string = null;
    /** Holds boolean value as enable/disable video autoplay*/
    @Input() public autoplay: any = true;
    /** Holds Image URL to display inside toggle button */
    @Input() public displayIcon: string = null;
    /** Holds Image width */
    @Input() public displayIconWidth: number = 25;
    /** Holds Image height */
    @Input() public displayIconHeight: number = 25;
    /** Holds Module Name by which video link will be selected */
    @Input() public moduleName: string = null;
    /** Holds CSS class for custom code */
    @Input() public cssClass: string = null;

    /** Holds final youtube video link  */
    public videoLink: string = '';

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
        console.log("displayIconWidth", this.displayIconWidth);

        this.videoLink = VIDEOLINK[this.moduleName];
        this.autoplay = this.autoplay ? 1 : 0;
        this.videoLink = `${this.videoLink}&rel=0&autoplay=${this.autoplay}`;
        this.videoLink = this.domSantizer(this.videoLink);
    }

    /**
     *  Open video Dialog 
     *
     * @memberof WatchVideoComponent
     */
    public openVideoTutorialDailog(): void {
        this.dialog.open(this.videoTutorial, {
            width: '800px',
            height: 'auto'
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
}
