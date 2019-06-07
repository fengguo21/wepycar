
import * as store from 'store.js';
const base = 'https://preprod.api.rwef.richemont.cn';
import { wxLogin, checkToken, refreshToken } from '/api.js';
const APP_ID = 'wx752c282e61fdd08a';
const login = function(){
 wx.qy.login({
            success: res => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              console.log({
                code: res.code,
                brand: "CAR",
                agentId: "1000007",
                type: "binding"

              }, '===============')
              wxLogin({
                code: res.code,
                brand: "CAR",
                agentId: "1000007",
                type: "binding"

              }).then(res => {
                store.set('token', res.token)

              })
            }
          })
}
const get = (path, params, showToast) => {
  const newParams = { ...params };
  const token = store.get('token')
  return new Promise((resolve) => {
    wx.request({
      url: `${base}/${path}`, //仅为示例，并非真实的接口地址
      data: newParams,
      method: 'GET',
      header: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json;',
        'brand': 'CAR',
      },
      success: (res) => {
        
        if (res.statusCode == 401) {
          login()
          return
        }
        if (res.statusCode == 500) {
          resolve(res);
          wx.showModal({
            title: '小提示',
            content: res.data.message,
            confirmColor: '#ffaf0e',
            showCancel: false,
          });
          return
        }
        

        resolve(res);
       
      },
      fail: (error) => {
        wx.showModal({
          title: '错误提示',
          content: '网络出错，请稍候'
        })
        
      },
    });
  });
};
const put = (path, params, showToast) => {
  const newParams = { ...params };
  const token = store.get('token')

  if (showToast) {
    wx.showToast({
      title: '正在加载...',
      icon: 'loading',
    });
  }

  return new Promise((resolve) => {
    wx.request({
      url: `${base}/${path}`, //仅为示例，并非真实的接口地址
      data: newParams,
      method: 'PUT',
      header: {
        'Authorization': 'Bearer ' + token,
        // 'Content-Type': 'application/json;',
        'brand': 'CAR',
      },
      success: (res) => {
        console.log(res, 'ya=============')
        if(res.statusCode==401){
         login()
         return
        }
        if (res.statusCode == 500) {
          resolve(res);
          wx.showModal({
            title: '小提示',
            content: res.data.message,
            confirmColor: '#ffaf0e',
            showCancel: false,
          });
          return
        }
        
        wx.hideToast();
        // if (res.data.status != 0) {

        resolve(res);
        
      },
      fail: (error) => {
        wx.showModal({
          title: '错误提示',
          content: '网络出错，请稍候'
        })
       
      },
    });
  });
};

const postHasToken = (path, params, showToast) => {
  const newParams = { ...params };
  const token = store.get('token')
  console.log(token, '---------------------')
  if (showToast) {
    wx.showToast({
      title: '正在加载...',
      icon: 'loading',
    });
  }

  return new Promise((resolve) => {
    wx.request({
      url: `${base}/${path}`, //仅为示例，并非真实的接口地址
      data: newParams,
      method: 'POST',
      header: {

        // 'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + token,
        'brand': 'CAR',
        'Content-Type': 'application/json;charset=UTF-8'
      },
      success: (res) => {
        console.log(res, '==========kun')
        if (res.statusCode == 401) {
          login()
          return
        }
        if (res.data.status == 0) {

          resolve(res);
        } else {
          resolve(res);
          wx.showModal({
            title: '小提示',
            content: res.data.message,
            confirmColor: '#ffaf0e',
            showCancel: false,
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络出错',

          mask: true,
          duration: 1500,
        });
      },
    });
  });
};
const post = (path, params, showToast) => {
  const newParams = { ...params };

  if (showToast) {
    wx.showToast({
      title: '正在加载...',
      icon: 'loading',
    });
  }

  return new Promise((resolve) => {
    wx.request({
      url: `${base}/${path}`, //仅为示例，并非真实的接口地址
      data: newParams,
      method: 'POST',
      header: {


        // 'Authorization': 'Bearer YXBwdXNlcjphcHB1c2VydGVzdA==',
        // 'Content-Type': 'application/json;charset=UTF-8'
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      success: (res) => {
        if (res.statusCode == 401) {
          login()
          return
        }
        if (res.data.status == 0) {
          // store.set('token', res.data.data.token)
          resolve(res.data.data);
        } else {

          wx.showModal({
            title: '小提示',
            content: res.data.message,
            confirmColor: '#ffaf0e',
            showCancel: false,
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络出错',

          mask: true,
          duration: 1500,
        });
      },
    });
  });
};

const http = {
  post,
  postHasToken,
  get,
  put
};

export default http;