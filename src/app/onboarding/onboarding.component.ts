import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WindowRef } from '../shared/helpers/window.object';

@Component({
  selector: 'onboarding-component',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css']

})

export class OnboardingComponent implements OnInit {
  constructor(private _router: Router, private _window: WindowRef) {
    //
  }

  public ngOnInit() {
    //
  }

  public goTo(path: string) {
    this._router.navigate([path], { queryParams: { tab: 'permission', tabIndex: 5 } });
  }

  public scheduleNow() {
    let newwindow = window.open('https://app.intercom.io/a/meeting-scheduler/calendar/VEd2SmtLSyt2YisyTUpEYXBCRWg1YXkwQktZWmFwckF6TEtwM3J5Qm00R2dCcE5IWVZyS0JjSXF2L05BZVVWYS0tck81a21EMVZ5Z01SQWFIaG00RlozUT09--c6f3880a4ca63a84887d346889b11b56a82dd98f', 'scheduleWindow', 'height=650,width=1199,left=200,top=100`');
    if (window.focus) {
        newwindow.focus();
    }
      return false;
  }

  // public downloadPlugin() {
  //   window.location = 'https://s3.ap-south-1.amazonaws.com/giddhbuildartifacts/Walkover+Prod.tcp';
  // }
}
