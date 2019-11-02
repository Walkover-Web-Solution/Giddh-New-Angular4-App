
import { Component, OnInit } from '@angular/core';




@Component({
  selector: 'cr-dr-list',
  templateUrl: 'cr-dr-list.component.html',
  styleUrls: ['cr-dr-list.component.scss', '../../home.component.scss'],

})
export class crDrComponent implements OnInit {

  public ngOnInit() {

  }
  addTableData = [
    {


      Debetors: "Walkover Web Solution pvt ltd.",
      InvoicedOn: "12/09/2019",
      BillAmount: "11,12,55,733.00",
      DueAs: "8,12,55,000.00"

    },
    {

      Debetors: "Walkover Web Solution pvt ltd.",
      InvoicedOn: "12/09/2019",
      BillAmount: "11,12,55,733.00",
      DueAs: "8,12,55,000.00"
    },
    {


      Debetors: "Walkover Web Solution pvt ltd.",
      InvoicedOn: "12/09/2019",
      BillAmount: "11,12,55,733.00",
      DueAs: "8,12,55,000.00"
    },
    {


      Debetors: "Walkover Web Solution pvt ltd.",
      InvoicedOn: "12/09/2019",
      BillAmount: "11,12,55,733.00",
      DueAs: "8,12,55,000.00"
    }


  ]
}
