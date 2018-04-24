import { PipeTransform, Pipe } from '@angular/core';
import * as moment from 'moment';

// tslint:disable-next-line:pipe-naming
@Pipe({ name: 'duration' })
export class DurationPipe implements PipeTransform {
  public transform(text, search) {
  // let duration = moment.duration(moment().diff(moment(text)));
  // console.log('duration', duration);
  // let hours = duration.asHours();
  // console.log('duration', hours);
  // console.log(moment(hours));
  // console.log(moment(text).format('LLL'));
  }
}
