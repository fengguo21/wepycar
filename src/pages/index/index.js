import * as store from '../../utils/store.js'
import {getExternals, getCdb, bindCustomer} from '../../utils/api.js'

const app = getApp()
Page({
  data: {
    pageStep: 0, // 0列表状态，1待绑定状态，2已绑定待跳转状态
    selecting: false,
    modelShow: false,
    errText: '',
    users: [],
    isChecked: false,
    user: '',
    cdbNumber: '',
    cdbInfo: ''
  },

  onShow: function (options) {
    // 1120 1121 为入口2,3的场景值
    this.setData({
      users: store.get('selectedUsers')
    })
    if (app.globalData.scene === 1120 | app.globalData.scene === 1121) {
      let self = this
      let userIds = []
      wx.qy.getCurExternalContact({
        success: function (res) {
          let userId = res.userId // 返回当前外部联系人userId
          if (userId) {
            userIds.push(userId)
            self.getExternals(userIds, 1)
          }
        },
        fail: function () {
          wx.qy.getCurExternalContact({
            success: function (res) {
              let userId = res.userId // 返回当前外部联系人userId
              if (userId) {
                userIds.push(userId)
                self.getExternals(userIds, 1)
              }
            }
          })
        }
      })
    }
  },
  // 事件处理函数
  // ***********自定义方法
  // 事件处理函数
  /**
   * @function getExternals
   * @param {*} userIds
   * @param {*} tag
   * @description 获取外部联系人
   */
  getExternals(userIds, tag) {
    getExternals({ 'externalUserIds': userIds }).then(res => {
      if (tag === 1) {
        app.globalData.scene = ''
        let user = res.data.data[0]
        if (!user.bind) {
          store.set('currentCustomer', res.data.data[0])
          app.globalData.scene = ''
          this.setData({
            pageStep: 1,
            user: user
          })
          this.setData({
            pageStep: 1,
            user: user
          })
        } else if (user.bind === true) {
          this.setData({
            pageStep: 2,
            user: user
          })
        }
      } else {
        store.set('selectedUsers', res.data.data)
        this.setData({
          users: res.data.data
        })
        app.globalData.scene = ''
      }
    }).catch(err => {
      this.setData({
        modelShow: true,
        errText: err
      })
    })
  },
  // 跳转到warm
  toWarm() {
    wx.navigateToMiniProgram({
      appId: 'wx1ea318c84338cee5',
      path: 'pages/client/customerInfo/customerInfo?id=' + this.data.user.externalUserId,
      success(res) {
      }
    })
  },
  cancelToWarm() {
    app.globalData.scene = ''
    this.setData({
      pageStep: 0
    })
  },
  selectExternal() {
    let self = this
    if (!this.data.selecting) {
      self.setData({
        selecting: true
      })
      wx.qy.selectExternalContact({
        filterType: 0, // 0表示展示全部外部联系人列表，1表示仅展示未曾选择过的外部联系人。默认值为0；除了0与1，其他值非法。
        success: function (res) {
          let userIds = res.userIds// 返回此次选择的外部联系人userId列表，数组类型
          self.getExternals(userIds, 0)
        },
        complete: function () {
          self.setData({
            selecting: false
          })
        }
      })
    }
  },
  toDetail(e) {
    let user = e.currentTarget.dataset.item
    if (user.bind === true) {
      return
    }
    store.set('currentCustomer', user)
    this.setData({
      pageStep: 1,
      user: user
    })
    // wx.navigateTo({
    //   url: '/pages/detail/detail?from=index'
    // })
  },

  getCdb() {
    getCdb({
      cdbNumber: this.data.cdbNumber,
      externalUserId: this.data.user.externalUserId
    }).then(res => {
      if (res) {
        let cdbInfo = res.data.data
        if (cdbInfo.country === '') {
          cdbInfo.country = 'CN'
        }
        this.setData({
          cdbInfo: cdbInfo,
          cdbNumber: '',
          isChecked: true
        })
      }
    }).catch(err => {
      if (err) {
        this.setData({
          modelShow: true,
          errText: err
        })
      }
    })
  },
  bindCustomer(params) {
    bindCustomer(params).then(res => {
      let selectedUsers = store.get('selectedUsers')
      for (let i = 0; i < selectedUsers.length; i++) {
        if (selectedUsers[i].externalUserId === this.data.user.externalUserId) {
          selectedUsers[i].bind = true
        }
      }
      store.set('selectedUsers', selectedUsers)
      this.setData({
        pageStep: 0

      })
      if (res.data.status === 0) {
        let saName = ''
        let boutique = ''
        if (res.data.data.saName) {
          saName = res.data.data.saName
        }
        if (res.data.data.boutique) {
          boutique = res.data.data.boutique
        }
        wx.redirectTo({
          url: '/pages/binded/binded?saName=' + saName + '&boutique=' + boutique
        })
      }
    }).catch(err => {
      if (err) {
        this.setData({
          modelShow: true,
          errText: err
        })
      }
    })
  },
  check: function (e) {
    if (this.data.cdbNumber) {
      this.getCdb()
    }
  },
  cancelcheck() {
    this.setData({
      pageStep: 0
    })
    app.globalData.scene = ''
  },
  confirm() {
    this.bindCustomer({
      externalUserId: this.data.user.externalUserId,
      cdbUserDto: this.data.cdbInfo
    })
  },
  recheck() {
    this.setData({
      cdbInfo: '',
      isChecked: false
    })
  },
  inputCdb(e) {
    this.setData({
      cdbNumber: e.detail.value
    })
  }
})
