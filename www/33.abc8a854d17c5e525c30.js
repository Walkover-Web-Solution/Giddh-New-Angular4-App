(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[33],{

/***/ "./src/app/login/login.component.css":
/*!*******************************************!*\
  !*** ./src/app/login/login.component.css ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900');\n/************ login page start *****************/\n/*typography styles*/\nbody.ununresponsive {\n  padding: 0;\n  background: #2c2c43;\n}\n.intro.login {\n  /* background: url('../images/new/login_bg.jpg') no-repeat top center scroll; */\n  background-size: cover;\n  width: 100%;\n  display: table;\n}\n.btn-lg {\n  padding: 10px 16px;\n  font-size: 16px;\n  line-height: 1.3333333;\n}\n.btn {\n  cursor: pointer;\n}\n.btn:focus {\n  outline: 0;\n}\n.modal-header h3 {\n  color: #fff;\n  font-size: 1.3rem;\n}\n.login {\n  padding-top: 0;\n}\n.login .brand-heading {\n  color: white;\n  font-size: 40px;\n  margin-bottom: 80px;\n}\n#box {\n  background-color: #fff;\n  padding: 20px 30px;\n  margin: 0 auto;\n  width: 360px;\n  height: auto;\n}\n#box button {\n  text-transform: uppercase;\n}\n.login-btn {\n  position: relative;\n}\n#box img {\n  max-height: 30px;\n  position: absolute;\n  left: 10px;\n  top: 4px;\n}\n#box .glyphicon {\n  max-height: 30px;\n  position: absolute;\n  left: 15px;\n  top: 13px;\n}\n#box .btn:hover,\n#box .btn:hover {\n  color: #fff;\n}\n.mrB1 {\n  margin-bottom: 10px\n}\n.twitter {\n  background: #11B1E5;\n}\n.google {\n  background: #DE4D3C;\n}\n.linkedin {\n  background: #0E78AA;\n}\n.mobile {\n  background: #26263A;\n}\n.btn-login {\n  text-transform: uppercase;\n  color: #fff;\n  margin-bottom: 10px;\n  display: inline-block;\n  vertical-align: middle;\n  -webkit-transform: translateZ(0);\n  transform: translateZ(0);\n  box-shadow: 0 0 1px rgba(0, 0, 0, 0);\n  -webkit-backface-visibility: hidden;\n  backface-visibility: hidden;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-transition-duration: 0.3s;\n  transition-duration: 0.3s;\n  -webkit-transition-property: transform;\n  -webkit-transition-property: -webkit-transform;\n  transition-property: -webkit-transform;\n  transition-property: transform;\n  transition-property: transform, -webkit-transform;\n  padding: 10px 16px !important;\n}\n.btn-login:hover,\n.btn-login:focus,\n.btn-login:active {\n  -webkit-transform: scale(1.1);\n  transform: scale(1.1);\n}\n/*giddh loader*/\n.giddh-spinner {\n  -webkit-animation: rotate 1.5s infinite linear;\n          animation: rotate 1.5s infinite linear;\n  background: #221F1F none repeat scroll 0 0;\n  border: 7px solid #C63B13;\n  border-radius: 50%;\n  box-shadow: 0 -10px 0 14px #fff inset;\n  box-sizing: border-box;\n  height: 60px;\n  width: 60px;\n  margin: 0 auto 20px;\n}\n@-webkit-keyframes rotate {\n  0% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n@keyframes rotate {\n  0% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n.intro .lead {\n  text-align: center;\n  font-size: 18px;\n}\n.btn-login.btn-default {\n  color: #333;\n  background-color: #fff;\n  border-color: #ccc;\n}\n.btn-login.btn-default:hover {\n  color: #000 !important;\n  background-color: #fff;\n  border-color: #ccc;\n  box-shadow: none;\n}\n.intro .intro-body {\n  display: table-cell;\n  vertical-align: middle;\n  text-align: center;\n  padding: 100px 0;\n  width: 100%;\n  height: 100%;\n  position: relative;\n  top: 0;\n  left: 0;\n}\nbutton.close {\n  float: right;\n  font-size: 21px;\n  font-weight: 700;\n  line-height: 1;\n  color: #db7f53;\n  text-shadow: none;\n  opacity: 1;\n}\n/* .modal-body {\n    overflow: hidden;\n} */\n.email {\n  background: #10aae0;\n}\n/************* end login page *************/\n/***********************SIGN IN REDESIGN ***********************/\n.form-control,\n:host ::ng-deep .form-control {\n  height: 41px;\n  font-size: 16px;\n}\n:host ::ng-deep .clear {\n  top: 50% !important;\n  font-size: 22px !important;\n  right: 6px !important;\n}\n:host ::ng-deep .btn-success {\n  background: #e34b26;\n  color: #fff;\n}\n:host ::ng-deep .btn-success:hover {\n  background: #2c2c43;\n  /* color: #ff5f00; */\n}\nstrong {\n  font-family: 'Roboto', sans-serif;\n}\n.flex-container {\n  display: -webkit-box;\n  display: flex;\n  height: 100%;\n  -webkit-box-align: center;\n          align-items: center;\n  font-family: 'Roboto', sans-serif;\n  -webkit-box-pack: start;\n          justify-content: flex-start;\n}\n.flex-container > div {\n  -webkit-box-align: center;\n          align-items: center;\n  height: 100%;\n  display: -webkit-box;\n  display: flex;\n  font-family: 'Roboto', sans-serif;\n}\n.logo {\n  position: absolute;\n  left: 100px;\n  top: 32px;\n  width: 124px;\n  z-index: 9;\n}\nh1 {\n  font-size: 24px;\n}\n.slide_content {\n  padding: 80px 100px;\n  color: #fff;\n  background: #2c2c43;\n  text-align: center;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n          flex-direction: column;\n  -webkit-box-pack: center;\n          justify-content: center;\n}\n.login_box {\n  background: #FFF8EA url('/./assets/images/new/banner-grid-design.png') repeat;\n  padding: 20px 70px;\n}\n.login_box h1 {\n  color: #0f0f27;\n  font-weight: 500;\n}\n.form_wrapper {\n  display: -webkit-box;\n  display: flex;\n  margin-bottom: 40px;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n          flex-direction: column;\n}\nsmall {\n  color: #333;\n}\n.form_wrapper form {\n  width: 300px;\n}\n/* social_login */\n.social_login {\n  overflow: hidden;\n  display: -webkit-box;\n  display: flex;\n}\n.social_login li {\n  list-style: none;\n  display: inline-block;\n  margin-right: 15px;\n}\n.social_login li a {\n  display: inline-block;\n  height: 40px;\n  border: 1px solid;\n  min-width: 40px;\n  line-height: 40px;\n  text-align: center;\n  position: relative;\n}\n.google_ico a {\n  color: #fff;\n  padding-left: 40px !important;\n}\n.google_ico span {\n  padding: 0 15px;\n}\n/* social icon */\n.linkedin_ico a {\n  color: #0d83b3;\n  border-color: #0d83b3;\n}\n.google_ico a {\n  background: #5092f3;\n  border-color: #5092f3 !important;\n  color: #fff;\n}\n.ico-google {\n  height: 38px;\n  position: absolute;\n  width: 40px;\n  left: 0;\n  background: #fff8eb;\n  line-height: 38px;\n  vertical-align: middle;\n}\n.ico-google img {\n  width: 18px;\n  height: 18px;\n}\n.login_option,\n.login_option a {\n  color: #0c5fc1;\n  margin-top: 55px;\n  font-weight: 500;\n}\n.login_option a {\n  border-bottom: 2px dotted #0c5fc1;\n}\n.slide_content h1 {\n  font-size: 24px;\n  font-weight: 400;\n  text-align: center;\n  line-height: 34px;\n}\n.hash_tag {\n  color: #e34b26;\n}\n.slide_content .btn {\n  font-size: 18px;\n  font-weight: 500;\n  margin-top: 55px;\n  -webkit-transition: all 0.5s ease;\n  transition: all 0.5s ease;\n  padding: 4px 18px;\n}\n.slide_content .btn-white {\n  color: #fff7eb;\n  border: 1px solid #fff;\n}\n.slide_content .btn-white:hover {\n  color: #0f0f27;\n  background: #fff;\n}\n.slide_content > div > img {\n  max-width: 400px;\n  margin-bottom: 40px;\n}\n.app_ico,\n.download_app {\n  display: -webkit-box;\n  display: flex;\n  width: 100%;\n  -webkit-box-pack: space-evenly;\n          justify-content: space-evenly;\n}\n.app_ico ul h1 {\n  margin-top: 10px;\n}\n.app_ico ul li,\n.download_app ul li {\n  display: inline-block;\n  list-style: none;\n  /* margin-right: 20px; */\n  border-radius: 2px;\n}\n.app_ico ul li {\n  height: 40px;\n}\n.download_app ul li {\n  margin-right: 0;\n}\n.app_ico ul li a,\n.download_app ul li a {\n  display: inline-block;\n  height: 40px;\n  border: 1px solid;\n  min-width: 40px;\n  line-height: 40px;\n  color: #fff;\n  text-align: center;\n  position: relative;\n  overflow: hidden;\n}\n.app_ico ul li a:hover,\n.download_app ul li a:hover {\n  background: #fff;\n  color: #2c2d43;\n}\n.download_app ul li a:hover i {\n  border-color: #2c2d43;\n}\n.img_hover:hover img:last-child {\n  display: block !important;\n}\n.img_hover:hover img:first-child {\n  display: none;\n}\n@media only screen and (max-width: 768px) {\n  .flex-container {\n    background: #FFF8EA url('/./assets/images/banner-grid-design.png') repeat;\n    display: block;\n  }\n\n  .slide_content {\n    display: none !important;\n    padding: 110px 20px;\n  }\n\n  .login_box {\n    padding: 80px 20px;\n  }\n\n  .on_mobile {\n    display: block !important;\n  }\n\n  .flex-container > div {\n    display: block;\n    height: auto;\n    text-align: center;\n    overflow: hidden;\n  }\n\n  .social_login {\n    display: block;\n  }\n\n  .logo {\n    left: 20px;\n    top: 20px;\n  }\n\n  .logo img {\n    max-width: 130px;\n  }\n\n  .download_app ul li a {\n    height: 50px;\n    line-height: 50px;\n    padding: 0 16px;\n    border-radius: 2px;\n    display: -webkit-box;\n    display: flex;\n  }\n\n  .download_app ul li a i {\n    border-right: 1px solid #fff;\n    padding-right: 16px;\n    font-size: 28px;\n    position: relative;\n    margin-right: 16px;\n    height: 49px;\n    line-height: 49px;\n  }\n\n  .form_wrapper form {\n    margin: 0 auto;\n  }\n}\n"

/***/ }),

/***/ "./src/app/login/login.component.html":
/*!********************************************!*\
  !*** ./src/app/login/login.component.html ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"flex-container\">\n  <a href=\"/\" class=\"logo\"><img src=\"./assets/images/new/giddh-logo-white.png\"/> </a>\n  <!-- slide1 -->\n  <div class=\"slide_content col-xs-7 slide1\" [hidden]=\"selectedBanner !== 'slide1'\">\n    <div>\n      <img src=\"./assets/images/login/img1.png\" class=\"img-responsive\"/>\n    </div>\n    <div>\n      <h1>Automatic entries when you receive payments <br/>online from any payment gateway. <span class=\"hash_tag\">#automation</span>\n      </h1>\n    </div>\n    <a href=\"http://faq.giddh.com/integration/how-to-integrate-razorpay-payment-gateway\" target=\"_blank\"\n       class=\"btn btn-white\">Know more</a>\n  </div>\n\n  <!-- slide2 -->\n  <div class=\"slide_content col-xs-7 slide2\" [hidden]=\"selectedBanner !== 'slide2'\">\n    <div class=\"mrB4\">\n      <h1>Giddh handles your accounting seamlessly, wherever you are!</h1>\n    </div>\n    <div>\n      <img src=\"./assets/images/login/img2.png\" class=\"img-responsive\"/>\n    </div>\n\n    <div class=\"app_ico\">\n      <ul>\n        <li class=\"mrR2\"><a href=\"https://play.google.com/store/apps/details?id=com.giddh.app\" target=\"_blank\"><i\n          class=\"fa fa-android\"></i></a></li>\n        <li>\n          <a href=\"https://itunes.apple.com/in/app/giddh-tb/id999743672?mt=8\" target=\"_blank\" class=\"img_hover\">\n            <i class=\"\">\n              <img src=\"./assets/images/new/ios.svg\"/>\n              <img src=\"./assets/images/new/ios_hover.svg\" [style.display]=\"'none'\"/>\n            </i>\n          </a>\n        </li>\n        <h1>Mobile App</h1>\n      </ul>\n      <ul>\n        <li class=\"mrR2\"><a\n          href=\"https://s3-ap-south-1.amazonaws.com/giddh-app-builds/giddh%20Setup%20{{apkVersion}}.exe\"\n          target=\"_blank\"><i class=\"fa fa-windows\"></i></a></li>\n        <li class=\"mrR2\"><a href=\"https://s3-ap-south-1.amazonaws.com/giddh-app-builds/giddh-{{apkVersion}}.dmg\"\n                            target=\"_blank\"><i class=\"fa fa-apple\"></i></a>\n        </li>\n        <!-- <li><a href=\"https://s3-ap-south-1.amazonaws.com/giddh-app-builds/giddh%20Setup%20{{apkVersion}}.exe\" target=\"_blank\"><i\n  class=\"fa fa-linux\"></i></a></li> -->\n        <h1>Desktop App</h1>\n      </ul>\n    </div>\n  </div>\n\n  <!-- slide3 -->\n  <div class=\"slide_content col-xs-7 slide3\" [hidden]=\"selectedBanner !== 'slide3'\">\n    <div>\n      <img src=\"./assets/images/login/img3.png\" class=\"img-responsive\"/>\n    </div>\n    <div>\n      <h1>Send automated electronic receipts and past due payment <br/> reminders by email or SMS. <span\n        class=\"hash_tag\">#automation</span></h1>\n    </div>\n    <a\n      href=\"http://faq.giddh.com/invoice/send-automated-electronic-receipts-and-past-due-payment-reminders-by-email-or-sms\"\n      target=\"_blank\" class=\"btn btn-white\">Know more</a>\n  </div>\n\n  <!-- slide4 -->\n  <div class=\"slide_content col-xs-7 slide4\" [hidden]=\"selectedBanner !== 'slide4'\">\n    <div>\n      <img src=\"./assets/images/login/img4.png\" class=\"img-responsive\"/>\n    </div>\n    <div>\n      <h1><span class=\"hash_tag\">Share your accounts</span> in real time with your<br/> customers and vendors. And the\n        company with your CA</h1>\n    </div>\n    <a href=\"http://faq.giddh.com/ledger/what-is-magic-link-and-how-to-get-it\" target=\"_blank\" class=\"btn btn-white\">Know\n      more</a>\n  </div>\n\n  <!-- slide5 -->\n  <div class=\"slide_content col-xs-7 slide5\" [hidden]=\"selectedBanner !== 'slide5'\">\n    <div>\n      <img src=\"./assets/images/login/img5.png\" class=\"img-responsive\" [style.max-width.px]=\"500\"/>\n    </div>\n    <div>\n      <h1><span class=\"hash_tag\">Import/Sync</span> all your data from <br/>an old accounting software</h1>\n    </div>\n    <a href=\"http://faq.giddh.com/tally/how-to-sync-your-data-from-tally-to-giddh\" target=\"_blank\"\n       class=\"btn btn-white\">Know more</a>\n  </div>\n\n  <!-- show on small device -->\n  <div class=\"slide_content col-xs-12 on_mobile\" [hidden]=\"true\">\n    <div>\n      <h1>Giddh handles your accounting seamlessly, wherever you are! <span class=\"hash_tag\">Download</span></h1>\n    </div>\n\n    <div class=\"download_app mrT4\">\n      <ul>\n        <li><a href=\"\" target=\"_blank\"><i class=\"fa fa-android\"></i>Download</a></li>\n        <li><a href=\"\" target=\"_blank\"><i class=\"fa fa-apple\"></i>Download</a></li>\n      </ul>\n    </div>\n  </div>\n\n\n  <div class=\"login_box flex col-md-5 col-xs-12\">\n    <div class=\"\">\n      <h1 class=\"mrB3\">Login to your secure accounting space</h1>\n      <div class=\"form_wrapper\" *ngIf=\"loginUsing\">\n\n        <!-- login with email form -->\n        <form class=\"\" name=\"verifyEmailForm\" novalidate [formGroup]=\"emailVerifyForm\" *ngIf=\"loginUsing === 'email'\">\n          <div *ngIf=\"!(isLoginWithEmailSubmited$ | async)\" class=\"clearfix\">\n\n            <input class=\"form-control mrB1\" formControlName=\"email\" type=\"email\" placeholder=\"Email address\" required>\n            <button [disabled]=\"!emailVerifyForm.controls['email'].valid\" [ladda]=\"isLoginWithEmailInProcess$ | async\"\n                    class=\"btn btn-success btn-block btn-lg\"\n                    (click)=\"LoginWithEmail(emailVerifyForm.controls['email'].value)\">Submit\n            </button>\n\n          </div>\n          <div *ngIf=\"isLoginWithEmailSubmited$ | async\" class=\"clearfix\">\n            <input class=\"form-control mrB1\" formControlName=\"token\" type=\"text\"\n                   placeholder=\"Enter verification code here\" required>\n            <div class=\"clearfix mrB2\">\n              <button [disabled]=\"!emailVerifyForm.controls['token'].valid\" class=\"btn btn-success btn-block btn-lg\"\n                      [ladda]=\"isVerifyEmailInProcess$ | async\"\n                      (click)=\"VerifyEmail(emailVerifyForm.controls['email'].value,emailVerifyForm.controls['token'].value)\">\n                Verify Email\n              </button>\n              <a class=\"btn btn-link cp pull-right\" (click)=\"LoginWithEmail(emailVerifyForm.controls['email'].value)\">Resend\n                codes</a>\n            </div>\n\n            <!-- <div class=\"clearfix\">\n    <small class=\"\">We have sent a verification code to your registered email.</small>\n</div> -->\n          </div>\n        </form>\n        <!-- form end/ -->\n\n        <!-- login with mobile form -->\n        <form class=\"\" id=\"verifyMobile\" name=\"verifyEmailForm\" novalidate [formGroup]=\"mobileVerifyForm\"\n              *ngIf=\"loginUsing === 'mobile'\">\n          <div class=\"clearfix form-group\" *ngIf=\"!(isLoginWithMobileSubmited$ | async)\">\n            <sh-select [options]=\"countryCodeList\" class=\"pull-left mrR1\" (selected)=\"setCountryCode($event)\"\n                       [placeholder]=\"'CC'\" formControlName=\"country\" style=\"width: 80px;\"></sh-select>\n            <input class=\"form-control\" formControlName=\"mobileNumber\" type=\"text\" placeholder=\"Mobile No\" required\n                   style=\"width: calc(100% - 90px);\"/>\n            <button class=\"btn btn-success btn-lg btn-block mrT1\"\n                    (click)=\"getOtp(mobileVerifyForm.controls['mobileNumber'].value,mobileVerifyForm.controls['country'].value)\"\n                    [ladda]=\"isLoginWithMobileInProcess$ | async\"\n                    [disabled]=\"!mobileVerifyForm.controls['mobileNumber'].valid\">{{ !(isLoginWithMobileInProcess$ |\n                async) ? 'Get OTP' : 'Resend' }}\n            </button>\n          </div>\n          <div class=\"clearfix form-group\" *ngIf=\"(isLoginWithMobileSubmited$ | async)\">\n            <input class=\"form-control\" placeholder=\"Enter OTP\" formControlName=\"otp\">\n            <button type=\"login\" class=\"btn btn-block btn-success btn-lg mrT1\"\n                    [ladda]=\"isVerifyMobileInProcess$ | async\"\n                    (click)=\"VerifyCode(mobileVerifyForm.controls['mobileNumber'].value,mobileVerifyForm.controls['otp'].value)\"\n                    [disabled]=\"!mobileVerifyForm.controls['otp'].valid\">Login\n            </button>\n          </div>\n        </form>\n        <!-- form end/ -->\n\n        <!-- login with userName form -->\n        <form class=\"pos-rel\" id=\"loginWithPwd\" [formGroup]=\"loginWithPasswdForm\"\n              (ngSubmit)=\"loginWithPasswd(loginWithPasswdForm)\" *ngIf=\"loginUsing === 'userName'\"\n              [hidden]=\"isLoginWithPasswordSuccessNotVerified$ | async\">\n          <div class=\"clearfix form-group\">\n            <input class=\"form-control mrB1\" formControlName=\"uniqueKey\" type=\"text\" placeholder=\"Email Id\"\n                   autocomplete=\"new-email\"/>\n            <input class=\"form-control\" type=\"password\" formControlName=\"password\" placeholder=\"Password\"\n                   autocomplete=\"new-password\"/>\n            <button class=\"btn btn-success btn-lg btn-block mrT1\" type=\"submit\"\n                    [disabled]=\"!loginWithPasswdForm.controls['uniqueKey'].value || !loginWithPasswdForm.controls['password'].value\">\n              Login\n            </button>\n          </div>\n          <a href=\"javascript:void(0)\" class=\"pull-right btn-link fs14\" (click)=\"showForgotPasswordModal()\">Forgot\n            password?</a>\n        </form>\n        <form class=\"\" *ngIf=\"isLoginWithPasswordSuccessNotVerified$ | async\" id=\"signupVerifyForm\"\n              [formGroup]=\"signupVerifyForm\" autocomplete=\"off\">\n          <div class=\"clearfix\">\n            <!-- <input class=\"form-control mrB1\" formControlName=\"email\" type=\"text\" placeholder=\"Email Id\" required> -->\n            <input class=\"form-control mrB1\" formControlName=\"verificationCode\" type=\"text\"\n                   placeholder=\"Enter verification code here\" required>\n            <div class=\"clearfix mrB2\">\n              <button [disabled]=\"!signupVerifyForm.controls['verificationCode'].valid\"\n                      class=\"btn btn-success btn-block btn-lg\"\n                      (click)=\"VerifyEmail(loginWithPasswdForm.controls['uniqueKey'].value,signupVerifyForm.controls['verificationCode'].value)\">\n                Verify Email\n              </button>\n              <a class=\"btn btn-link cp pull-right\"\n                 (click)=\"LoginWithEmail(loginWithPasswdForm.controls['uniqueKey'].value)\">Resend\n                code</a>\n            </div>\n          </div>\n        </form>\n        <!-- form end/ -->\n\n        <div class=\"\" *ngIf=\"loginUsing === 'forgot'\">\n          <form class=\"\" id=\"forgotPassword\" name=\"forgotPassword\" novalidate [formGroup]=\"forgotPasswordForm\"\n                *ngIf=\"forgotStep === 1\" [hidden]=\"!showForgotPassword\">\n            <div class=\"clearfix form-group\">\n              <input class=\"form-control\" formControlName=\"userId\" type=\"text\" placeholder=\"Email Id\" required/>\n            </div>\n            <button class=\"btn btn-block btn-success btn-lg mrT1\" type=\"submit\"\n                    (click)=\"forgotPassword(forgotPasswordForm.controls['userId'].value)\"\n                    [disabled]=\"!forgotPasswordForm.controls['userId'].value\">Reset Password\n            </button>\n          </form>\n          <form class=\"\" id=\"resetPassword\" name=\"resetPassword\" novalidate [formGroup]=\"resetPasswordForm\"\n                *ngIf=\"forgotStep === 2\" [hidden]=\"!showForgotPassword\">\n            <div class=\"row\">\n              <div class=\"clearfix form-group\">\n                <div class=\"col-xs-12\">\n                  <input class=\"form-control\" formControlName=\"verificationCode\" type=\"text\"\n                         placeholder=\"Verification Code\" required autocomplete=\"new-verification\"/>\n                  <input class=\"form-control mrT1\" formControlName=\"newPassword\" type=\"password\"\n                         placeholder=\"New Password\" required autocomplete=\"new-password\"/>\n                </div>\n                <div class=\"col-xs-12\">\n                </div>\n              </div>\n            </div>\n            <button class=\"btn btn-block btn-success btn-lg mrT1\" type=\"submit\"\n                    (click)=\"resetPassword(resetPasswordForm)\"\n                    [disabled]=\"!resetPasswordForm.controls['verificationCode'].value || !resetPasswordForm.controls['newPassword'].value\">\n              Submit\n            </button>\n          </form>\n        </div>\n\n      </div>\n\n\n      <ul class=\"social_login\">\n        <li class=\"google_ico\"><a href=\"javascript:void(0);\" (click)=\"signInWithProviders('google')\"><i\n          class=\"ico-google\">\n          <img src=\"./assets/images/new/google_ico.svg\"/>\n        </i><span>Login with Google</span></a></li>\n        <li class=\"linkedin_ico\" *ngIf=\"showLinkedInButton\"><a href=\"javascript:void(0);\"\n                                                               (click)=\"signInWithProviders('linkedin')\"><i\n          class=\"fa fa-linkedin\"></i></a></li>\n\n      </ul>\n      <div class=\"login_option\" *ngIf=\"loginUsing !== 'userName'\">\n        <!--  -->\n        Login with <a href=\"javascript:void(0);\" (click)=\"loginUsing = 'userName';resetForgotPasswordProcess()\">email\n        and password</a>\n        <!-- , <a href=\"javascript:void(0);\" (click)=\"loginUsing = 'email';resetForgotPasswordProcess()\">Email</a>  -->\n        <!-- or <a href=\"javascript:void(0);\" (click)=\"loginUsing = 'mobile';resetForgotPasswordProcess()\">Mobile</a> -->\n      </div>\n\n      <div class=\"mrT4\">\n        Don't have an account? <a routerLink=\"/signup\" class=\"btn btn-sm btn-primary mrL\">Signup</a>\n      </div>\n    </div>\n  </div>\n</div>\n\n\n<!-- <section id=\"videoBg\" class=\"intro login\" style=\"height: 100%;\">\n    <div class=\"intro-body\">\n        <div class=\"container\">\n            <div class=\"row\">\n                <div class=\"col-sm-12\">\n                    <h1 class=\"brand-heading arvo\">Enter your accounting space</h1>\n\n                    <div id=\"box\" class=\"text-uppercase\">\n                        <div class=\"clearfix mrB1\">\n                            <p class=\"lead \">Sign In or register</p>\n                        </div>\n                        <button type=\"login\" class=\"btn sharp btn-block btn-lg btn-login google\" (click)=\"signInWithProviders('google')\">\n              <img src=\"./assets/images/google-plus-icon.png\">\n              connect with Google\n            </button>\n                        <button type=\"login\" class=\"btn sharp btn-block btn-lg btn-login linkedin\" (click)=\"signInWithProviders('linkedin')\">\n              <img src=\"./assets/images/linkedin-icon.png\">\n              Login with LinkedIn\n            </button>\n                        <button type=\"login\" class=\"btn sharp btn-block btn-lg btn-login email\" (click)=\"showEmailModal()\">\n              <i class=\"glyphicon glyphicon-envelope\"></i>\n              connect with Email\n    </button>\n\n                        <button type=\"login\" class=\"btn sharp btn-block btn-lg btn-login mobile\" (click)=\"showMobileModal()\">\n              <i class=\"glyphicon glyphicon-phone\"></i>\n              Login with Mobile\n            </button>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</section> -->\n\n<!--email varify modal  -->\n<div class=\"modal fade\" tabindex=\"-1\" bsModal #emailVerifyModal=\"bs-modal\" role=\"dialog\" aria-hidden=\"true\">\n  <div class=\"modal-dialog modal-md\">\n    <div class=\"modal-content\">\n      <div class=\"noBrdRdsModal\">\n\n        <div class=\"modal-header\">\n          <h3>Sign Up with Giddh</h3>\n          <span aria-hidden=\"true\" class=\"close\" data-dismiss=\"modal\" (click)=\"hideEmailModal()\">×</span>\n        </div>\n        <div class=\"modal-body clearfix\">\n          <form class=\"col-xs-12\" name=\"verifyEmailForm\" novalidate [formGroup]=\"emailVerifyForm\">\n            <div *ngIf=\"!(isLoginWithEmailSubmited$ | async)\" class=\"clearfix form-group form-group-lg\">\n\n              <input class=\"form-control mrT1\" formControlName=\"email\" type=\"email\"\n                     placeholder=\"Enter your email address\" required>\n              <button [disabled]=\"!emailVerifyForm.controls['email'].valid\" [ladda]=\"isLoginWithEmailInProcess$ | async\"\n                      class=\"btn sharp btn-block btn-success btn-lg mrT1\"\n                      (click)=\"LoginWithEmail(emailVerifyForm.controls['email'].value)\">Submit\n              </button>\n\n            </div>\n            <div *ngIf=\"isLoginWithEmailSubmited$ | async\" class=\"clearfix form-group form-group-lg\">\n\n              <input class=\"form-control mrT1\" formControlName=\"token\" type=\"text\"\n                     placeholder=\"Enter verification code here\" required>\n              <small>We have sent a verification code to your registered email.</small>\n              <button [disabled]=\"!emailVerifyForm.controls['token'].valid\"\n                      class=\"btn sharp btn-block btn-success btn-lg mrT1\" [ladda]=\"isVerifyEmailInProcess$ | async\"\n                      (click)=\"VerifyEmail(emailVerifyForm.controls['email'].value,emailVerifyForm.controls['token'].value)\">\n                Last step to go\n              </button>\n              <a class=\"btn btn-link cp pull-right\" (click)=\"LoginWithEmail(emailVerifyForm.controls['email'].value)\">Resend\n                code</a>\n            </div>\n          </form>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n<!--email varify modal  -->\n\n<!--mobile varify form  -->\n<div class=\"modal fade\" tabindex=\"-1\" bsModal #mobileVerifyModal=\"bs-modal\" role=\"dialog\" aria-hidden=\"true\">\n  <div class=\"modal-dialog modal-md\">\n    <div class=\"modal-content\">\n      <div class=\"noBrdRdsModal\">\n        <div class=\"modal-header\">\n          <h3>Sign Up with Giddh</h3>\n          <span aria-hidden=\"true\" class=\"close\" data-dismiss=\"modal\" (click)=\"hideMobileModal()\">×</span>\n        </div>\n        <div class=\"modal-body clearfix\">\n          <form class=\"col-xs-12\" id=\"verifyMobile\" name=\"verifyEmailForm\" novalidate [formGroup]=\"mobileVerifyForm\">\n            <div class=\"clearfix form-group-lg\" *ngIf=\"!(isLoginWithMobileSubmited$ | async)\">\n              <sh-select [options]=\"countryCodeList\" class=\"form-inline\" (selected)=\"setCountryCode($event)\"\n                         [placeholder]=\"'CC'\" formControlName=\"country\" class=\"pull-left\"\n                         style=\"width: 80px;\"></sh-select>\n              <input class=\"form-control\" formControlName=\"mobileNumber\" type=\"text\" placeholder=\"Enter your Mobile No\"\n                     required style=\"width: calc(100% - 80px);\"/>\n            </div>\n            <button *ngIf=\"!(isLoginWithMobileSubmited$ | async)\" class=\"btn sharp btn-block btn-success btn-lg mrT1\"\n                    (click)=\"getOtp(mobileVerifyForm.controls['mobileNumber'].value,mobileVerifyForm.controls['country'].value)\"\n                    [ladda]=\"isLoginWithMobileInProcess$ | async\"\n                    [disabled]=\"!mobileVerifyForm.controls['mobileNumber'].valid\">{{ !(isLoginWithMobileInProcess$ |\n                async) ? 'Get Otp' : 'Resend' }}\n            </button>\n            <div class=\"clearfix form-group form-group-lg\" *ngIf=\"(isLoginWithMobileSubmited$ | async)\">\n              <hr class=\"mrtb10\">\n              <input class=\"form-control\" placeholder=\"Enter OTP\" style=\"border-radius:0\" formControlName=\"otp\">\n              <button type=\"login\" class=\"btn sharp btn-block btn-success btn-lg mrT1\"\n                      [ladda]=\"isVerifyMobileInProcess$ | async\"\n                      (click)=\"VerifyCode(mobileVerifyForm.controls['mobileNumber'].value,mobileVerifyForm.controls['otp'].value)\"\n                      [disabled]=\"!mobileVerifyForm.controls['otp'].valid\">Login\n              </button>\n            </div>\n          </form>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n<!--mobile verify form  -->\n\n<!-- two way auth popup -->\n<div class=\"modal fade\" tabindex=\"-1\" bsModal #twoWayAuthModal=\"bs-modal\" role=\"dialog\" aria-hidden=\"true\">\n  <div class=\"modal-dialog modal-md\">\n    <div class=\"modal-content\">\n      <div class=\"noBrdRdsModal\">\n        <div class=\"modal-header\">\n          <h3>Sign Up with Giddh</h3>\n          <span aria-hidden=\"true\" class=\"close\" data-dismiss=\"modal\" (click)=\"resetTwoWayAuthModal()\">×</span>\n        </div>\n        <div class=\"modal-body clearfix\">\n          <form class=\"col-xs-12\" id=\"authModal\" name=\"verifyEmailForm\" novalidate [formGroup]=\"twoWayOthForm\">\n            <div class=\"clearfix form-group form-group-lg\">\n              <hr class=\"mrtb10\">\n              <input class=\"form-control\" placeholder=\"Enter OTP\" style=\"border-radius:0\" formControlName=\"otp\">\n              <small>We have sent an OTP to your registered mobile number.</small>\n              <button type=\"login\" class=\"btn sharp btn-block btn-success btn-lg mrT1\"\n                      [ladda]=\"isTwoWayAuthInProcess$ | async\" (click)=\"verifyTwoWayCode()\"\n                      [disabled]=\"twoWayOthForm.get('otp').invalid\">Submit\n              </button>\n            </div>\n          </form>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n<!-- two way auth popup -->\n\n<!--mobile varify form  -->\n<!-- <div class=\"modal fade\" tabindex=\"-1\" bsModal #forgotPasswordModal=\"bs-modal\" role=\"dialog\" aria-hidden=\"true\">\n    <div class=\"modal-dialog modal-md\">\n        <div class=\"modal-content\">\n            <div class=\"noBrdRdsModal\">\n                <div class=\"modal-header\">\n                    <h3>Forgot Password</h3>\n                    <span aria-hidden=\"true\" class=\"close\" data-dismiss=\"modal\" (click)=\"hideForgotPasswordModal()\">×</span>\n                </div>\n                <div class=\"modal-body clearfix\">\n                    <form class=\"col-xs-12\" id=\"forgotPassword\" name=\"forgotPassword\" novalidate [formGroup]=\"forgotPasswordForm\" *ngIf=\"!(isForgotPasswordInProgress$ | async)\">\n                        <div class=\"clearfix form-group\">\n                            <input class=\"form-control\" formControlName=\"userId\" type=\"text\" placeholder=\"Email Id\" required />\n                        </div>\n                        <button class=\"btn btn-sm btn-success pull-right\" type=\"submit\" (click)=\"forgotPassword(forgotPasswordForm.controls['userId'].value)\">Reset Password</button>\n                    </form>\n                    <form class=\"col-xs-12\" id=\"resetPassword\" name=\"resetPassword\" novalidate [formGroup]=\"resetPasswordForm\" *ngIf=\"isForgotPasswordInProgress$ | async\">\n                        <div class=\"row\">\n                            <div class=\"clearfix form-group\">\n                                <div class=\"col-xs-6\">\n                                    <input class=\"form-control\" formControlName=\"verificationCode\" type=\"text\" placeholder=\"Verification Code\" required />\n                                </div>\n                                <div class=\"col-xs-6\">\n                                    <input class=\"form-control\" formControlName=\"newPassword\" type=\"password\" placeholder=\"New Password\" required />\n                                </div>\n                            </div>\n                        </div>\n                        <button class=\"btn btn-sm btn-success  pull-right\" type=\"submit\" (click)=\"resetPassword(resetPasswordForm)\">Submit</button>\n                    </form>\n                </div>\n            </div>\n        </div>\n    </div>\n</div> -->\n<!--mobile verify form  -->\n"

/***/ }),

