import * as store from '../../utils/store.js'
import { getCdb, bindCustomer } from '../../utils/api.js'
import { errInfo } from '../../utils/config.js'
Page({
  data: {
    users: [],
    modelShow: false,
    isChecked: false,
    user: '',
    cdbNumber: '',
    cdbInfo: '',
    errText: ''
  },
  // ***********生命周期函数
  onLoad: function (options) {
    if (options.from === 'index') {
      let user = store.get('currentCustomer')
      this.setData({
        user: user
      })
    } else {
      let self = this
      let userIds = []
      wx.qy.getCurExternalContact({
        success: function (res) {
          let userId = res.userId // 返回当前外部联系人userId
          if (userId) {
            userIds.push(userId)
            self.getExternals(userIds)
          }
        },
        fail: function () {
          wx.qy.getCurExternalContact({
            success: function (res) {
              let userId = res.userId // 返回当前外部联系人userId
              if (userId) {
                userIds.push(userId)
                self.getExternals(userIds)
              }
            }
          })
        }
      })
    }
  },
  getCdb() {
    getCdb({
      cdbNumber: this.data.cdbNumber,
      externalUserId: this.data.user.externalUserId
    }).then(res => {
      if (res) {
        let cdbInfo = res.data.data
        if (cdbInfo.country === '') {
          cdbInfo.country = 'CN'
        }
        this.setData({
          cdbInfo: cdbInfo,
          cdbNumber: '',
          isChecked: true
        })
      }
    }).catch(err => {
      if (err) {
        this.setData({
          modelShow: true,
          errText: err
        })
      }
    })
  },
  bindCustomer(params) {
    bindCustomer(params).then(res => {
      let selectedUsers = store.get('selectedUsers')
      for (let i = 0; i < selectedUsers.length; i++) {
        if (selectedUsers[i].externalUserId == this.data.user.externalUserId) {
          selectedUsers[i].bind = true
        }
      }
      store.set('selectedUsers', selectedUsers)
      if (res.data.status === 0) {
        let saName = ''
        let boutique = ''
        if (res.data.data.saName) {
          saName = res.data.data.saName
        }
        if (res.data.data.boutique) {
          boutique = res.data.data.boutique
        }
        wx.redirectTo({
          url: '/pages/binded/binded?saName=' + saName + '&boutique=' + boutique
        })
      }
    }).catch(err => {
      if (err) {
        this.setData({
          modelShow: true,
          errText: err
        })
      }
    })
  },
  check: function (e) {
    if (this.data.cdbNumber) {
      this.getCdb()
    }
  },
  confirm() {
    this.bindCustomer({
      externalUserId: this.data.user.externalUserId,
      cdbUserDto: this.data.cdbInfo
    })
  },
  recheck() {
    this.setData({
      cdbInfo: '',
      isChecked: false
    })
  },
  inputCdb(e) {
    this.setData({
      cdbNumber: e.detail.value
    })
  },
})
