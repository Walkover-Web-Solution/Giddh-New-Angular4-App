const local = {
  errlyticsNeeded: 'false',
  errlyticsKey: '""',
  isElectron:'false',
  AppUrl: '"http://localapp.giddh.com:3000/"',
  ApiUrl: '"http://apitest.giddh.com/"',
  APP_FOLDER: '""'
};
const test = {
  errlyticsNeeded: 'false',
  errlyticsKey: '""',
  isElectron:'false',
  AppUrl: '"http://test.giddh.com/"',
  ApiUrl: '"http://apitest.giddh.com/"',
  APP_FOLDER: '"app/"'
};
const prod = {
  errlyticsNeeded: 'true',
  errlyticsKey: '"eTrTpSiedQC4tLUYVDup3RJpc_wFL2QhCaIc0vzpsQA"',
  isElectron:'false',
  AppUrl: '"https://giddh.com/"',
  ApiUrl: '"https://api.giddh.com/"',
  APP_FOLDER: '"app/"'
};


module.exports = { local, test, prod };
