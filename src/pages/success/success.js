import * as store from '../../utils/store.js';
import { inputWorkbench } from '../../utils/scene';
import { helper } from '../helper';

Page({
  data: {
    customer: '',
    saName: '',
    greeting: '',
    inputOnLoad: false,
    isWorkBench: false
  },
  // ***********生命周期函数
  onShow: function() {
    let self = this;
    self.setData({
      isWorkBench: inputWorkbench()
    });

    if (!this.data.inputOnLoad) {
      if (this.data.isWorkBench) {
        // 工作台第二次进入时，直接到首页
        const deep = getCurrentPages().length;
        if (deep > 1) {
          wx.navigateBack({
            delta: deep - 1
          });
        } else {
          wx.redirectTo({
            url: '/pages/index/index'
          });
        }

        return;
      }
      helper
        .checkBindingStatus()
        .then(hasBind => {
          if (hasBind) {
            // 返回到 input-cdb 页面，判断已绑定走到已绑定页面，这样已绑定页面不会有返回按钮
            const deep = getCurrentPages().length;
            if (deep > 1) {
              wx.navigateBack({
                delta: deep - 1
              });
            }
          } else {
            const deep = getCurrentPages().length;
            if (deep > 1) {
              wx.navigateBack({
                delta: deep - 1
              });
            }
          }
        })
        .catch(err => {
          if (err) {
            // TODO 错误提示
            self.setData({
              modelShow: true,
              errText: err
            });
          }
        });
    }
    self.setData({
      inputOnLoad: false
    });
  },
  onLoad: function(options) {
    let self = this;
    let customer = store.get('currentCustomer');
    let boutique = options.boutique;
    self.setData({
      inputOnLoad: true
    });

    // 获取 当前 SA 的名字
    wx.qy.getEnterpriseUserInfo({
      success: function(res) {
        let name = res.userInfo.name;
        self.setData({
          customer: customer,
          saName: name,
          boutique: boutique,
          greeting:
            '您好！我是' +
            boutique +
            name +
            '，很高兴为您服务。如果您希望了解更多作品的保养建议，或有其他任何问题，作为您的专属销售顾问，我都可以直接在这里为您解答，随时欢迎您的咨询。'
        });
      }
    });
  },
  // ***********自定义方法
  /**
   * @description 会话
   */
  sendGreeting() {
    let self = this;
    wx.setClipboardData({
      data: this.data.greeting,
      success(res) {
        wx.getClipboardData({
          success(res) {}
        });
        wx.qy.openEnterpriseChat({
          // 参与会话的外部联系人列表，格式为userId1;userId2;…，用分号隔开。
          externalUserIds: self.data.customer.externalUserId,
          // 必填，会话名称。单聊时该参数传入空字符串""即可。
          groupName: ''
        });
      }
    });
  },
  toHome() {
    wx.reLaunch({
      url: '/pages/index/index'
    });
  }
});
