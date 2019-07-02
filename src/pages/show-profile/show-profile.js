import { loading } from '../../utils/loading';
import { inputWorkbench } from '../../utils/scene';
import * as store from '../../utils/store.js';
import { getCdb, bindCustomer, getExternals } from '../../utils/api.js';
import { helper } from '../helper';

Page({
  data: {
    modelShow: false,
    user: {},
    cdbInfo: '',
    errText: '',
    busy: false,
    showProfile: false
  },
  // ***********生命周期函数

  onShow: function() {
    loading.clean();
    if (this.data.showProfile !== true && !inputWorkbench()) {
      helper
        .checkBindingStatus()
        .then(hasBind => {
          if (hasBind) {
            // 返回到 input-cdb 页面，判断已绑定走到已绑定页面，这样已绑定页面不会有返回按钮
            const deep = getCurrentPages().length;
            if (deep > 1) {
              wx.navigateBack({
                delta: deep - 1
              });
            }
          } else {
            let currentCustomer = store.get('currentCustomer');
            console.log(currentCustomer, this.data.user);
            // 非当前人员
            if (
              currentCustomer.externalUserId !== this.data.user.externalUserId
            ) {
              const deep = getCurrentPages().length;
              if (deep > 1) {
                wx.navigateBack({
                  delta: deep - 1
                });
              }
            }
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
    this.setData({
      showProfile: false
    });
  },

  onLoad: function(options) {
    console.log('onload', options, Boolean(options.showProfile));

    let user = store.get('currentCustomer');
    let cdbInfo = store.get('cdbInfo');
    this.setData({
      showProfile: Boolean(options.showProfile),
      user: user,
      cdbInfo: cdbInfo
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
            this.setData({
              cdbInfo: cdbInfo,
              cdbNumber: '',
              isChecked: true
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
    wx.navigateTo({
      url: '/pages/success/success?saName=' + saName + '&boutique=' + boutique
    });
  },
  confirm() {
    bindCustomer({
      externalUserId: this.data.user.externalUserId,
      cdbUserDto: this.data.cdbInfo
    })
      .then(res => {
        if (res.data.status === 0) {
          console.log('inputWorkbench', inputWorkbench());
          if (!inputWorkbench()) {
            this.gotoSuccess(res.data.data);
          } else {
            getExternals({
              externalUserIds: [this.data.user.externalUserId]
            })
              .then(res => {
                let selectedUsers = store.get('selectedUsers');
                for (let i = 0; i < selectedUsers.length; i++) {
                  if (
                    selectedUsers[i].externalUserId ===
                    this.data.user.externalUserId
                  ) {
                    selectedUsers[i] = res.data.data[0];
                  }
                }
                store.set('selectedUsers', selectedUsers);
                this.gotoSuccess(res.data.data[0]);
              })
              .catch(err => {
                this.setData({
                  modelShow: true,
                  errText: err
                });
              });
          }
        } else {
          console.log('bind error', res.data.data);
        }
      })
      .catch(err => {
        if (err) {
          this.setData({
            modelShow: true,
            errText: err
          });
        }
      });
  },
  recheck() {
    wx.navigateBack({
      delta: 1
    });
  },
  inputCdb(e) {
    this.setData({
      cdbNumber: e.detail.value
    });
  }
});
