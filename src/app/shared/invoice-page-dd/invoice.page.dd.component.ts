import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
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
    / / color: #393a3d;
      padding: 0;
    }
  `]
})

export class InvoicePageDDComponent implements OnInit {

  public navItems: INameUniqueName[] = INV_PAGE;
  public selectedType: string = null;
  @Output('pageChanged') public pageChanged: EventEmitter<any> = new EventEmitter(null);

  public dropDownPages: any[] = [
    {name: 'Invoice', uniqueName: 'invoice', path: 'preview'},
    {name: 'Recurring', uniqueName: 'recurring', path: 'recurring'},
    {name: 'Receipt', uniqueName: 'receipt', path: 'receipt'},
    {name: 'Credit Note', uniqueName: 'cr-note', path: 'cr-note'},
    {name: 'Debit Note', uniqueName: 'dr-note', path: 'dr-note'}
  ];

  constructor(private router: Router, private location: Location, private _cdRef: ChangeDetectorRef) {
    // this.selectedType = 'Invoice';
    // this.router.events.subscribe((event: NavigationStart) => {
    //   if (event.url) {
    //     if (event.url.indexOf('invoice') !== -1) {
    //       this.navItems = this.removeObjFromArr('invoice');
    //       this.selectedType = INV_PAGE[0].name;
    //     } else if (event.url.indexOf('proforma') !== -1) {
    //       this.navItems = this.removeObjFromArr('proforma');
    //       this.selectedType = INV_PAGE[1].name;
    //     }
    //   }
    // });
  }

  public ngOnInit(): void {
    if (this.router.routerState.snapshot.url) {
      this.setUrl(this.router.routerState.snapshot.url);
    }

    // this.router.events.subscribe(ev => {
    //   if (ev instanceof NavigationEnd) {
    //     this.setUrl(ev.url);
    //   }
    // });
  }

  public changePage(page): void {
    // this._cdRef.detectChanges();
    this.selectedType = _.cloneDeep(page.name);
    this.setUrl(page.path);
    // this.pageChanged.emit(page.path);
    // this.router.navigate(['/pages', 'invoice', page.path]);
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

  private setUrl(mainUrl: string) {
    let url = mainUrl.split('/');
    let lastUrl = url[url.length - 1];
    this.pageChanged.emit(lastUrl);
    switch (lastUrl) {
      case 'invoice':
        this.selectedType = 'Invoice';
        break;
      case 'recurring':
        this.selectedType = 'Recurring';
        break;
      case 'receipt':
        this.selectedType = 'Receipt';
        break;
      case 'cr-note':
        this.selectedType = 'Credit Note';
        break;
      case 'dr-note':
        this.selectedType = 'Debit Note';
        break;
      default:
        this.selectedType = 'Invoice';
        break;
    }
  }

}
