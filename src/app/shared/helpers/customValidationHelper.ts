import { FormControl } from '@angular/forms';

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
