import { Pipe, PipeTransform } from '@angular/core';

import { Flyer } from './heroes';

@Pipe({ name: 'OmitByKeyPipe', pure: false })
export class OmitByKeyPipe implements PipeTransform {
  public transform(arr: any[]) {
    return arr.filter(o => o.name !== 'Sarfaraz Ansari');
  }
}
