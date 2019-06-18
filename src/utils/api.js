import http from './http.js'
import * as store from './store.js'
import { brand } from './config.js'

// Get External User Profiles
export const getExternals = params => http('wechat-enterprise/v1/external/users/profiles', params, 'POST', {
    'Authorization': 'Bearer ' + store.get('token'),
    'Content-Type': 'application/json;',
    'brand': brand
})
// JS Code to Session
export const wxLogin = params => http('wechat-enterprise/v1/api/jscode_to_session', params, 'POST', {
    'Content-Type': 'application/x-www-form-urlencoded'
})
// Get CDB Customer
export const getCdb = params => http('wechat-enterprise/v1/external/users/nsi_customer', params, 'GET', {
    'Authorization': 'Bearer ' + store.get('token'),
    'Content-Type': 'application/json;',
    'brand': brand
})
// Bind Offline Customer and SA
export const bindCustomer = params => http('wechat-enterprise/v1/external/users?action=bind', params, 'POST', {
    'Authorization': 'Bearer ' + store.get('token'),
    'Content-Type': 'application/json;',
    'brand': brand
})
// Check Token
export const checkToken = params => http('wechat-enterprise/v1/mp/auth/token', params, 'GET', {
    'Authorization': 'Bearer ' + store.get('token'),
    'Content-Type': 'application/json;',
    'brand': brand
})
// Refresh Token
export const refreshToken = params => http('wechat-enterprise/v1/mp/auth/token', params, 'PUT', {
    'Authorization': 'Bearer ' + store.get('token'),
    'brand': brand
})
