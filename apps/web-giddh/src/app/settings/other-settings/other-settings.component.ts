import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'other-settings',
  templateUrl: './other-settings.component.html',
  styleUrls: ['./other-settings.component.scss']
})
export class OtherSettingsComponent implements OnInit {
  public isBranchElement: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

}
