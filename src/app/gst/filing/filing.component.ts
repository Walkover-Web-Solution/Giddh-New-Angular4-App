import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'filing',
  templateUrl: 'filing.component.html',
  styleUrls: ['filing.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class FilingComponent implements OnInit {
  public selectedPeriod: string = null;
  constructor(private _route: Router, private activatedRoute: ActivatedRoute, ) {
    //
  }

  public ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.selectedPeriod = params['period'];
    });
    //
  }

}
