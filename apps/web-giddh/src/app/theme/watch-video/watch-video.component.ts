import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { VIDEOLINK } from './video-link.const';

@Component({
    selector: 'watch-video',
    templateUrl: './watch-video.component.html',
    styleUrls: ['./watch-video.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WatchVideoComponent implements OnInit, OnDestroy  {
    @ViewChild('videoTutorial') videoTutorial: TemplateRef<any>;

    public videoTutorialDialogRef: MatDialogRef<any>;
    @Input() public buttonName: string = null;
    @Input() public autoplay: any = true;
    @Input() public toggleIcon: string = null;
    @Input() public toggleIconWidth: string = '25px';
    @Input() public toggleIconHeight: string = '25px';
    @Input() public moduleName: string = null;
    @Output() public videoClose: EventEmitter<any> = new EventEmitter<any>();

    public videoLink;
    
    constructor(public dialog: MatDialog) {}

     /**
     * Initializes the component
     *
     * @memberof WatchVideoComponent
     */
     public ngOnInit(): void {
        this.videoLink = VIDEOLINK.VOUCHER;
        console.log("autoplay",this.autoplay)
        this.autoplay = this.autoplay ? 1 : 0;
        console.log("autoplay",this.autoplay)
         console.log("VIDEOLINK",VIDEOLINK);
     }
    public openVideoTutorialDailog(): void {
        this.videoTutorialDialogRef = this.dialog.open(this.videoTutorial, {
            width: '800px',
            height: '450px'
        });
    }

    // /**
    //  * This will close the dialog and will send response
    //  *
    //  * @param {*} response
    //  * @memberof WatchVideoComponent
    //  */
    // public sendResponse(response: any): void {
    //     this.dialogRef.close(response);
    // }
    public ngOnDestroy() {
        
    }
}
