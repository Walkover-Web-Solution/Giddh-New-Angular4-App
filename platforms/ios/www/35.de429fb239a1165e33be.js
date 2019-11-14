(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[35],{

/***/ "./src/app/signup/signup.component.css":
/*!*********************************************!*\
  !*** ./src/app/signup/signup.component.css ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900');\n/************ login page start *****************/\n/*typography styles*/\nbody.ununresponsive {\n  padding: 0;\n  background: #2c2c43;\n}\n.intro.login {\n  /* background: url('../images/new/login_bg.jpg') no-repeat top center scroll; */\n  background-size: cover;\n  width: 100%;\n  display: table;\n}\n.btn-lg {\n  padding: 10px 16px;\n  font-size: 16px;\n  line-height: 1.3333333;\n}\n.btn {\n  cursor: pointer;\n}\n.btn:focus {\n  outline: 0;\n}\n.modal-header h3 {\n  color: #fff;\n  font-size: 1.3rem;\n}\n.login {\n  padding-top: 0;\n}\n.login .brand-heading {\n  color: white;\n  font-size: 40px;\n  margin-bottom: 80px;\n}\n#box {\n  background-color: #fff;\n  padding: 20px 30px;\n  margin: 0 auto;\n  width: 360px;\n  height: auto;\n}\n#box button {\n  text-transform: uppercase;\n}\n.login-btn {\n  position: relative;\n}\n#box img {\n  max-height: 30px;\n  position: absolute;\n  left: 10px;\n  top: 4px;\n}\n#box .glyphicon {\n  max-height: 30px;\n  position: absolute;\n  left: 15px;\n  top: 13px;\n}\n#box .btn:hover,\n#box .btn:hover {\n  color: #fff;\n}\n.mrB1 {\n  margin-bottom: 10px\n}\n.twitter {\n  background: #11B1E5;\n}\n.google {\n  background: #DE4D3C;\n}\n.linkedin {\n  background: #0E78AA;\n}\n.mobile {\n  background: #26263A;\n}\n.btn-login {\n  text-transform: uppercase;\n  color: #fff;\n  margin-bottom: 10px;\n  display: inline-block;\n  vertical-align: middle;\n  transform: translateZ(0);\n  box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  -webkit-backface-visibility: hidden;\n  backface-visibility: hidden;\n  -moz-osx-font-smoothing: grayscale;\n  transition-duration: 0.3s;\n  transition-property: transform;\n  padding: 10px 16px !important;\n}\n.btn-login:hover,\n.btn-login:focus,\n.btn-login:active {\n  transform: scale(1.1);\n}\n/*giddh loader*/\n.giddh-spinner {\n  -webkit-animation: rotate 1.5s infinite linear;\n          animation: rotate 1.5s infinite linear;\n  background: #221F1F none repeat scroll 0 0;\n  border: 7px solid #C63B13;\n  border-radius: 50%;\n  box-shadow: 0 -10px 0 14px #fff inset;\n  box-sizing: border-box;\n  height: 60px;\n  width: 60px;\n  margin: 0 auto 20px;\n}\n@-webkit-keyframes rotate {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n@keyframes rotate {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n.intro .lead {\n  text-align: center;\n  font-size: 18px;\n}\n.btn-login.btn-default {\n  color: #333;\n  background-color: #fff;\n  border-color: #ccc;\n}\n.btn-login.btn-default:hover {\n  color: #000 !important;\n  background-color: #fff;\n  border-color: #ccc;\n  box-shadow: none;\n}\n.intro .intro-body {\n  display: table-cell;\n  vertical-align: middle;\n  text-align: center;\n  padding: 100px 0;\n  width: 100%;\n  height: 100%;\n  position: relative;\n  top: 0;\n  left: 0;\n}\nbutton.close {\n  float: right;\n  font-size: 21px;\n  font-weight: 700;\n  line-height: 1;\n  color: #db7f53;\n  text-shadow: none;\n  opacity: 1;\n}\n/* .modal-body {\n    overflow: hidden;\n} */\n.email {\n  background: #10aae0;\n}\n/************* end login page *************/\n/***********************SIGN IN REDESIGN ***********************/\n.form-control,\n:host ::ng-deep .form-control {\n  height: 41px;\n  font-size: 16px;\n}\n:host ::ng-deep .clear {\n  top: 50% !important;\n  font-size: 22px !important;\n  right: 6px !important;\n}\n:host ::ng-deep .btn-success {\n  background: #ff5f00;\n  color: #fff;\n}\n:host ::ng-deep .btn-success:hover {\n  background: #2c2c43;\n  /* color: #ff5f00; */\n}\nstrong {\n  font-family: 'Roboto', sans-serif;\n}\n.flex-container {\n  display: flex;\n  height: 100%;\n  align-items: center;\n  font-family: 'Roboto', sans-serif;\n  justify-content: flex-start;\n  flex-direction: row-reverse;\n}\n.flex-container > div {\n  align-items: center;\n  height: 100%;\n  display: flex;\n  font-family: 'Roboto', sans-serif;\n}\n.logo {\n  align-self: start;\n}\nh1 {\n  font-size: 24px;\n}\n.slide_content {\n  padding: 0 100px;\n  color: #fff;\n  background: #2c2c43;\n  justify-content: space-evenly;\n  text-align: left;\n  flex-direction: column;\n  justify-content: space-evenly;\n}\n.login_box {\n  background: #FFF8EA url('/./assets/images/banner-grid-design.png') repeat;\n  padding: 20px 70px;\n}\n.login_box h1 {\n  color: #0f0f27;\n  font-weight: 500;\n}\n.form_wrapper {\n  display: flex;\n  margin-bottom: 40px;\n  flex-direction: column;\n}\nsmall {\n  color: #333;\n}\n.form_wrapper form {\n  width: 300px;\n}\n/* social_login */\n.social_login {\n  overflow: hidden;\n  display: flex;\n}\n.social_login li {\n  list-style: none;\n  display: inline-block;\n  margin-right: 15px;\n}\n.social_login li a {\n  display: inline-block;\n  height: 40px;\n  border: 1px solid;\n  min-width: 40px;\n  line-height: 40px;\n  text-align: center;\n  position: relative;\n}\n.google_ico a {\n  color: #fff;\n  padding-left: 40px !important;\n}\n.google_ico span {\n  padding: 0 15px;\n}\n/* social icon */\n.linkedin_ico a {\n  color: #0d83b3;\n  border-color: #0d83b3;\n}\n.google_ico a {\n  background: #5092f3;\n  border-color: #5092f3 !important;\n  color: #fff;\n}\n.ico-google {\n  height: 38px;\n  position: absolute;\n  width: 40px;\n  left: 0;\n  background: #fff8eb;\n  line-height: 38px;\n  vertical-align: middle;\n}\n.ico-google img {\n  width: 18px;\n  height: 18px;\n}\n.login_option,\n.login_option a {\n  color: #0c5fc1;\n  margin-top: 55px;\n  font-weight: 500;\n}\n.login_option a {\n  border-bottom: 2px dotted #0c5fc1;\n}\n.slide_content h1 {\n  font-size: 24px;\n  text-align: left;\n  font-weight: 500;\n  line-height: 34px;\n}\n.feature_list {\n  display: flex;\n  flex-direction: column;\n  /* height: 100%; */\n  align-items: left;\n  justify-content: space-evenly;\n  align-self: self-start;\n}\n.feature_list li {\n  list-style: none;\n  margin-bottom: 70px;\n  padding-left: 55px;\n  position: relative;\n}\n.feature_list li .signup-ico {\n  position: absolute;\n  left: 0;\n  height: 100%;\n  width: 30px;\n  right: 0;\n  top: 7px;\n  bottom: 0;\n}\n.feature_list li > p {\n  font-size: 20px;\n  text-align: left\n}\n.client_testimonial {\n  align-self: flex-start;\n  /* padding-left: 55px; */\n  position: relative;\n  width: 100%;\n  background: rgba(106, 106, 168, 15%);\n  margin: 0 -15px;\n}\n.client_testimonial .content {\n  display: flex;\n  align-self: left;\n  flex-direction: column;\n  align-items: self-start;\n  position: relative;\n  padding: 30px 70px;\n}\n.client_testimonial p {\n  font-size: 20px;\n  margin-bottom: 10px;\n  text-align: left\n}\n.client_testimonial h4 {\n  font-size: 20px\n}\n.hash_tag {\n  color: #e33536;\n}\n.blockquote-ico {\n  position: absolute;\n  left: 15px;\n  height: 100%;\n  width: 30px;\n  right: 0;\n  top: 30px;\n  bottom: 0;\n}\n.hint ul {\n  font-size: 13px;\n  padding: 7px;\n  padding-left: 18px;\n}\n.hint {\n  position: absolute;\n  /* left: -335px; */\n  left: 0;\n  z-index: 1;\n  background: #fff;\n  /* bottom: 0; */\n  bottom: -38px;\n  border-radius: 0;\n  padding: 4px;\n  border: 1px solid #ddd;\n}\n.hint:before {\n  content: '';\n  display: block;\n  width: 0;\n  height: 0;\n  position: absolute;\n  border-top: 8px solid transparent;\n  border-bottom: 8px solid transparent;\n  border-left: 8px solid #dddddd;\n  /* right: -8px; */\n  /* top: 3px; */\n  left: 6px;\n  top: -12px;\n  transform: rotate(-90deg);\n  right: inherit;\n}\n@media only screen and (max-width: 1200px) {\n  .slide_content {\n    padding: 0 55px;\n  }\n}\n@media only screen and (min-width: 767px) {\n  .hidden-md {\n    display: none\n  }\n}\n@media only screen and (max-width: 767px) {\n  .flex-container {\n    background: #FFF8EA url('/./assets/images/banner-grid-design.png') repeat;\n    display: block;\n  }\n\n  .login_box,\n  .slide_content {\n    padding: 80px 20px;\n  }\n\n  .slide_content .logo {\n    display: none;\n  }\n\n  .flex-container > div {\n    display: block;\n    height: auto;\n    text-align: center;\n    overflow: hidden;\n  }\n\n  .social_login {\n    display: block;\n  }\n\n  .logo {\n    padding: 20px;\n    float: left;\n  }\n\n  .logo img {\n    max-width: 130px;\n  }\n\n  .form_wrapper form {\n    margin: 0 auto;\n  }\n\n  .client_testimonial {\n    margin: 0 auto;\n  }\n\n  .hint ul {\n    text-align: left\n  }\n\n  .hint {\n    bottom: -74px;\n  }\n\n  .hint:before {\n    left: 6px;\n    top: -12px;\n    transform: rotate(-90deg);\n    right: inherit;\n  }\n}\n"

/***/ }),

/***/ "./src/app/signup/signup.component.html":
/*!**********************************************!*\
  !*** ./src/app/signup/signup.component.html ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"flex-container\">\n    <a href=\"/\" class=\"logo\"><img src=\"./assets/images/new/giddh-logo.png\" class=\"hidden-md\" /> </a>\n\n    <div class=\"login_box flex col-md-5 col-xs-12\">\n\n        <div class=\"\">\n            <h1 class=\"mrB3\">Signup to the new world of accounting</h1>\n            <div class=\"form_wrapper\" *ngIf=\"loginUsing\">\n\n                <!-- login with email form -->\n                <form class=\"\" name=\"verifyEmailForm\" novalidate [formGroup]=\"emailVerifyForm\" *ngIf=\"loginUsing === 'email'\">\n                    <div *ngIf=\"!(isLoginWithEmailSubmited$ | async)\" class=\"clearfix\">\n\n                        <input class=\"form-control mrB1\" formControlName=\"email\" type=\"email\" placeholder=\"Email address\" required>\n                        <button [disabled]=\"!emailVerifyForm.controls['email'].valid\" [ladda]=\"isLoginWithEmailInProcess$ | async\" class=\"btn btn-success btn-block btn-lg\" (click)=\"LoginWithEmail(emailVerifyForm.controls['email'].value)\">Submit\n            </button>\n\n                    </div>\n                    <div *ngIf=\"isLoginWithEmailSubmited$ | async\" class=\"clearfix\">\n                        <input class=\"form-control mrB1\" formControlName=\"token\" type=\"text\" placeholder=\"Enter verification code here\" required>\n                        <div class=\"clearfix mrB2\">\n                            <button [disabled]=\"!emailVerifyForm.controls['token'].valid\" class=\"btn btn-success btn-block btn-lg\" [ladda]=\"isVerifyEmailInProcess$ | async\" (click)=\"VerifyEmail(emailVerifyForm.controls['email'].value,emailVerifyForm.controls['token'].value)\">\n                Verify Email\n              </button>\n                            <a class=\"btn btn-link cp pull-right\" (click)=\"LoginWithEmail(emailVerifyForm.controls['email'].value)\">Resend\n                code</a>\n                        </div>\n\n                        <!-- <div class=\"clearfix\">\n                <small class=\"\">We have sent a verification code to your registered email.</small>\n            </div> -->\n                    </div>\n                </form>\n                <!-- form end/ -->\n\n\n                <!-- login with userName form -->\n                <form class=\"pos-rel\" id=\"signUpWithPwd\" [formGroup]=\"signUpWithPasswdForm\" (ngSubmit)=\"SignupWithPasswd(signUpWithPasswdForm)\" *ngIf=\"loginUsing === 'userName'\" [hidden]=\"isSignupWithPasswordSuccess$ | async\" autocomplete=\"off\">\n                    <div class=\"clearfix form-group\">\n                        <input class=\"form-control mrB1\" type=\"text\" formControlName=\"email\" placeholder=\"Email Id\" />\n                        <input class=\"form-control\" type=\"password\" (ngModelChange)=\"validatePwd($event)\" formControlName=\"password\" name=\"password\" placeholder=\"Password\" [minlength]=\"8\" [maxlength]=\"20\" autocomplete=\"false\" />\n                        <div class=\"hint\" [hidden]=\"!showPwdHint\">\n                            <ul>\n                                <li>Provide minimum 8 and maximum 20 characters.</li>\n                                <li>1 number and 1 special character (@$!%*?&_).</li>\n                                <!-- <li>1 uppercase letter.</li>\n                <li>1 lowercase letter.</li> -->\n                            </ul>\n                        </div>\n                        <button class=\"btn btn-success btn-lg btn-block mrT1\" type=\"submit\" [disabled]=\"!signUpWithPasswdForm.controls['email'].valid || !signUpWithPasswdForm.controls['password'].value\">\n              Signup\n            </button>\n                    </div>\n                </form>\n                <!-- form end/ -->\n                <form class=\"\" *ngIf=\"isSignupWithPasswordSuccess$ | async\" id=\"signupVerifyForm\" [formGroup]=\"signupVerifyForm\" autocomplete=\"off\">\n                    <div class=\"clearfix\">\n                        <!-- <input class=\"form-control mrB1\" formControlName=\"email\" type=\"text\" placeholder=\"Email Id\" required> -->\n                        <input class=\"form-control mrB1\" formControlName=\"verificationCode\" type=\"text\" placeholder=\"Enter verification code here\" required>\n                        <div class=\"clearfix mrB2\">\n                            <button [disabled]=\"!signupVerifyForm.controls['verificationCode'].valid\" class=\"btn btn-success btn-block btn-lg\" (click)=\"VerifyEmail(signupVerifyForm.controls['email'].value,signupVerifyForm.controls['verificationCode'].value)\">\n                Verify Email\n              </button>\n                            <a class=\"btn btn-link cp pull-right\" (click)=\"LoginWithEmail(signupVerifyForm.controls['email'].value)\">Resend\n                code</a>\n                        </div>\n                    </div>\n                </form>\n            </div>\n\n\n            <ul class=\"social_login\">\n                <li class=\"google_ico\"><a href=\"javascript:void(0);\" (click)=\"signInWithProviders('google')\"><i\n          class=\"ico-google\">\n          <img src=\"./assets/images/new/google_ico.svg\"/>\n        </i><span>Signup with Google</span></a></li>\n                <li class=\"linkedin_ico\"><a href=\"javascript:void(0);\" (click)=\"signInWithProviders('linkedin')\"><i\n          class=\"fa fa-linkedin\"></i></a></li>\n\n            </ul>\n            <div class=\"login_option\" *ngIf=\"loginUsing !== 'userName'\">\n                <!--  -->\n                Signup with <a href=\"javascript:void(0);\" (click)=\"loginUsing = 'userName'\">email and password</a>\n                <!-- ,<a href=\"javascript:void(0);\" (click)=\"loginUsing = 'email'\">Email</a> -->\n            </div>\n            <div class=\"mrT4\">\n                Already have an account? <a routerLink=\"/login\" class=\"btn btn-sm btn-primary mrL\">Login</a>\n            </div>\n        </div>\n    </div>\n\n    <div class=\"slide_content col-md-7 col-xs-12\">\n        <a href=\"/\" class=\"logo\"><img src=\"./assets/images/new/giddh-logo-white.png\" /> </a>\n        <ul class=\"feature_list\" [hidden]=\"selectedBanner !== 'slide1'\">\n            <li>\n                <span class=\"signup-ico\"><img src=\"./assets/images/signup/icon-Easy.svg\"/></span>\n                <h1>Easy Access</h1>\n                <p>of your financial statements Trial Balance, P&L and B/S.</p>\n            </li>\n            <li>\n                <span class=\"signup-ico\"><img src=\"./assets/images/signup/icon-import.svg\"/></span>\n                <h1>Import from Tally</h1>\n                <p>either sync or import all your financial data to Giddh.</p>\n            </li>\n            <li>\n                <span class=\"signup-ico\"><img src=\"./assets/images/signup/icon-secured.svg\"/></span>\n                <h1>Secured</h1>\n                <p>everything is backed up automatically & stored on the AWS cloud.</p>\n            </li>\n        </ul>\n\n        <ul class=\"feature_list\" [hidden]=\"selectedBanner !== 'slide2'\">\n            <li>\n                <span class=\"signup-ico\"><img src=\"./assets/images/signup/icon-Easy.svg\"/></span>\n                <h1>Simple</h1>\n                <p>a beautiful design to make your accounting easy.</p>\n            </li>\n            <li>\n                <span class=\"signup-ico\"><img src=\"./assets/images/signup/icon-import.svg\"/></span>\n                <h1>Tax Compliance</h1>\n                <p>File your taxes on time.</p>\n            </li>\n            <li>\n                <span class=\"signup-ico\"><img src=\"./assets/images/signup/icon-secured.svg\"/></span>\n                <h1>Everywhere</h1>\n                <p>a mobile app, API integration & dedicated support for your custom needs.</p>\n            </li>\n        </ul>\n\n        <ul class=\"feature_list\" [hidden]=\"selectedBanner !== 'slide3'\">\n            <li>\n                <span class=\"signup-ico\"><img src=\"./assets/images/signup/icon-Easy.svg\"/></span>\n                <h1>Simple</h1>\n                <p>a beautiful design to make your accounting easy.</p>\n            </li>\n            <li>\n                <span class=\"signup-ico\"><img src=\"./assets/images/signup/icon-import.svg\"/></span>\n                <h1>Tax Compliance</h1>\n                <p>File your taxes on time.</p>\n            </li>\n            <li>\n                <span class=\"signup-ico\"><img src=\"./assets/images/signup/icon-secured.svg\"/></span>\n                <h1>Team Management</h1>\n                <p>add all your team mates, accountants and CAs with the permissions they need.</p>\n            </li>\n        </ul>\n\n        <div class=\"client_testimonial\">\n            <div class=\"content\">\n                <span class=\"blockquote-ico\"><img src=\"./assets/images/signup/icon-testimonial.svg\"/> </span>\n                <p>Giddh has helped me immensely in creating and sending invoices automatically.</p>\n                <h4>-Ishan Vyas</h4>\n                <img src=\"./assets/images/signup/instacar.png\" class=\"client_logo mrT\" />\n            </div>\n        </div>\n    </div>\n</div>\n\n<!--email varify modal  -->\n<div class=\"modal fade\" tabindex=\"-1\" bsModal #emailVerifyModal=\"bs-modal\" role=\"dialog\" aria-hidden=\"true\">\n    <div class=\"modal-dialog modal-md\">\n        <div class=\"modal-content\">\n            <div class=\"noBrdRdsModal\">\n\n                <div class=\"modal-header\">\n                    <h3>Sign Up with Giddh</h3>\n                    <span aria-hidden=\"true\" class=\"close\" data-dismiss=\"modal\" (click)=\"hideEmailModal()\">×</span>\n                </div>\n                <div class=\"modal-body clearfix\">\n                    <form class=\"col-xs-12\" name=\"verifyEmailForm\" novalidate [formGroup]=\"emailVerifyForm\">\n                        <div *ngIf=\"!(isLoginWithEmailSubmited$ | async)\" class=\"clearfix form-group form-group-lg\">\n\n                            <input class=\"form-control mrT1\" formControlName=\"email\" type=\"email\" placeholder=\"Enter your email address\" required>\n                            <button [disabled]=\"!emailVerifyForm.controls['email'].valid\" [ladda]=\"isLoginWithEmailInProcess$ | async\" class=\"btn sharp btn-block btn-success btn-lg mrT1\" (click)=\"LoginWithEmail(emailVerifyForm.controls['email'].value)\">Submit\n              </button>\n\n                        </div>\n                        <div *ngIf=\"isLoginWithEmailSubmited$ | async\" class=\"clearfix form-group form-group-lg\">\n\n                            <input class=\"form-control mrT1\" formControlName=\"token\" type=\"text\" placeholder=\"Enter verification code here\" required>\n                            <small>We have sent a verification code to your registered email.</small>\n                            <button [disabled]=\"!emailVerifyForm.controls['token'].valid\" class=\"btn sharp btn-block btn-success btn-lg mrT1\" [ladda]=\"isVerifyEmailInProcess$ | async\" (click)=\"VerifyEmail(emailVerifyForm.controls['email'].value,emailVerifyForm.controls['token'].value)\">\n                Last step to go\n              </button>\n                            <a class=\"btn btn-link cp pull-right\" (click)=\"LoginWithEmail(emailVerifyForm.controls['email'].value)\">Resend\n                code</a>\n                        </div>\n                    </form>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n<!--email varify modal  -->\n\n<!--mobile varify form  -->\n<div class=\"modal fade\" tabindex=\"-1\" bsModal #mobileVerifyModal=\"bs-modal\" role=\"dialog\" aria-hidden=\"true\">\n    <div class=\"modal-dialog modal-md\">\n        <div class=\"modal-content\">\n            <div class=\"noBrdRdsModal\">\n                <div class=\"modal-header\">\n                    <h3>Sign Up with Giddh</h3>\n                    <span aria-hidden=\"true\" class=\"close\" data-dismiss=\"modal\" (click)=\"hideMobileModal()\">×</span>\n                </div>\n                <div class=\"modal-body clearfix\">\n                    <form class=\"col-xs-12\" id=\"verifyMobile\" name=\"verifyEmailForm\" novalidate [formGroup]=\"mobileVerifyForm\">\n                        <div class=\"clearfix form-group-lg\" *ngIf=\"!(isLoginWithMobileSubmited$ | async)\">\n                            <sh-select [options]=\"countryCodeList\" class=\"form-inline\" (selected)=\"setCountryCode($event)\" [placeholder]=\"'CC'\" formControlName=\"country\" class=\"pull-left\" style=\"width: 80px;\"></sh-select>\n                            <input class=\"form-control\" formControlName=\"mobileNumber\" type=\"text\" placeholder=\"Enter your Mobile No\" required style=\"width: calc(100% - 80px);\" />\n                        </div>\n                        <button *ngIf=\"!(isLoginWithMobileSubmited$ | async)\" class=\"btn sharp btn-block btn-success btn-lg mrT1\" (click)=\"getOtp(mobileVerifyForm.controls['mobileNumber'].value,mobileVerifyForm.controls['country'].value)\" [ladda]=\"isLoginWithMobileInProcess$ | async\"\n                            [disabled]=\"!mobileVerifyForm.controls['mobileNumber'].valid\">{{ !(isLoginWithMobileInProcess$ |\n              async) ? 'Get Otp' : 'Resend' }}\n            </button>\n                        <div class=\"clearfix form-group form-group-lg\" *ngIf=\"(isLoginWithMobileSubmited$ | async)\">\n                            <hr class=\"mrtb10\">\n                            <input class=\"form-control\" placeholder=\"Enter OTP\" style=\"border-radius:0\" formControlName=\"otp\">\n                            <button type=\"login\" class=\"btn sharp btn-block btn-success btn-lg mrT1\" [ladda]=\"isVerifyMobileInProcess$ | async\" (click)=\"VerifyCode(mobileVerifyForm.controls['mobileNumber'].value,mobileVerifyForm.controls['otp'].value)\" [disabled]=\"!mobileVerifyForm.controls['otp'].valid\">Login\n              </button>\n                        </div>\n                    </form>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n<!--mobile verify form  -->\n\n<!-- two way auth popup -->\n<div class=\"modal fade\" tabindex=\"-1\" bsModal #twoWayAuthModal=\"bs-modal\" role=\"dialog\" aria-hidden=\"true\">\n    <div class=\"modal-dialog modal-md\">\n        <div class=\"modal-content\">\n            <div class=\"noBrdRdsModal\">\n                <div class=\"modal-header\">\n                    <h3>Sign Up with Giddh</h3>\n                    <span aria-hidden=\"true\" class=\"close\" data-dismiss=\"modal\" (click)=\"resetTwoWayAuthModal()\">×</span>\n                </div>\n                <div class=\"modal-body clearfix\">\n                    <form class=\"col-xs-12\" id=\"authModal\" name=\"verifyEmailForm\" novalidate [formGroup]=\"twoWayOthForm\">\n                        <div class=\"clearfix form-group form-group-lg\">\n                            <hr class=\"mrtb10\">\n                            <input class=\"form-control\" placeholder=\"Enter OTP\" style=\"border-radius:0\" formControlName=\"otp\">\n                            <small>We have sent an OTP to your registered mobile number.</small>\n                            <button type=\"login\" class=\"btn sharp btn-block btn-success btn-lg mrT1\" [ladda]=\"isTwoWayAuthInProcess$ | async\" (click)=\"verifyTwoWayCode()\" [disabled]=\"twoWayOthForm.get('otp').invalid\">Submit\n              </button>\n                        </div>\n                    </form>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n<!-- two way auth popup -->"

/***/ }),

