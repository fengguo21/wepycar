
import * as store from './store.js'
const base = 'https://preprod.api.rwef.richemont.cn'
import { wxLogin, checkToken, refreshToken } from './api.js'
const APP_ID = 'wx752c282e61fdd08a'
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
        store.set('token', res.token)
      })
    }
  })
}
const service = (path, params, method, head) => {
  const newParams = { ...params }
  const token = store.get('token')

  if (head == 'head1') {

  }

  const header = {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json;',
    'brand': 'CAR'
  }

  wx.showToast({
    title: '正在加载...',
    duration: 10000,
    mask: true,
    icon: 'loading'
  })
  return new Promise((resolve) => {
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


        }


        if (res.data.status == 0) {
          resolve(res)
        } else {
          if (res.data.status == 9000 | res.data.status == 1001 | res.data.status == 2003) {
            wx.showModal({
              title: '提示',
              content: '网络错误或技术错误，请与管理员联系',
              confirmColor: '#ffaf0e',
              showCancel: false
            })
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
        wx.showModal({
          title: '错误提示',
          content: '网络出错，请稍候'
        })
      }
    })
  })
}
const get = (path, params, showToast) => {
  const newParams = { ...params }
  const token = store.get('token')

  wx.showToast({
    title: '正在加载...',
    duration: 10000,
    mask: true,
    icon: 'loading'
  })

  return new Promise((resolve) => {
    wx.request({
      url: `${base}/${path}`, // 仅为示例，并非真实的接口地址
      data: newParams,
      method: 'GET',
      header: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json;',
        'brand': 'CAR'
      },
      success: (res) => {
        console.log(res, '---------------------')
        wx.hideToast()
        if (res.statusCode == 401) {
          login()

        }


        if (res.data.status == 0) {
          resolve(res)
        } else {
          if (res.data.status == 9000 | res.data.status == 1001 | res.data.status == 2003) {
            wx.showModal({
              title: '提示',
              content: '网络错误或技术错误，请与管理员联系',
              confirmColor: '#ffaf0e',
              showCancel: false
            })
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
        wx.showModal({
          title: '错误提示',
          content: '网络出错，请稍候'
        })
      }
    })
  })
}
const put = (path, params) => {
  const newParams = { ...params }
  const token = store.get('token')


  wx.showToast({
    title: '正在加载...',
    icon: 'loading'
  })


  return new Promise((resolve) => {
    wx.request({
      url: `${base}/${path}`, // 仅为示例，并非真实的接口地址
      data: newParams,
      method: 'PUT',
      header: {
        'Authorization': 'Bearer ' + token,
        // 'Content-Type': 'application/json;',
        'brand': 'CAR'
      },
      success: (res) => {
        wx.hideToast()

        if (res.statusCode == 401) {
          login()
          return

        }
        if (res.statusCode != 200) {
          console.log(res, 'test---------------------')
          wx.showModal({
            title: '提示',
            content: res.errMsg,
            confirmColor: '#ffaf0e',
            showCancel: false
          })
          return
        }


        // if (res.data.status != 0) {

        resolve(res)
      },
      fail: (error) => {
        wx.hideToast()
        wx.showModal({
          title: '错误提示',
          content: '网络出错，请稍候'
        })
      }
    })
  })
}

const postHasToken = (path, params) => {
  const newParams = { ...params }
  const token = store.get('token')
  console.log(token, '---------------------')

  wx.showToast({
    title: '正在加载...',
    icon: 'loading'
  })


  return new Promise((resolve) => {
    wx.request({
      url: `${base}/${path}`, // 仅为示例，并非真实的接口地址
      data: newParams,
      method: 'POST',
      header: {

        // 'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + token,
        'brand': 'CAR',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      success: (res) => {
        wx.hideToast()
        console.log(res, '==========kun')
        if (res.statusCode == 401) {
          login()
          return

        }
        // if (res.statusCode = 500) {
        //   console.log(res, 'test---------------------')
        //   wx.showModal({
        //     title: '提示',
        //     content: res.data.message,
        //     confirmColor: '#ffaf0e',
        //     showCancel: false
        //   })
        //   return
        // }
        // if (res.statusCode != 200) {
        //   console.log(res, 'test---------------------')
        //   wx.showModal({
        //     title: '提示',
        //     content: res.errMsg,
        //     confirmColor: '#ffaf0e',
        //     showCancel: false
        //   })
        //   return
        // }
        if (res.data.status == 0) {
          resolve(res)
        } else {

          wx.showModal({
            title: '提示',
            content: res.data.message,
            confirmColor: '#ffaf0e',
            showCancel: false
          })
        }
      },
      fail: () => {
        wx.showModal({
          title: '错误提示',
          content: '网络出错，请稍候'
        })
      }
    })
  })
}
const post = (path, params) => {
  const newParams = { ...params }


  wx.showToast({
    title: '正在加载...',
    icon: 'loading'
  })


  return new Promise((resolve) => {
    wx.request({
      url: `${base}/${path}`, // 仅为示例，并非真实的接口地址
      data: newParams,
      method: 'POST',
      header: {

        // 'Authorization': 'Bearer YXBwdXNlcjphcHB1c2VydGVzdA==',
        // 'Content-Type': 'application/json;charset=UTF-8'
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        wx.hideToast()
        if (res.statusCode == 401) {
          login()
          return

        }
        if (res.statusCode != 200) {
          console.log(res, 'test---------------------')
          wx.showModal({
            title: '提示',
            content: res.errMsg,
            confirmColor: '#ffaf0e',
            showCancel: false
          })
        }
        if (res.data.status == 0) {
          // store.set('token', res.data.data.token)
          resolve(res.data.data)
        } else {
          wx.showModal({
            title: '小提示',
            content: res.data.message,
            confirmColor: '#ffaf0e',
            showCancel: false
          })
        }
      },
      fail: () => {
        wx.hideToast()
        wx.showModal({
          title: '错误提示',
          content: '网络出错，请稍候'
        })
      }
    })
  })
}

const http = {
  post,
  postHasToken,
  get,
  put,
  service
}

export default http
