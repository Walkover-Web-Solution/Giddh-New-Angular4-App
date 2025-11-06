import { Component, Input } from '@angular/core';
import { InventoryUser } from '../../../models/api-models/Inventory-in-out';

@Component({
    selector: 'person-list',
    styles: [`
    .active > a {
      color: #d35f29 !important;
    }

    .stock-grp-list > li > a, .sub-grp > li > a {
      text-transform: capitalize;
    }

    .stock-items > li > a > div {
      text-transform: capitalize;
    }

    .stock-grp-list li > i:focus {
      outline: 0;
    }

    .group-open {
      background: rgb(255, 255, 255);
    }

    .group-open li {
      border: 0;
    }

    .btn-link {
      padding-top: 0 !important;
    }
  `],
    template: `
    <ul class="list-unstyled stock-grp-list clearfix" *ngIf="personList">
      <li routerLinkActive="active" *ngFor="let p of personList"><a [routerLink]="['/pages','inventory-in-out','person',p?.uniqueName]"> {{p.name}}</a></li>
    </ul>
  `
})
export class PersonListComponent {
    @Input() public personList: InventoryUser[];
}
