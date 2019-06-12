// tslint:disable-next-line:no-var-requires
const _isDev = require('electron-is-dev');

export function isDev() {
  return _isDev;
}

let _log: (...args: any[]) => void;

if (isDev()) {
  _log = (...args: any[]): void => {
    console.log(args);
  };
} else {
  // tslint:disable-next-line:no-var-requires
  const log = require('electron-log');
  _log = log.info.bind(log);
}

export function log(...args: any[]): void {
  _log(args);
}
