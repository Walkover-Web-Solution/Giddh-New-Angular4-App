import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'address-settings',
  templateUrl: './address-settings.component.html',
  styleUrls: ['./address-settings.component.scss']
})
export class AddressSettingsComponent implements OnInit {
  public isBranchElement: boolean = false;
  public accountAsideMenuState: string = 'out';
  constructor() { }

  ngOnInit(): void {
  }


  public openAddAndManage() {
    this.toggleAccountAsidePane();
}

public toggleAccountAsidePane(event?): void {
    if (event) {
        event.preventDefault();
    }
    this.accountAsideMenuState = this.accountAsideMenuState === 'out' ? 'in' : 'out';

    this.toggleBodyClass();
}


public toggleBodyClass() {
    if (this.accountAsideMenuState === 'in') {
        document.querySelector('body').classList.add('fixed');
    } else {
        document.querySelector('body').classList.remove('fixed');
    }
}



}
