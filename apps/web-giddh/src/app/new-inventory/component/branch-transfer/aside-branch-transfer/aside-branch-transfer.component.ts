import { Component, OnInit, EventEmitter, Output, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BranchTransferCreateComponent } from '../branch-transfer-create/branch-transfer-create.component';

@Component({
    selector: 'aside-branch-transfer',
    templateUrl: './aside-branch-transfer.component.html',
    styleUrls: ['./aside-branch-transfer.component.scss'],

})

export class AsideBranchTransferComponent implements OnInit {
    /* Aside pane state*/
    public asideMenuState: string = 'out';
     /** Instance of Mat Dialog for Branch Transfer */
    @ViewChild("branch_transfer_dialog") public branch_transfer_dialog: TemplateRef<any>;

    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);

    constructor(private dialog: MatDialog) { }

    public closeAsidePane(event?) {
        this.closeAsideEvent.emit();
    }
    public ngOnInit() {

    }


    /**
   *  Function to open Dialog on Receipt Note Button
   */
    openBranchTransferDialog(input:string): void{
        this.closeAsidePane();
        this.dialog.open(BranchTransferCreateComponent,{
          width: '100%',
          minHeight: '90vh',
          maxWidth: '100vw',
          position: {bottom:'0'},
          data: input
        })
    }
}
