import { Component, OnInit, TemplateRef, Inject, ViewChild } from '@angular/core';
import { ServiceConfig } from '../../../services/service.config';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ASIDE_PANE_CONFIG } from '../../../app.constant';
@Component({
    selector: 'adjust-group',
    templateUrl: './adjust-group.component.html',
    styleUrls: ['./adjust-group.component.scss'],

})

export class AdjustGroupComponent implements OnInit {
    /* this will store image path*/
    public imgPath: string = '';
    /* This will store aside pane template reference */
    @ViewChild('asideMenuStateForInventoryAdjustmentTemplate') public asideMenuStateForInventoryAdjustmentTemplate: TemplateRef<any>;
    /* This will store aside pane dialog reference */
    public asideMenuStateForInventoryAdjustmentDialogRef: MatDialogRef<any>;
    /* This will store modal reference */
    public dialogRef: MatDialogRef<any>;

    constructor(
        @Inject(ServiceConfig) private serviceConfig,
        private dialog: MatDialog
    ) { }

    /* Create combo aside pane open function */
    public openAdjustmentDialog(): void {
        this.asideMenuStateForInventoryAdjustmentDialogRef = this.dialog.open(this.asideMenuStateForInventoryAdjustmentTemplate, ASIDE_PANE_CONFIG);
    }

    /**
     * Opens the dialog with the provided template
     *
     * @param {TemplateRef<any>} template
     * @memberof AdjustGroupComponent
     */
    public openDialog(template: TemplateRef<any>): void {
        this.dialogRef = this.dialog.open(template, {
            panelClass: 'mat-dialog-lg'
        });
    }

    public ngOnInit() {
        /* added image path */
        this.imgPath = isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || AppUrl) + APP_FOLDER + 'assets/images/';
    }
}
