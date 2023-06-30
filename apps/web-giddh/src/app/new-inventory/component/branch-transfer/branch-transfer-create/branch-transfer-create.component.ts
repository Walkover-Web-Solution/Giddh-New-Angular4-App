import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'branch-transfer-create',
  templateUrl: './branch-transfer-create.component.html',
  styleUrls: ['./branch-transfer-create.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class BranchTransferCreateComponent implements OnInit {
  /** Close the  HSN/SAC Opened Menu*/
  @ViewChild('hsnSacMenuTrigger') hsnSacMenuTrigger: MatMenuTrigger;
  @ViewChild('skuMenuTrigger') skuMenuTrigger: MatMenuTrigger;
   /** Product Name Filter dropdown items*/
   public product:any = [];
   /** Holds if Multiple Products/Senders selected */
   public transferType: 'Products' | 'Senders' = 'Products';
   /** For Table Receipt Toggle Input Fields */
   public activeRow: boolean = false;
   /** For HSN/SAC Code Inside Table*/
   public showCodeType:'HSN' | 'SAC' = 'HSN';
   public hsnNumber:number;
   public sacNumber:number;
   public skuNumber:string;
   /** On Sender */
   public senderHsnSacStatus:'HSN' | 'SAC'; 
   public branchTransferMode: 'receipt-note' | 'delivery-challan' = 'receipt-note';
   public SenderProductName:string= 'Sender\'s Name';
   public productSenderDescription:string = 'Product Description';

  constructor() { }

  ngOnInit() {
  }

  public setActiveRow(): void {
      this.activeRow = true;
  }

  public hideActiveRow(): void {
      this.activeRow = false;
  }
 /** Close the  HSN/SAC Opened Menu*/
  public closeShowCodeMenu(): void {
    this.hsnSacMenuTrigger.closeMenu();
    this.skuMenuTrigger.closeMenu();
  }

  public branchTransferTypeOnchange(): void{
    this.SenderProductName =  this.transferType === 'Senders' ? 'Product\'s Name' :  'Sender\'s Name';
    this.productSenderDescription = (this.transferType === 'Senders') ? ((this.branchTransferMode === "receipt-note") ? 'Sender\’s Details' : 'Receiver\’s Details'): 'Product Description';
  }
    
}
