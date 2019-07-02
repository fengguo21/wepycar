import * as store                              from './store.js';
import { errInfo, base, brand, agentId, type } from './config.js';
import { wxLogin }                             from './api.js';
import { loading }                             from './loading';
import { helper } from '../pages/helper'
import { inputWorkbench } from './scene';


const login = function() {
  return new Promise((resolve, reject) => {
    wx.qy.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wxLogin({
          code: res.code,
          brand: brand,
          agentId: agentId,
          type: type
        })
          .then(res => {
            store.set('token', res.data.data.token);
            resolve();
          })
          .catch(err => {
            reject(err);
          });
      }
    });
  });
};

const reCheckBindStatus = () => {
  helper
    .checkBindingStatus()
    .then(hasBind => {
      if (hasBind) {
        wx.redirectTo({
          url: '/pages/binded/binded?from=index'
        });
      } else {
        wx.redirectTo({
          url: '/pages/input-cdb/input-cdb?from=index'
        });
      }
    })
    .catch(err => {
      console.log('err', err);
      if (err) {
        // TODO 错误提示

      }
    });

}

const http = (path, params, method, head) => {
  const newParams = { ...params };

  return new Promise((resolve, reject) => {
    // 请求成功处理
    let ok = function(res) {
      loading.hide();
      if (
        res.statusCode === 400 ||
        res.statusCode === 403 ||
        res.statusCode === 404 ||
        res.statusCode === 502 ||
        res.statusCode === 999
      ) {
        let errcode = res.statusCode;
        reject(errInfo[errcode]);
      }
      if (res.data.status === 0) {
        resolve(res);
      } else {
        let errcode = res.data.status;
        if (errInfo[errcode]) {
          reject(errInfo[errcode]);
        } else {
          let errinfo = `错误代码${res.data.status},请与管理员联系`;
          reject(errinfo);
        }
      }
    };

    loading.show({
      title: '正在加载...',
      duration: 15000,
      mask: true,
      icon: 'loading'
    });
    // 如果没有登录，尝试一次登录操作
    wx.request({
      url: `${base}/${path}`, // 仅为示例，并非真实的接口地址
      data: newParams,
      method: method,
      header: head,
      success: res => {
        if (res.statusCode !== 401) {
          ok(res);
          return;
        }

        // 尝试一次隐式登录
        login()
        console.log('relog begin------')

          .then(() => {
            console.log('relog------')
            if(!inputWorkbench()){
              console.log('名片页进入------')

              reCheckBindStatus()
              return

            }
            wx.request({
              url: `${base}/${path}`, // 仅为示例，并非真实的接口地址
              data: newParams,
              method: method,
              header: head,
              success: res => {
                if (res.statusCode !== 401) {
                  ok(res);
                  return;
                }
                loading.hide();
                console.error('登录失败', res.data);
                reject(res.data);
              },
              fail: error => {
                loading.hide();
                let errinfo = '网络错误，请检查';
                reject(errinfo);
              }
            });
          })
          .catch(err => {
            loading.hide();
            console.error('登录失败', err);
            reject(err);
          });
      },
      fail: error => {
        loading.hide();
        let errinfo = '网络错误，请检查';
        reject(errinfo);
      }
    });
  });
};
export default http;
