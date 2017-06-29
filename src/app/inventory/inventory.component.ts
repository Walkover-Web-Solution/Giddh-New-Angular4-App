import { CompanyRequest } from './../models/api-models/Company';
import { CompanyActions } from './../services/actions/company.actions';
import { Actions } from '@ngrx/effects';

import { Store } from '@ngrx/store';
import { HomeActions } from './actions/home.actions';
import { AppState } from '../store/roots';
import {
  Component,
  OnInit
} from '@angular/core';

@Component({
  selector: 'inventory',
  templateUrl: './inventory.component.html'
})
export class InventoryComponent implements OnInit {

  public localState = { value: '' };
  public items: string[] = ['Amsterdam', 'Antwerp', 'Athens', 'Barcelona',
    'Berlin', 'Birmingham', 'Bradford', 'Bremen', 'Brussels', 'Bucharest',
    'Budapest', 'Cologne', 'Copenhagen', 'Dortmund', 'Dresden', 'Dublin', 'Düsseldorf',
    'Essen', 'Frankfurt', 'Genoa', 'Glasgow', 'Gothenburg', 'Hamburg', 'Hannover',
    'Helsinki', 'Leeds', 'Leipzig', 'Lisbon', 'Łódź', 'London', 'Kraków', 'Madrid',
    'Málaga', 'Manchester', 'Marseille', 'Milan', 'Munich', 'Naples', 'Palermo',
    'Paris', 'Poznań', 'Prague', 'Riga', 'Rome', 'Rotterdam', 'Seville', 'Sheffield',
    'Sofia', 'Stockholm', 'Stuttgart', 'The Hague', 'Turin', 'Valencia', 'Vienna',
    'Vilnius', 'Warsaw', 'Wrocław', 'Zagreb', 'Zaragoza'];

  public value: any = ['Athens'];
  public _disabledV: string = '0';
  public disabled: boolean = false;

  /**
   * TypeScript public modifiers
   */
  constructor(private store: Store<AppState>, private companyActions: CompanyActions) {
    let company = new CompanyRequest();
    // this.store.dispatch(this.companyActions.CreateCompany(company));
  }

  private get disabledV(): string {
    return this._disabledV;
  }

  private set disabledV(value: string) {
    this._disabledV = value;
    this.disabled = this._disabledV === '1';
  }

  public selected(value: any): void {
    console.log('Selected value is: ', value);
  }

  public removed(value: any): void {
    console.log('Removed value is: ', value);
  }

  public refreshValue(value: any): void {
    this.value = value;
  }

  public itemsToString(value: any[] = []): string {
    return value
      .map((item: any) => {
        return item.text;
      }).join(',');
  }

  public ngOnInit() {
    console.log('hello `Home` component');
    // this.exampleData = [
    // ];
  }

  public getAddress(e) {
    console.log(e);
  }
}
