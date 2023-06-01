import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'branch-transfer-create',
  templateUrl: './branch-transfer-create.component.html',
  styleUrls: ['./branch-transfer-create.component.scss']
})

export class BranchTransferCreateComponent implements OnInit {
   /** Product Name Filter dropdown items*/
   public product:any = [];
   /** Holds if Multiple Products/Senders selected */
   public transferType: string = 'Products';

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<BranchTransferCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public whichComponent: any,) { }

  ngOnInit() {
    console.log("Component",this.whichComponent)
  }
    
}