/***/ "./src/app/login/login.component.ts":
/*!******************************************!*\
  !*** ./src/app/login/login.component.ts ***!
  \******************************************/
/*! exports provided: LoginComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginComponent", function() { return LoginComponent; });
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
/* harmony import */ var _services_authentication_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../services/authentication.service */ "./src/app/services/authentication.service.ts");
/* harmony import */ var _models_user_login_state__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../models/user-login-state */ "./src/app/models/user-login-state.ts");

















var LoginComponent = /** @class */ (function () {
    // tslint:disable-next-line:no-empty
    function LoginComponent(_fb, store, router, loginAction, authService, document, _toaster, _authService) {
        var _this = this;
        this._fb = _fb;
        this.store = store;
        this.router = router;
        this.loginAction = loginAction;
        this.authService = authService;
        this.document = document;
        this._toaster = _toaster;
        this._authService = _authService;
        // @ViewChild('forgotPasswordModal') public forgotPasswordModal: ModalDirective;
        this.isSubmited = false;
        this.countryCodeList = [];
        this.selectedBanner = null;
        this.loginUsing = null;
        this.urlPath = "";
        this.showForgotPassword = false;
        this.forgotStep = 0;
        this.retryCount = 0;
        this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_9__["ReplaySubject"](1);
        //Button to hide linkedIn button till functionality is available
        this.showLinkedInButton = false;
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
        this.isLoginWithPasswordInProcess$ = store.select(function (state) {
            return state.login.isLoginWithPasswordInProcess;
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.isForgotPasswordInProgress$ = store.select(function (state) {
            return state.login.isForgotPasswordInProcess;
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.isResetPasswordInSuccess$ = store.select(function (state) {
            return state.login.isResetPasswordInSuccess;
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
        this.isLoginWithPasswordSuccessNotVerified$ = store.select(function (state) {
            return state.login.isLoginWithPasswordSuccessNotVerified;
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$));
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
    LoginComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.emailVerifyModal.config = { backdrop: "static" };
        this.twoWayAuthModal.config = { backdrop: "static" };
        this.mobileVerifyModal.config = { backdrop: "static" };
        this.getElectronAppVersion();
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
        this.loginWithPasswdForm = this._fb.group({
            uniqueKey: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required],
            password: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].minLength(8), _angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].maxLength(20), _angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,20}$")]]
        });
        this.forgotPasswordForm = this._fb.group({
            userId: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required]]
        });
        this.resetPasswordForm = this._fb.group({
            verificationCode: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required]],
            uniqueKey: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required]],
            newPassword: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required]]
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
            if (status === _models_user_login_state__WEBPACK_IMPORTED_MODULE_16__["userLoginStateEnum"].needTwoWayAuth) {
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
        this.isResetPasswordInSuccess$.subscribe(function (s) {
            if (s) {
                _this.resetForgotPasswordProcess();
                _this.loginUsing = "userName";
            }
        });
        this.isForgotPasswordInProgress$.subscribe(function (a) {
            if (!a) {
                _this.forgotStep = 1;
            }
            else {
                _this.forgotStep = 2;
            }
        });
        this.twoWayAuthModal.onHidden.subscribe(function (e) {
            if (e && e.dismissReason === "esc") {
                return _this.resetTwoWayAuthModal();
            }
        });
        this.isLoginWithPasswordSuccessNotVerified$.subscribe(function (res) {
            if (res) {
                console.log("isLoginWithPasswordSuccessNotVerified", res);
            }
        });
    };
    LoginComponent.prototype.showEmailModal = function () {
        var _this = this;
        this.emailVerifyModal.show();
        this.emailVerifyModal.onShow.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["takeUntil"])(this.destroyed$)).subscribe(function () {
            _this.isSubmited = false;
        });
    };
    LoginComponent.prototype.LoginWithEmail = function (email) {
        var data = new _models_api_models_loginModels__WEBPACK_IMPORTED_MODULE_10__["SignupwithEmaillModel"]();
        this.retryCount++;
        data.email = email;
        data.retryCount = this.retryCount;
        this.store.dispatch(this.loginAction.SignupWithEmailRequest(data));
    };
    LoginComponent.prototype.VerifyEmail = function (email, code) {
        var data = new _models_api_models_loginModels__WEBPACK_IMPORTED_MODULE_10__["VerifyEmailModel"]();
        data.email = email;
        data.verificationCode = code;
        this.store.dispatch(this.loginAction.VerifyEmailRequest(data));
    };
    LoginComponent.prototype.VerifyCode = function (mobile, code) {
        var data = new _models_api_models_loginModels__WEBPACK_IMPORTED_MODULE_10__["VerifyMobileModel"]();
        data.countryCode = Number(this.selectedCountry);
        data.mobileNumber = mobile;
        data.oneTimePassword = code;
        this.store.dispatch(this.loginAction.VerifyMobileRequest(data));
    };
    LoginComponent.prototype.verifyTwoWayCode = function () {
        var user;
        this.userDetails$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["take"])(1)).subscribe(function (p) { return user = p; });
        var data = new _models_api_models_loginModels__WEBPACK_IMPORTED_MODULE_10__["VerifyMobileModel"]();
        data.countryCode = Number(user.countryCode);
        data.mobileNumber = user.contactNumber;
        data.oneTimePassword = this.twoWayOthForm.value.otp;
        this.store.dispatch(this.loginAction.VerifyTwoWayAuthRequest(data));
    };
    LoginComponent.prototype.hideEmailModal = function () {
        this.emailVerifyModal.hide();
        this.store.dispatch(this.loginAction.ResetSignupWithEmailState());
        this.emailVerifyForm.reset();
    };
    LoginComponent.prototype.showMobileModal = function () {
        this.mobileVerifyModal.show();
    };
    LoginComponent.prototype.hideMobileModal = function () {
        this.mobileVerifyModal.hide();
        this.store.dispatch(this.loginAction.ResetSignupWithMobileState());
        this.mobileVerifyForm.get("mobileNumber").reset();
    };
    LoginComponent.prototype.showTwoWayAuthModal = function () {
        this.twoWayAuthModal.show();
    };
    LoginComponent.prototype.hideTowWayAuthModal = function () {
        this.twoWayAuthModal.hide();
    };
    LoginComponent.prototype.resetTwoWayAuthModal = function () {
        this.store.dispatch(this.loginAction.SetLoginStatus(_models_user_login_state__WEBPACK_IMPORTED_MODULE_16__["userLoginStateEnum"].notLoggedIn));
        this.hideTowWayAuthModal();
    };
    // tslint:disable-next-line:no-empty
    LoginComponent.prototype.getOtp = function (mobileNumber, code) {
        var data = new _models_api_models_loginModels__WEBPACK_IMPORTED_MODULE_10__["SignupWithMobile"]();
        data.mobileNumber = mobileNumber;
        data.countryCode = Number(this.selectedCountry);
        this.store.dispatch(this.loginAction.SignupWithMobileRequest(data));
    };
    /**
     * Getting data from browser's local storage
     */
    LoginComponent.prototype.getData = function () {
        this.token = localStorage.getItem("token");
        this.imageURL = localStorage.getItem("image");
        this.name = localStorage.getItem("name");
        this.email = localStorage.getItem("email");
    };
    LoginComponent.prototype.signInWithProviders = function (provider) {
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
    LoginComponent.prototype.ngOnDestroy = function () {
        this.document.body.classList.add("unresponsive");
        this.destroyed$.next(true);
        this.destroyed$.complete();
    };
    /**
     * setCountryCode
     */
    LoginComponent.prototype.setCountryCode = function (event) {
        if (event.value) {
            var country = this.countryCodeList.filter(function (obj) { return obj.value === event.value; });
            this.selectedCountry = country[0].label;
        }
    };
    /**
     * randomBanner
     */
    LoginComponent.prototype.generateRandomBanner = function () {
        var bannerArr = ["1", "2", "3", "4", "5"];
        var selectedSlide = bannerArr[Math.floor(Math.random() * bannerArr.length)];
        this.selectedBanner = "slide" + selectedSlide;
    };
    LoginComponent.prototype.loginWithPasswd = function (model) {
        var ObjToSend = model.value;
        if (ObjToSend) {
            this.store.dispatch(this.loginAction.LoginWithPasswdRequest(ObjToSend));
        }
        // let pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,20}$/g;
        // if (pattern.test(ObjToSend.password)) {
        // } else {
        //   return this._toaster.errorToast('Password is weak');
        // }
    };
    LoginComponent.prototype.showForgotPasswordModal = function () {
        this.showForgotPassword = true;
        this.loginUsing = "forgot";
        this.forgotStep = 1;
    };
    LoginComponent.prototype.forgotPassword = function (userId) {
        this.resetPasswordForm.patchValue({ uniqueKey: userId });
        this.userUniqueKey = userId;
        this.store.dispatch(this.loginAction.forgotPasswordRequest(userId));
    };
    LoginComponent.prototype.resetPassword = function (form) {
        var ObjToSend = form.value;
        ObjToSend.uniqueKey = _.cloneDeep(this.userUniqueKey);
        this.store.dispatch(this.loginAction.resetPasswordRequest(ObjToSend));
    };
    LoginComponent.prototype.resetForgotPasswordProcess = function () {
        this.forgotPasswordForm.reset();
        this.resetPasswordForm.reset();
        this.forgotStep = 1;
        this.userUniqueKey = null;
    };
    LoginComponent.prototype.getElectronAppVersion = function () {
        var _this = this;
        this._authService.GetElectronAppVersion().subscribe(function (res) {
            if (res && typeof res === "string") {
                var version = res.split("files")[0];
                var versNum = version.split(" ")[1];
                _this.apkVersion = versNum;
            }
        });
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ViewChild"])("emailVerifyModal"),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_6__["ModalDirective"])
    ], LoginComponent.prototype, "emailVerifyModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ViewChild"])("mobileVerifyModal"),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_6__["ModalDirective"])
    ], LoginComponent.prototype, "mobileVerifyModal", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ViewChild"])("twoWayAuthModal"),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", ngx_bootstrap__WEBPACK_IMPORTED_MODULE_6__["ModalDirective"])
    ], LoginComponent.prototype, "twoWayAuthModal", void 0);
    LoginComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["Component"])({
            selector: "login",
            template: __webpack_require__(/*! ./login.component.html */ "./src/app/login/login.component.html"),
            styles: [__webpack_require__(/*! ./login.component.css */ "./src/app/login/login.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](5, Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["Inject"])(_angular_platform_browser__WEBPACK_IMPORTED_MODULE_13__["DOCUMENT"])),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormBuilder"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_8__["Store"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"],
            _actions_login_action__WEBPACK_IMPORTED_MODULE_2__["LoginActions"],
            _theme_ng_social_login_module_index__WEBPACK_IMPORTED_MODULE_11__["AuthService"],
            Document,
            _services_toaster_service__WEBPACK_IMPORTED_MODULE_14__["ToasterService"],
            _services_authentication_service__WEBPACK_IMPORTED_MODULE_15__["AuthenticationService"]])
    ], LoginComponent);
    return LoginComponent;
}());



