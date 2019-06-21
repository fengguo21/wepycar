export const loading = {
  show: (
    param = {
      title: '正在加载...',
      duration: 15000,
      mask: true,
      icon: 'loading'
    }
  ) => {
    const app = getApp();

    if (app.globalData.loadingCount === 0) {
      wx.showToast(param);
    }
    app.globalData.loadingCount++;
  },
  hide: () => {
    const app = getApp();
    app.globalData.loadingCount--;
    if (app.globalData.loadingCount === 0) {
      wx.hideToast();
    }
  },
  clean: () => {
    const app = getApp();
    app.globalData.loadingCount = 0;
    wx.hideToast();
  }
};
