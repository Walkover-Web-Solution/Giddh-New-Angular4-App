
const COMMON = 'company/:companyUniqueName/';

export const SETTINGS_INTEGRATION_API = {
  SMS: COMMON + 'sms-key', // GET or POST call
  EMAIL: COMMON + 'email-key', // GET or POST call
  RAZORPAY: COMMON + 'razorpay', // ALL METHODS
  CASHFREE: COMMON + ' cashfree', // POST
  AUTOCOLLECT_USER: COMMON + ' autocollect/add/users', // POST, PUT, DELETE
  PAYMENT_GATEWAY: COMMON + ' payment-gateway' // POST, PUT, DELETE
};
