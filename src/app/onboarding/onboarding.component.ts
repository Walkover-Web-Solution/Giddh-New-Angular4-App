import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'onboarding-component',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css']

})

export class OnboardingComponent implements OnInit {
  constructor(private _router: Router) {
    //
  }

  public ngOnInit() {
    //
  }

  public goTo(path: string) {
    this._router.navigate([path], { queryParams: { tab: 'permission', tabIndex: 5 } });
  }

  // public downloadPlugin() {
  //   window.location = 'https://s3.ap-south-1.amazonaws.com/giddhbuildartifacts/Walkover+Prod.tcp';
  // }
}