/***/ "./src/app/signup/signup.component.ts":
/*!********************************************!*\
  !*** ./src/app/signup/signup.component.ts ***!
  \********************************************/
/*! exports provided: SignupComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SignupComponent", function() { return SignupComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "../../node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _actions_login_action__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../actions/login.action */ "./src/app/actions/login.action.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var ngx_bootstrap__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ngx-bootstrap */ "../../node_modules/ngx-bootstrap/index.js");
/* harmony import */ var _app_constant__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../app.constant */ "./src/app/app.constant.ts");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @ngrx/store */ "../../node_modules/@ngrx/store/fesm5/store.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs */ "../../node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _models_api_models_loginModels__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../models/api-models/loginModels */ "./src/app/models/api-models/loginModels.ts");
/* harmony import */ var _theme_ng_social_login_module_index__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../theme/ng-social-login-module/index */ "./src/app/theme/ng-social-login-module/index.ts");
/* harmony import */ var _shared_helpers_countryWithCodes__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../shared/helpers/countryWithCodes */ "./src/app/shared/helpers/countryWithCodes.ts");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/platform-browser */ "../../node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _services_toaster_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../services/toaster.service */ "./src/app/services/toaster.service.ts");
/* harmony import */ var _models_user_login_state__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../models/user-login-state */ "./src/app/models/user-login-state.ts");
















