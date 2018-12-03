import { GeneralService } from './../../../../services/general.service';
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'giddhCurrency'})
export class GiddhCurrencyPipe implements PipeTransform {

    constructor(private _currencyType: GeneralService) {}
  public transform(input: number) {

         let result = input.toString().split('.');
         let finalOutput;
         let currencyType = (this._currencyType.currencyType != null || this._currencyType.currencyType !== undefined) ? this._currencyType.currencyType : '10,000,000';

     //    currencyType=(currencyType==null)?((this._currencyType.currencyType!=null)? this._currencyType.currencyType : '10,000,000'):'10,000,000';

         switch (currencyType) {
case '1,00,00,000':
{
         let lastThree = result[0].substring(result[0].length - 3);
         let otherNumbers = result[0].substring(0, result[0].length - 3);
         if (otherNumbers !== '' && otherNumbers !== '-') {
             lastThree = ',' + lastThree;
         }
         let output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

         if (result.length > 1) {
             output += '.' + result[1].substring(0, 2);
         }
         finalOutput = output ;

   }
   break;
case '10,000,000':
{
         let lastThree = result[0].substring(result[0].length - 3);
         let otherNumbers = result[0].substring(0, result[0].length - 3);
         if (otherNumbers !== '' && otherNumbers !== '-') {
             lastThree = ',' + lastThree;
         }
         let output = otherNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + lastThree;

         if (result.length > 1) {
             output += '.' + result[1].substring(0, 2);
         }
         finalOutput = output ;

   }
   break;

case '10 000 000': {

    let lastThree = result[0].substring(result[0].length - 3);
    let otherNumbers = result[0].substring(0, result[0].length - 3);
    if (otherNumbers !== '' && otherNumbers !== '-') {
        lastThree = ' ' + lastThree;
    }
    let output = otherNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + lastThree;

    if (result.length > 1) {
        output += '.' + result[1].substring(0, 2);
    }
    finalOutput = output ;

   }break;
case '10\'000\'000': {

    let lastThree = result[0].substring(result[0].length - 3);
    let otherNumbers = result[0].substring(0, result[0].length - 3);
    if (otherNumbers !== '' && otherNumbers !== '-') {
        lastThree = '\'' + lastThree;
    }
    let output = otherNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, "\'") + lastThree;

    if (result.length > 1) {
        output += '.' + result[1].substring(0, 2);
    }
    finalOutput = output ;

   }
   break;

   default: {
    let lastThree = result[0].substring(result[0].length - 3);
    let otherNumbers = result[0].substring(0, result[0].length - 3);
    if (otherNumbers !== '' && otherNumbers !== '-') {
        lastThree = ',' + lastThree;
    }
    let output = otherNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + lastThree;

    if (result.length > 1) {
        output += '.' + result[1].substring(0, 2);
    }
    finalOutput = output ;

}
break;
}
return finalOutput;

}

}
