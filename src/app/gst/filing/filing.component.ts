import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppState } from 'app/store';
import { Store } from '@ngrx/store';

@Component({
  selector: 'filing',
  templateUrl: 'filing.component.html',
  styleUrls: ['filing.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class FilingComponent implements OnInit {
  public selectedPeriod: string = null;
  public gstNumber: string = null;
  constructor(private _route: Router, private activatedRoute: ActivatedRoute, private store: Store<AppState>) {
    //
  }

  public ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.selectedPeriod = params['period'];
    });
  }

}