var SignupComponent = /** @class */ (function () {
    // tslint:disable-next-line:no-empty
    function SignupComponent(_fb, store, router, loginAction, authService, document, _toaster) {
        var _this = this;
        this._fb = _fb;
        this.store = store;
        this.router = router;
        this.loginAction = loginAction;
        this.authService = authService;
        this.document = document;
        this._toaster = _toaster;
        this.urlPath = "";
        this.isSubmited = false;
        this.countryCodeList = [];
        this.selectedBanner = null;
        this.loginUsing = null;
        this.showPwdHint = false;
        this.retryCount = 0;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_9__["ReplaySubject"](1);
        this.urlPath =  false ? undefined : "http://test.giddh.com/" + "app/";
        this.isLoginWithEmailInProcess$ = store.select(function (state) {
            return state.login.isLoginWithEmailInProcess;
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.isVerifyEmailInProcess$ = store.select(function (state) {
            return state.login.isVerifyEmailInProcess;
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.isLoginWithMobileInProcess$ = store.select(function (state) {
            return state.login.isLoginWithMobileInProcess;
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.isVerifyMobileInProcess$ = store.select(function (state) {
            return state.login.isVerifyMobileInProcess;
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.isLoginWithMobileSubmited$ = store.select(function (state) {
            return state.login.isLoginWithMobileSubmited;
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.isLoginWithEmailSubmited$ = store.select(function (state) {
            return state.login.isLoginWithEmailSubmited;
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        store.select(function (state) {
            return state.login.isVerifyEmailSuccess;
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (value) {
            if (value) {
                // this.router.navigate(['home']);
            }
        });
        store.select(function (state) {
            return state.login.isVerifyMobileSuccess;
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (value) {
            if (value) {
                // this.router.navigate(['home']);
            }
        });
        this.isSignupWithPasswordInProcess$ = store.select(function (state) {
            return state.login.isSignupWithPasswordInProcess;
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.isSignupWithPasswordSuccess$ = store.select(function (state) {
            return state.login.isSignupWithPasswordSuccess;
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.signupVerifyEmail$ = this.store.select(function (p) { return p.login.signupVerifyEmail; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.isSocialLogoutAttempted$ = this.store.select(function (p) { return p.login.isSocialLogoutAttempted; }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        _shared_helpers_countryWithCodes__WEBPACK_IMPORTED_MODULE_12__["contriesWithCodes"].map(function (c) {
            _this.countryCodeList.push({ value: c.countryName, label: c.value });
        });
        this.userLoginState$ = this.store.select(function (p) { return p.session.userLoginState; });
        this.userDetails$ = this.store.select(function (p) { return p.session.user; });
        this.isTwoWayAuthInProcess$ = this.store.select(function (p) { return p.login.isTwoWayAuthInProcess; });
        this.isTwoWayAuthInSuccess$ = this.store.select(function (p) { return p.login.isTwoWayAuthSuccess; });
    }
    // tslint:disable-next-line:no-empty
    SignupComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.document.body.classList.remove("unresponsive");
        this.generateRandomBanner();
        this.mobileVerifyForm = this._fb.group({
            country: ["India", [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required]],
            mobileNumber: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required]],
            otp: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required]]
        });
        this.emailVerifyForm = this._fb.group({
            email: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].email]],
            token: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required]
        });
        this.twoWayOthForm = this._fb.group({
            otp: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required]]
        });
        this.signUpWithPasswdForm = this._fb.group({
            email: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].email]],
            password: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].minLength(8), _angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].maxLength(20), _angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,20}$")]]
        });
        this.signupVerifyForm = this._fb.group({
            email: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].email]],
            verificationCode: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required]
        });
        this.setCountryCode({ value: "India", label: "India" });
        // get user object when google auth is complete
        if (!_app_constant__WEBPACK_IMPORTED_MODULE_7__["Configuration"].isElectron) {
            this.authService.authState.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function (user) {
                _this.isSocialLogoutAttempted$.subscribe(function (res) {
                    if (!res && user) {
                        switch (user.provider) {
                            case "GOOGLE": {
                                _this.store.dispatch(_this.loginAction.signupWithGoogle(user.token));
                                break;
                            }
                            case "LINKEDIN": {
                                var obj = new _models_api_models_loginModels__WEBPACK_IMPORTED_MODULE_10__["LinkedInRequestModel"]();
                                obj.email = user.email;
                                obj.token = user.token;
                                _this.store.dispatch(_this.loginAction.signupWithLinkedin(obj));
                                break;
                            }
                            default: {
                                // do something
                                break;
                            }
                        }
                    }
                });
            });
        }
        //  get login state and check if twoWayAuth is needed
        this.userLoginState$.subscribe(function (status) {
            if (status === _models_user_login_state__WEBPACK_IMPORTED_MODULE_15__["userLoginStateEnum"].needTwoWayAuth) {
                _this.showTwoWayAuthModal();
            }
        });
        // check if two way auth is successfully done
        this.isTwoWayAuthInSuccess$.subscribe(function (a) {
            if (a) {
                _this.hideTowWayAuthModal();
                _this.store.dispatch(_this.loginAction.resetTwoWayAuthModal());
            }
        });
        this.signupVerifyEmail$.subscribe(function (a) {
            if (a) {
                // console.log(a);
                _this.signupVerifyForm.get("email").patchValue(a);
            }
        });
    };
    SignupComponent.prototype.showEmailModal = function () {
        var _this = this;
        this.emailVerifyModal.show();
        this.emailVerifyModal.onShow.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function () {
            _this.isSubmited = false;
        });
    };
    SignupComponent.prototype.LoginWithEmail = function (email) {
        var data = new _models_api_models_loginModels__WEBPACK_IMPORTED_MODULE_10__["SignupwithEmaillModel"]();
        this.retryCount++;
        data.email = email;
        data.retryCount = this.retryCount;
        this.store.dispatch(this.loginAction.SignupWithEmailRequest(data));
    };
    SignupComponent.prototype.VerifyEmail = function (email, code) {
        var data = new _models_api_models_loginModels__WEBPACK_IMPORTED_MODULE_10__["VerifyEmailModel"]();
        data.email = email;
        data.verificationCode = code;
        this.store.dispatch(this.loginAction.VerifyEmailRequest(data));
    };
    SignupComponent.prototype.VerifyCode = function (mobile, code) {
        var data = new _models_api_models_loginModels__WEBPACK_IMPORTED_MODULE_10__["VerifyMobileModel"]();
        data.countryCode = Number(this.selectedCountry);
        data.mobileNumber = mobile;
        data.oneTimePassword = code;
        this.store.dispatch(this.loginAction.VerifyMobileRequest(data));
    };
    SignupComponent.prototype.verifyTwoWayCode = function () {
        var user;
        this.userDetails$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["take"])(1)).subscribe(function (p) { return user = p; });
        var data = new _models_api_models_loginModels__WEBPACK_IMPORTED_MODULE_10__["VerifyMobileModel"]();
        data.countryCode = Number(user.countryCode);
        data.mobileNumber = user.contactNumber;
        data.oneTimePassword = this.twoWayOthForm.value.otp;
        this.store.dispatch(this.loginAction.VerifyTwoWayAuthRequest(data));
    };
    SignupComponent.prototype.hideEmailModal = function () {
        this.emailVerifyModal.hide();
        this.store.dispatch(this.loginAction.ResetSignupWithEmailState());
        this.emailVerifyForm.reset();
    };
    SignupComponent.prototype.showMobileModal = function () {
        this.mobileVerifyModal.show();
    };
    SignupComponent.prototype.hideMobileModal = function () {
        this.mobileVerifyModal.hide();
        this.store.dispatch(this.loginAction.ResetSignupWithMobileState());
        this.mobileVerifyForm.get("mobileNumber").reset();
    };
    SignupComponent.prototype.showTwoWayAuthModal = function () {
        this.twoWayAuthModal.show();
    };
    SignupComponent.prototype.hideTowWayAuthModal = function () {
        this.twoWayAuthModal.hide();
    };
    SignupComponent.prototype.resetTwoWayAuthModal = function () {
        this.store.dispatch(this.loginAction.SetLoginStatus(_models_user_login_state__WEBPACK_IMPORTED_MODULE_15__["userLoginStateEnum"].notLoggedIn));
        this.hideTowWayAuthModal();
    };
    // tslint:disable-next-line:no-empty
    SignupComponent.prototype.getOtp = function (mobileNumber, code) {
        var data = new _models_api_models_loginModels__WEBPACK_IMPORTED_MODULE_10__["SignupWithMobile"]();
        data.mobileNumber = mobileNumber;
        data.countryCode = Number(this.selectedCountry);
        this.store.dispatch(this.loginAction.SignupWithMobileRequest(data));
    };
    /**
     * Getting data from browser's local storage
     */
    SignupComponent.prototype.getData = function () {
        this.token = localStorage.getItem("token");
        this.imageURL = localStorage.getItem("image");
        this.name = localStorage.getItem("name");
        this.email = localStorage.getItem("email");
    };
    SignupComponent.prototype.signInWithProviders = function (provider) {
        return tslib__WEBPACK_IMPORTED_MODULE_0__["__awaiter"](this, void 0, void 0, function () {
            var ipcRenderer, t, t;
            return tslib__WEBPACK_IMPORTED_MODULE_0__["__generator"](this, function (_a) {
                if (_app_constant__WEBPACK_IMPORTED_MODULE_7__["Configuration"].isElectron) {
                    ipcRenderer = window.require("electron").ipcRenderer;
                    if (provider === "google") {
                        t = ipcRenderer.sendSync("authenticate", provider);
                        this.store.dispatch(this.loginAction.signupWithGoogle(t));
                    }
                    else {
                        t = ipcRenderer.sendSync("authenticate", provider);
                        this.store.dispatch(this.loginAction.LinkedInElectronLogin(t));
                    }
                }
                else {
                    //  web social authentication
                    this.store.dispatch(this.loginAction.resetSocialLogoutAttempt());
                    if (provider === "google") {
                        this.authService.signIn(_theme_ng_social_login_module_index__WEBPACK_IMPORTED_MODULE_11__["GoogleLoginProvider"].PROVIDER_ID);
                    }
                    else if (provider === "linkedin") {
                        this.authService.signIn(_theme_ng_social_login_module_index__WEBPACK_IMPORTED_MODULE_11__["LinkedinLoginProvider"].PROVIDER_ID);
                    }
                }
                return [2 /*return*/];
            });
        });
    };
    SignupComponent.prototype.ngOnDestroy = function () {
        this.document.body.classList.add("unresponsive");
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    /**
     * setCountryCode
     */
    SignupComponent.prototype.setCountryCode = function (event) {
        if (event.value) {
            var country = this.countryCodeList.filter(function (obj) { return obj.value === event.value; });
            this.selectedCountry = country[0].label;
        }
    };
    /**
     * randomBanner
     */
    SignupComponent.prototype.generateRandomBanner = function () {
        var bannerArr = ["1", "2", "3"];
        var selectedSlide = bannerArr[Math.floor(Math.random() * bannerArr.length)];
        this.selectedBanner = "slide" + selectedSlide;
    };
    SignupComponent.prototype.SignupWithPasswd = function (model) {
        var ObjToSend = model.value;
        var pattern = /^(?=.*[a-z])(?=.*\d)[A-Za-z\d$@$!%*?&_]{8,20}$/g;
        if (pattern.test(ObjToSend.password)) {
            this.store.dispatch(this.loginAction.SignupWithPasswdRequest(ObjToSend));
        }
        else {
            return this._toaster.errorToast("Password is weak");
        }
    };
    SignupComponent.prototype.validatePwd = function (value) {
        // let pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,20}$/g;
        var pattern = /^(?=.*[a-z])(?=.*\d)[A-Za-z\d$@$!%*?&_]{8,20}$/g;
        if (pattern.test(value)) {
            // this.store.dispatch(this.loginAction.SignupWithPasswdRequest(ObjToSend));
            this.showPwdHint = false;
        }
        else if (value) {
            return this.showPwdHint = true;
        }
        else {
            this.showPwdHint = false;
        }
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ViewChild"])("emailVerifyModal"),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_6__["ModalDirective"])
    ], SignupComponent.prototype, "emailVerifyModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ViewChild"])("mobileVerifyModal"),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_6__["ModalDirective"])
    ], SignupComponent.prototype, "mobileVerifyModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ViewChild"])("twoWayAuthModal"),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_6__["ModalDirective"])
    ], SignupComponent.prototype, "twoWayAuthModal", void 0);
    SignupComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["Component"])({
            selector: "signup",
            template: __webpack_require__(/*! ./signup.component.html */ "./src/app/signup/signup.component.html"),
            styles: [__webpack_require__(/*! ./signup.component.css */ "./src/app/signup/signup.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](5, Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["Inject"])(_angular_platform_browser__WEBPACK_IMPORTED_MODULE_13__["DOCUMENT"])),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormBuilder"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_8__["Store"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"],
            _actions_login_action__WEBPACK_IMPORTED_MODULE_2__["LoginActions"],
            _theme_ng_social_login_module_index__WEBPACK_IMPORTED_MODULE_11__["AuthService"],
            Document,
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_14__["ToasterService"]])
    ], SignupComponent);
    return SignupComponent;
}());



