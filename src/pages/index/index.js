//index.js
// import * as store from '../../utils/store.js';
//获取应用实例
import * as store from '../../utils/store.js';
import { getExternals } from '../../utils/api.js';
const app = getApp()

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    modalName:'',

    userInfo: {},
    users: [],
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  
  getExternals(userIds) {
    console.log(userIds,'======ren')
    getExternals({ "externalUserIds": userIds }).then(res => {
      this.setData({
        users:res.data.data
        
      })
      store.set('myuers', res.data.data)
      console.log(res, 'select----------------')
    })
  },
  selectExternal() {
    let self = this
    wx.qy.selectExternalContact({
      filterType: 0,//0表示展示全部外部联系人列表，1表示仅展示未曾选择过的外部联系人。默认值为0；除了0与1，其他值非法。
      success: function (res) {
        var userIds = res.userIds;// 返回此次选择的外部联系人userId列表，数组类型
       
        self.getExternals(userIds)
      }
    });
  },
  onShow: function () {
    console.log(this.data.users, '======')
  },
  onLoad: function () {
    if(store.get('myusers')){
      this.setData({
        users: store.get('myusers')
      })
      console.log(this.data.users,'======')
    }

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
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
    console.log(e.currentTarget.dataset.item,'================')
    if(user.bind == true){
      this.showModal()
      return
    }
    store.set('currentCustomer',user)
    wx.navigateTo({
      url: "/pages/detail/detail"
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
