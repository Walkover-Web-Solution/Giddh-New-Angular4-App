import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'branch-transfer-create',
  templateUrl: './branch-transfer-create.component.html',
  styleUrls: ['./branch-transfer-create.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class BranchTransferCreateComponent implements OnInit , OnDestroy{
    /** Instance of stock create/edit form */
    @ViewChild('branchTransferCreateEditForm', { static: false }) public stockCreateEditForm: NgForm;
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /** True if translations loaded */
    public translationLoaded: boolean = false;
    /* this will store image path*/
    public imgPath: string = "";
    /* this will hold branch transfer mode */
    public branchTransferMode: string = "";
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
   public SenderProductName:string= 'Sender\'s Name';
   public productSenderDescription:string = 'Product Description';

    constructor(
        private route: ActivatedRoute,
        private changeDetection: ChangeDetectorRef
    ) {

  }

    public ngOnInit(): void {
        /* added image path */
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';

        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            if (params?.type ) {
                console.log(params);
                this.branchTransferMode = params.type;
                this.changeDetection.detectChanges();
            }
        });
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

/**
 * Lifecycle hook for destroy
 *
 * @memberof BranchTransferCreateComponent
 */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