/***/ }),

/***/ "./src/app/signup/signup.module.ts":
/*!*****************************************!*\
  !*** ./src/app/signup/signup.module.ts ***!
  \*****************************************/
/*! exports provided: SignupModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SignupModule", function() { return SignupModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _signup_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./signup.component */ "./src/app/signup/signup.component.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ngx-bootstrap/modal */ "../../node_modules/ngx-bootstrap/modal/index.js");
/* harmony import */ var angular2_ladda__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! angular2-ladda */ "../../node_modules/angular2-ladda/module/module.js");
/* harmony import */ var _theme_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../theme/ng-virtual-select/sh-select.module */ "./src/app/theme/ng-virtual-select/sh-select.module.ts");
/* harmony import */ var _signup_routing_module__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./signup.routing.module */ "./src/app/signup/signup.routing.module.ts");









var SignupModule = /** @class */ (function () {
    function SignupModule() {
    }
    SignupModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ReactiveFormsModule"],
                _signup_routing_module__WEBPACK_IMPORTED_MODULE_8__["SignupRoutingModule"],
                ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_5__["ModalModule"],
                angular2_ladda__WEBPACK_IMPORTED_MODULE_6__["LaddaModule"],
                _theme_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_7__["ShSelectModule"]
            ],
            declarations: [_signup_component__WEBPACK_IMPORTED_MODULE_3__["SignupComponent"]]
        })
    ], SignupModule);
    return SignupModule;
}());



/***/ }),

/***/ "./src/app/signup/signup.routing.module.ts":
/*!*************************************************!*\
  !*** ./src/app/signup/signup.routing.module.ts ***!
  \*************************************************/
/*! exports provided: SignupRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SignupRoutingModule", function() { return SignupRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _signup_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./signup.component */ "./src/app/signup/signup.component.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _decorators_UserAuthenticated__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../decorators/UserAuthenticated */ "./src/app/decorators/UserAuthenticated.ts");





var SignupRoutingModule = /** @class */ (function () {
    function SignupRoutingModule() {
    }
    SignupRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
            imports: [
                _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"].forChild([
                    {
                        path: '', component: _signup_component__WEBPACK_IMPORTED_MODULE_1__["SignupComponent"], canActivate: [_decorators_UserAuthenticated__WEBPACK_IMPORTED_MODULE_4__["UserAuthenticated"]]
                    }
                ])
            ],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"]]
        })
    ], SignupRoutingModule);
    return SignupRoutingModule;
}());



/***/ })

}]);