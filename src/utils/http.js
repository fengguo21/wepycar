
import * as store from './store.js'
import base from config.js
import brand from config.js
import agentId from config.js
import type from config.js
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
        store.set('token', res.data.data.token)
      }).catch(err => {
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
        wx.hideToast()
        if (res.statusCode == 401) {
          login()
          return
        }

        if (res.data.status == 0) {
          resolve(res)
        } else {
          if (res.data.status == 1601) {
            reject('【错误代码400】请求错误，请重试或与管理员联系')
          } else if (res.data.status == 1606) {
            reject('【错误代码1606】SA账号的店铺信息错误，请联系管理员。')
          } else if (res.data.status == 1607) {
            reject('【错误代码1607】该CDB顾客编号已绑定其他顾客微信，请核对CDB是否正确，如无误请与管理员联系。')
          } else if (res.data.status == 1608) {
            reject('【错误代码1608】绑定失败， 请与管理员联系。')
          } else if (res.data.status == 1609) {
            reject('【错误代码1609】该顾客已不是您的外部联系人，请确认企业微信好友关系，如您还可以与其聊天，请与管理员联系。')
          } else if (res.data.status == 1303) {
            reject('【错误代码1303】SA账号的品牌信息错误, 请联系管理员。')
          } else if (res.data.status == 1001) {
            reject('【错误代码1001】数据错误，请与管理员联系。')
          } else if (res.data.status == 2003) {
            reject('【错误代码2003】MDB系统错误，请与管理员联系。')
          } else if (res.data.status == 1004) {
            reject('【错误代码1004】SA账号验证失败，请与管理员联系。')
          } else if (res.data.status == 9000) {
            reject('【错误代码9000】SWSE绑定失败，请检查CDB中手机号及中英文是否补全，补全后再绑定；如CDB信息全面，请与管理员联系。')
          } else {
            reject(res.data.message)
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
