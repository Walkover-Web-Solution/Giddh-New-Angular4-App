import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import { MatLegacySnackBarRef as MatSnackBarRef, MAT_LEGACY_SNACK_BAR_DATA as MAT_SNACK_BAR_DATA } from "@angular/material/legacy-snack-bar";

@Component({
    selector: 'snackbar',
    templateUrl: './snackbar.component.html',
    styleUrls: ['./snackbar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SnackBarComponent implements OnInit {
    /** Instance of set timeout method */
    public timeout: any;
    /** Instance of set interval method */
    public interval: any;
    /** Width in percentage of snackbar */
    public snackProgressBarWidthPercentage: number = 100;
    /** Show/hide progress bar */
    public showProgressBar: boolean = true;

    constructor(
        @Inject(MAT_SNACK_BAR_DATA) public data: any,
        private matSnackBarRef: MatSnackBarRef<any>,
        private changeDetection: ChangeDetectorRef
    ) { 
    }

    /**
     * Called on initialization of the component
     *
     * @memberof SnackBarComponent
     */
    public ngOnInit(): void {
        this.createTimeout();
    }

    /**
     * It creates the snackbar dismissal timeout
     *
     * @memberof SnackBarComponent
     */
    public createTimeout(): void {
        this.showProgressBar = true;
        this.interval = setInterval(() => {
            this.snackProgressBarWidthPercentage--;
            if(this.snackProgressBarWidthPercentage === 0) {
                clearInterval(this.interval);
            }
            this.changeDetection.detectChanges();
        }, 30);

        this.timeout = setTimeout(() => {
            this.dismiss();
        }, 3000);

        this.changeDetection.detectChanges();
    }

    /**
     * It resets the snackbar dismissal timeout
     *
     * @memberof SnackBarComponent
     */
    public resetTimeout(): void {
        this.showProgressBar = false;
        this.snackProgressBarWidthPercentage = 100;
        clearInterval(this.interval);
        clearTimeout(this.timeout);
        this.changeDetection.detectChanges();
    }

    /**
     * This will dismiss the snack bar
     *
     * @memberof SnackBarComponent
     */
    public dismiss(): void {
        this.showProgressBar = false;
        this.snackProgressBarWidthPercentage = 0;
        this.matSnackBarRef.dismiss();
        this.changeDetection.detectChanges();
    }
}