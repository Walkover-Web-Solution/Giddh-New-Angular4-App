import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'dataType', pure: true })

export class DataTypePipe implements PipeTransform {
  /**
   * Returns type of data 
   *
   * @param {*} value
   * @return {*}  {*}
   * @memberof DataTypePipe
   */
  public transform(value: any): any {
    return typeof value;
  }
}
