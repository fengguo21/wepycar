import * as store from '../../utils/store.js'
import { getExternals } from '../../utils/api.js'
const app = getApp()
Page({
  data: {
    selecting: false,
    modelShow: false,
    errText: '',
    user: {},
    users: [],
    shwoDetail: false,
    curUserId: ''
  },

  onShow: function (options) {
    if (app.globalData.scene === 1120 | app.globalData.scene === 1121) {
      console.log('secne index')
      let self = this
      let userIds = []
      wx.qy.getCurExternalContact({
        success: function (res) {
          var userId = res.userId //返回当前外部联系人userId
          if (userId) {
            self.setData({
              curUserId: userId,
            })
            userIds.push(userId)
            self.getExternals(userIds, 1)
          }
        },
        fail: function () {
          wx.qy.getCurExternalContact({
            success: function (res) {
              var userId = res.userId //返回当前外部联系人userId
              console.log(userId, 'second    userid')
              if (userId) {
                userIds.push(userId)
                self.getExternals(userIds, 1)
              }
            }
          })
        }
      })
    }
  },
  // 事件处理函数
  // ***********自定义方法
  // 事件处理函数
  /**
   * @function getExternals
   * @param {*} userIds
   * @param {*} tag
   * @description 获取外部联系人
   */
  getExternals(userIds, tag) {
    getExternals({ 'externalUserIds': userIds }).then(res => {
      if (tag === 1) {
        let user = res.data.data[0]
        if (!user.bind) {
          store.set('currentCustomer', res.data.data[0])
          app.globalData.scene = ''
          this.setData({
            shwoDetail: false,
            users: res.data.data,
            user: user
          })
          wx.navigateTo({
            url: '/pages/detail/detail?from=index'
          })
        } else if (user.bind === true) {
          this.setData({
            shwoDetail: true,
            users: res.data.data,
            user: user
          })
        }
      } else {
        this.setData({
          users: res.data.data,
        })
        app.globalData.scene = ''
      }
    }).catch(err => {
      this.setData({
        modelShow: true,
        errText: err
      })
    })
  },
  //跳转到warm
  toWarm() {
    wx.navigateToMiniProgram({
      appId: 'wx1ea318c84338cee5',
      path: 'pages/client/customerInfo/customerInfo?id=' + this.data.user.externalUserId,
      success(res) {
      }
    })
  },
  cancelToWarm() {
    app.globalData.scene = ''
    this.setData({
      shwoDetail: false,
    })
  },
  selectExternal() {
    let self = this
    if (!this.data.selecting) {
      self.setData({
        selecting: true
      })
      wx.qy.selectExternalContact({
        filterType: 0, // 0表示展示全部外部联系人列表，1表示仅展示未曾选择过的外部联系人。默认值为0；除了0与1，其他值非法。
        success: function (res) {
          var userIds = res.userIds// 返回此次选择的外部联系人userId列表，数组类型
          self.getExternals(userIds, 0)
        },
        fail: function (err) {
        },
        complete: function () {
          self.setData({
            selecting: false
          })
        }
      })
    }
  },
  toDetail(e) {
    let user = e.currentTarget.dataset.item
    if (user.bind === true) {
      return
    }
    store.set('currentCustomer', user)
    wx.navigateTo({
      url: '/pages/detail/detail?from=index'
    })
  }
})
