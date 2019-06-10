// index.js
// import * as store from '../../utils/store.js';
// 获取应用实例
import * as store from '../../utils/store.js'
import { getExternals } from '../../utils/api.js'
const app = getApp()

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    modalName: '',

    userInfo: {},
    users: [{ "externalUserId": "wmdb3IDgAA-Vztf7iXpOlBZ2qoCaejOA", "bind": true, "cdbId": "1234", "bindingDate": "2019-05-23 11:34:51", "name": "test.external", "avatar": "http://p.qlogo.cn/bizmail/IcsdgagqefergqerhewSdage/0" }, { "externalUserId": "wmdb3IDgAA-adfadfdpOldafDaFaejAD", "bind": false, "name": "test.external", "avatar": "http://p.qlogo.cn/bizmail/Adfad3efergqerhewSdage/0" }],
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  // 事件处理函数

  getExternals(userIds) {
    console.log(userIds, '======ren')
    getExternals({ 'externalUserIds': userIds }).then(res => {
      this.setData({
        users: res.data.data

      })

    })
  },
  selectExternal() {
    let self = this
    wx.qy.selectExternalContact({
      filterType: 0, // 0表示展示全部外部联系人列表，1表示仅展示未曾选择过的外部联系人。默认值为0；除了0与1，其他值非法。
      success: function (res) {
        var userIds = res.userIds// 返回此次选择的外部联系人userId列表，数组类型

        self.getExternals(userIds)
      }
    })
  },
  onLoad: function () {
    console.log(this.data.users, '======')
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

      }
    })

  },
  onShow: function () {
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

      }
    })



  },
  showModal(e) {
    console.log('test---------')
    this.setData({
      modalName: 'Modal'
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  toDetail(e) {
    let user = e.currentTarget.dataset.item
    console.log(e.currentTarget.dataset.item, '================')
    if (user.bind == true) {
      this.showModal()
      return
    }
    store.set('currentCustomer', user)
    wx.navigateTo({
      url: '/pages/detail/detail'
    })
  },
  onShareAppMessage: function () {

  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
