import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { Component, OnInit } from '@angular/core';

@Component({
  // templateUrl: './inventory.component.html'
  template: `<h2>Hey dude ManufacturingComponent</h2>`
})

export class ManufacturingComponent implements OnInit {
  constructor(private store: Store<AppState>) {
  }

  public ngOnInit() {
    console.log('hello ManufacturingComponent module');
  }
}
