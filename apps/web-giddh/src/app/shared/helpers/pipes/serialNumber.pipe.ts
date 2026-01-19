import { Pipe, PipeTransform } from '@angular/core';

/**
 * Handles Pipe functionality
 */
@Pipe({
  name: 'serialNumber',
  standalone: true
})
/**
 * SerialNumberPipe pipe
 * Implements SerialNumberPipe functionality
 */
export class SerialNumberPipe implements PipeTransform {

  /**
   * Transforms the index of an item to a serial number for a paginated table.
   * @param index - The zero-based index of the item in the current page
   * @param currentPage - The current page number (1-based)
   * @param itemsPerPage - Number of items per page
   * @returns The serial number for the item
   */
  transform(index: number, currentPage: number, itemsPerPage: number): number {
    /**
     * Handles if functionality
     */
    if (currentPage < 1 || itemsPerPage < 1 || index < 0) {
      return -1; // Return an invalid serial number for invalid inputs
    }
    /**
     * Handles return functionality
     */
    return (currentPage - 1) * itemsPerPage + index + 1;
  }

}
