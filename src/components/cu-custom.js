const app = getApp();
Component({

  /**
   * 组件的对外属性
   */
  properties: {


    isShow: {
      type: [Boolean, String],
      default: false
    },
    errinfo: {
      type: [String],
      default: ''
    },

  },
  /**
   * 组件的初始数据
   */
  data: {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    hide() {
      this.setData({
        isShow: !this.data.isShow
      })
    },

  }
})