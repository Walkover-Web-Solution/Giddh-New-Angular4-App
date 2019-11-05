export class CountryResponse {
  alpha2CountryCode: string;
  alpha3CountryCode: string;
  callingCode: string;
  countryName: string;
  currency: {
    code: string;
    symbol: string;
  }
}

export class CurrencyResponse {
  code: string;
  symbol: string;
}
