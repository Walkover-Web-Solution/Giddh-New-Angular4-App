(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["common"],{

/***/ "./src/app/models/api-models/loginModels.ts":
/*!**************************************************!*\
  !*** ./src/app/models/api-models/loginModels.ts ***!
  \**************************************************/
/*! exports provided: LinkedInRequestModel, VerifyEmailModel, SignupwithEmaillModel, VerifyEmailResponseModel, UserDetails, SignupWithMobile, SignupWithMobileResponse, VerifyMobileModel, VerifyMobileResponseModel, LoginWithNumberResponse, VerifyLoginOTPResponse, CreatedBy, AuthKeyResponse */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LinkedInRequestModel", function() { return LinkedInRequestModel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VerifyEmailModel", function() { return VerifyEmailModel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SignupwithEmaillModel", function() { return SignupwithEmaillModel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VerifyEmailResponseModel", function() { return VerifyEmailResponseModel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserDetails", function() { return UserDetails; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SignupWithMobile", function() { return SignupWithMobile; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SignupWithMobileResponse", function() { return SignupWithMobileResponse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VerifyMobileModel", function() { return VerifyMobileModel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VerifyMobileResponseModel", function() { return VerifyMobileResponseModel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginWithNumberResponse", function() { return LoginWithNumberResponse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VerifyLoginOTPResponse", function() { return VerifyLoginOTPResponse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreatedBy", function() { return CreatedBy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthKeyResponse", function() { return AuthKeyResponse; });
var LinkedInRequestModel = /** @class */ (function () {
    function LinkedInRequestModel() {
    }
    return LinkedInRequestModel;
}());

var VerifyEmailModel = /** @class */ (function () {
    function VerifyEmailModel() {
    }
    return VerifyEmailModel;
}());

var SignupwithEmaillModel = /** @class */ (function () {
    function SignupwithEmaillModel() {
    }
    return SignupwithEmaillModel;
}());

var VerifyEmailResponseModel = /** @class */ (function () {
    function VerifyEmailResponseModel() {
    }
    return VerifyEmailResponseModel;
}());

var UserDetails = /** @class */ (function () {
    function UserDetails() {
    }
    return UserDetails;
}());

var SignupWithMobile = /** @class */ (function () {
    function SignupWithMobile() {
        this.countryCode = 91;
    }
    return SignupWithMobile;
}());

var SignupWithMobileResponse = /** @class */ (function () {
    function SignupWithMobileResponse() {
    }
    return SignupWithMobileResponse;
}());

var VerifyMobileModel = /** @class */ (function () {
    function VerifyMobileModel() {
        this.countryCode = 91;
    }
    return VerifyMobileModel;
}());

var VerifyMobileResponseModel = /** @class */ (function () {
    function VerifyMobileResponseModel() {
    }
    return VerifyMobileResponseModel;
}());

/**
 * Model for login-with-number api response
 * API:: (login-with-number) login-with-number?countryCode=:countryCode&mobileNumber=:mobileNumber
 * we have to pass a header named Access-Token in this request header
 * how to get access-token tou have to hit sendopt api for this and in response you will get this token
 */
var LoginWithNumberResponse = /** @class */ (function () {
    function LoginWithNumberResponse() {
    }
    return LoginWithNumberResponse;
}());

/**
 * Model for verify-login-otp api response
 * API:: (verify-login-otp) https://sendotp.msg91.com/api/verifyOTP
 * we have to pass a header named application-key in this request header
 * and VerifyMobileModel as request pauload
 * in return we get a response as success if otp is valid, which looks like:
 * {
 *   "status": "success",
 *  "response": {
 *       "code": "NUMBER_VERIFIED_SUCCESSFULLY",
 *       "refreshToken": "c7u0NE-Hdik8GIPmNY4vxqaOGS8DAF2cYb6Irrs8dXoEmxf3UGAFPd-luCG_o8ZrWAtVRdW0ioFc98qwNr3L3rQovoPtHDHUeLw5if0NJcIfZQ4GI0qZOmxnAeaMpLFKAxk8MIHT6S5ORRItGVJecw=="
 *   }
 * }
 * this refresh token is passed as token to login with mobile api
 */
var VerifyLoginOTPResponse = /** @class */ (function () {
    function VerifyLoginOTPResponse() {
    }
    return VerifyLoginOTPResponse;
}());

var CreatedBy = /** @class */ (function () {
    function CreatedBy() {
    }
    return CreatedBy;
}());

var AuthKeyResponse = /** @class */ (function () {
    function AuthKeyResponse() {
    }
    return AuthKeyResponse;
}());



/***/ })

}]);