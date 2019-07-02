import * as store from '../../utils/store.js';
import { getExternals } from '../../utils/api.js';
import { inputWorkbench } from '../../utils/scene';
import { helper } from '../helper';

Page({
  data: {
    selecting: false,
    modelShow: false,
    errText: '',
    user: {},
    users: [],
    showDetail: false,
    curUserId: ''
  },

  onShow: function(options) {
    console.log('index onshow-------')
    if (inputWorkbench()) {
      this.setData({
        users: store.get('selectedUsers')
      });
    } else {
      console.log('名片---- index')
      helper
        .checkBindingStatus()
        .then(hasBind => {
          console.log('check first----',hasBind)
          if (hasBind) {
            wx.redirectTo({
              url: '/pages/binded/binded?from=index'
            });
          } else {
            wx.redirectTo({
              url: '/pages/input-cdb/input-cdb?from=index'
            });
          }
        })
        .catch(err => {
          console.log('err', err);
          if (err) {
            // TODO 错误提示
            this.setData({
              modelShow: true,
              errText: err
            });
          }
        });
    }
  },
  // 事件处理函数
  // ***********自定义方法
  // 事件处理函数
  /**
   * 获取选择的外部联系人列表信息
   * @param userIds
   */
  showExternalList(userIds) {
    getExternals({ externalUserIds: userIds })
      .then(res => {
        store.set('selectedUsers', res.data.data);
        this.setData({
          users: res.data.data
        });
        // app.globalData.scene = '';
      })
      .catch(err => {
        this.setData({
          modelShow: true,
          errText: err
        });
      });
  },

  cancelToWarm() {
    this.setData({
      showDetail: false
    });
  },
  selectExternal() {
    let self = this;
    if (!this.data.selecting) {
      self.setData({
        selecting: true
      });
      wx.qy.selectExternalContact({
        filterType: 0, // 0表示展示全部外部联系人列表，1表示仅展示未曾选择过的外部联系人。默认值为0；除了0与1，其他值非法。
        success: function(res) {
          let userIds = res.userIds; // 返回此次选择的外部联系人userId列表，数组类型
          self.showExternalList(userIds);
        },
        complete: function() {
          self.setData({
            selecting: false
          });
        }
      });
    }
  },
  toDetail(e) {
    let user = e.currentTarget.dataset.item;
    if (user.bind === true) {
      return;
    }
    store.set('currentCustomer', user);
    wx.navigateTo({
      url: '/pages/input-cdb/input-cdb?from=index'
    });
  }
});
