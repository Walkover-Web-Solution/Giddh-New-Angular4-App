import { Router } from '@angular/router';
import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
// import { AuthService } from 'ng2-ui-auth';

import { AuthService, AppGlobals } from 'angular2-google-login';
import { ModalDirective } from 'ngx-bootstrap';

import { ErrorHandlerService } from './../services/errorhandler.service';
@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('emailVerifyModal') public emailVerifyModal: ModalDirective;
  public isSubmited: boolean = false;
  public emailVerifyForm: FormGroup;
  private imageURL: string;
  private email: string;
  private name: string;
  private token: string;
  // tslint:disable-next-line:no-empty
  constructor(private _fb: FormBuilder,
              private auth: AuthService,
              private router: Router,
              private eh: ErrorHandlerService,
              private zone: NgZone) { }

  // tslint:disable-next-line:no-empty
  public ngOnInit() {
    AppGlobals.GOOGLE_CLIENT_ID = '641015054140-3cl9c3kh18vctdjlrt9c8v0vs85dorv2.apps.googleusercontent.com';
    this.emailVerifyForm = this._fb.group({
        email: ['', [Validators.required, Validators.email]],
        token: ['', Validators.required]
    });
  }

  public googleAuthenticate() {
    this.auth.authenticateUser((result) => {
      // Using Angular2 Zone dependency to manage the scope of variables
      this.zone.run(() => {
        this.getData();
      });
    });
  }

  public showEmailModal() {
    this.emailVerifyModal.show();

    this.emailVerifyModal.onShow.subscribe(() => {
      this.isSubmited = false;
    });
  }

  public hideEmailModal() {
    this.emailVerifyModal.hide();
  }

  /**
   * Getting data from browser's local storage
   */
  public getData() {
    this.token = localStorage.getItem('token');
    this.imageURL = localStorage.getItem('image');
    this.name = localStorage.getItem('name');
    this.email = localStorage.getItem('email');
  }

  /**
   * Logout user and calls function to clear the localstorage
   */
  public logout() {
    let scopeReference = this;
    this.auth.userLogout(function() {
      scopeReference.clearLocalStorage();
    });
  }

  /**
   * Clearing Localstorage of browser
   */
  public clearLocalStorage() {
    localStorage.removeItem('token');
    localStorage.removeItem('image');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
  }
}
