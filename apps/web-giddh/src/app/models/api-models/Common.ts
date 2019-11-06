export class CountryRequest {
  formName: string;
}

export class CountryResponse {
  alpha2CountryCode: string;
  alpha3CountryCode: string;
  callingCode: string;
  countryName: string;
  currency: {
    code: string;
    symbol: string;
  };
}

export class CurrencyResponse {
  code: string;
  symbol: string;
}

export class CallingCodesResponse {
  callingCodes: string;
}

export class FormResponse {
  mobileNumber: {
    callingCode: string;
    regex: string;
  };
  applicableTaxes: [ {
    name: string;
    uniqueName: string;
  }];
  currency: {
    code: string;
    symbol: string;
  };
  fields: [{
    regex: string;
    name: string;
    label: string;
  }];
}
