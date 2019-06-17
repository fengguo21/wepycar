const APP_ID = 'wx752c282e61fdd08a';


export const appId = APP_ID;

export const get = key => wx.getStorageSync(`${APP_ID}-${key}`);

export const set = (key, value) => {
  wx.setStorageSync(`${APP_ID}-${key}`, value);
};

