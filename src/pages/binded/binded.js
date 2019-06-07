// pages/binded/binded.js
import * as store from '../../utils/store.js';
import { wxLogin } from '../../utils/api.js';
Page({

  /**
   * Page initial data
   */
  data: {
    customer:'',
    saName:'',
    greeting:''
  },
  sendGreeting(){
    let self = this
    wx.setClipboardData({
      data: this.data.greeting,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
          }
        })
        wx.qy.openEnterpriseChat({
       
          externalUserIds: self.data.customer.externalUserId, // 参与会话的外部联系人列表，格式为userId1;userId2;…，用分号隔开。
          groupName: '',  // 必填，会话名称。单聊时该参数传入空字符串""即可。
          success: function (res) {
            // 回调
          },
          fail: function (res) {
            // 失败处理
          }
        });
      }
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let customer = store.get('currentCustomer')
    let saName = options.saName

    console.log(customer,'ppppp')
    this.setData({
      customer: customer,
      saName: saName,
      greeting: '您好！我是' + saName + '，很高兴为您服务。如果您希望了解更多作品的保养建议，或有其他任何问题，作为您的专属销售顾问，我都可以直接在这里为您解答，随时欢迎您的咨询。'

    });
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

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