import { inputWorkbench } from '../utils/scene';
import { getExternals } from '../utils/api';
import * as store from '../utils/store';

/**
 * 当前外部联系人的 binding 状态
 * @return Promise
 *    resolve: true， 外部联系人已绑定
 *    resolve: false，外部联系人未绑定
 *    reject： error，外部联系人获取错误；非 万能+或用户资料进入
 *
 * 当前获取的外部用户信息会放入 store.set('currentCustomer', user)
 *
 * 1. 由于企业微信小程序会缓存最后一次退出页面，
 * 在第二次打开的时候，可能会在任何页面
 * 2. 由于不同入口进入需要显示或跳转的页面逻辑不同，
 * 需要在 onShow 方法里面检查当前外部联系人的 binding 状态，跳转到正确页面
 */
function checkBindingStatus() {
  return new Promise((resolve, reject) => {
    // 获取外部联系人信息和 bind 状态
    let returnBindingStatus = userId => {
      getExternals({ externalUserIds: [userId] })
        .then(res => {
          let user = res.data.data[0];
          store.set('currentCustomer', user);
          resolve(user.bind);
        })
        .catch(err => {
          reject(err);
        });
    };

    const app = getApp();
    if (!inputWorkbench()) {
      wx.qy.getCurExternalContact({
        success: function (res) {
          let userId = res.userId; // 返回当前外部联系人userId
          if (userId) {
            app.globalData.externalId = userId;
            returnBindingStatus(userId);
          }
        },
        fail: function () {
          wx.qy.getCurExternalContact({
            success: function (res) {
              let userId = res.userId; // 返回当前外部联系人userId
              if (userId) {
                app.globalData.externalId = userId;
                returnBindingStatus(userId);
              }
            }
          });
        }
      });
    } else {
      reject('万能+或用户资料进入，不支持检查操作');
    }
  });
}

export const helper = { checkBindingStatus };