/***/ }),

/***/ "./src/app/login/login.module.ts":
/*!***************************************!*\
  !*** ./src/app/login/login.module.ts ***!
  \***************************************/
/*! exports provided: LoginModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginModule", function() { return LoginModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "../../node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _login_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./login.component */ "./src/app/login/login.component.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "../../node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _login_routing_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./login.routing.module */ "./src/app/login/login.routing.module.ts");
/* harmony import */ var ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ngx-bootstrap/modal */ "../../node_modules/ngx-bootstrap/modal/index.js");
/* harmony import */ var angular2_ladda__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! angular2-ladda */ "../../node_modules/angular2-ladda/fesm5/angular2-ladda.js");
/* harmony import */ var _theme_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../theme/ng-virtual-select/sh-select.module */ "./src/app/theme/ng-virtual-select/sh-select.module.ts");









var LoginModule = /** @class */ (function () {
    function LoginModule() {
    }
    LoginModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ReactiveFormsModule"],
                _login_routing_module__WEBPACK_IMPORTED_MODULE_5__["LoginRoutingModule"],
                ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_6__["ModalModule"],
                angular2_ladda__WEBPACK_IMPORTED_MODULE_7__["LaddaModule"],
                _theme_ng_virtual_select_sh_select_module__WEBPACK_IMPORTED_MODULE_8__["ShSelectModule"]
            ],
            declarations: [_login_component__WEBPACK_IMPORTED_MODULE_3__["LoginComponent"]]
        })
    ], LoginModule);
    return LoginModule;
}());



/***/ }),

/***/ "./src/app/login/login.routing.module.ts":
/*!***********************************************!*\
  !*** ./src/app/login/login.routing.module.ts ***!
  \***********************************************/
/*! exports provided: LoginRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginRoutingModule", function() { return LoginRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "../../node_modules/tslib/tslib.es6.js");
/* harmony import */ var _login_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./login.component */ "./src/app/login/login.component.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "../../node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "../../node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _decorators_UserAuthenticated__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../decorators/UserAuthenticated */ "./src/app/decorators/UserAuthenticated.ts");





var LoginRoutingModule = /** @class */ (function () {
    function LoginRoutingModule() {
    }
    LoginRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
            imports: [
                _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"].forChild([
                    {
                        path: '', component: _login_component__WEBPACK_IMPORTED_MODULE_1__["LoginComponent"], canActivate: [_decorators_UserAuthenticated__WEBPACK_IMPORTED_MODULE_4__["UserAuthenticated"]]
                    }
                ])
            ],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"]]
        })
    ], LoginRoutingModule);
    return LoginRoutingModule;
}());



/***/ })

}]);