import {bind, Injectable} from 'angular2/angular2';

@Injectable()
export class MessageService {
  message: Array<string>;

  constructor() {
    this.message = 'TIME FLIES LIKE AN ARROW'.split('');
  }

}
