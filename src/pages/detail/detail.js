// pages/detail/detail.js
import * as store from '../../utils/store.js'
import { getCdb, bindCustomer } from '../../utils/api.js'
Page({

  /**
   * Page initial data
   */
  data: {
    users: [],
    modelShow: false,
    isChecked: false,
    user: '',
    cdbNumber: '',
    cdbInfo: '',
    errinfo: '',


  },
  getCdb() {
    getCdb({ cdbNumber: this.data.cdbNumber, externalUserId: this.data.user.externalUserId }).then(res => {
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
          errinfo: err

        })
      }

    })
  },
  bindCustomer(params) {
    console.log(params, 'params--')
    bindCustomer(params).then(res => {
      this.setData({

        loadModal: false
      })
      if (res.data.status === 0) {
        let saName = ''
        let boutique = ''
        if (res.data.data.saName) {
          saName = res.data.data.saName
        }
        if (res.data.data.boutique) {
          boutique = res.data.data.boutique
        }

        wx.reLaunch({
          url: '/pages/binded/binded?saName=' + saName + '&boutique=' + boutique
        })
      }
    }).catch(err => {
      if (err) {
        this.setData({
          modelShow: true,
          errinfo: err

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

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    if (options.from = 'index') {
      let user = store.get('currentCustomer')
      this.setData({
        user: user
      })
    } else {
      let self = this

      let userIds = []
      wx.qy.getCurExternalContact({
        success: function (res) {
          var userId = res.userId // 返回当前外部联系人userId
          if (userId) {
            userIds.push(userId)
            self.getExternals(userIds)
          }
        },
        fail: function () {
          wx.qy.getCurExternalContact({
            success: function (res) {
              var userId = res.userId // 返回当前外部联系人userId
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


  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {
    console.log('hide')
    wx.redirectTo({
      url: '/pages/index/index'
    })
  },



  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})
