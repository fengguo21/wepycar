// pages/detail/detail.js
import * as store from '../../utils/store.js'
import { getCdb, bindCustomer } from '../../utils/api.js'
Page({

  /**
   * Page initial data
   */
  data: {
    users: [],

    isChecked: false,
    user: '',
    cdbNumber: '',
    cdbInfo: '',
    loadModal: false,
    modalName: ''

  },
  getCdb() {

    getCdb({ cdbNumber: this.data.cdbNumber, externalUserId: this.data.user.externalUserId }).then(res => {

      if (res) {
        console.log(res, '==========')
        let cdbInfo = res.data.data
        if (cdbInfo.country == '') {
          cdbInfo.country = 'CN'
        }
        this.setData({
          cdbInfo: cdbInfo,
          cdbNumber: '',
          isChecked: true

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
      if (res.data.status == 0) {
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

          var userId = res.userId //返回当前外部联系人userId
          if (userId) {
            userIds.push(userId)
            self.getExternals(userIds)

          }

        },
        fail: function () {

          wx.qy.getCurExternalContact({
            success: function (res) {
              var userId = res.userId //返回当前外部联系人userId
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
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */


  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {
    console.log('hide')
    wx.redirectTo({
      url: "/pages/index/index",
    })
  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})
