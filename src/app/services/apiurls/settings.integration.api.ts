
const COMMON = 'company/:companyUniqueName/';

export const SETTINGS_INTEGRATION_API = {
  SMS: COMMON + 'sms-key', // GET or POST call
  EMAIL: COMMON + 'email-key', // GET or POST call
  RAZORPAY: COMMON + 'razorpay', // ALL METHODS
  CASHFREE: COMMON + 'cashfree', // GET, POST
  AUTOCOLLECT_USER: COMMON + 'cashfree/autocollect/users', // GET, POST, PUT, DELETE
  PAYMENT_GATEWAY: COMMON + 'cashfree/payment-gateway', // GET, POST, PUT, DELETE
  AMAZON_SELLER: COMMON + 'amazon/seller', // GET, POST
  AMAZON_SELLER_OPERATION: COMMON + 'amazon/seller/:sellerId' // DELETE, PUT
};
