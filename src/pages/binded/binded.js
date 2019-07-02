import { inputWorkbench } from '../../utils/scene';
import * as store from '../../utils/store.js';
import { helper } from '../helper';

Page({
  data: {
    user: {}
  },
  // ***********生命周期函数
  onLoad: function(options) {
    let user = store.get('currentCustomer');
    this.setData({
      user: user
    });
  },
  onShow: function() {
    if (!inputWorkbench()) {
      helper
        .checkBindingStatus()
        .then(hasBind => {
          if (hasBind) {
            this.setData({
              user: store.get('currentCustomer')
            });
          } else {
            wx.redirectTo({
              url: '/pages/input-cdb/input-cdb'
            });
          }
        })
        .catch(err => {
          // TODO 错误提示
          this.setData({
            modelShow: true,
            errText: err
          });
        });
    }
  },
  /**
   * @description 会话
   */
  close() {
    // TODO 需要判断入口或页面深度
    wx.navigateBack({
      delta: 1
    });
  }
});
