import { Component, OnInit, ViewChildren, TemplateRef, Inject, ViewChild } from '@angular/core';
import { ShSelectComponent } from '../../../theme/ng-virtual-select/sh-select.component';
import { ServiceConfig } from '../../../services/service.config';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ASIDE_PANE_CONFIG } from '../../../app.constant';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
@Component({
    selector: 'adjust-group',
    templateUrl: './adjust-group.component.html',
    styleUrls: ['./adjust-group.component.scss'],

})

export class AdjustGroupComponent implements OnInit {
    /* This will store modal reference */
    public modalRef: BsModalRef;
    /* this will store image path*/
    public imgPath: string = '';
    /* This will store aside pane template reference */
    @ViewChild('asideMenuStateForInventoryAdjustmentTemplate') public asideMenuStateForInventoryAdjustmentTemplate: TemplateRef<any>;
    /* This will store aside pane dialog reference */
    public asideMenuStateForInventoryAdjustmentDialogRef: MatDialogRef<any>;

    /* sh-select view child */
    @ViewChildren('selectAccount') public selectAccount: ShSelectComponent;

    constructor(
        @Inject(ServiceConfig) private serviceConfig,
        private modalService: BsModalService,
        private dialog: MatDialog
    ) { }

    /* Create combo aside pane open function */
    public openAdjustmentDialog(): void {
        this.asideMenuStateForInventoryAdjustmentDialogRef = this.dialog.open(this.asideMenuStateForInventoryAdjustmentTemplate, ASIDE_PANE_CONFIG);
    }
    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template,
            Object.assign({}, { class: 'modal-xl' })
        );
    }

    public ngOnInit() {
        /* added image path */
        this.imgPath = isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || AppUrl) + APP_FOLDER + 'assets/images/';
    }
}
