import { Component } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Location } from '@angular/common';
import { Ng2BootstrapModule } from 'ngx-bootstrap';
import * as _ from '../../lodash-optimized';
import { INameUniqueName } from '../../models/interfaces/nameUniqueName.interface';

const INV_PAGE = [
  { name: 'Invoice', uniqueName: 'invoice'},
  { name: 'Proforma', uniqueName: 'proforma'}
];

@Component({
  selector: 'invoice-page-dd',
  templateUrl: './invoice.page.dd.component.html'
})

export class InvoicePageDDComponent {

  public navItems: INameUniqueName[] = INV_PAGE;
  public selectedPage: string = null;

  constructor(private router: Router, private location: Location) {
    this.router.events.subscribe((event: NavigationStart) => {
      if (event.url) {
        if (event.url.indexOf('invoice') !== -1 ) {
          this.navItems = this.removeObjFromArr('invoice');
          this.selectedPage = INV_PAGE[0].name;
        }else if (event.url.indexOf('proforma') !== -1) {
          this.navItems = this.removeObjFromArr('proforma');
          this.selectedPage = INV_PAGE[1].name;
        }
      }
    });
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
  private changePage(page: string): void {
    // console.log('Page should be changed to:', page);
    // this.router.navigate(['/pages', page]);
  }
}
