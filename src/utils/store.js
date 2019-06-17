import APP_ID from config.js

const appId = APP_ID;
export const get = key => wx.getStorageSync(`${APP_ID}-${key}`);
export const set = (key, value) => {
  wx.setStorageSync(`${APP_ID}-${key}`, value);
};

