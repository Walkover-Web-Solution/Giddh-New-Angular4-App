import { Pipe, PipeTransform } from '@angular/core';
/**
 * Handles Pipe functionality
 */
@Pipe({ name: 'dataType', pure: true, standalone: false })

/**
 * DataTypePipe pipe
 * Implements DataTypePipe functionality
 */
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
