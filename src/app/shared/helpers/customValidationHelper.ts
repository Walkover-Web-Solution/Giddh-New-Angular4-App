import { FormControl, AbstractControl, FormArray } from '@angular/forms';

export const emailValidator = (control: FormControl) => {
  return new Promise<any>((resolve, reject) => {
    let pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!pattern.test(control.value)) {
      resolve({ notValid: true });
    }else {
      resolve(null);
    }
  });
};

export const mobileValidator = (control: FormControl) => {
  return new Promise<any>((resolve, reject) => {
    let pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!pattern.test(control.value)) {
      resolve({ notValid: true });
    }else {
      resolve(null);
    }
  });
};

export const uniqueNameValidator = (control: FormControl) => {
  return new Promise<any>((resolve, reject) => {
    let pattern = /^[a-z0-9]*$/;
    if (!pattern.test(control.value)) {
      resolve({ notValidUniqueName: true });
    } else {
      resolve(null);
    }
  });
};

export const stockManufacturingDetailsValidator = (control: AbstractControl) => {
    // const linkedStockUniqueName = control.get('linkedStockUniqueName');
    // const linkedQuantity = control.get('linkedQuantity');
    // const linkedStockUnitCode = control.get('linkedStockUnitCode');
    const linkedStocks = control.get('linkedStocks') as FormArray;
    const manufacturingQuantity = control.get('manufacturingQuantity');
    const manufacturingUnitCode = control.get('manufacturingUnitCode');

    if (manufacturingQuantity && manufacturingUnitCode) {
      if (!linkedStocks.controls.length) {
        return {notAllowed: true};
      } else {
        return null;
      }
    } else {
      return null;
    }
};
