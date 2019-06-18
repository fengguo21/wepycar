import { wxLogin, checkToken, refreshToken } from './utils/api.js'
import * as store from './utils/store.js'
import { brand, agentId, type } from './utils/config.js'
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
    if (this.globalData.env === 'wxwork') {
      wx.qy.checkSession({
        success: function () {
          checkToken().then(res => {
            if (res.data.status === 0 & res.data.data === false) {
              refreshToken().then(res => {
              })
            }
          })
        },
        fail: function () {
          wx.qy.login({
            success: res => {
              wxLogin({
                code: res.code,
                brand: brand,
                agentId: agentId,
                type: type
              }).then(res => {
                store.set('token', res.token)
              }).catch(err => {
              })
            }
          })
        }
      })
    }
  },
  onShow(options) {
    this.globalData.scene = options.scene
  },
  globalData: {
  }
})
