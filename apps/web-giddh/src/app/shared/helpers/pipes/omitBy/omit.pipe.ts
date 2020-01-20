import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'OmitByKeyPipe', pure: true })
export class OmitByKeyPipe implements PipeTransform {
	public transform(data: any[], key: string, val: string): any[] {
		if (data && data.length) {
			if (key && val) {
				return data.filter(o => o[key] !== val);
			} else {
				return data;
			}
		}
	}
}
