/*
 * Install DevTool extensions when Electron is in development mode
 */
import { app } from 'electron';

declare const ENV: string;

if (ENV === 'development') {
  // tslint:disable-next-line:no-var-requires
  const installExtension = require('electron-devtools-installer').default;

  const extensions = [
    {name: 'Redux DevTools', id: 'lmhkpmbekcpmknklioeibfkpmmfibljd'},
  ];

  app.once('ready', () => {
    const userDataPath = app.getPath('userData');
    extensions.forEach((ext) => {
      installExtension(ext.id).then(() => {
        // console.log(ext.name + ' installed in ' + userDataPath);
      }).catch((err) => {
        console.error('Failed to install ' + ext.name, err);
      });
    });
    require('devtron').install();
  });

}
