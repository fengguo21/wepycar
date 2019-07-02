import { wxLogin, checkToken, refreshToken } from './utils/api.js';
import * as store from './utils/store.js';
import { brand, agentId, type } from './utils/config.js';

App({
  onLaunch: function() {
    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        if (e.environment === 'wxwork') {
          this.globalData.env = e.environment;
        }
      }
    });
  },
  onShow(options) {
    this.globalData.loadingCount = 0;
    wx.hideToast();
    console.log('app onShow', options);
    this.globalData.scene = options.scene;
    if (this.globalData.env === 'wxwork') {
      wx.qy.checkSession({
        success: function() {
          checkToken().then(res => {
            if (res.data.status === 0 && res.data.data === false) {
              refreshToken();
            }
          });
        },
        fail: function() {
          wx.qy.login({
            success: res => {
              wxLogin({
                code: res.code,
                brand: brand,
                agentId: agentId,
                type: type
              }).then(res => {
                store.set('token', res.token);
              });
            }
          });
        }
      });
    }
  },
  onHide() {
    // 关闭小程序，重定向至首页
    this.globalData.scene = '';
    this.globalData.loadingCount = 0;
  },
  globalData: {
    loadingCount: 0
  }
});
