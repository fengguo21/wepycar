import * as store from '../../utils/store.js';
Page({
  data: {
    customer: '',
    saName: '',
    greeting: ''
  },
  // ***********生命周期函数
  onLoad: function (options) {
    let self = this
    let customer = store.get('currentCustomer')
    let boutique = options.boutique
    wx.qy.getEnterpriseUserInfo({
      success: function (res) {
        let name = res.userInfo.name
        self.setData({
          customer: customer,
          saName: name,
          boutique: boutique,
          greeting: '您好！我是' + boutique + name + '，很高兴为您服务。如果您希望了解更多作品的保养建议，或有其他任何问题，作为您的专属销售顾问，我都可以直接在这里为您解答，随时欢迎您的咨询。'
        });
      }
    })
  },
  // ***********自定义方法
  /**
   * @description 会话
   */
  sendGreeting() {
    let self = this
    wx.setClipboardData({
      data: this.data.greeting,
      success(res) {
        wx.getClipboardData({
          success(res) {
          }
        })
        wx.qy.openEnterpriseChat({
          // 参与会话的外部联系人列表，格式为userId1;userId2;…，用分号隔开。
          externalUserIds: self.data.customer.externalUserId,
          // 必填，会话名称。单聊时该参数传入空字符串""即可。
          groupName: '',
        });
      }
    })
  }
})