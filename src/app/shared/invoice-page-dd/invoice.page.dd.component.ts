import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import * as _ from '../../lodash-optimized';
import { INameUniqueName } from '../../models/api-models/Inventory';

const INV_PAGE = [
  {name: 'Invoice', uniqueName: 'invoice'},
  {name: 'Proforma', uniqueName: 'proforma'}
];

@Component({
  selector: 'invoice-page-dd',
  templateUrl: './invoice.page.dd.component.html',
  styles: [`
    .navbar-brand {
      height: auto;
      padding: 5px 15px;
    }
  .spcl_dropdown {
      border: 0 !important;
      background: transparent !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      font-size: 24px;
      // color: #393a3d;
      padding: 0;
  }
  `]
})

export class InvoicePageDDComponent implements OnInit {

  public navItems: INameUniqueName[] = INV_PAGE;
  public selectedPage: string = null;

  public dropDownPages: any[] = [
    {name: 'Invoice', uniqueName: 'invoice', path: 'preview'},
    {name: 'Recurring', uniqueName: 'recurring', path: 'recurring'}
  ];

  constructor(private router: Router, private location: Location, private _cdRef: ChangeDetectorRef) {
    this.selectedPage = 'Invoice';
    // this.router.events.subscribe((event: NavigationStart) => {
    //   if (event.url) {
    //     if (event.url.indexOf('invoice') !== -1) {
    //       this.navItems = this.removeObjFromArr('invoice');
    //       this.selectedPage = INV_PAGE[0].name;
    //     } else if (event.url.indexOf('proforma') !== -1) {
    //       this.navItems = this.removeObjFromArr('proforma');
    //       this.selectedPage = INV_PAGE[1].name;
    //     }
    //   }
    // });
  }

  public ngOnInit(): void {
    if (this.router.routerState.snapshot.url.includes('recurring')) {
      this.selectedPage = 'Recurring';
    }
  }

  private removeObjFromArr(str) {
    let res = _.remove(INV_PAGE, (item: INameUniqueName) => {
      return item.uniqueName !== str;
    });
    return res;
  }

  private onShown(): void {
    // console.log('Dropdown is shown');
  }

  private changePage(page): void {
    this.selectedPage = page.name;
    this._cdRef.detectChanges();
    this.router.navigate(['/pages', 'invoice', page.path]);
  }
}
