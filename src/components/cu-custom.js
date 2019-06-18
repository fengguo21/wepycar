// eslint-disable-next-line no-undef
Component({
  /**
   * 组件的对外属性
   */
  properties: {
    isShow: {
      type: [Boolean, String],
      default: false
    },
    errInfo: {
      type: [String],
      default: ''
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    hide() {
      this.setData({
        isShow: !this.data.isShow
      })
    }
  }
})
