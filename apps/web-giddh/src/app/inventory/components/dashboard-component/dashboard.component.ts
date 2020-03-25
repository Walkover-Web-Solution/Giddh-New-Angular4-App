import { Component, OnInit } from '@angular/core';
@Component({
    selector: 'dashboardcomponent',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    public imgPath: string = '';
    public datePickerOptions: any = {
        hideOnEsc: true,
        opens: 'left',
        locale: {
            applyClass: 'btn-green',
            applyLabel: 'Go',
            fromLabel: 'From',
            format: 'D-MMM-YY',
            toLabel: 'To',
            cancelLabel: 'Cancel',
            customRangeLabel: 'Custom range'
        },
    };

// product detail table data
    itemDetailDatas = [
        {
          totalItemGroup: "Total Items Group",
          itemNo: "27", 
        },
        {
            totalItemGroup: "Total Items/Products",
            itemNo: "22",
        }     
    ]

// selling item table data

    sellingItemDatas = [
        {
        simpleProductName: "Sample Product Name 1",
        itemNo: "4900 Nos.",
        },
        {
        simpleProductName: "Sample Product Name 2",
        itemNo: "4900 Nos.",
        }  ,
        {
        simpleProductName: "Sample Product Name 3",
        itemNo: "4900 Nos.",
        }     
    ]

    // purchase item table data
    purchaseDatas = [
        {
          vendorName: "Walkover Web 1 Solution pvt ltd.",
          totalAmount: "25285.00",

        },
        {
            vendorName: "Giddh",
            totalAmount: "25285.00",
        }    
     ]
    // purchase order table data
    purchaseOrderDatas = [
        {
          customerName: "Walkover Web 1 Solution pvt ltd.",
          totalAmount: "25285.00",

        },
        {
            customerName: "MSG91",
          totalAmount: "25285.00",
        } 
    ]
    ngOnInit(){
        this.imgPath = (isElectron||isCordova)  ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
    }

}