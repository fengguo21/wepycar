import { loading } from '../../utils/loading';
import { inputWorkbench } from '../../utils/scene';
import * as store from '../../utils/store.js';
import { getCdb, bindCustomer, getExternals } from '../../utils/api.js';
import { helper } from '../helper';

Page({
  data: {
    users: [],
    modelShow: false,
    isChecked: false,
    user: '',
    cdbNumber: '',
    cdbInfo: '',
    errText: '',
    busy: false
  },
  // ***********生命周期函数
  onShow: function (options) {
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
  onLoad: function (options) {
    let user = store.get('currentCustomer');
    this.setData({
      user: user
    });
  },
  check: function (e) {
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
    wx.redirectTo({
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
    this.setData({
      cdbInfo: '',
      isChecked: false
    });
  },
  inputCdb(e) {
    this.setData({
      cdbNumber: e.detail.value
    });
  }
});
