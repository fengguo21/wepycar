import http from './http.js';
import * as store from './store.js'
const token = store.get('token')

// Get External User Profiles
export const getExternals = params => http.postHasToken('wechat-enterprise/v1/external/users/profiles', params);
// JS Code to Session
export const wxLogin = params => http.post('wechat-enterprise/v1/api/jscode_to_session', params);
// Get CDB Customer
export const getCdb = params => http.service('wechat-enterprise/v1/external/users/nsi_customer', params, 'GET', "head1");
// Bind Offline Customer and SA
export const bindCustomer = params => http.postHasToken('wechat-enterprise/v1/external/users?action=bind', params);
// Check Token
export const checkToken = params => http.service('wechat-enterprise/v1/mp/auth/token', params, 'GET', 'head1');
// Refresh Token
export const refreshToken = params => http.put('wechat-enterprise/v1/mp/auth/token', params);