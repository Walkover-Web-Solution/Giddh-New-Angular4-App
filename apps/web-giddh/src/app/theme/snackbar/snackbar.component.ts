import { ChangeDetectionStrategy, Component, Inject } from "@angular/core";
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from "@angular/material/snack-bar";

@Component({
    selector: 'snackbar',
    templateUrl: './snackbar.component.html',
    styleUrls: ['./snackbar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SnackBarComponent {
    constructor(
        @Inject(MAT_SNACK_BAR_DATA) public data: any,
        private matSnackBarRef: MatSnackBarRef<any>
    ) { 
    }

    /**
     * This will dismiss the snack bar
     *
     * @memberof SnackBarComponent
     */
    public dismiss(): void {
        this.matSnackBarRef.dismiss();
    }
}