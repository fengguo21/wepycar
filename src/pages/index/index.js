// index.js
// import * as store from '../../utils/store.js';
// 获取应用实例
import * as store from '../../utils/store.js'
import { getExternals } from '../../utils/api.js'
const app = getApp()

Page({
  data: {

    chatUserId: '',
    selecting: false,
    modelShow: false,
    errinfo: '',
    userInfo: {},
    users: [],

  },
  // 事件处理函数

  getExternals(userIds, tag) {

    getExternals({ 'externalUserIds': userIds }).then(res => {
      this.setData({
        users: res.data.data

      })
      if (tag == 1) {

        let user = res.data.data[0]

        if (user.bind == false) {
          store.set('currentCustomer', res.data.data[0])
          wx.navigateTo({
            url: '/pages/detail/detail?from=index'
          })
        } else if (user.bind == true) {
          wx.showModal({
            title: '提示',
            content: '顾客已完成绑定,跳转到顾客详情页？',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.navigateToMiniProgram({
                  appId: 'wx1ea318c84338cee5',
                  path: 'pages/client/customerInfo/customerInfo?id=' + user.externalUserId,

                  success(res) {
                    // 打开成功
                  }
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })

        }
      } else {

      }


    }).catch(err => {

      this.setData({
        modelShow: true,
        errinfo: err
      })

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

          self.getExternals(userIds)
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
  onLoad: function () {




  },
  onShow: function (options) {

    let self = this

    let userIds = []
    wx.qy.getCurExternalContact({
      success: function (res) {

        var userId = res.userId //返回当前外部联系人userId


        if (userId) {
          console.log(userId, 'yyyyy    userid')

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
              self.setData({
                chatUserId: userId
              })
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
  onShareAppMessage: function () {

  },

  getUserInfo: function (e) {

    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
