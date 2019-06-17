// index.js
// import * as store from '../../utils/store.js';
// 获取应用实例
import * as store from '../../utils/store.js'
import { getExternals } from '../../utils/api.js'
Page({
  data: {
    selecting: false,
    modelShow: false,
    errinfo: '',
    user: {},
    users: [],
    shwoDetail: false,
    flag: '',
    curUserId: ''
  },
  // 事件处理函数

  getExternals(userIds, tag) {
    getExternals({ 'externalUserIds': userIds }).then(res => {

      if (tag == 1) {
        let user = res.data.data[0]
        if (user.bind == false) {
          store.set('currentCustomer', res.data.data[0])
          wx.navigateTo({
            url: '/pages/detail/detail?from=index'
          })
        } else if (user.bind == true) {
          this.setData({
            shwoDetail: true,
            user: user
          })
        }
      } else {
        this.setData({
          users: res.data.data,
          flag: 2

        })
      }
    }).catch(err => {

      this.setData({
        modelShow: true,
        errinfo: err
      })
    })
  },
  toWarm() {
    wx.navigateToMiniProgram({
      appId: 'wx1ea318c84338cee5',
      path: 'pages/client/customerInfo/customerInfo?id=' + this.data.user.externalUserId,
      success(res) {
        // 打开成功
      }
    })
  },
  cancelToWarm() {
    this.setData({
      shwoDetail: false
    })
  },
  selectExternal() {
    let self = this
    if (this.data.selecting == false) {
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
  onShow: function (options) {
    let self = this
    let userIds = []
    wx.qy.getCurExternalContact({
      success: function (res) {
        var userId = res.userId //返回当前外部联系人userId
        if (userId) {
          if (userId == self.data.curUserId && self.data.flag == 2) {
            return
          }
          self.setData({
            curUserId: userId
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

  },
  toDetail(e) {
    let user = e.currentTarget.dataset.item
    if (user.bind == true) {
      return
    }
    store.set('currentCustomer', user)
    wx.navigateTo({
      url: '/pages/detail/detail?from=index'
    })
  },

})
