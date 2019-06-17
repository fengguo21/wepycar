// app.js
import { wxLogin, checkToken, refreshToken } from './utils/api.js'
import * as store from './utils/store.js'
import brand from config.js
import agentId from config.js
import type from config.js
App({
  onLaunch: function () {
    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {


        this.globalData.StatusBar = e.statusBarHeight
        let custom = wx.getMenuButtonBoundingClientRect()

        this.globalData.Custom = custom
        if (e.environment === 'wxwork') {
          this.globalData.env = e.environment

        }
      }
    })
    if (this.globalData.env == 'wxwork') {
      wx.qy.checkSession({
        success: function () {
          console.log('success')
          checkToken().then(res => {
            if (res.data.status == 0 & res.data.data == false) {
              refreshToken().then(res => {
                console.log(res, 'refresh')
              })
            }

          })
          // session_key 未过期，并且在本生命周期一直有效
        },
        fail: function () {

          // session_key 已经失效，需要重新执行登录流程
          wx.qy.login({
            success: res => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              wxLogin({
                code: res.code,
                brand: brand,
                agentId: agentId,
                type: type

              }).then(res => {
                store.set('token', res.token)
              })
            }
          })
        }
      })
    }
  },

  globalData: {
    userInfo: null
  }
})
