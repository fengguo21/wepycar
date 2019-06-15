
import * as store from './store.js'
const base = 'https://preprod.api.rwef.richemont.cn'
import { wxLogin } from './api.js'

const login = function () {
  wx.qy.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId

      wxLogin({
        code: res.code,
        brand: 'CAR',
        agentId: '1000007',
        type: 'binding'

      }).then(res => {
        store.set('token', res.data.data.token)
      }).catch(err => {
        console.log(err, 'reject===========')
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
      'brand': 'CAR'
    }
  }
  if (head === 'head2') {
    console.log('head2------')
    header = {

      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
  if (head === 'head3') {
    header = {
      'Authorization': 'Bearer ' + token,
      'brand': 'CAR'
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
        console.log(res, '---------------------')
        wx.hideToast()
        if (res.statusCode == 401) {
          login()
          return
        }

        if (res.data.status == 0) {
          resolve(res)
        } else {
          if (res.data.status == 9000 | res.data.status == 1001 | res.data.status == 2003) {
            reject(res)
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.message,
              confirmColor: '#ffaf0e',
              showCancel: false
            })
          }
        }
      },
      fail: (error) => {
        wx.hideToast()
        console.log(error, 'rejecr-----')
        reject(error)
      }
    })
  })
}

export default http
