import { Configuration } from '../../app.constant';
let COMMON_URL = Configuration.ApiUrl + '/stock/:stockUniqueName/manufacture';
export const MANUFACTURING_API = {
  GET: COMMON_URL + '/:manufacturingUniqueName',
  CREATE: COMMON_URL,
  UPDATE: COMMON_URL + '/:manufacturingUniqueName',
  DELETE: COMMON_URL + '/:manufacturingUniqueName'
};
