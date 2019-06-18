
import * as store from './store.js'
import {
  errInfo,
  base,
  brand,
  agentId,
  type
} from './config.js'
import {
  wxLogin
} from './api.js'
const login = function () {
  wx.qy.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      wxLogin({
        code: res.code,
        brand: brand,
        agentId: agentId,
        type: type
      }).then(res => {
        store.set('token', res.data.data.token)
      }).catch(err => {
      })
    }
  })
}
const http = (path, params, method, head) => {
  const newParams = { ...params }
  wx.showToast({
    title: '正在加载...',
    duration: 10000,
    mask: true,
    icon: 'loading'
  })
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${base}/${path}`, // 仅为示例，并非真实的接口地址
      data: newParams,
      method: method,
      header: head,
      success: (res) => {
        wx.hideToast()
        if (res.statusCode == 401) {
          login()
          let errcode = res.statusCode
          reject(errInfo[errcode])
        }
        if (res.statusCode == 400 | res.statusCode == 403 | res.statusCode == 404 | res.statusCode == 502) {
          let errcode = res.statusCode
          reject(errInfo[errcode])
        }
        if (res.data.status == 0) {
          resolve(res)
        } else {

          let errcode = res.data.status
          console.log(errInfo[errcode], '=================')
          if (errInfo[errcode]) {
            reject(errInfo[errcode])
          } else {
            let errinfo = `错误代码${res.data.status},请与管理员联系`
            reject(errinfo)
          }
        }
      },
      fail: (error) => {
        wx.hideToast()
        let errinfo = '网络错误，请检查'
        reject(errinfo)
      }
    })
  })
}
export default http
