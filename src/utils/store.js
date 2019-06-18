import { appid } from './config.js'
export const get = key => wx.getStorageSync(`${appid}-${key}`);
export const set = (key, value) => {
  wx.setStorageSync(`${appid}-${key}`, value);
};

