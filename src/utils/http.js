
import * as store from './store.js'
import { errInfo, base, brand, agentId, type } from './config.js'




import { wxLogin } from './api.js'


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
        console.log('login-------------------')
        store.set('token', res.data.data.token)
      }).catch(err => {
        console.log(err, 'login-------------------')
      })
    }
  })
}
const http = (path, params, method, head) => {
  const newParams = { ...params }
  const token = store.get('token')

  let header = ''
  if (head === 'head1') {
    header = {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json;',
      'brand': brand
    }
  }
  if (head === 'head2') {
    header = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  if (head === 'head3') {
    header = {
      'Authorization': 'Bearer ' + token,
      'brand': brand
    }
  }

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
      header: header,
      success: (res) => {
        console.log(res, '------------------')
        wx.hideToast()
        if (res.statusCode == 401) {
          login()
          reject('【错误代码401】登录信息错误或已失效，请重试。')

        }
        if (res.statusCode == 400) {

          reject('【错误代码400】请求错误，请重试或与管理员联系。')
        }
        if (res.statusCode == 403) {
          reject('【错误代码403】无访问权限，请联系管理员。')
        }
        if (res.statusCode == 404) {
          reject('【错误代码404】该信息不存在，请稍后重试或与管理员联系。')
        }
        if (res.statusCode == 502) {
          reject('【错误代码502】连接超时，请与管理员联系。')
        }

        if (res.data.status == 0) {
          resolve(res)
        } else {
          let errcode = res.data.status
          reject(errInfo[errcode])

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
