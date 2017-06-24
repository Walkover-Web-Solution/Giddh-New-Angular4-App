import { FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'company-add',
  templateUrl: './company-add.component.html'
})
export class CompanyAddComponent implements OnInit {
  public phoneNumber: string;
  public verificationCode: string;
  public showVerificationBox: boolean;
  constructor() { }

  // tslint:disable-next-line:no-empty
  public ngOnInit() {

   }

  /**
   * addNumber
   */
  public addNumber() {
    
  }

  /**
   * verifyNumber
   */
  public verifyNumber() {
    
  }
}
