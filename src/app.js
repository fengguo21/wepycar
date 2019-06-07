//app.js
import { wxLogin, checkToken, refreshToken} from '/utils/api.js';
import * as store from 'utils/store.js';
App({
  onLaunch: function() {
    wx.qy.checkSession({
      success: function () {
        console.log('success')
        checkToken().then(res=>{
          if(res.data.code ==0&res.data.data == false){
            refreshToken().then(res=>{
              console.log(res,'refresh')
            })
          }
          console.log(res,'===========')
        })
        //session_key 未过期，并且在本生命周期一直有效
      },
      fail: function () {
        console.log('fail----')
        // session_key 已经失效，需要重新执行登录流程
        wx.qy.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            console.log({
              code: res.code,
              brand: "CAR",
              agentId: "1000007",
              type: "binding"

            }, '===============')
            wxLogin({
              code: res.code,
              brand: "CAR",
              agentId: "1000007",
              type: "binding"

            }).then(res => {
              store.set('token', res.token)

            })
          }
        })
    
  }
})

    
   
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        console.log(e,'-----------------')
       
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        console.log(custom,'=============')
        this.globalData.Custom = custom;
        if (e.environment == "wxwork") {
          this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight+45;
        }else{
          this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
        }
      
      }
    })
  },
  login(){
    // 登录
    wx.qy.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log({
          code: res.code,
          brand: "CAR",
          agentId: "1000007",
          type: "binding"

        }, '===============')
        wxLogin({
          code: res.code,
          brand: "CAR",
          agentId: "1000007",
          type: "binding"

        }).then(res => {
          // store.set(token,res.code)
          console.log(res, '====================')
        })
      }
    })
  },
  globalData: {
    userInfo: null
  }
})