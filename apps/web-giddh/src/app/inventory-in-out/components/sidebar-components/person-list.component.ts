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

    .grp_open {
      background: rgb(255, 255, 255);
    }

    .grp_open li {
      border: 0;
    }

    .btn-link {
      padding-top: 0 !important;
    }
  `],
    // [routerLink]="[ 'add-group', grp.uniqueName ]"
    template: `
    <ul class="list-unstyled stock-grp-list clearfix" *ngIf="personList">
      <li routerLinkActive="active" *ngFor="let p of personList"><a [routerLink]="['/pages','inventory-in-out','person',p.uniqueName]"> {{p.name}}</a></li>
      <!-- <li class="clearfix" [ngClass]="{'isGrp': grp.childStockGroups.length > 0,'grp_open': grp.isOpen}" *ngFor="let grp of Groups">
         <a (click)="OpenGroup(grp,$event)" class="pull-left" [routerLink]="[ 'group', grp.uniqueName, 'stock-report' ]">
           <div [ngClass]="{'active': (activeGroupUniqueName$ | async) === grp.uniqueName}">{{grp.name}}</div>
         </a>
         <i *ngIf="grp.childStockGroups.length > 0" class="icon-arrow-down pr" [ngClass]="{'open': grp.isOpen}" (click)="OpenGroup(grp,$event)" [routerLink]="[ 'group', grp.uniqueName, 'stock-report' ]"></i>
         <button class="btn btn-link btn-xs pull-right" (click)="goToManageGroup(grp)" *ngIf="grp.isOpen && (activeGroup && activeGroup.uniqueName === grp.uniqueName)">
           Edit
         </button>
         <stock-list [Groups]='grp'>
         </stock-list>
         <stockgrp-list [Groups]='grp.childStockGroups' *ngIf="grp.childStockGroups.length > 0 && grp.isOpen">
         </stockgrp-list>
       </li>-->
    </ul>
  `
})
export class PersonListComponent {
    @Input() public personList: InventoryUser[];
}
