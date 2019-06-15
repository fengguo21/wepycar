import http from './http.js'
// Get External User Profiles
export const getExternals = params => http('wechat-enterprise/v1/external/users/profiles', params, 'POST', 'head1')
// JS Code to Session
export const wxLogin = params => http('wechat-enterprise/v1/api/jscode_to_session', params, 'POST', 'head2')
// Get CDB Customer
export const getCdb = params => http('wechat-enterprise/v1/external/users/nsi_customer', params, 'GET', 'head1')
// Bind Offline Customer and SA
export const bindCustomer = params => http('wechat-enterprise/v1/external/users?action=bind', params, 'POST', 'head1')
// Check Token
export const checkToken = params => http('wechat-enterprise/v1/mp/auth/token', params, 'GET', 'head1')
// Refresh Token
export const refreshToken = params => http('wechat-enterprise/v1/mp/auth/token', params, 'PUT', 'head3')
