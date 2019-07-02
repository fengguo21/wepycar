import { loading } from '../../utils/loading';
import { inputWorkbench } from '../../utils/scene';
import * as store from '../../utils/store.js';
import { getCdb } from '../../utils/api.js';
import { helper } from '../helper';

Page({
  data: {
    users: [],
    modelShow: false,
    user: '',
    cdbNumber: '',
    cdbInfo: '',
    errText: '',
    busy: false
  },
  // ***********生命周期函数
  onShow: function(options) {
    this.setData({
      cdbNumber: ''
    });
    loading.clean();
    if (!inputWorkbench()) {
      helper
        .checkBindingStatus()
        .then(hasBind => {
          if (hasBind) {
            wx.redirectTo({
              url: '/pages/binded/binded'
            });
          } else {
            this.setData({
              user: store.get('currentCustomer')
            });
          }
        })
        .catch(err => {
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
  onLoad: function(options) {
    let user = store.get('currentCustomer');
    this.setData({
      user: user
    });
  },
  check: function(e) {
    if (this.busy) {
      return;
    }
    if (this.data.cdbNumber) {
      this.busy = true;
      getCdb({
        cdbNumber: this.data.cdbNumber,
        externalUserId: this.data.user.externalUserId
      })
        .then(res => {
          this.busy = false;
          if (res) {
            let cdbInfo = res.data.data;
            if (cdbInfo.country === '') {
              cdbInfo.country = 'CN';
            }
            store.set('cdbInfo', cdbInfo);
            wx.navigateTo({
              url: '/pages/show-profile/show-profile?showProfile=true'
            });
          }
        })
        .catch(err => {
          this.busy = false;
          if (err) {
            this.setData({
              modelShow: true,
              errText: err
            });
          }
        });
    }
  },
  gotoSuccess(user) {
    let saName = '';
    let boutique = '';
    if (user.saName) {
      saName = user.saName;
    }
    if (user.boutique) {
      boutique = user.boutique;
    }
    wx.redirectTo({
      url: '/pages/success/success?saName=' + saName + '&boutique=' + boutique
    });
  },
  inputCdb(e) {
    this.setData({
      cdbNumber: e.detail.value
    });
  }
});
